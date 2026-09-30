import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useMission } from '../context/MissionContext';

export default function OrbitVisualizer() {
  const containerRef = useRef(null);
  const { currentOrbit, currentLookAngles, activeGS, groundStations } = useMission();

  const satMeshRef = useRef(null);
  const lineOfSightRef = useRef(null);
  const earthGroupRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 4.5, 9.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lighting
    const ambLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambLight);

    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.5);
    sunLight.position.set(10, 6, 8);
    scene.add(sunLight);

    // Earth
    const earthGroup = new THREE.Group();
    scene.add(earthGroup);
    earthGroupRef.current = earthGroup;

    const earthGeo = new THREE.SphereGeometry(2.1, 36, 36);
    const earthMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.6,
      metalness: 0.3
    });
    const earth = new THREE.Mesh(earthGeo, earthMat);
    earthGroup.add(earth);

    // Coordinate Grid
    const gridGeo = new THREE.SphereGeometry(2.11, 24, 24);
    const gridMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const grid = new THREE.Mesh(gridGeo, gridMat);
    earthGroup.add(grid);

    // Ground Station Markers
    groundStations.forEach(gs => {
      const phi = (90 - gs.lat) * (Math.PI / 180);
      const theta = (gs.lon + 180) * (Math.PI / 180);
      const r = 2.12;

      const x = -(r * Math.sin(phi) * Math.cos(theta));
      const z = (r * Math.sin(phi) * Math.sin(theta));
      const y = (r * Math.cos(phi));

      const pinGeo = new THREE.SphereGeometry(0.06, 12, 12);
      const pinMat = new THREE.MeshBasicMaterial({ color: gs.color || 0x10b981 });
      const pin = new THREE.Mesh(pinGeo, pinMat);
      pin.position.set(x, y, z);
      earthGroup.add(pin);
    });

    // Orbit Track
    const orbitCurve = new THREE.EllipseCurve(0, 0, 3.8, 3.5, 0, 2 * Math.PI, false, 0);
    const pts = orbitCurve.getPoints(100);
    const orbitGeo = new THREE.BufferGeometry().setFromPoints(pts.map(p => new THREE.Vector3(p.x, 0, p.y)));
    const orbitMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.8 });
    const orbitLine = new THREE.Line(orbitGeo, orbitMat);
    orbitLine.rotation.x = Math.PI / 3.8;
    orbitLine.rotation.y = Math.PI / 7;
    scene.add(orbitLine);

    // Satellite Mesh
    const satGroup = new THREE.Group();
    const bodyGeo = new THREE.BoxGeometry(0.35, 0.7, 0.35);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.85, roughness: 0.25 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    satGroup.add(body);

    const panelGeo = new THREE.BoxGeometry(0.8, 0.6, 0.03);
    const panelMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.5, roughness: 0.3 });
    const pLeft = new THREE.Mesh(panelGeo, panelMat);
    pLeft.position.set(-0.6, 0, 0);
    satGroup.add(pLeft);

    const pRight = new THREE.Mesh(panelGeo, panelMat);
    pRight.position.set(0.6, 0, 0);
    satGroup.add(pRight);

    scene.add(satGroup);
    satMeshRef.current = satGroup;

    // Line of Sight Beam
    const losMat = new THREE.LineBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.9, linewidth: 2 });
    const losGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0)]);
    const losLine = new THREE.Line(losGeo, losMat);
    scene.add(losLine);
    lineOfSightRef.current = losLine;

    // Mouse Drag Controls
    let dragging = false;
    let prevX = 0, prevY = 0;

    const onMouseDown = (e) => {
      dragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onMouseMove = (e) => {
      if (!dragging) return;
      const dX = e.clientX - prevX;
      const dY = e.clientY - prevY;
      earthGroup.rotation.y += dX * 0.006;
      earthGroup.rotation.x += dY * 0.006;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onMouseUp = () => { dragging = false; };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      earthGroup.rotation.y += 0.001;
      satGroup.rotation.y += 0.02;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!container) return;
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('mousedown', onMouseDown);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [groundStations]);

  // Update Satellite 3D Position in Real-Time
  useEffect(() => {
    if (!satMeshRef.current || !currentOrbit) return;

    // Convert Keplerian/ECI coordinates to 3D Scene scale
    const scale = 3.6 / (6371.0 + 550.0);
    const x = (currentOrbit.xECI || 0) * scale;
    const y = (currentOrbit.zECI || 0) * scale;
    const z = (currentOrbit.yECI || 0) * scale;

    satMeshRef.current.position.set(x, y, z);

    // Update Line-of-sight visual beam if above horizon
    if (lineOfSightRef.current && currentLookAngles) {
      if (currentLookAngles.elevationDeg >= (activeGS?.minElevation || 10)) {
        lineOfSightRef.current.visible = true;
        const pts = [satMeshRef.current.position, new THREE.Vector3(0, 0, 0)];
        lineOfSightRef.current.geometry.setFromPoints(pts);
      } else {
        lineOfSightRef.current.visible = false;
      }
    }
  }, [currentOrbit, currentLookAngles, activeGS]);

  return (
    <div className="bg-slate-900/90 border-2 border-slate-800 rounded-xl p-5 shadow-2xl flex flex-col h-full relative">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 z-10">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse"></div>
          <h3 className="text-sm font-display font-black text-white uppercase tracking-wider">
            3D Orbital Track & Satellite Ephemeris
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
          550 km SSO
        </span>
      </div>

      <div ref={containerRef} className="flex-1 w-full min-h-[260px] relative cursor-grab active:cursor-grabbing"></div>

      {/* Floating Real-time HUD overlay */}
      <div className="absolute bottom-4 left-4 right-4 bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-lg p-2.5 flex items-center justify-between text-xs font-mono">
        <div>
          <span className="text-slate-500">LAT:</span> <span className="text-white font-bold">{currentOrbit.latitude.toFixed(2)}°</span>
          <span className="text-slate-500 ml-2">LON:</span> <span className="text-white font-bold">{currentOrbit.longitude.toFixed(2)}°</span>
        </div>
        <div>
          <span className="text-slate-500">EL:</span> <span className={`${currentLookAngles.elevationDeg >= 10 ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>{currentLookAngles.elevationDeg.toFixed(1)}°</span>
          <span className="text-slate-500 ml-2">AZ:</span> <span className="text-white">{currentLookAngles.azimuthDeg.toFixed(1)}°</span>
        </div>
      </div>
    </div>
  );
}
