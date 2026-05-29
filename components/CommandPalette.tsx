'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Monitor, FileText, ArrowUpRight, Play, CornerDownLeft } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import mediaData from '../public/media.json';

interface CommandPaletteProps {
  onOpenVideo: (videoId: string) => void;
  onNavigateToSection: (section: string) => void;
  onOpenTerminal: () => void;
}

interface SearchItem {
  id: string;
  title: string;
  category: 'project' | 'command' | 'navigation';
  description: string;
  action: () => void;
}

export default function CommandPalette({ onOpenVideo, onNavigateToSection, onOpenTerminal }: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Define searchable catalog items
  const items: SearchItem[] = [
    // Terminal commands
    {
      id: 'cmd-help',
      title: 'Run command: help',
      category: 'command',
      description: 'List all operational commands inside VaultOS terminal.',
      action: () => { onOpenTerminal(); setIsOpen(false); }
    },
    {
      id: 'cmd-ls',
      title: 'Run command: ls projects',
      category: 'command',
      description: 'Lists all available projects in the virtual directory tree.',
      action: () => { onOpenTerminal(); setIsOpen(false); }
    },
    {
      id: 'cmd-clear',
      title: 'Run command: clear',
      category: 'command',
      description: 'Clear the terminal output screen.',
      action: () => { onOpenTerminal(); setIsOpen(false); }
    },
    // Navigation routes
    {
      id: 'nav-work',
      title: 'Navigate to: /work',
      category: 'navigation',
      description: 'Jump scroll directly to the cinematic project displays.',
      action: () => { onNavigateToSection('work'); setIsOpen(false); }
    },
    {
      id: 'nav-showcase',
      title: 'Navigate to: /showcase',
      category: 'navigation',
      description: 'Jump scroll directly to the Interactive Live Projects Showcase.',
      action: () => { onNavigateToSection('showcase'); setIsOpen(false); }
    },
    {
      id: 'nav-terminal',
      title: 'Navigate to: /terminal',
      category: 'navigation',
      description: 'Open the interactive Zsh virtual shell drawer.',
      action: () => { onNavigateToSection('terminal'); setIsOpen(false); }
    },
    {
      id: 'nav-about',
      title: 'Navigate to: /about',
      category: 'navigation',
      description: 'Scroll down to biography, skills, and developer credentials.',
      action: () => { onNavigateToSection('about'); setIsOpen(false); }
    },
    // Projects from media database
    ...mediaData.map((project) => ({
      id: `proj-${project.id}`,
      title: `Project: ${project.title}`,
      category: 'project' as const,
      description: project.description,
      action: () => { onOpenVideo(project.id); setIsOpen(false); }
    }))
  ];

  // Hotkey listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        setQuery('');
        setSelectedIndex(0);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Set input focus when opening
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  // Click outside to close helper
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener('mousedown', handleClickOutside);
    }
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Keyboard navigation inside the palette
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
      }
    }
  };

  // Fuzzy-like matching query filter
  const filtered = items.filter((item) => {
    const searchStr = `${item.title} ${item.description} ${item.category}`.toLowerCase();
    return searchStr.includes(query.toLowerCase());
  });

  // Keep index within bounds on filter change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  return (
    <>
      {/* Help Trigger Indicator Button in bottom right */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 px-4 py-2.5 bg-[#0c0c0c]/80 hover:bg-[#1a1a1a]/95 text-white/70 hover:text-white border border-[#222222] rounded-full shadow-lg backdrop-blur-md transition-all flex items-center space-x-2 text-xs font-mono group z-40 select-none cursor-pointer"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block"></span>
        <span>COMMAND PALETTE</span>
        <kbd className="bg-white/10 text-white/50 px-1.5 py-0.5 rounded text-[10px] group-hover:text-white transition-colors">⌘K</kbd>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-start justify-center pt-24 px-4">
            <motion.div
              ref={containerRef}
              initial={{ opacity: 0, scale: 0.97, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -8 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="w-full max-w-xl bg-[#090909] border border-[#222222] rounded-lg shadow-2xl overflow-hidden flex flex-col font-mono"
            >
              {/* Search Header */}
              <div className="flex items-center space-x-3 px-4 py-3.5 border-b border-[#222222]">
                <Search className="text-white/40" size={16} />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Fuzzy search projects, zsh console commands, routes..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-transparent border-none outline-none text-[#ffffff] placeholder-white/30 text-sm focus:ring-0"
                />
                <kbd className="text-[10px] text-white/30 bg-white/5 px-2 py-0.5 rounded select-none">ESC</kbd>
              </div>

              {/* Items List */}
              <div className="max-h-[300px] overflow-y-auto p-2 flex flex-col space-y-0.5 select-none">
                {filtered.length === 0 ? (
                  <div className="text-center py-8 text-sm text-white/40">
                    No results found for "{query}"
                  </div>
                ) : (
                  filtered.map((item, index) => {
                    const isSelected = index === selectedIndex;
                    return (
                      <div
                        key={item.id}
                        onClick={item.action}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`flex items-start justify-between px-3 py-2.5 rounded cursor-pointer transition-colors ${
                          isSelected ? 'bg-white text-black' : 'bg-transparent text-white'
                        }`}
                      >
                        <div className="flex items-start space-x-3 max-w-[85%]">
                          <div className={`mt-0.5 ${isSelected ? 'text-black' : 'text-white/40'}`}>
                            {item.category === 'project' && <Play size={14} />}
                            {item.category === 'command' && <Monitor size={14} />}
                            {item.category === 'navigation' && <FileText size={14} />}
                          </div>
                          <div>
                            <p className="text-xs font-semibold leading-tight">{item.title}</p>
                            <p className={`text-[10px] mt-0.5 truncate leading-tight ${
                              isSelected ? 'text-black/70' : 'text-white/40'
                            }`}>
                              {item.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1.5 text-[9px] opacity-75">
                          {isSelected ? (
                            <span className="flex items-center font-bold">
                              Select <CornerDownLeft size={8} className="ml-1" />
                            </span>
                          ) : (
                            <span className="text-white/30 capitalize">{item.category}</span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer Guide */}
              <div className="bg-[#050505] border-t border-[#222222] px-4 py-2.5 flex items-center justify-between text-[10px] text-white/40 select-none">
                <div className="flex items-center space-x-3">
                  <span>↑↓ Navigate</span>
                  <span>↵ Enter to select</span>
                </div>
                <span>VaultOS Command Center</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
