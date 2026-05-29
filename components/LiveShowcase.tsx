'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code, 
  Terminal as TerminalIcon, 
  ExternalLink, 
  GitBranch, 
  Layers, 
  FileText, 
  Sparkles, 
  X, 
  Copy, 
  Check, 
  RefreshCw, 
  Maximize2,
  Minimize2,
  FolderGit2
} from 'lucide-react';
import projectsData from '../public/projects.json';

interface Project {
  id: string;
  title: string;
  languages: string[];
  description: string;
  tags: string[];
  github: string;
  embedUrl: string;
  linesOfCode: string;
  commits: string;
  archType: string;
  cloneCmd: string;
}

interface LiveShowcaseProps {
  activeProject?: Project | null;
  setActiveProject?: (project: Project | null) => void;
}

export default function LiveShowcase({ activeProject: propActiveProject, setActiveProject: propSetActiveProject }: LiveShowcaseProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [localActiveProject, setLocalActiveProject] = useState<Project | null>(null);

  const activeProject = propActiveProject !== undefined ? propActiveProject : localActiveProject;
  const setActiveProject = propSetActiveProject !== undefined ? propSetActiveProject : setLocalActiveProject;
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  // Spotlight Mouse-tracking coordinate ref
  const mouseCoords = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const languages = ['All', 'TypeScript', 'JavaScript', 'Java', 'Python'];

  const filteredProjects = selectedLanguage === 'All' 
    ? projectsData 
    : projectsData.filter((p: Project) => p.languages.includes(selectedLanguage));

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleReloadIframe = () => {
    setIframeKey(prev => prev + 1);
  };

  // Keyboard close for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeProject) {
        setActiveProject(null);
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeProject]);

  return (
    <section id="showcase-section" className="max-w-6xl mx-auto px-6 py-28 border-t border-white/[0.03] select-none">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div className="space-y-4">
          <span className="font-mono text-xs text-white/40 tracking-[0.4em] uppercase block">
            INTERACTIVE RUNTIMES // DIGITAL MATRIX
          </span>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white">
            LIVE PROJECT SHOWCASE
          </h2>
          <p className="text-xs md:text-sm text-white/40 font-mono max-w-xl">
            Click into any repository to compile and run live workspace codebases in the browser console. Instantly inspect core structure and runtimes.
          </p>
        </div>

        {/* Filter Navigation */}
        <div className="flex flex-wrap gap-2 border border-white/5 bg-neutral-950/80 p-1.5 rounded-lg backdrop-blur-md self-start font-mono text-[10px] tracking-wider uppercase">
          {languages.map((lang) => {
            const isActive = selectedLanguage === lang;
            return (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`relative px-4 py-2 rounded-md transition-all cursor-pointer ${
                  isActive 
                    ? 'text-black font-semibold' 
                    : 'text-white/50 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeLangTab"
                    className="absolute inset-0 bg-white rounded-md z-0"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{lang}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Projects Cards Grid */}
      <motion.div 
        layout 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project: Project) => {
            return (
              <CardSpotlight 
                key={project.id} 
                project={project} 
                onClick={() => {
                  setActiveProject(project);
                  setIframeKey(0);
                }}
              />
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Interactive Modal Sandbox Overlay */}
      <AnimatePresence>
        {activeProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 bg-black/90 backdrop-blur-md"
          >
            {/* Modal Body Container */}
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className={`bg-[#050505] border border-white/10 w-full h-full md:rounded-lg overflow-hidden flex flex-col shadow-2xl relative ${
                isFullscreen ? 'md:max-w-none md:h-screen md:m-0 md:rounded-none' : 'md:max-w-6xl md:h-[80vh]'
              }`}
            >
              
              {/* Fake Terminal Window Controls Bar */}
              <div className="bg-[#0f0f0f] border-b border-white/10 px-4 py-3 flex items-center justify-between select-none">
                
                {/* Visual Window buttons */}
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => {
                      setActiveProject(null);
                      setIsFullscreen(false);
                    }}
                    className="w-3 h-3 rounded-full bg-[#ef4444] inline-block hover:brightness-75 transition-all cursor-pointer"
                    title="Close"
                  >
                    <X size={8} className="text-black/40 mx-auto font-black hidden hover:block" />
                  </button>
                  <button 
                    onClick={() => {
                      setActiveProject(null);
                      setIsFullscreen(false);
                    }}
                    className="w-3 h-3 rounded-full bg-[#f59e0b] inline-block opacity-75 cursor-pointer"
                  ></button>
                  <button 
                    onClick={() => setIsFullscreen(prev => !prev)}
                    className="w-3 h-3 rounded-full bg-[#10b981] inline-block hover:brightness-75 transition-all cursor-pointer"
                    title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                  ></button>
                </div>

                {/* Simulated URL Bar / Title */}
                <div className="flex items-center space-x-2 text-xs font-mono text-white/50 bg-[#161616] border border-white/5 px-4 py-1.5 rounded-md w-1/2 justify-center truncate">
                  <TerminalIcon size={12} className="text-white/30 shrink-0" />
                  <span className="truncate">vaultos://sandbox/{activeProject.id}</span>
                </div>

                {/* Right controls */}
                <div className="flex items-center space-x-4 text-white/40">
                  <button 
                    onClick={handleReloadIframe}
                    className="hover:text-white transition-colors cursor-pointer"
                    title="Reset Sandbox"
                  >
                    <RefreshCw size={13} />
                  </button>
                  <button 
                    onClick={() => setIsFullscreen(prev => !prev)}
                    className="hover:text-white transition-colors cursor-pointer hidden md:block"
                    title="Toggle Dimensions"
                  >
                    {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                  </button>
                  <button 
                    onClick={() => {
                      setActiveProject(null);
                      setIsFullscreen(false);
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>

              {/* Split Workspace Layout */}
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                
                {/* Left Panel: Telemetry & Specs */}
                <div className="w-full md:w-[320px] lg:w-[360px] border-b md:border-b-0 md:border-r border-white/10 bg-[#070707] p-5 flex flex-col justify-between overflow-y-auto space-y-6">
                  
                  {/* Repo Bio */}
                  <div className="space-y-4 font-mono">
                    <div className="flex items-center space-x-2">
                      <FolderGit2 size={16} className="text-white/60" />
                      <span className="text-xs text-white/40 uppercase tracking-widest">REPOSITORY DEPLOY</span>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-black text-white uppercase tracking-tight">{activeProject.title}</h3>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {activeProject.languages.map((l) => (
                          <span 
                            key={l} 
                            className={`text-[9px] px-2 py-0.5 rounded-full font-sans tracking-wide uppercase border font-semibold ${
                              getLanguageStyles(l)
                            }`}
                          >
                            {l}
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className="text-[11px] text-white/60 font-sans leading-relaxed pt-2 border-t border-white/5">
                      {activeProject.description}
                    </p>
                  </div>

                  {/* Telemetry Panel */}
                  <div className="bg-[#0b0b0b] border border-white/5 rounded-lg p-4 font-mono text-[10px] space-y-3">
                    <div className="text-white/40 uppercase tracking-widest border-b border-white/5 pb-1 flex items-center space-x-1.5">
                      <Layers size={10} />
                      <span>RUNTIME TELEMETRY:</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/30 flex items-center gap-1"><Code size={9} /> LOC SIZE:</span>
                      <span className="text-white/80">{activeProject.linesOfCode} lines</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/30 flex items-center gap-1"><GitBranch size={9} /> COMMITS:</span>
                      <span className="text-white/80">{activeProject.commits} runs</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/30 flex items-center gap-1"><Sparkles size={9} /> BLUEPRINT:</span>
                      <span className="text-white/80 truncate max-w-[150px]">{activeProject.archType}</span>
                    </div>
                  </div>

                  {/* Commands and Link Out */}
                  <div className="space-y-4 font-mono">
                    <div className="space-y-1">
                      <span className="text-[9px] text-white/30 uppercase block">Local Ingestion Trigger</span>
                      <div className="flex bg-black border border-white/10 rounded overflow-hidden p-2 justify-between items-center text-[10px]">
                        <code className="text-white/60 select-all truncate mr-2">{activeProject.cloneCmd}</code>
                        <button 
                          onClick={() => copyToClipboard(activeProject.cloneCmd, activeProject.id)}
                          className="text-white/30 hover:text-white shrink-0 cursor-pointer"
                        >
                          {copiedId === activeProject.id ? <Check size={11} className="text-green-500" /> : <Copy size={11} />}
                        </button>
                      </div>
                    </div>

                    <a 
                      href={activeProject.github} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-full py-2.5 bg-white text-black font-semibold text-xs rounded hover:bg-white/90 transition-all flex items-center justify-center space-x-1.5 uppercase font-mono tracking-wide cursor-pointer"
                    >
                      <ExternalLink size={12} />
                      <span>Inspect Raw Source</span>
                    </a>
                  </div>

                </div>

                {/* Right Panel: Embedded StackBlitz Sandbox */}
                <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden">
                  <iframe
                    key={iframeKey}
                    src={activeProject.embedUrl}
                    className="w-full h-full border-none bg-black"
                    title={`${activeProject.title} StackBlitz Workspace`}
                    allow="geolocation; microphone; camera; midi; vr; clipboard-write"
                  />
                </div>

              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}

// Subcomponent: Spotlight Mouse-tracking card
function CardSpotlight({ project, onClick }: { project: Project; onClick: () => void }) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoords({ x, y });
  };

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      style={{
        // Inject mouse CSS variables for glow
        // @ts-ignore
        '--mouse-x': `${coords.x}px`,
        '--mouse-y': `${coords.y}px`,
      }}
      className="group relative bg-[#070707] border border-white/[0.06] hover:border-white/30 rounded-lg overflow-hidden h-[260px] cursor-pointer shadow-xl transition-all duration-300 flex flex-col justify-between p-6 select-none font-mono"
    >
      
      {/* Radial Spotlight Glow Overlay */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.06), transparent 80%)`,
        }}
      />

      {/* Card Header: Tech badges & code symbol */}
      <div className="flex justify-between items-start">
        <div className="flex flex-wrap gap-1">
          {project.languages.map((l) => (
            <span 
              key={l}
              className={`text-[8px] px-2 py-0.5 border font-semibold font-sans tracking-wide uppercase rounded-full bg-[#111111]/80 ${
                getLanguageStyles(l)
              }`}
            >
              {l}
            </span>
          ))}
        </div>
        <Code size={14} className="text-white/20 group-hover:text-white/60 transition-colors" />
      </div>

      {/* Card Main: Title & Bio */}
      <div className="space-y-2 mt-4 flex-1">
        <h3 className="text-base font-bold uppercase tracking-tight text-white group-hover:text-white transition-all select-none">
          {project.title}
        </h3>
        <p className="text-[11px] text-white/50 group-hover:text-white/70 font-sans leading-relaxed select-none transition-colors line-clamp-3">
          {project.description}
        </p>
      </div>

      {/* Card Footer: Telemetry metrics */}
      <div className="border-t border-white/5 pt-4 mt-auto flex items-center justify-between text-[9px] text-white/30 group-hover:text-white/50 transition-colors">
        <div className="flex items-center space-x-3">
          <span className="flex items-center gap-1"><Layers size={9} /> {project.linesOfCode} LOC</span>
          <span className="flex items-center gap-1"><GitBranch size={9} /> {project.commits} COM</span>
        </div>
        <div className="flex items-center space-x-1 text-white/40 group-hover:text-white transition-colors">
          <TerminalIcon size={10} className="animate-pulse" />
          <span className="uppercase text-[8px] font-bold tracking-wider">RUN REPO</span>
        </div>
      </div>

    </motion.div>
  );
}

// Brand specific color-schemes helper
function getLanguageStyles(lang: string) {
  switch (lang) {
    case 'TypeScript':
      return 'border-[#3178C6]/20 text-[#3178C6] shadow-[inset_0_0_8px_rgba(49,120,198,0.05)]';
    case 'JavaScript':
      return 'border-[#F7DF1E]/20 text-[#F7DF1E] shadow-[inset_0_0_8px_rgba(247,223,30,0.05)]';
    case 'Python':
      return 'border-[#3776AB]/20 text-[#3776AB] shadow-[inset_0_0_8px_rgba(55,118,171,0.05)]';
    case 'Java':
      return 'border-[#ED8B00]/20 text-[#ED8B00] shadow-[inset_0_0_8px_rgba(237,139,0,0.05)]';
    case 'HTML':
      return 'border-[#E34F26]/20 text-[#E34F26] shadow-[inset_0_0_8px_rgba(227,79,38,0.05)]';
    case 'CSS':
      return 'border-[#1572B6]/20 text-[#1572B6] shadow-[inset_0_0_8px_rgba(21,114,182,0.05)]';
    case 'Shell':
      return 'border-[#4EAA25]/20 text-[#4EAA25] shadow-[inset_0_0_8px_rgba(78,170,37,0.05)]';
    case 'SQL':
      return 'border-[#4479A1]/20 text-[#4479A1] shadow-[inset_0_0_8px_rgba(68,121,161,0.05)]';
    default:
      return 'border-white/10 text-white/60';
  }
}
