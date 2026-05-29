'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, Circle, ChevronRight } from 'lucide-react';
import mediaData from '../public/media.json';
import projectsData from '../public/projects.json';

interface TerminalProps {
  onOpenVideo: (videoId: string) => void;
  onOpenSandbox: (sandboxId: string) => void;
  onNavigateToSection: (section: string) => void;
  isOpen?: boolean;
}

interface FileSystemNode {
  type: 'file' | 'directory';
  content?: string; // If file, contains text.
  children?: Record<string, FileSystemNode>; // If directory, contains mapping of names to nodes.
}

export default function Terminal({ onOpenVideo, onOpenSandbox, onNavigateToSection, isOpen = true }: TerminalProps) {
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [inputVal, setInputVal] = useState<string>('');
  const [currentPath, setCurrentPath] = useState<string[]>([]); // empty represents root (~ or /)
  const [lines, setLines] = useState<Array<{ type: 'input' | 'output' | 'error'; text: string; path?: string }>>([
    { type: 'output', text: 'Welcome to VaultOS CLI v2.4.0 (zsh-compatible).' },
    { type: 'output', text: 'Type "help" to see a list of available commands.' },
    { type: 'output', text: 'Type "ls" to view directories, or "open <project-id>" to play a cinematic video.' },
    { type: 'output', text: '' }
  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Simulated virtual file system
  const virtualFS: FileSystemNode = {
    type: 'directory',
    children: {
      'instructions.txt': {
        type: 'file',
        content: 'VaultOS CLI Instructions:\n1. Use "ls" to list files in the current folder.\n2. Use "cd <folder>" to enter folders like "projects" or "about".\n3. Use "cat <file>" to read files (e.g. "cat bio.txt").\n4. Use "open <project-id>" to trigger a cinematic popup (e.g. "open neon-chase").\n5. Use "help" to list all commands.'
      },
      'about': {
        type: 'directory',
        children: {
          'bio.txt': {
            type: 'file',
            content: 'BIOGRAPHY:\nA developer and designer crafting highly interactive experiences.\nBlending structural programming with raw cinematic art.'
          },
          'skills.txt': {
            type: 'file',
            content: 'CORE CAPABILITIES:\n- Frontend: React, Next.js (App Router), TypeScript, Tailwind CSS\n- Animation: Framer Motion, GSAP, WebGL\n- Design: UI/UX, Motion Design, After Effects, Figma\n- Architecture: System design, high-performance edge assets, robust APIs'
          },
          'contact.txt': {
            type: 'file',
            content: 'CONNECT:\n- Email: contact@portfolio.vault\n- GitHub: github.com/skengzyy\n- LinkedIn: linkedin.com/in/skengzyy'
          }
        }
      },
      'projects': {
        type: 'directory',
        children: {} // Dynamic projects populate below
      }
    }
  };

  // Dynamically populate cinematic projects inside projects folder
  mediaData.forEach((project) => {
    if (virtualFS.children && virtualFS.children['projects'].children) {
      virtualFS.children['projects'].children[`cinema-${project.id}.txt`] = {
        type: 'file',
        content: `PROJECT (CINEMATIC): ${project.title.toUpperCase()}\n---------------------------------\nCategory   : ${project.category}\nDate       : ${project.date}\nSize       : ${project.size}\nDescription: ${project.description}\nTags       : ${project.tags.join(', ')}\n\nRUN "open ${project.id}" to play cinematic footage.`
      };
    }
  });

  // Dynamically populate interactive coding projects inside projects folder
  projectsData.forEach((project) => {
    if (virtualFS.children && virtualFS.children['projects'].children) {
      virtualFS.children['projects'].children[`code-${project.id}.txt`] = {
        type: 'file',
        content: `PROJECT (CODEBASE): ${project.title.toUpperCase()}\n---------------------------------\nLanguages  : ${project.languages.join(', ')}\nTelemetry  : ${project.linesOfCode} LOC | ${project.commits} Commits\nBlueprint  : ${project.archType}\nGitHub     : ${project.github}\nDescription: ${project.description}\n\nRUN "sandbox ${project.id}" or "open ${project.id}" to launch runtime sandbox.`
      };
    }
  });

  // Scroll to bottom on new lines
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [lines]);

  // Handle focus
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Focus on mount or view toggles
  useEffect(() => {
    focusInput();
  }, [isOpen]);

  // Navigate simulated filesystem helper
  const getNodeAtPath = (path: string[]): FileSystemNode | null => {
    let current: FileSystemNode = virtualFS;
    for (const segment of path) {
      if (current.type !== 'directory' || !current.children || !current.children[segment]) {
        return null;
      }
      current = current.children[segment];
    }
    return current;
  };

  const getPathString = () => {
    return currentPath.length === 0 ? '~' : `~/${currentPath.join('/')}`;
  };

  // Command handlers
  const handleCommand = (rawCommand: string) => {
    const trimmed = rawCommand.trim();
    if (!trimmed) {
      setLines((prev) => [...prev, { type: 'input', text: '', path: getPathString() }]);
      return;
    }

    // Add command to history
    const newHistory = [...history, trimmed];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length);

    setLines((prev) => [...prev, { type: 'input', text: trimmed, path: getPathString() }]);

    const parts = trimmed.split(/\s+/);
    const command = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ').trim();

    let outputLines: Array<{ type: 'output' | 'error'; text: string }> = [];

    switch (command) {
      case 'help':
        outputLines = [
          { type: 'output', text: 'VaultOS Zsh - Core Commands:' },
          { type: 'output', text: '  ls                 List files/directories in the current folder' },
          { type: 'output', text: '  cd <dir>           Navigate to a directory (use "cd .." to go back)' },
          { type: 'output', text: '  cat <file>         Print contents of a text file' },
          { type: 'output', text: '  open <project-id>  Launch cinema screen OR sandbox matching project ID' },
          { type: 'output', text: '  sandbox <id>       Launch interactive coding IDE sandbox environment' },
          { type: 'output', text: '  work               Jump scroll directly to visual grid layout' },
          { type: 'output', text: '  clear              Purge all console lines' },
          { type: 'output', text: '  help               Display this operational command index' }
        ];
        break;

      case 'ls': {
        const currentNode = getNodeAtPath(currentPath);
        if (currentNode && currentNode.type === 'directory' && currentNode.children) {
          const contents = Object.entries(currentNode.children).map(([name, node]) => {
            if (node.type === 'directory') {
              return `${name}/`; // folders end with /
            }
            return name;
          });
          
          if (contents.length === 0) {
            outputLines = [{ type: 'output', text: '(empty directory)' }];
          } else {
            // Highlighting folders
            outputLines = [
              {
                type: 'output',
                text: contents.join('     ')
              }
            ];
          }
        } else {
          outputLines = [{ type: 'error', text: 'ls: failed to read directory structure' }];
        }
        break;
      }

      case 'cd': {
        if (!arg || arg === '~') {
          setCurrentPath([]);
        } else if (arg === '..') {
          if (currentPath.length > 0) {
            setCurrentPath((prev) => prev.slice(0, -1));
          }
        } else {
          // Normal navigation
          const targetPath = [...currentPath, arg];
          const node = getNodeAtPath(targetPath);
          if (node && node.type === 'directory') {
            setCurrentPath(targetPath);
          } else {
            outputLines = [{ type: 'error', text: `cd: no such file or directory: ${arg}` }];
          }
        }
        break;
      }

      case 'cat': {
        if (!arg) {
          outputLines = [{ type: 'error', text: 'cat: missing filename argument. Usage: cat <file>' }];
        } else {
          const filePath = [...currentPath, arg];
          const node = getNodeAtPath(filePath);
          if (node && node.type === 'file' && node.content) {
            outputLines = node.content.split('\n').map((line) => ({ type: 'output', text: line }));
          } else if (node && node.type === 'directory') {
            outputLines = [{ type: 'error', text: `cat: ${arg}: Is a directory` }];
          } else {
            outputLines = [{ type: 'error', text: `cat: ${arg}: No such file or directory` }];
          }
        }
        break;
      }

      case 'open': {
        if (!arg) {
          outputLines = [
            { type: 'error', text: 'open: missing project id. Usage: open <project-id>' },
            { type: 'output', text: 'Try "open neon-chase" or "open codesphere"' }
          ];
        } else {
          // Clean ID (strip .txt and prefix if provided)
          const cleanId = arg.replace(/\.txt$/, '').replace(/^(code-|cinema-)/, '').toLowerCase();
          const matchesVideo = mediaData.some((p) => p.id === cleanId);
          const matchesSandbox = projectsData.some((p) => p.id === cleanId);
          
          if (matchesVideo) {
            outputLines = [{ type: 'output', text: `Launching cinematic theater for project: [${cleanId}]` }];
            onOpenVideo(cleanId);
          } else if (matchesSandbox) {
            outputLines = [
              { type: 'output', text: `Launching interactive sandbox for coding project: [${cleanId}]` },
              { type: 'output', text: 'Scrolling viewport directly to workspace.' }
            ];
            onNavigateToSection('showcase');
            setTimeout(() => onOpenSandbox(cleanId), 600);
          } else {
            outputLines = [
              { type: 'error', text: `open: no project or media found matching "${cleanId}"` },
              { type: 'output', text: 'List projects via: "ls projects"' }
            ];
          }
        }
        break;
      }

      case 'sandbox': {
        if (!arg) {
          outputLines = [
            { type: 'error', text: 'sandbox: missing project id. Usage: sandbox <project-id>' },
            { type: 'output', text: 'Try "sandbox codesphere" or "sandbox dezsys-grpc"' }
          ];
        } else {
          const cleanId = arg.replace(/\.txt$/, '').replace(/^(code-|cinema-)/, '').toLowerCase();
          const matchesSandbox = projectsData.some((p) => p.id === cleanId);
          
          if (matchesSandbox) {
            outputLines = [
              { type: 'output', text: `Booting browser-in-browser environment for codebase: [${cleanId}]` },
              { type: 'output', text: 'Connecting to StackBlitz WebContainers...' }
            ];
            onNavigateToSection('showcase');
            setTimeout(() => onOpenSandbox(cleanId), 600);
          } else {
            outputLines = [
              { type: 'error', text: `sandbox: no interactive repository matches "${cleanId}"` },
              { type: 'output', text: 'List repo details via: "ls projects"' }
            ];
          }
        }
        break;
      }

      case 'work': {
        outputLines = [{ type: 'output', text: 'Scrolling to visual grid...' }];
        onNavigateToSection('work');
        break;
      }

      case 'clear':
        setLines([]);
        return;

      default:
        outputLines = [
          { type: 'error', text: `zsh: command not found: ${command}` },
          { type: 'output', text: 'Type "help" to see available terminal functions.' }
        ];
    }

    setLines((prev) => [...prev, ...outputLines, { type: 'output', text: '' }]);
  };

  // Keyboard handlers
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Autocomplete with TAB
    if (e.key === 'Tab') {
      e.preventDefault();
      const parts = inputVal.split(/\s+/);
      const command = parts[0];
      const arg = parts.slice(1).join(' ');

      const currentNode = getNodeAtPath(currentPath);
      const availableCommands = ['help', 'ls', 'cd', 'cat', 'open', 'work', 'clear'];

      // Case 1: Autocomplete commands
      if (parts.length === 1 && command) {
        const matches = availableCommands.filter((c) => c.startsWith(command.toLowerCase()));
        if (matches.length === 1) {
          setInputVal(matches[0]);
        } else if (matches.length > 1) {
          setLines((prev) => [
            ...prev,
            { type: 'input', text: inputVal, path: getPathString() },
            { type: 'output', text: matches.join('   ') },
            { type: 'output', text: '' }
          ]);
        }
      } 
      // Case 2: Autocomplete files/folders for cd or cat
      else if (parts.length > 1 && currentNode && currentNode.children) {
        const targetSearch = arg.toLowerCase();
        const items = Object.keys(currentNode.children);
        
        let filteredItems = items.filter((item) => item.toLowerCase().startsWith(targetSearch));
        
        // If cd command, only autocomplete directories
        if (command.toLowerCase() === 'cd') {
          filteredItems = filteredItems.filter((item) => currentNode.children![item].type === 'directory');
        }

        if (filteredItems.length === 1) {
          setInputVal(`${command} ${filteredItems[0]}`);
        } else if (filteredItems.length > 1) {
          setLines((prev) => [
            ...prev,
            { type: 'input', text: inputVal, path: getPathString() },
            { type: 'output', text: filteredItems.join('   ') },
            { type: 'output', text: '' }
          ]);
        }
      }
    }

    // Command History UP
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0 && historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setInputVal(history[nextIndex]);
      }
    }

    // Command History DOWN
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (history.length > 0 && historyIndex < history.length - 1) {
        const nextIndex = historyIndex + 1;
        setHistoryIndex(nextIndex);
        setInputVal(history[nextIndex]);
      } else {
        setHistoryIndex(history.length);
        setInputVal('');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCommand(inputVal);
    setInputVal('');
  };

  return (
    <div 
      className="w-full bg-[#0a0a0a] border border-[#222222] rounded-lg shadow-2xl overflow-hidden font-mono text-sm max-w-4xl mx-auto crt-overlay"
      onClick={focusInput}
    >
      {/* Terminal Title Bar */}
      <div className="bg-[#141414] border-b border-[#222222] px-4 py-3 flex items-center justify-between select-none">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-[#ef4444] inline-block opacity-75 hover:opacity-100 transition-opacity cursor-pointer"></span>
          <span className="w-3 h-3 rounded-full bg-[#f59e0b] inline-block opacity-75 hover:opacity-100 transition-opacity cursor-pointer"></span>
          <span className="w-3 h-3 rounded-full bg-[#10b981] inline-block opacity-75 hover:opacity-100 transition-opacity cursor-pointer"></span>
        </div>
        <div className="flex items-center space-x-2 text-xs text-accent-gray">
          <TerminalIcon size={12} />
          <span>zsh — user@portfolio: {getPathString()}</span>
        </div>
        <div className="w-12"></div> {/* spacer to align title center */}
      </div>

      {/* Terminal Content Screen */}
      <div className="p-5 h-[420px] overflow-y-auto flex flex-col space-y-1.5 selection:bg-[#ffffff] selection:text-[#000000]">
        {lines.map((line, i) => {
          if (line.type === 'input') {
            return (
              <div key={i} className="flex items-start">
                <span className="text-terminal-user select-none crt-glow-blue">user@portfolio</span>
                <span className="text-accent-gray select-none mx-1.5">:</span>
                <span className="text-terminal-path select-none crt-glow-yellow">{line.path}</span>
                <span className="text-terminal-fg select-none ml-1.5 mr-2">%</span>
                <span className="text-[#ffffff] whitespace-pre-wrap">{line.text}</span>
              </div>
            );
          } else {
            return (
              <div 
                key={i} 
                className={`whitespace-pre-wrap ${
                  line.type === 'error' ? 'text-red-400 font-bold' : 'text-terminal-fg'
                }`}
              >
                {line.text}
              </div>
            );
          }
        })}

        {/* Input Prompter */}
        <form onSubmit={handleSubmit} className="flex items-center w-full pt-1">
          <span className="text-terminal-user select-none crt-glow-blue">user@portfolio</span>
          <span className="text-accent-gray select-none mx-1.5">:</span>
          <span className="text-terminal-path select-none crt-glow-yellow">{getPathString()}</span>
          <span className="text-terminal-fg select-none ml-1.5 mr-2">%</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-[#ffffff] focus:ring-0 p-0 font-mono caret-white"
            autoFocus
            spellCheck={false}
            autoComplete="off"
          />
        </form>
        <div ref={terminalEndRef} />
      </div>
    </div>
  );
}
