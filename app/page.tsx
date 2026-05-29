'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal as TerminalIcon, ShieldAlert, MonitorPlay, ArrowDown, ChevronRight, Send, ArrowUpRight } from 'lucide-react';
import mediaData from '../public/media.json';
import Terminal from '../components/Terminal';
import CommandPalette from '../components/CommandPalette';
import VideoPopup from '../components/VideoPopup';
import LiveShowcase from '../components/LiveShowcase';
import projectsData from '../public/projects.json';

export default function Home() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [activeSandbox, setActiveSandbox] = useState<any | null>(null);
  const [terminalOpen, setTerminalOpen] = useState(true);

  // Refs for navigation scrolling
  const workRef = useRef<HTMLDivElement>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const terminalSectionRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);

  // Scroll to section handler
  const navigateToSection = (sectionId: string) => {
    let target: HTMLDivElement | null = null;
    if (sectionId === 'work') target = workRef.current;
    if (sectionId === 'showcase') target = showcaseRef.current;
    if (sectionId === 'terminal') target = terminalSectionRef.current;
    if (sectionId === 'about') target = aboutRef.current;

    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white font-sans overflow-hidden">
      
      {/* Dynamic Background Noise/Glow (Subtle Aesthetic) */}
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-[#0a0a0a] to-transparent pointer-events-none opacity-80"></div>
      <div className="absolute -top-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-white/[0.01] blur-[150px] pointer-events-none"></div>
      <div className="absolute top-[40%] -right-[10%] w-[600px] h-[600px] rounded-full bg-white/[0.01] blur-[150px] pointer-events-none"></div>

      {/* Sticky Premium Minimal Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-black/60 backdrop-blur-md border-b border-white/[0.03] select-none">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-mono text-sm tracking-[0.25em] font-black uppercase text-white hover:text-white/80 transition-colors select-none cursor-pointer"
          >
            VAULT // OS
          </button>
          <div className="flex items-center space-x-8 font-mono text-xs text-white/50">
            <button 
              onClick={() => navigateToSection('work')} 
              className="hover:text-white transition-colors uppercase tracking-widest relative py-1 cursor-pointer"
            >
              Work
            </button>
            <button 
              onClick={() => navigateToSection('showcase')} 
              className="hover:text-white transition-colors uppercase tracking-widest relative py-1 cursor-pointer"
            >
              Showcase
            </button>
            <button 
              onClick={() => navigateToSection('terminal')} 
              className="hover:text-white transition-colors uppercase tracking-widest relative py-1 cursor-pointer"
            >
              Terminal
            </button>
            <button 
              onClick={() => navigateToSection('about')} 
              className="hover:text-white transition-colors uppercase tracking-widest relative py-1 cursor-pointer"
            >
              About
            </button>
          </div>
        </div>
      </nav>

      {/* 1. Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center max-w-6xl mx-auto px-6 pt-20 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Oversized Headlines */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-8 select-none">
            <div className="space-y-3">
              <span className="font-mono text-xs text-white/40 tracking-[0.4em] uppercase block">
                PORTFOLIO SYSTEM V2
              </span>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[0.95] uppercase">
                DESIGNED FOR SPEED.<br />
                <span className="text-white/40 font-mono font-light italic text-3xl md:text-5xl tracking-normal normal-case">architected for</span><br />
                CINEMA.
              </h1>
            </div>
            
            <p className="text-sm md:text-base text-white/60 font-sans max-w-lg leading-relaxed">
              A bespoke digital stage showcasing high-performance motion design, interactive code architecture, and a virtual Zsh terminal interface. Hit <kbd className="font-mono bg-white/10 px-1 py-0.5 rounded text-[10px] text-white/70">⌘K</kbd> to prompt globally.
            </p>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => navigateToSection('work')}
                className="px-6 py-3 bg-white text-black font-semibold text-xs rounded hover:bg-white/95 transition-all select-none flex items-center space-x-2 cursor-pointer"
              >
                <span>EXPLORE WORK</span>
                <ChevronRight size={14} />
              </button>
              <button
                onClick={() => navigateToSection('terminal')}
                className="px-6 py-3 bg-transparent border border-white/20 hover:border-white text-white font-mono text-xs rounded transition-all select-none flex items-center space-x-2 cursor-pointer"
              >
                <TerminalIcon size={14} />
                <span>OPEN TERMINAL</span>
              </button>
            </div>
          </div>

          {/* Right Column: Dynamic Organic Shape Video Mask (Blob) */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="relative w-[320px] h-[320px] md:w-[400px] md:h-[400px]">
              
              {/* Outer Wobbling Ring Glow */}
              <div className="absolute inset-0 bg-white/5 border border-white/10 organic-blob animate-pulse pointer-events-none scale-105"></div>
              
              {/* Primary Wobbling Video Mask Container */}
              <div className="absolute inset-0 organic-blob overflow-hidden bg-[#111111] border border-white/20 shadow-2xl">
                <video
                  src="/vids/mountains-sunset-clean-skyline.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover scale-110"
                />
                {/* Visual Glass Tint Layer */}
                <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
              </div>

              {/* Monospaced Floating Widget */}
              <div className="absolute bottom-4 -left-6 bg-black/90 border border-white/10 px-4 py-2.5 rounded font-mono text-[10px] space-y-1 shadow-2xl backdrop-blur-sm z-10 select-none">
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-white/40">BUFFER: OK</span>
                </div>
                <div className="text-white/80">CORE_AMBIENT_STREAM</div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Footer Indicator */}
        <div className="absolute bottom-8 left-6 flex items-center space-x-3 text-[10px] text-white/30 font-mono tracking-widest select-none">
          <span>SCROLL FOR SPECTRA</span>
          <ArrowDown size={12} className="animate-bounce" />
        </div>
      </section>

      {/* 2. Work Section: Premium Irregular Grid Layout */}
      <section ref={workRef} className="max-w-6xl mx-auto px-6 py-28 border-t border-white/[0.03]">
        <div className="space-y-4 mb-16 select-none">
          <span className="font-mono text-xs text-white/40 tracking-[0.4em] uppercase block">
            SELECTED SPECTRA // VISUAL REGISTRY
          </span>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
            IRREGULAR CREATIVE DISPLAYS
          </h2>
          <p className="text-xs md:text-sm text-white/40 font-mono max-w-xl">
            A bespoke off-axis multi-column dashboard rejecting typical card layouts. Ambient auto-looping assets open instantly into the cinematic theater on click.
          </p>
        </div>

        {/* 12-Column Irregular grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Card 1: Horizon Drift (Featured Wide Column - md:span-8) */}
          <div 
            onClick={() => setActiveVideo('horizon-drift')}
            className="md:col-span-8 group relative bg-[#070707] border border-white/[0.06] hover:border-white/30 rounded-lg overflow-hidden h-[360px] md:h-[400px] cursor-pointer shadow-xl transition-all duration-300"
          >
            <div className="absolute inset-0 bg-black">
              <video
                src="/vids/mountains-sunset-clean-skyline.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover opacity-60 group-hover:scale-[1.03] group-hover:opacity-80 transition-all duration-700"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/10 flex flex-col justify-end p-8 font-mono">
              <span className="px-2.5 py-0.5 border border-white/20 text-white/50 text-[9px] uppercase tracking-widest rounded-full bg-[#111111]/80 w-fit">
                Cinematic
              </span>
              <h3 className="text-xl font-bold uppercase tracking-tight text-white mt-3 select-none">
                Horizon Drift
              </h3>
              <p className="text-[11px] text-white/60 font-sans mt-2 max-w-md leading-relaxed select-none">
                An aesthetic study of light and scale in mountainous terrain, capturing slow-moving sunset dynamics.
              </p>
              <div className="flex items-center space-x-2 mt-4 text-[10px] text-white/40 group-hover:text-white transition-colors">
                <MonitorPlay size={12} />
                <span>LAUNCH CINEMA MODE [horizon-drift]</span>
              </div>
            </div>
          </div>

          {/* Card 2: Neon Chase (Tall Column - md:span-4) */}
          <div 
            onClick={() => setActiveVideo('neon-chase')}
            className="md:col-span-4 group relative bg-[#070707] border border-white/[0.06] hover:border-white/30 rounded-lg overflow-hidden h-[360px] md:h-[400px] cursor-pointer shadow-xl transition-all duration-300"
          >
            <div className="absolute inset-0 bg-black">
              <video
                src="/vids/Car_driving_1.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover opacity-60 group-hover:scale-[1.03] group-hover:opacity-80 transition-all duration-700"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/10 flex flex-col justify-end p-8 font-mono">
              <span className="px-2.5 py-0.5 border border-white/20 text-white/50 text-[9px] uppercase tracking-widest rounded-full bg-[#111111]/80 w-fit">
                Action
              </span>
              <h3 className="text-xl font-bold uppercase tracking-tight text-white mt-3 select-none">
                Neon Chase
              </h3>
              <p className="text-[11px] text-white/60 font-sans mt-2 leading-relaxed select-none">
                A high-speed vehicular odyssey through simulated urban grid systems and low-light reflections.
              </p>
              <div className="flex items-center space-x-2 mt-4 text-[10px] text-white/40 group-hover:text-white transition-colors">
                <MonitorPlay size={12} />
                <span>LAUNCH CINEMA MODE</span>
              </div>
            </div>
          </div>

          {/* Card 3: 3xHit Motion System (Standard Column - md:span-4) */}
          <div 
            onClick={() => setActiveVideo('3xhit-motion')}
            className="md:col-span-4 group relative bg-[#070707] border border-white/[0.06] hover:border-white/30 rounded-lg overflow-hidden h-[320px] cursor-pointer shadow-xl transition-all duration-300"
          >
            <div className="absolute inset-0 bg-black">
              <video
                src="/vids/3xHIT_MEDT_AE-UE1.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover opacity-50 group-hover:scale-[1.03] group-hover:opacity-75 transition-all duration-700"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/10 flex flex-col justify-end p-6 font-mono">
              <span className="px-2.5 py-0.5 border border-white/20 text-white/50 text-[9px] uppercase tracking-widest rounded-full bg-[#111111]/80 w-fit">
                Experimental
              </span>
              <h3 className="text-base font-bold uppercase tracking-tight text-white mt-3 select-none">
                3xHit Motion System
              </h3>
              <div className="flex items-center space-x-2 mt-4 text-[10px] text-white/40 group-hover:text-white transition-colors">
                <MonitorPlay size={12} />
                <span>LAUNCH CINEMA MODE</span>
              </div>
            </div>
          </div>

          {/* Card 4: Alleywalk (Featured Wide Column - md:span-8) */}
          <div 
            onClick={() => setActiveVideo('alleywalk')}
            className="md:col-span-8 group relative bg-[#070707] border border-white/[0.06] hover:border-white/30 rounded-lg overflow-hidden h-[320px] cursor-pointer shadow-xl transition-all duration-300"
          >
            <div className="absolute inset-0 bg-black">
              <video
                src="/vids/Walking in an Alley_small_1.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover opacity-50 group-hover:scale-[1.03] group-hover:opacity-75 transition-all duration-700"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/10 flex flex-col justify-end p-6 font-mono">
              <span className="px-2.5 py-0.5 border border-white/20 text-white/50 text-[9px] uppercase tracking-widest rounded-full bg-[#111111]/80 w-fit">
                Cinematic
              </span>
              <h3 className="text-lg font-bold uppercase tracking-tight text-white mt-3 select-none">
                Alleywalk
              </h3>
              <p className="text-[11px] text-white/60 font-sans mt-2 max-w-md leading-relaxed select-none">
                First-person narrative walk through an atmospheric alleyway, exploring cinematic suspense and shadows.
              </p>
              <div className="flex items-center space-x-2 mt-4 text-[10px] text-white/40 group-hover:text-white transition-colors">
                <MonitorPlay size={12} />
                <span>LAUNCH CINEMA MODE [alleywalk]</span>
              </div>
            </div>
          </div>

          {/* Card 5: Morphing Bounds (Medium - md:span-6) */}
          <div 
            onClick={() => setActiveVideo('morphing-bounds')}
            className="md:col-span-6 group relative bg-[#070707] border border-white/[0.06] hover:border-white/30 rounded-lg overflow-hidden h-[280px] cursor-pointer shadow-xl transition-all duration-300"
          >
            <div className="absolute inset-0 bg-black">
              <video
                src="/vids/Jerryson_ShapeLayerAnimationGK.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover opacity-55 group-hover:scale-[1.03] group-hover:opacity-75 transition-all duration-700"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/10 flex flex-col justify-end p-6 font-mono">
              <span className="px-2.5 py-0.5 border border-white/20 text-white/50 text-[9px] uppercase tracking-widest rounded-full bg-[#111111]/80 w-fit">
                Animation
              </span>
              <h3 className="text-base font-bold uppercase tracking-tight text-white mt-3 select-none">
                Morphing Bounds
              </h3>
              <div className="flex items-center space-x-2 mt-4 text-[10px] text-white/40 group-hover:text-white transition-colors">
                <MonitorPlay size={12} />
                <span>LAUNCH CINEMA MODE</span>
              </div>
            </div>
          </div>

          {/* Card 6: Loading Sequence (Medium - md:span-6) */}
          <div 
            onClick={() => setActiveVideo('loading-sequence')}
            className="md:col-span-6 group relative bg-[#070707] border border-white/[0.06] hover:border-white/30 rounded-lg overflow-hidden h-[280px] cursor-pointer shadow-xl transition-all duration-300"
          >
            <div className="absolute inset-0 bg-black">
              <video
                src="/vids/LadeBalken_Jerryson.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover opacity-55 group-hover:scale-[1.03] group-hover:opacity-75 transition-all duration-700"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/10 flex flex-col justify-end p-6 font-mono">
              <span className="px-2.5 py-0.5 border border-white/20 text-white/50 text-[9px] uppercase tracking-widest rounded-full bg-[#111111]/80 w-fit">
                Interface
              </span>
              <h3 className="text-base font-bold uppercase tracking-tight text-white mt-3 select-none">
                Ladebalken Loading Sequence
              </h3>
              <div className="flex items-center space-x-2 mt-4 text-[10px] text-white/40 group-hover:text-white transition-colors">
                <MonitorPlay size={12} />
                <span>LAUNCH CINEMA MODE</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2.5 Live Projects Showcase Section */}
      <section ref={showcaseRef} className="relative bg-black border-t border-white/[0.03]">
        <LiveShowcase 
          activeProject={activeSandbox}
          setActiveProject={setActiveSandbox}
        />
      </section>

      {/* 3. Terminal Drawer Section */}
      <section ref={terminalSectionRef} className="max-w-6xl mx-auto px-6 py-28 border-t border-white/[0.03] bg-[#020202]/30">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Section Info Column */}
          <div className="lg:col-span-4 space-y-6 select-none lg:sticky lg:top-24">
            <div className="space-y-3">
              <span className="font-mono text-xs text-white/40 tracking-[0.4em] uppercase block">
                INTEGRATED CONTROLLER
              </span>
              <h2 className="text-3xl font-black uppercase tracking-tight text-white">
                VAULTOS INTERACTIVE TERMINAL
              </h2>
            </div>
            
            <p className="text-xs md:text-sm text-white/60 leading-relaxed font-sans font-light select-none">
              Navigate directories (`cd`), view system statistics (`cat`), list projects (`ls`), and boot cinema screen files (`open [project-id]`) natively from our simulation shell.
            </p>
            
            <div className="border border-white/10 rounded-lg p-4 font-mono text-[10px] bg-black/60 space-y-2">
              <div className="text-white/40 uppercase tracking-widest border-b border-white/5 pb-1">Quick Codes:</div>
              <div className="flex justify-between">
                <span>help</span>
                <span className="text-white/60">Display operational commands</span>
              </div>
              <div className="flex justify-between">
                <span>ls projects</span>
                <span className="text-white/60">List virtual project directories</span>
              </div>
              <div className="flex justify-between">
                <span>open neon-chase</span>
                <span className="text-white/60">Trigger video project popup</span>
              </div>
            </div>
          </div>

          {/* Actual Console Column */}
          <div className="lg:col-span-8 w-full">
            <Terminal 
              onOpenVideo={(vidId) => setActiveVideo(vidId)} 
              onOpenSandbox={(sandboxId) => {
                const proj = projectsData.find((p) => p.id === sandboxId);
                if (proj) {
                  setActiveSandbox(proj);
                }
              }}
              onNavigateToSection={navigateToSection}
              isOpen={terminalOpen}
            />
          </div>
        </div>
      </section>

      {/* 4. About & Contact Section */}
      <section ref={aboutRef} className="max-w-6xl mx-auto px-6 py-28 border-t border-white/[0.03]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Column 1: Core Bio (span 5) */}
          <div className="lg:col-span-5 space-y-6 font-mono select-none">
            <div className="space-y-3">
              <span className="text-white/40 text-xs tracking-[0.4em] uppercase block">SYSTEM CREDENTIALS</span>
              <h2 className="text-3xl font-black uppercase tracking-tight text-white">BIOGRAPHY & SKILLS</h2>
            </div>

            <p className="text-xs text-white/70 leading-relaxed font-sans">
              I am a digital developer bridging structural system architectures and organic cinematic interfaces. By structuring code for high performance and visual interactions, every viewport becomes an intentional, heavy narrative.
            </p>

            <div className="space-y-4 pt-6 border-t border-white/5 text-xs text-white/50">
              <div className="space-y-1.5">
                <span className="text-white/80 uppercase text-[10px] tracking-wider block">INTERFACE STACK:</span>
                <span className="font-sans text-[11px] block leading-relaxed text-white/60">
                  React / Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion, GSAP, WebGL.
                </span>
              </div>
              <div className="space-y-1.5">
                <span className="text-white/80 uppercase text-[10px] tracking-wider block">CREATIVE DESIGN:</span>
                <span className="font-sans text-[11px] block leading-relaxed text-white/60">
                  UI/UX Layout Systems, Motion Design, Adobe After Effects, Cinema 4D, Vector geometries.
                </span>
              </div>
            </div>
          </div>

          {/* Spacer */}
          <div className="hidden lg:block lg:col-span-1"></div>

          {/* Column 2: Minimal Contact Form (span 6) */}
          <div className="lg:col-span-6 space-y-8 font-mono">
            <div className="space-y-3 select-none">
              <span className="text-white/40 text-xs tracking-[0.4em] uppercase block">TRANSMIT PACKET</span>
              <h2 className="text-3xl font-black uppercase tracking-tight text-white">CONNECT WITH THE VAULT</h2>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              <div className="relative">
                <label className="text-[10px] text-white/40 uppercase block mb-1.5">Node Label</label>
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  className="w-full bg-[#050505] border border-white/10 focus:border-white outline-none rounded p-3 text-xs text-white placeholder-white/20 transition-colors font-mono"
                />
              </div>

              <div className="relative">
                <label className="text-[10px] text-white/40 uppercase block mb-1.5">Callback Node</label>
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  className="w-full bg-[#050505] border border-white/10 focus:border-white outline-none rounded p-3 text-xs text-white placeholder-white/20 transition-colors font-mono"
                />
              </div>

              <div className="relative">
                <label className="text-[10px] text-white/40 uppercase block mb-1.5">Transmission Payload</label>
                <textarea 
                  rows={4}
                  placeholder="Secure packet content..." 
                  className="w-full bg-[#050505] border border-white/10 focus:border-white outline-none rounded p-3 text-xs text-white placeholder-white/20 transition-colors font-mono resize-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-white text-black font-semibold text-xs rounded hover:bg-white/90 transition-all select-none flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>TRANSMIT PACKET</span>
                <Send size={12} />
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* 5. Minimal Footer */}
      <footer className="border-t border-white/[0.03] py-12 bg-black select-none">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-[10px] text-white/30 font-mono uppercase tracking-wider">
          <div className="flex items-center space-x-3">
            <span>© 2026 VAULTOS INC.</span>
            <span>//</span>
            <span>ALL SYSTEMS OPERATIONAL</span>
          </div>
          <div className="flex space-x-6">
            <a href="https://github.com/skengzyy" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center space-x-1">
              <span>GITHUB</span>
              <ArrowUpRight size={10} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center space-x-1">
              <span>LINKEDIN</span>
              <ArrowUpRight size={10} />
            </a>
            <a href="mailto:contact@portfolio.vault" className="hover:text-white flex items-center space-x-1">
              <span>EMAIL</span>
              <ArrowUpRight size={10} />
            </a>
          </div>
        </div>
      </footer>

      {/* Dynamic Floating Command Palette overlay */}
      <CommandPalette 
        onOpenVideo={(vidId) => setActiveVideo(vidId)} 
        onNavigateToSection={navigateToSection}
        onOpenTerminal={() => navigateToSection('terminal')}
      />

      {/* Fullscreen Cinematic overlay Video player */}
      <VideoPopup 
        videoId={activeVideo} 
        onClose={() => setActiveVideo(null)} 
      />

    </div>
  );
}
