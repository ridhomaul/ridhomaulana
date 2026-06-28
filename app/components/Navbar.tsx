"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Home, Briefcase, User, Mail, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const navItems = [
  { name: "Home", href: "#home", icon: Home },
  { name: "Projects", href: "#projects", icon: Briefcase },
  { name: "Experience", href: "#experience", icon: User },
  { name: "Contact", href: "#contact", icon: Mail },
];

export default function Navbar() {
  const [activeItem, setActiveItem] = useState("Home");
  const [hoveredItem, setHoveredItem] = useState("Home");
  
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const requestRef = useRef<number | null>(null);
  
  const [isHoveringNav, setIsHoveringNav] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  useGSAP(() => {
    // Hide navbar on scroll down, show on scroll up
    const showAnim = gsap.from(wrapperRef.current, { 
      yPercent: -150,
      paused: true,
      duration: 0.3,
      ease: "power2.out"
    }).progress(1); // start shown

    ScrollTrigger.create({
      start: "top top",
      end: "max",
      onUpdate: (self) => {
        if (self.direction === 1 && self.scroll() > 50) {
          showAnim.reverse(); // hide
        } else {
          showAnim.play(); // show
        }
      }
    });
  }, { scope: wrapperRef });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reducedMotion || !navRef.current) return;
    
    const rect = navRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    
    requestRef.current = requestAnimationFrame(() => {
      navRef.current?.style.setProperty('--mouse-x', `${x}px`);
      navRef.current?.style.setProperty('--mouse-y', `${y}px`);
    });
  };

  const handleMouseLeave = () => {
    setIsHoveringNav(false);
    setHoveredItem(activeItem);
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
  };

  return (
    <div ref={wrapperRef} className="fixed top-6 inset-x-0 z-50 flex justify-center pointer-events-none">
      
      {/* 
        ========================================================================
        REAL LIQUID GLASS SVG FILTER (Refraction + Chromatic Aberration)
        ======================================================================== 
      */}
      <svg className="fixed w-0 h-0 pointer-events-none" aria-hidden="true" style={{ position: 'absolute' }}>
        <defs>
          <filter id="liquid-glass-refraction" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
            {/* 1. Base blur for depth of field */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="BLUR" />
            
            {/* 2. Organic glass irregularity map (Turbulence) */}
            <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="2" result="NOISE" seed="42" />
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1.5 -0.2" in="NOISE" result="CONTRAST_NOISE" />
            
            {/* 3. Refraction displacement (distorts background based on noise) */}
            <feDisplacementMap in="BLUR" in2="CONTRAST_NOISE" scale="16" xChannelSelector="R" yChannelSelector="G" result="REFRACTED" />
            
            {/* 4. Chromatic Aberration - Channel Splits (Red shifted right, Blue shifted left) */}
            <feOffset dx="2.5" dy="0" in="REFRACTED" result="RED_SHIFT" />
            <feOffset dx="-2.5" dy="0" in="REFRACTED" result="BLUE_SHIFT" />
            
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" in="RED_SHIFT" result="RED" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" in="REFRACTED" result="GREEN" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" in="BLUE_SHIFT" result="BLUE" />
            
            {/* 5. Chromatic Aberration - Accurate Recombination via Arithmetic Addition */}
            <feComposite operator="arithmetic" k1="0" k2="1" k3="1" k4="0" in="RED" in2="GREEN" result="RG" />
            <feComposite operator="arithmetic" k1="0" k2="1" k3="1" k4="0" in="RG" in2="BLUE" result="FINAL_GLASS" />
          </filter>
        </defs>
      </svg>

      {/* Styles for dynamic caustic reflection */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes caustic-reflection {
          0% { transform: translateX(-200%) skewX(-30deg); opacity: 0; }
          20% { opacity: 0.8; }
          40% { transform: translateX(300%) skewX(-30deg); opacity: 0; }
          100% { transform: translateX(300%) skewX(-30deg); opacity: 0; }
        }
        .animate-caustic {
          animation: caustic-reflection 8s cubic-bezier(0.2, 0.8, 0.2, 1) infinite;
          will-change: transform;
        }
      `}} />

      <nav 
        ref={navRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHoveringNav(true)}
        onMouseLeave={handleMouseLeave}
        className="pointer-events-auto relative flex items-center p-1.5 transition-all duration-300 rounded-full"
      >
        
        {/* Layer 1: SVG Backdrop Refraction */}
        <div 
          className="absolute inset-0 rounded-full pointer-events-none overflow-hidden bg-white/10 dark:bg-[#1a1a1a]/20"
          style={{ 
            backdropFilter: 'url(#liquid-glass-refraction)',
            WebkitBackdropFilter: 'url(#liquid-glass-refraction)',
          }}
        />
        
        {/* Layer 2: 3D Surface & Specular Highlights */}
        <div 
          className="absolute inset-0 rounded-full pointer-events-none border border-white/50 dark:border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-1px_2px_rgba(0,0,0,0.2),0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),inset_0_2px_4px_rgba(255,255,255,0.1),inset_0_-1px_2px_rgba(0,0,0,0.5),0_8px_32px_rgba(0,0,0,0.4)] bg-linear-to-b from-white/40 via-white/5 to-black/5 dark:from-white/10 dark:via-transparent dark:to-black/40"
        />

        {/* Layer 3: Mouse Reactive Caustic Highlight */}
        {!reducedMotion && isHoveringNav && (
          <div 
            className="absolute inset-0 pointer-events-none rounded-full transition-opacity duration-300 mix-blend-overlay z-0"
            style={{
              background: 'radial-gradient(150px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(255,255,255,0.7), transparent 100%)',
            }}
          />
        )}

        {/* Layer 4: Dynamic Caustic Reflection Sweep */}
        {!reducedMotion && (
          <div className="absolute inset-0 pointer-events-none rounded-full overflow-hidden z-40">
            <div className="w-[60%] h-[200%] absolute -top-[50%] -left-[100%] bg-linear-to-r from-transparent via-white/50 to-transparent animate-caustic mix-blend-overlay pointer-events-none blur-[2px]" />
          </div>
        )}

        <div className="flex items-center gap-1 px-2 relative z-10">
          {navItems.map((item) => {
            const isHovered = hoveredItem === item.name;
            const isActive = activeItem === item.name;

            return (
              <a
                key={item.name}
                href={item.href}
                onMouseEnter={() => setHoveredItem(item.name)}
                onClick={() => setActiveItem(item.name)}
                className={`relative flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isHovered || isActive 
                    ? "text-white drop-shadow-md" 
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                {isHovered && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-linear-to-r from-purple-500/90 to-blue-500/90 rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),inset_0_-1px_2px_rgba(0,0,0,0.3),0_4px_12px_rgba(168,85,247,0.4)] border border-white/30 dark:border-white/10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  >
                    {/* Glossy overlay for active item */}
                    <div className="absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-white/40 to-transparent rounded-t-full pointer-events-none" />
                  </motion.div>
                )}
                <item.icon className={`relative w-4 h-4 transition-colors duration-300 z-20 ${isActive && !isHovered ? "text-purple-600 dark:text-purple-400" : ""}`} />
                <span className={`relative hidden sm:inline transition-colors duration-300 z-20 ${isActive && !isHovered ? "text-purple-600 dark:text-purple-400" : ""}`}>{item.name}</span>
              </a>
            );
          })}
        </div>

        <div className="w-px h-6 bg-slate-300/80 dark:bg-slate-700/80 mx-2 relative z-10"></div>
        
        <div className="flex items-center gap-2 pr-1 relative z-10">
          <button 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-all duration-300 relative group"
            aria-label="Toggle theme"
          >
            {mounted && theme === "dark" ? (
              <Sun className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:-rotate-12" />
            )}
          </button>
        </div>
      </nav>
    </div>
  );
}