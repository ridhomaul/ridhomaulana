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
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  
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
    const showAnim = gsap.from(wrapperRef.current, { 
      yPercent: -150,
      paused: true,
      duration: 0.4,
      ease: "power3.out"
    }).progress(1);

    ScrollTrigger.create({
      start: "top top",
      end: "max",
      onUpdate: (self) => {
        if (self.direction === 1 && self.scroll() > 50) {
          showAnim.reverse(); 
        } else {
          showAnim.play(); 
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
    setHoveredItem(null);
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
  };

  return (
    <div ref={wrapperRef} className="fixed top-6 inset-x-0 z-50 flex justify-center pointer-events-none perspective-[1000px]">
      
      {/* 
        ========================================================================
        ULTIMATE LIQUID GLASS SVG FILTER
        Real Refraction + Chromatic Aberration + Internal Light Bending
        ======================================================================== 
      */}
      <svg className="fixed w-0 h-0 pointer-events-none" aria-hidden="true" style={{ position: 'absolute' }}>
        <defs>
          <filter id="real-liquid-glass" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
            {/* 1. Depth of Field Blur */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="BLUR" />
            
            {/* 2. Liquid Flow Turbulence (Wave distortion) */}
            <feTurbulence type="fractalNoise" baseFrequency="0.01 0.015" numOctaves="3" result="NOISE" seed="42">
              <animate attributeName="baseFrequency" values="0.01 0.015; 0.015 0.02; 0.01 0.015" dur="12s" repeatCount="indefinite" />
              <animate attributeName="seed" values="42; 84; 42" dur="30s" repeatCount="indefinite" />
            </feTurbulence>
            
            {/* Boost contrast of noise for sharper refraction */}
            <feColorMatrix type="matrix" values="
              1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              0 0 0 1.5 -0.2" in="NOISE" result="INTENSE_NOISE" />
            
            {/* 3. Intense Refraction / Magnification */}
            <feDisplacementMap in="BLUR" in2="INTENSE_NOISE" scale="40" xChannelSelector="R" yChannelSelector="G" result="REFRACTED" />
            
            {/* 4. Chromatic Aberration RGB Splitting */}
            {/* Offset the refracted image to split the channels slightly */}
            <feOffset dx="4" dy="0" in="REFRACTED" result="R_SHIFT" />
            <feOffset dx="-4" dy="0" in="REFRACTED" result="B_SHIFT" />
            
            {/* Isolate colors */}
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" in="R_SHIFT" result="RED" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" in="REFRACTED" result="GREEN" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" in="B_SHIFT" result="BLUE" />
            
            {/* Recombine channels */}
            <feBlend mode="screen" in="RED" in2="GREEN" result="RG" />
            <feBlend mode="screen" in="RG" in2="BLUE" result="FINAL_RGB" />
            
            {/* 5. Internal Caustic Brilliance (slight brightness curve to make it look like solid glass) */}
            <feComponentTransfer in="FINAL_RGB" result="FINAL_GLASS">
              <feFuncR type="linear" slope="1.05" intercept="0.02" />
              <feFuncG type="linear" slope="1.05" intercept="0.02" />
              <feFuncB type="linear" slope="1.05" intercept="0.02" />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>

      {/* Dynamic Keyframes for internal light sweeps */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes sweep-primary {
          0% { transform: translateX(-150%) skewX(-30deg); opacity: 0; }
          15% { opacity: 0.9; }
          30% { transform: translateX(250%) skewX(-30deg); opacity: 0; }
          100% { transform: translateX(250%) skewX(-30deg); opacity: 0; }
        }
        @keyframes sweep-secondary {
          0% { transform: translateX(-150%) skewX(-40deg); opacity: 0; }
          20% { opacity: 0.5; }
          40% { transform: translateX(250%) skewX(-40deg); opacity: 0; }
          100% { transform: translateX(250%) skewX(-40deg); opacity: 0; }
        }
        .animate-sweep-1 {
          animation: sweep-primary 8s cubic-bezier(0.25, 1, 0.5, 1) infinite;
          will-change: transform;
        }
        .animate-sweep-2 {
          animation: sweep-secondary 12s cubic-bezier(0.25, 1, 0.5, 1) infinite;
          animation-delay: 2s;
          will-change: transform;
        }
      `}} />

      <nav 
        ref={navRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHoveringNav(true)}
        onMouseLeave={handleMouseLeave}
        className="pointer-events-auto relative flex items-center p-2 transition-all duration-500 rounded-full group"
        style={{ transformStyle: 'preserve-3d' }}
      >
        
        {/* =========================================
            GLASS VOLUME LAYERS
            ========================================= */}
            
        {/* Layer 1: Real Background Refraction (SVG Backdrop Filter) */}
        <div 
          className="absolute inset-0 rounded-full pointer-events-none bg-white/5 dark:bg-[#0a0a0a]/10"
          style={{ 
            backdropFilter: 'url(#real-liquid-glass)',
            WebkitBackdropFilter: 'url(#real-liquid-glass)',
          }}
        />

        {/* Layer 2: Glass Thickness (Inner rims and 3D shadow) */}
        <div 
          className="absolute inset-0 rounded-full pointer-events-none border border-white/30 dark:border-white/10"
          style={{
            boxShadow: `
              inset 0 4px 12px -2px rgba(255,255,255,0.8),    /* Top rim highlight (thick) */
              inset 0 -6px 15px -4px rgba(0,0,0,0.5),         /* Bottom dark volume */
              inset 3px 0 8px -2px rgba(255,255,255,0.4),     /* Left rim highlight */
              inset -3px 0 8px -2px rgba(0,0,0,0.4),          /* Right dark rim */
              0 25px 50px -12px rgba(0,0,0,0.6)               /* Heavy drop shadow for floating */
            `
          }}
        />

        {/* Layer 3: Contoured Surface Specular (Glossy Curve) */}
        <div 
          className="absolute inset-0 rounded-full pointer-events-none mix-blend-overlay opacity-90"
          style={{
            background: 'radial-gradient(150% 100% at 50% -20%, rgba(255,255,255,1) 0%, rgba(255,255,255,0.1) 35%, transparent 60%)'
          }}
        />
        
        {/* Layer 3b: Base Convex Gradient */}
        <div 
          className="absolute inset-0 rounded-full pointer-events-none opacity-80 mix-blend-normal"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.05) 15%, transparent 40%, rgba(0,0,0,0.15) 85%, rgba(0,0,0,0.5) 100%)'
          }}
        />

        {/* Layer 4: Subtle Edge Chromatic Aberration Rim */}
        <div 
          className="absolute inset-0 rounded-full pointer-events-none mix-blend-screen opacity-70"
          style={{
            boxShadow: 'inset 2px 0 5px rgba(255,0,0,0.4), inset -2px 0 5px rgba(0,100,255,0.4)'
          }}
        />

        {/* Layer 5: Internal Caustic Core (Light bending in the volume) */}
        <div 
          className="absolute inset-0 rounded-full pointer-events-none mix-blend-color-dodge opacity-60"
          style={{
            background: 'radial-gradient(120% 100% at 50% 100%, rgba(255,255,255,0.4) 0%, transparent 60%)'
          }}
        />

        {/* Layer 6: Dynamic Multi-layer Sweeping Reflections */}
        {!reducedMotion && (
          <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
            {/* Primary fast reflection */}
            <div className="w-[50%] h-[150%] absolute -top-1/4 -left-[50%] bg-linear-to-r from-transparent via-white/70 to-transparent animate-sweep-1 mix-blend-overlay blur-[1px]" />
            {/* Secondary slow reflection (parallax thickness) */}
            <div className="w-[80%] h-[150%] absolute -top-1/4 -left-[80%] bg-linear-to-r from-transparent via-white/30 to-transparent animate-sweep-2 blur-[3px]" />
          </div>
        )}

        {/* Layer 7: Mouse Reactive Internal Light (Caustic interaction) */}
        {!reducedMotion && isHoveringNav && (
          <div 
            className="absolute inset-0 pointer-events-none rounded-full mix-blend-screen z-0 transition-opacity duration-300"
            style={{
              background: 'radial-gradient(100px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(255,255,255,0.6), transparent 100%)',
            }}
          />
        )}


        {/* =========================================
            NAVIGATION ITEMS
            ========================================= */}
        <div className="flex items-center gap-1.5 px-2 relative z-10">
          {navItems.map((item) => {
            const isHovered = hoveredItem === item.name;
            const isActive = activeItem === item.name;

            return (
              <a
                key={item.name}
                href={item.href}
                onMouseEnter={() => setHoveredItem(item.name)}
                onClick={() => setActiveItem(item.name)}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  isHovered || isActive 
                    ? "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" 
                    : "text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white drop-shadow-sm"
                }`}
              >
                {/* Active/Hover Pill inside the glass */}
                {(isHovered || isActive) && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-linear-to-r from-purple-500/90 to-blue-500/90 rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-2px_4px_rgba(0,0,0,0.3),0_0_15px_rgba(168,85,247,0.6)] border border-white/40 dark:border-white/20 z-0"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  >
                    {/* Glossy overlay for the pill itself */}
                    <div className="absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-white/50 to-transparent rounded-t-full pointer-events-none" />
                  </motion.div>
                )}
                
                <item.icon className={`relative w-4 h-4 transition-colors duration-300 z-20 ${isActive && !isHovered ? "text-purple-600 dark:text-purple-300" : ""}`} />
                <span className={`relative hidden sm:inline transition-colors duration-300 z-20 ${isActive && !isHovered ? "text-purple-600 dark:text-purple-300" : ""}`}>{item.name}</span>
              </a>
            );
          })}
        </div>

        <div className="w-px h-7 bg-slate-400/50 dark:bg-slate-500/50 mx-2 relative z-10 shadow-sm" />
        
        <div className="flex items-center gap-2 pr-1 relative z-10">
          <button 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2.5 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white rounded-full transition-all duration-300 relative group drop-shadow-sm"
            aria-label="Toggle theme"
          >
            {/* Button Hover Glow */}
            <div className="absolute inset-0 rounded-full bg-white/0 group-hover:bg-white/20 dark:group-hover:bg-white/10 transition-colors duration-300 pointer-events-none" />
            
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