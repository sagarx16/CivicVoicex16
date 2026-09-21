"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles, Text } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Shared ref to hold normalized scroll progress (0 to 1) without triggering React re-renders
const scrollProgress = { current: 0 };

// ── 3D Barbie Dollhouse Scene Components ──

function RoomFurniture() {
  return (
    <group>
      {/* ── Room 1: Entrance & Foyer ── */}
      <group position={[0, 0, 4]}>
        {/* Welcome Mat */}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3, 1.5]} />
          <meshStandardMaterial color="#f72585" roughness={0.8} />
        </mesh>

        {/* Archway Pillars */}
        <mesh position={[-2.2, 2.2, 0]}>
          <cylinderGeometry args={[0.2, 0.25, 4.4, 16]} />
          <meshStandardMaterial color="#ffc2d1" roughness={0.3} />
        </mesh>
        <mesh position={[2.2, 2.2, 0]}>
          <cylinderGeometry args={[0.2, 0.25, 4.4, 16]} />
          <meshStandardMaterial color="#ffc2d1" roughness={0.3} />
        </mesh>

        {/* Balloon Cluster */}
        <Float speed={2} rotationIntensity={0.3} floatIntensity={0.8}>
          <group position={[-1.8, 3.2, 0.5]}>
            <mesh position={[0, 0.4, 0]}>
              <sphereGeometry args={[0.35, 24, 24]} />
              <meshStandardMaterial color="#ff70a6" roughness={0.2} metalness={0.1} />
            </mesh>
            <mesh position={[0.3, 0.7, 0.1]}>
              <sphereGeometry args={[0.32, 24, 24]} />
              <meshStandardMaterial color="#ffd166" roughness={0.2} metalness={0.1} />
            </mesh>
            <mesh position={[-0.25, 0.8, -0.1]}>
              <sphereGeometry args={[0.3, 24, 24]} />
              <meshStandardMaterial color="#ff477e" roughness={0.2} metalness={0.1} />
            </mesh>
          </group>
        </Float>
      </group>

      {/* ── Room 2: Living Room / Parlor (z: 0 to -3) ── */}
      <group position={[0, 0, 0]}>
        {/* Plush Velvet Sofa */}
        <group position={[0, 0.4, -1]}>
          {/* Base */}
          <mesh position={[0, 0.2, 0]}>
            <boxGeometry args={[3.2, 0.5, 1.2]} />
            <meshStandardMaterial color="#f72585" roughness={0.4} />
          </mesh>
          {/* Backrest */}
          <mesh position={[0, 0.8, -0.45]}>
            <boxGeometry args={[3.2, 0.8, 0.35]} />
            <meshStandardMaterial color="#ff4d8d" roughness={0.4} />
          </mesh>
          {/* Armrests */}
          <mesh position={[-1.6, 0.6, 0]}>
            <boxGeometry args={[0.3, 0.6, 1.2]} />
            <meshStandardMaterial color="#ff4d8d" roughness={0.4} />
          </mesh>
          <mesh position={[1.6, 0.6, 0]}>
            <boxGeometry args={[0.3, 0.6, 1.2]} />
            <meshStandardMaterial color="#ff4d8d" roughness={0.4} />
          </mesh>
        </group>

        {/* Coffee Table */}
        <mesh position={[0, 0.3, 0.4]}>
          <cylinderGeometry args={[0.8, 0.8, 0.1, 32]} />
          <meshStandardMaterial color="#fff0f5" roughness={0.1} metalness={0.3} />
        </mesh>
        {/* Golden Table Leg */}
        <mesh position={[0, 0.15, 0.4]}>
          <cylinderGeometry args={[0.1, 0.1, 0.3, 16]} />
          <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Chandelier */}
        <group position={[0, 3.6, 0]}>
          <mesh position={[0, 0, 0]}>
            <octahedronGeometry args={[0.4]} />
            <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.1} />
          </mesh>
          <pointLight color="#ffe4e6" intensity={2} distance={8} decay={2} />
        </group>

        {/* Wrapped Birthday Gifts */}
        <group position={[1.6, 0.3, 0.5]}>
          <mesh position={[0, 0, 0]} rotation={[0, 0.3, 0]}>
            <boxGeometry args={[0.6, 0.6, 0.6]} />
            <meshStandardMaterial color="#ffd166" roughness={0.3} />
          </mesh>
          <mesh position={[-0.4, 0.2, 0.4]} rotation={[0, -0.4, 0]}>
            <boxGeometry args={[0.5, 0.4, 0.5]} />
            <meshStandardMaterial color="#ff70a6" roughness={0.3} />
          </mesh>
        </group>
      </group>

      {/* ── Room 3: Memory Gallery & Photo Hall (z: -4 to -7) ── */}
      <group position={[0, 0, -5]}>
        {/* Floating Photo Frames with Glowing Borders */}
        {[-1.8, 0, 1.8].map((x, i) => (
          <Float key={i} speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
            <group position={[x, 2.2 + (i % 2) * 0.4, 0]}>
              {/* Golden Frame */}
              <mesh position={[0, 0, -0.05]}>
                <boxGeometry args={[1.3, 1.6, 0.08]} />
                <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
              </mesh>
              {/* Photo Canvas */}
              <mesh position={[0, 0, 0]}>
                <planeGeometry args={[1.1, 1.4]} />
                <meshStandardMaterial color={i === 0 ? "#ffc2d1" : i === 1 ? "#ffe5ec" : "#ffb3c6"} roughness={0.6} />
              </mesh>
            </group>
          </Float>
        ))}
      </group>

      {/* ── Room 4: Rooftop Terrace & Birthday Cake (z: -9) ── */}
      <group position={[0, 0, -9]}>
        {/* Birthday Cake Pedestal */}
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[1, 1.1, 1.2, 32]} />
          <meshStandardMaterial color="#ffc2d1" roughness={0.3} />
        </mesh>

        {/* Two-Tier Birthday Cake */}
        <group position={[0, 1.4, 0]}>
          {/* Bottom Tier */}
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.7, 0.7, 0.5, 32]} />
            <meshStandardMaterial color="#ff70a6" roughness={0.4} />
          </mesh>
          {/* Top Tier */}
          <mesh position={[0, 0.65, 0]}>
            <cylinderGeometry args={[0.45, 0.45, 0.4, 32]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} />
          </mesh>
          {/* Candle */}
          <mesh position={[0, 0.95, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.25, 16]} />
            <meshStandardMaterial color="#ffd166" />
          </mesh>
          {/* Candle Flame Light */}
          <pointLight position={[0, 1.15, 0]} color="#ffb703" intensity={3} distance={5} />
          <mesh position={[0, 1.15, 0]}>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshBasicMaterial color="#ffea00" />
          </mesh>
        </group>

        {/* 3D Floating "Happy Birthday" Text */}
        <Float speed={2} floatIntensity={0.5}>
          <Text
            position={[0, 3.2, 0]}
            fontSize={0.65}
            color="#f72585"
            anchorX="center"
            anchorY="middle"
          >
            Happy Birthday! ✨
          </Text>
        </Float>
      </group>
    </group>
  );
}

function DollhouseStructure() {
  return (
    <group>
      {/* Floors with warm pastel tile checkering */}
      <mesh position={[0, -0.05, -3]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 18]} />
        <meshStandardMaterial color="#ffe5ec" roughness={0.5} />
      </mesh>

      {/* Walls (Left, Right, Back) */}
      {/* Left Wall */}
      <mesh position={[-3.8, 2.5, -3]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[18, 5.2]} />
        <meshStandardMaterial color="#ffc2d1" roughness={0.6} side={THREE.DoubleSide} />
      </mesh>
      {/* Right Wall */}
      <mesh position={[3.8, 2.5, -3]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[18, 5.2]} />
        <meshStandardMaterial color="#ffc2d1" roughness={0.6} side={THREE.DoubleSide} />
      </mesh>
      {/* Back Wall */}
      <mesh position={[0, 2.5, -11]}>
        <planeGeometry args={[8, 5.2]} />
        <meshStandardMaterial color="#ff9ebb" roughness={0.6} side={THREE.DoubleSide} />
      </mesh>

      {/* Ceiling Trim & Fairy Light String */}
      <mesh position={[0, 4.8, -3]}>
        <boxGeometry args={[7.8, 0.1, 17.8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>
    </group>
  );
}

// ── Smooth Camera Controller Linked to Scroll Progress ──
function SmoothCameraController() {
  // Keyframe stops along the dollhouse journey (x, y, z, lookX, lookY, lookZ)
  const cameraPath = [
    { p: 0.0, pos: [0, 2.8, 9.0], look: [0, 2.0, 4.0] },  // Outside Entrance
    { p: 0.25, pos: [0, 2.2, 4.5], look: [0, 1.8, 1.0] }, // Entering Foyer
    { p: 0.50, pos: [0.6, 1.8, 1.0], look: [-0.4, 1.5, -1.5] }, // Cozy Living Room
    { p: 0.75, pos: [-0.3, 2.2, -3.2], look: [0, 2.2, -6.0] }, // Memory Gallery
    { p: 1.00, pos: [0, 2.8, -6.8], look: [0, 2.0, -9.0] }, // Rooftop Birthday Cake
  ];

  useFrame((state) => {
    const t = THREE.MathUtils.clamp(scrollProgress.current, 0, 1);

    // Find the current segment in cameraPath
    let startIndex = 0;
    for (let i = 0; i < cameraPath.length - 1; i++) {
      if (t >= cameraPath[i].p && t <= cameraPath[i + 1].p) {
        startIndex = i;
        break;
      }
    }

    const start = cameraPath[startIndex];
    const end = cameraPath[startIndex + 1] || start;
    const segmentRange = end.p - start.p || 1;
    const localT = THREE.MathUtils.clamp((t - start.p) / segmentRange, 0, 1);

    // Smooth cubic easing for interpolation
    const easeT = THREE.MathUtils.smoothstep(localT, 0, 1);

    const targetPosX = THREE.MathUtils.lerp(start.pos[0], end.pos[0], easeT);
    const targetPosY = THREE.MathUtils.lerp(start.pos[1], end.pos[1], easeT);
    const targetPosZ = THREE.MathUtils.lerp(start.pos[2], end.pos[2], easeT);

    const targetLookX = THREE.MathUtils.lerp(start.look[0], end.look[0], easeT);
    const targetLookY = THREE.MathUtils.lerp(start.look[1], end.look[1], easeT);
    const targetLookZ = THREE.MathUtils.lerp(start.look[2], end.look[2], easeT);

    // Damped lerping prevents jitter, achieving 60-120fps continuous smoothness
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, targetPosX, 4, 0.016);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, targetPosY, 4, 0.016);
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, targetPosZ, 4, 0.016);

    const currentLook = new THREE.Vector3(targetLookX, targetLookY, targetLookZ);
    state.camera.lookAt(currentLook);
  });

  return null;
}

// ── Main Birthday Page with GSAP ScrollTrigger ──

export default function BirthdayPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const momentsSectionRef = useRef<HTMLDivElement>(null);
  const adventuresSectionRef = useRef<HTMLDivElement>(null);
  const letterSectionRef = useRef<HTMLDivElement>(null);
  const finaleSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure GSAP works within React component lifecycle and cleans up properly
    const ctx = gsap.context(() => {
      // 1. Sync global scroll progress to the 3D camera controller
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
        onUpdate: (self) => {
          scrollProgress.current = self.progress;
        },
      });

      // 2. Animate Hero Section
      if (heroSectionRef.current) {
        const heroElements = heroSectionRef.current.querySelectorAll(".reveal-item");
        gsap.fromTo(
          heroElements,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1.0,
            stagger: 0.18,
            ease: "power2.out",
            scrollTrigger: {
              trigger: heroSectionRef.current,
              start: "top 75%",
              toggleActions: "play none none none", // Animate only once when entering viewport
            },
          }
        );
      }

      // 3. Staggered reveal for Life Moments (Childhood Memories & Photos)
      if (momentsSectionRef.current) {
        const momentCards = momentsSectionRef.current.querySelectorAll(".reveal-item");
        gsap.fromTo(
          momentCards,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.16,
            ease: "power2.out",
            scrollTrigger: {
              trigger: momentsSectionRef.current,
              start: "top 70%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // 4. Staggered reveal for Unforgettable Adventures Section
      if (adventuresSectionRef.current) {
        const adventureCards = adventuresSectionRef.current.querySelectorAll(".reveal-item");
        gsap.fromTo(
          adventureCards,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.16,
            ease: "power2.out",
            scrollTrigger: {
              trigger: adventuresSectionRef.current,
              start: "top 70%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // 5. Reveal for Special Heartfelt Letter
      if (letterSectionRef.current) {
        const letterElements = letterSectionRef.current.querySelectorAll(".reveal-item");
        gsap.fromTo(
          letterElements,
          { opacity: 0, y: 60, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.1,
            stagger: 0.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: letterSectionRef.current,
              start: "top 65%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // 6. Finale Section (Make a Wish)
      if (finaleSectionRef.current) {
        const finaleItems = finaleSectionRef.current.querySelectorAll(".reveal-item");
        gsap.fromTo(
          finaleItems,
          { opacity: 0, y: 40, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.0,
            stagger: 0.15,
            ease: "back.out(1.5)",
            scrollTrigger: {
              trigger: finaleSectionRef.current,
              start: "top 70%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, containerRef);

    // Clean up on unmount to avoid memory leaks
    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full bg-[#140b1e] text-white selection:bg-pink-500 selection:text-white">
      {/* ── FIXED 3D THREE.JS CANVAS BACKGROUND (NO RE-RENDERS ON SCROLL) ── */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
        <Canvas
          shadows
          camera={{ position: [0, 2.8, 9.0], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.9} />
          <directionalLight position={[5, 8, 5]} intensity={1.5} castShadow />
          <pointLight position={[-4, 3, 2]} color="#ff70a6" intensity={2} />
          <pointLight position={[4, 3, -6]} color="#ffd166" intensity={2} />

          {/* Magical Floating Sparkles */}
          <Sparkles count={80} scale={12} size={3} speed={0.4} color="#ffd166" opacity={0.6} />

          {/* 3D Dollhouse Elements */}
          <DollhouseStructure />
          <RoomFurniture />

          {/* Camera sync controller */}
          <SmoothCameraController />
        </Canvas>
      </div>

      {/* Floating navigation pill */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
        <div className="px-5 py-2 rounded-full bg-black/40 backdrop-blur-xl border border-pink-500/30 flex items-center gap-4 shadow-lg shadow-pink-500/10">
          <span className="text-sm font-bold bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300 bg-clip-text text-transparent">
            ✨ Barbie Dreamhouse Tour
          </span>
          <Link
            href="/dashboard"
            className="text-xs px-3 py-1 rounded-full bg-pink-500/20 hover:bg-pink-500/40 text-pink-200 border border-pink-400/40 transition-colors"
          >
            Back to App
          </Link>
        </div>
      </header>

      {/* ── SCROLLABLE HTML CONTENT OVERLAYS ── */}
      <div className="relative z-10">
        {/* ── Section 1: Hero / Welcome ── */}
        <section
          ref={heroSectionRef}
          className="min-h-screen flex flex-col items-center justify-center text-center px-6"
        >
          <div className="max-w-2xl bg-black/45 backdrop-blur-md p-8 sm:p-12 rounded-3xl border border-pink-500/30 shadow-2xl shadow-pink-500/15">
            <span className="reveal-item inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase bg-pink-500/25 text-pink-300 border border-pink-500/40 mb-4">
              Happy Birthday Celebration 🎂
            </span>
            <h1 className="reveal-item text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text text-transparent leading-tight mb-4">
              Welcome to Your Dreamhouse Journey
            </h1>
            <p className="reveal-item text-base sm:text-lg text-pink-100/80 mb-6 leading-relaxed">
              Step inside the magic. Scroll down to travel through your favorite rooms, cherished life moments, and heartfelt memories.
            </p>
            <div className="reveal-item flex items-center justify-center gap-2 text-sm font-semibold text-pink-300 animate-bounce">
              <span>Scroll to enter</span>
              <span className="material-symbols-outlined text-[18px]">south</span>
            </div>
          </div>
        </section>

        {/* ── Section 2: Life Moments (Childhood & Beginnings) ── */}
        <section
          ref={momentsSectionRef}
          className="min-h-screen flex flex-col items-center justify-center px-6 py-20"
        >
          <div className="max-w-4xl w-full">
            <div className="text-center mb-10">
              <span className="reveal-item text-xs font-bold uppercase tracking-widest text-pink-400">
                Chapter 1 · The Parlor
              </span>
              <h2 className="reveal-item text-3xl sm:text-5xl font-extrabold text-white mt-2">
                Where It All Began
              </h2>
              <p className="reveal-item text-pink-200/70 text-sm sm:text-base mt-2">
                From playful laughter to big dreams — the early golden years.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              {[
                {
                  title: "Baby Steps",
                  year: "Sweet Beginnings",
                  desc: "Curious eyes, the brightest smiles, and the first steps into a world full of wonder.",
                  color: "from-pink-500/20 to-rose-500/20",
                  badge: "Baby Days",
                },
                {
                  title: "School Adventures",
                  year: "First Best Friends",
                  desc: "Braided hair, colorful crayons, playground games, and friendships that would last forever.",
                  color: "from-purple-500/20 to-pink-500/20",
                  badge: "School Era",
                },
                {
                  title: "Dreamer Era",
                  year: "Big Ambitions",
                  desc: "Discovering your passions, your creativity, and the fierce heart that inspires everyone around you.",
                  color: "from-amber-500/20 to-pink-500/20",
                  badge: "Golden Mind",
                },
              ].map((moment, idx) => (
                <div
                  key={idx}
                  className="reveal-item group p-6 rounded-2xl bg-black/50 backdrop-blur-xl border border-pink-500/25 hover:border-pink-400/60 shadow-xl transition-all duration-300 hover:-translate-y-1.5"
                >
                  <div className="w-full h-44 rounded-xl mb-4 bg-gradient-to-tr from-pink-500/30 via-purple-500/30 to-rose-400/30 flex items-center justify-center border border-pink-300/20">
                    <span className="material-symbols-outlined text-4xl text-pink-300 group-hover:scale-110 transition-transform">
                      photo_library
                    </span>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-400/30">
                    {moment.badge}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-3">{moment.title}</h3>
                  <p className="text-xs text-pink-300/80 font-medium mb-2">{moment.year}</p>
                  <p className="text-xs text-stone-300 leading-relaxed">{moment.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section 3: Unforgettable Adventures ── */}
        <section
          ref={adventuresSectionRef}
          className="min-h-screen flex flex-col items-center justify-center px-6 py-20"
        >
          <div className="max-w-4xl w-full">
            <div className="text-center mb-10">
              <span className="reveal-item text-xs font-bold uppercase tracking-widest text-amber-300">
                Chapter 2 · The Memory Gallery
              </span>
              <h2 className="reveal-item text-3xl sm:text-5xl font-extrabold text-white mt-2">
                Unforgettable Adventures
              </h2>
              <p className="reveal-item text-pink-200/70 text-sm sm:text-base mt-2">
                Every trip, late-night laugh, and celebration captured in time.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {[
                {
                  title: "Summer Getaway & Sunsets",
                  location: "Beachside Memories",
                  desc: "Chasing waves, salty breeze, and laughter that echoed under the golden sunset skies.",
                  icon: "wb_sunny",
                },
                {
                  title: "Midnight Road Trips",
                  location: "Under Starlit Skies",
                  desc: "Windows rolled down, favorite songs on repeat, talking about life until the morning light.",
                  icon: "local_florist",
                },
                {
                  title: "Milestone Wins & Graduations",
                  location: "Hard Work Paid Off",
                  desc: "Tears of joy, triumphant cheers, and standing tall knowing you can achieve anything.",
                  icon: "celebration",
                },
                {
                  title: "The Little Everyday Joys",
                  location: "Coffee & Cozy Talks",
                  desc: "Random hugs, inside jokes nobody else gets, and the comfort of just being together.",
                  icon: "favorite",
                },
              ].map((adv, idx) => (
                <div
                  key={idx}
                  className="reveal-item p-6 rounded-2xl bg-black/55 backdrop-blur-xl border border-pink-400/25 hover:border-amber-400/50 shadow-xl flex gap-4 items-start transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-amber-500 flex items-center justify-center shrink-0 shadow-md shadow-pink-500/30">
                    <span className="material-symbols-outlined text-white text-[24px]">
                      {adv.icon}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{adv.title}</h3>
                    <p className="text-xs text-amber-300 font-semibold mb-1">{adv.location}</p>
                    <p className="text-xs text-stone-300 leading-relaxed">{adv.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section 4: A Heartfelt Birthday Letter ── */}
        <section
          ref={letterSectionRef}
          className="min-h-screen flex flex-col items-center justify-center px-6 py-20"
        >
          <div className="max-w-2xl w-full bg-gradient-to-b from-[#2a133d]/85 to-[#1c0c2a]/95 backdrop-blur-2xl p-8 sm:p-12 rounded-3xl border border-pink-400/40 shadow-2xl shadow-pink-500/20 relative">
            <div className="reveal-item flex items-center justify-between pb-6 border-b border-pink-500/20">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-pink-400">
                  Chapter 3 · From the Heart
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  A Letter Just For You 💌
                </h2>
              </div>
              <div className="w-10 h-10 rounded-full bg-pink-500/20 border border-pink-400/40 flex items-center justify-center">
                <span className="material-symbols-outlined text-pink-300 text-[20px]">
                  drafts
                </span>
              </div>
            </div>

            <div className="reveal-item mt-6 space-y-4 text-sm sm:text-base text-pink-100/90 leading-relaxed font-serif">
              <p>Dearest Birthday Star,</p>
              <p>
                Today is all about celebrating the wonderful, radiant, and unstoppable person you are.
                You bring so much warmth and happiness into every room you walk into, turning ordinary days into unforgettable memories.
              </p>
              <p>
                May this year bring you closer to all your dreams, bless you with boundless adventures, deep happiness, and endless reasons to smile.
              </p>
              <p className="pt-2 font-sans font-semibold text-pink-300">
                With all the love in the universe, <br />
                <span className="text-lg bg-gradient-to-r from-pink-300 via-rose-300 to-amber-200 bg-clip-text text-transparent font-bold font-serif">
                  Forever & Always ✨
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* ── Section 5: Rooftop Finale · Make a Wish ── */}
        <section
          ref={finaleSectionRef}
          className="min-h-screen flex flex-col items-center justify-center text-center px-6 pb-24"
        >
          <div className="max-w-xl bg-black/55 backdrop-blur-xl p-8 sm:p-12 rounded-3xl border border-pink-400/40 shadow-2xl shadow-pink-500/25">
            <span className="reveal-item inline-block text-4xl mb-3">🎂</span>
            <h2 className="reveal-item text-3xl sm:text-5xl font-black text-white mb-3">
              Make a Wish!
            </h2>
            <p className="reveal-item text-sm sm:text-base text-pink-100/80 mb-6 leading-relaxed">
              You&apos;ve reached the top of the dollhouse terrace. Close your eyes, make your biggest wish, and step into your most magical year yet!
            </p>
            <div className="reveal-item flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="px-6 py-3 rounded-full font-bold text-sm text-white bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-400 hover:to-amber-400 shadow-lg shadow-pink-500/40 transition-all cursor-pointer"
              >
                Relive the Journey ↺
              </button>
              <Link
                href="/dashboard"
                className="px-6 py-3 rounded-full font-bold text-sm text-pink-200 bg-white/10 hover:bg-white/20 border border-pink-400/30 transition-all text-center"
              >
                Explore Civic App
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
