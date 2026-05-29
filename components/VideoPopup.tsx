'use client';

import React, { useEffect, useRef } from 'react';
import { X, Play, Info } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import mediaData from '../public/media.json';

interface VideoPopupProps {
  videoId: string | null;
  onClose: () => void;
}

export default function VideoPopup({ videoId, onClose }: VideoPopupProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Retrieve matching media project metadata
  const project = mediaData.find((p) => p.id === videoId);

  // Lock scroll when cinematic mode is active
  useEffect(() => {
    if (videoId) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [videoId]);

  // Escape to close listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none">
        {/* Fullscreen Close Zone */}
        <div className="absolute inset-0 cursor-zoom-out" onClick={onClose}></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl bg-[#030303] border border-[#222222] rounded-lg overflow-hidden shadow-2xl z-10 flex flex-col md:flex-row"
        >
          {/* Left Column: Premium Cinematic Video player */}
          <div className="relative flex-1 bg-black aspect-video md:aspect-auto md:h-[500px]">
            <video
              ref={videoRef}
              src={project.videoUrl}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
            {/* Ambient Dark Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none"></div>
          </div>

          {/* Right Column: Project details panel */}
          <div className="w-full md:w-[350px] p-6 flex flex-col justify-between border-t md:border-t-0 md:border-l border-[#222222] bg-[#070707] font-mono">
            {/* Close Button Top Right */}
            <div className="flex items-center justify-between pb-4 border-b border-[#1a1a1a]">
              <span className="text-[10px] text-white/40 tracking-wider">PROJECT SPECTRA</span>
              <button 
                onClick={onClose}
                className="text-white/60 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-full transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Main Info */}
            <div className="flex-1 py-6 flex flex-col justify-center space-y-4">
              <div>
                <span className="px-2 py-0.5 border border-[#333333] text-white/50 text-[9px] uppercase tracking-widest rounded-full bg-[#111111]">
                  {project.category}
                </span>
                <h2 className="text-xl font-bold text-white uppercase tracking-tight mt-3">
                  {project.title}
                </h2>
              </div>

              <p className="text-xs text-white/70 leading-relaxed font-sans">
                {project.description}
              </p>

              {/* Technical Specifications */}
              <div className="space-y-2 pt-2 text-[10px] text-white/50 border-t border-[#1a1a1a]">
                <div className="flex justify-between">
                  <span>SYSTEM TARGET:</span>
                  <span className="text-white">{project.id}.txt</span>
                </div>
                <div className="flex justify-between">
                  <span>RELEASE DATE:</span>
                  <span className="text-white">{project.date}</span>
                </div>
                <div className="flex justify-between">
                  <span>RESOURCE SIZE:</span>
                  <span className="text-white">{project.size}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-3 pt-4 border-t border-[#1a1a1a]">
              <div className="flex items-center space-x-2 text-[9px] text-white/40 leading-none">
                <Info size={10} />
                <span>Running in continuous edge loop.</span>
              </div>
              <button 
                onClick={onClose}
                className="w-full py-2 bg-white text-black font-semibold text-xs rounded hover:bg-white/95 transition-all active:scale-[0.98] select-none cursor-pointer"
              >
                CLOSE THEATER
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
