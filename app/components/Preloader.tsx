"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import anime from "animejs";

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLHeadingElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const reflectionRef = useRef<HTMLDivElement>(null);
  const bottomContainerRef = useRef<HTMLDivElement>(null);

  // Constants
  const STATUSES = [
    "Initializing...",
    "Loading Assets...",
    "Preparing Experience...",
    "Optimizing Motion...",
    "Welcome."
  ];

  const TITLE = "RIDHO MAULANA";
  const SUBTITLE = "FULLSTACK DEVELOPER";

  useGSAP(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "auto";
        onComplete();
      }
    });

    // 1. Initial State
    gsap.set(containerRef.current, { autoAlpha: 1 });
    
    // Anime.js Typography Animation
    tl.call(() => {
      // Main Title Stagger
      anime({
        targets: titleRef.current?.querySelectorAll('.char'),
        translateY: [40, 0],
        rotateX: [-60, 0],
        opacity: [0, 1],
        easing: "easeOutQuart",
        duration: 1400,
        delay: anime.stagger(40)
      });

      // Subtitle Stagger
      anime({
        targets: subtitleRef.current?.querySelectorAll('.char'),
        translateY: [20, 0],
        opacity: [0, 1],
        easing: "easeOutQuart",
        duration: 1200,
        delay: anime.stagger(30, { start: 400 })
      });
    }, [], 0.2);

    // GSAP Counter & Status Timing
    const statusObj = { val: 0 };
    tl.to(statusObj, {
      val: 100,
      duration: 3.5,
      ease: "power2.inOut",
      onUpdate: () => {
        const p = Math.round(statusObj.val);
        
        // Update Percentage
        if (percentRef.current) {
          percentRef.current.textContent = `${p < 10 ? '0' : ''}${p}%`;
        }
        
        // Update Status String
        let statusIndex = Math.floor((p / 100) * (STATUSES.length - 1));
        if (p === 100) statusIndex = STATUSES.length - 1;
        
        if (statusRef.current && statusRef.current.textContent !== STATUSES[statusIndex]) {
          statusRef.current.textContent = STATUSES[statusIndex];
        }
      }
    }, 0.5);

    // Anime.js Reflection Animation
    tl.call(() => {
      if (reflectionRef.current) {
        anime({
          targets: reflectionRef.current,
          translateX: ['-150%', '300%'],
          opacity: [0, 0.4, 0],
          easing: 'easeInOutQuad',
          duration: 1200
        });
      }
    }, [], 2.5);

    // Exit Animation (Premium Blur & Fade)
    tl.to([titleRef.current, subtitleRef.current, bottomContainerRef.current], {
      filter: "blur(12px)",
      opacity: 0,
      duration: 1,
      ease: "power2.inOut",
      stagger: 0.1
    }, "+=0.4");

    // Background Slide Up
    tl.to(containerRef.current, {
      yPercent: -100,
      duration: 1.2,
      ease: "power4.inOut"
    }, "-=0.6");

  }, { scope: containerRef });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    // Cleanup on unmount handled by GSAP scope and React
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  // Split text helper to mimic splitText()
  const splitToChars = (text: string) => {
    return text.split('').map((char, i) => (
      <span key={i} className="char inline-block" style={{ backfaceVisibility: 'hidden' }}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-[#090909] text-white overflow-hidden"
    >
      {/* Background: Soft Ambient Light */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_0%,transparent_60%)]" />
      
      {/* Background: Vignette */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.9)]" />
      
      {/* Background: Subtle Grain */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-15 mix-blend-overlay" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} 
      />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center" style={{ perspective: '1000px' }}>
        
        {/* Title Container with Reflection Overflow */}
        <div className="relative py-2 overflow-hidden">
          <h1 
            ref={titleRef} 
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-[0.2em] md:tracking-[0.3em] font-(family-name:--font-outfit)"
          >
            {splitToChars(TITLE)}
          </h1>
          
          {/* Glass Reflection Sweep */}
          <div 
            ref={reflectionRef}
            className="absolute top-0 bottom-0 left-0 w-1/3 bg-linear-to-r from-transparent via-white to-transparent skew-x-[-25deg] opacity-0 mix-blend-overlay"
          />
        </div>

        {/* Subtitle */}
        <h2 
          ref={subtitleRef} 
          className="mt-6 md:mt-8 text-[10px] sm:text-xs md:text-sm font-light tracking-[0.5em] md:tracking-[0.8em] text-white/50 uppercase"
        >
          {splitToChars(SUBTITLE)}
        </h2>
      </div>

      {/* Loading Status */}
      <div 
        ref={bottomContainerRef}
        className="absolute bottom-12 md:bottom-16 left-0 right-0 px-8 md:px-16 lg:px-24 flex justify-between items-center text-[10px] md:text-xs font-light tracking-widest text-white/40 w-full max-w-7xl mx-auto uppercase"
      >
        <span ref={statusRef}>Initializing...</span>
        <span ref={percentRef} className="font-mono tabular-nums tracking-normal">00%</span>
      </div>
    </div>
  );
}
