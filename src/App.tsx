import React, { useState, useEffect } from 'react';
import { TypeAnimation } from 'react-type-animation';
import Home from './components/Home';
import './App.css';

type Theme = 'dark' | 'light' | 'os' | { base: 'dark' | 'light', colors: string[] };
type View = 'terminal' | 'home' | 'projects' | 'contacts';

interface CommandEntry {
  command: string;
  output?: string;
}

function App() {
  const [showInput, setShowInput] = useState(false);
  const [isLocalhost, setIsLocalhost] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showCommands, setShowCommands] = useState(false);
  const [showUsage, setShowUsage] = useState(false);
  const [continuedLines, setContinuedLines] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedCommand, setSelectedCommand] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [theme, setTheme] = useState<Theme>('dark');
  const [commandHistory, setCommandHistory] = useState<CommandEntry[]>([]);
  const [osTheme, setOsTheme] = useState<'dark' | 'light'>('light');
  const [view, setView] = useState<View>('terminal');
  const [scrollTarget, setScrollTarget] = useState<string | null>(null);
  const [shouldKeepHistory, setShouldKeepHistory] = useState(false);

  const commands = [
    '/change-theme',
    '/home',
    '/projects',
    '/contacts'
  ];

  useEffect(() => {
    // Check if we're on localhost
    setIsLocalhost(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    
    // Add event listener for key press
    const handleKeyPress = () => {
      if (!showInput) {
        setShowInput(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showInput]);

  useEffect(() => {
    if (isTyping) {
      const timer = setTimeout(() => {
        setIsTyping(false);
        setInputValue(selectedCommand);
        setShowUsage(selectedCommand === '/change-theme');
      }, selectedCommand.length * 50 + 500);
      return () => clearTimeout(timer);
    }
  }, [isTyping, selectedCommand]);

  useEffect(() => {
    // Check OS theme preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateOsTheme = (e: MediaQueryListEvent | MediaQueryList) => {
      setOsTheme(e.matches ? 'dark' : 'light');
    };

    // Set initial value
    updateOsTheme(mediaQuery);

    // Listen for changes
    mediaQuery.addEventListener('change', updateOsTheme);

    return () => mediaQuery.removeEventListener('change', updateOsTheme);
  }, []);

  // Effect to handle only page reloads
  useEffect(() => {
    // Only add the beforeunload event listener
    const handleBeforeUnload = () => {
      setCommandHistory([]);  // Clear history only on page reload
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []); // No dependencies needed since this only handles page reload

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Get the actual viewport dimensions
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Calculate the mouse position relative to the viewport center
      const centerX = viewportWidth / 2;
      const centerY = viewportHeight / 2;
      
      // Calculate the percentage with more precision, centered around the mouse
      const x = ((e.clientX - centerX) / centerX) * 50 + 50;
      const y = ((e.clientY - centerY) / centerY) * 50 + 50;

      // Store the last position for intensity calculation
      lastX.current = e.clientX;
      lastY.current = e.clientY;
      lastMoveTime.current = Date.now();

      // Apply the values with requestAnimationFrame for smooth updates
      requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--x', `${x}%`);
        document.documentElement.style.setProperty('--y', `${y}%`);
      });
    };

    // Check for cursor staying still
    const intensityInterval = setInterval(() => {
      if (!lastMoveTime.current) return;
      
      const timeSinceMove = Date.now() - lastMoveTime.current;
      if (timeSinceMove > 300) { // Faster response time
        const currentIntensity = parseFloat(document.documentElement.style.getPropertyValue('--intensity') || '0.15');
        const newIntensity = Math.min(currentIntensity + 0.03, 0.35); // More gradual increase, lower max
        document.documentElement.style.setProperty('--intensity', newIntensity.toString());
        document.documentElement.style.setProperty('--base-opacity', '0.95');
        document.documentElement.style.setProperty('--hover-opacity', '1');
      }
    }, 50); // Check more frequently

    // Throttle the mousemove event for better performance
    let frameId: number;
    const throttledHandleMouseMove = (e: MouseEvent) => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
      frameId = requestAnimationFrame(() => {
        handleMouseMove(e);
        // Reset intensity when moving
        document.documentElement.style.setProperty('--intensity', '0.15');
        document.documentElement.style.setProperty('--base-opacity', '0.7');
        document.documentElement.style.setProperty('--hover-opacity', '0.9');
      });
    };

    window.addEventListener('mousemove', throttledHandleMouseMove);
    return () => {
      window.removeEventListener('mousemove', throttledHandleMouseMove);
      clearInterval(intensityInterval);
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, []);

  // Add these refs at the top of your component
  const lastX = React.useRef<number>(0);
  const lastY = React.useRef<number>(0);
  const lastMoveTime = React.useRef<number>(0);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showCommands) return;

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev <= 0 ? commands.length - 1 : prev - 1
        );
        break;
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev >= commands.length - 1 ? 0 : prev + 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleCommandClick(commands[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowCommands(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setShowCommands(value === '/');
    setShowUsage(value === '/change-theme');
    setSelectedIndex(-1);
    
    // Handle continued lines
    const lines = value.split('\n');
    if (lines.length > 1) {
      setContinuedLines(lines.slice(1));
    } else {
      setContinuedLines([]);
    }
  };

  const handleCommandClick = (command: string) => {
    setSelectedCommand(command);
    setIsTyping(true);
    setShowCommands(false);
    setSelectedIndex(-1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newCommand: CommandEntry = { command: inputValue };
    let output = '';

    if (inputValue.startsWith('/')) {
      const command = inputValue.toLowerCase();
      
      if (command === '/home') {
        setShouldKeepHistory(true); // Set flag to keep history when returning
        setView('home');
        output = 'Navigating to home page...';
      } else if (command === '/projects') {
        setShouldKeepHistory(true);
        setView('home');
        setScrollTarget('projects');
        output = 'Navigating to projects section...';
      } else if (command === '/contacts') {
        setShouldKeepHistory(true);
        setView('home');
        setScrollTarget('contacts');
        output = 'Navigating to contacts section...';
      } else if (command.startsWith('/change-theme')) {
        const args = command.split(/[:\s]/).slice(1).map(arg => arg.trim().toLowerCase());
        const baseTheme = args[0];
        const additionalColors = args.slice(1, 3); // Limit to 2 additional colors

        if (baseTheme && ['dark', 'light', 'os'].includes(baseTheme)) {
          if (additionalColors.length > 0) {
            setTheme({ base: baseTheme as 'dark' | 'light', colors: additionalColors });
            output = `Theme changed to ${baseTheme} with gradient colors: ${additionalColors.join(', ')}`;
          } else {
            setTheme(baseTheme as Theme);
            output = `Theme changed to ${baseTheme}`;
          }
        } else {
          output = 'Invalid theme. Usage: /change-theme [dark|light|os] [color1] [color2]\nExample: /change-theme dark purple blue';
        }
      } else if (command === '/') {
        setShowCommands(true);
        output = `Available commands:
/home - Go to home page
/projects - Go to projects section
/contacts - Go to contacts section
/change-theme [dark|light|os] [color1] [color2] - Change theme and add optional gradient colors
Examples:
  /change-theme dark
  /change-theme light purple
  /change-theme dark purple blue`;
      } else {
        output = 'Unknown command. Type / to see available commands';
      }
    }

    newCommand.output = output;
    setCommandHistory(prev => [...prev, newCommand]);
    setInputValue('');
    setShowCommands(false);
  };

  const getEffectiveTheme = () => {
    if (typeof theme === 'object') {
      return {
        base: theme.base,
        colors: theme.colors
      };
    }
    if (theme === 'os') {
      return osTheme;
    }
    return theme;
  };

  const handleNavigateToTerminal = () => {
    setView('terminal');  // Just change the view, no need to manage history
  };

  const getThemeStyles = () => {
    if (typeof theme === 'object') {
      const style: React.CSSProperties = {
        '--custom-color-1': theme.colors[0],
        '--custom-color-2': theme.colors[1] || theme.colors[0],
        '--text-color': theme.base === 'dark' ? '#fff' : '#000',
      } as React.CSSProperties;
      return style;
    }
    return {};
  };

  if (view === 'home') {
    return <Home 
      theme={theme} 
      scrollTarget={scrollTarget} 
      onNavigateToTerminal={handleNavigateToTerminal}
    />;
  }

  return (
    <div 
      className={`App ${typeof theme === 'object' ? theme.base : getEffectiveTheme()} ${showInput ? 'terminal-view' : 'landing-page'}`}
      data-gradient={typeof theme === 'object'}
      data-theme={typeof theme === 'object' ? theme.base : getEffectiveTheme()}
      style={getThemeStyles()}
    >
      {!showInput ? (
        <>
          <h1 style={{ 
            fontSize: '3rem',
            color: '#333',
            textAlign: 'center',
            marginBottom: '2rem'
          }}>
            Welcome to My Portfolio
          </h1>
          <TypeAnimation
            sequence={[
              'I create amazing digital experiences',
              2000,
              '',
              1000,
              'Press any key to continue',
              2000,
            ]}
            wrapper="h2"
            speed={50}
            style={{ 
              fontSize: '1.5rem',
              color: '#666',
              textAlign: 'center',
              minHeight: '2rem'
            }}
          />
        </>
      ) : (
        <div className="terminal-container">
          <div className="terminal">
            <div className="terminal-header">
              <div className="terminal-title">Terminal</div>
              <div className="terminal-controls">
                <span className="control close"></span>
                <span className="control minimize"></span>
                <span className="control maximize"></span>
              </div>
            </div>
            <div className="terminal-content">
              {commandHistory.map((item, index) => (
                <div key={index}>
                  <div className="command-line">
                    <span className="prompt">
                      {isLocalhost ? 'admin' : 'user'}$ 
                    </span>
                    <span className="command-text">{item.command}</span>
                  </div>
                  {item.output && (
                    <div className="command-output">{item.output}</div>
                  )}
                </div>
              ))}
              <form onSubmit={handleSubmit} className="command-line">
                <span className="prompt">
                  {isLocalhost ? 'admin' : 'user'}$ 
                </span>
                {isTyping ? (
                  <div className="typing-container">
                    <TypeAnimation
                      sequence={[selectedCommand]}
                      wrapper="span"
                      speed={50}
                      repeat={0}
                      className="terminal-input"
                      style={{ display: 'inline-block' }}
                    />
                  </div>
                ) : (
                  <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className="terminal-input"
                    autoFocus
                    spellCheck="false"
                    autoComplete="off"
                    placeholder="Type / to see commands"
                  />
                )}
              </form>
              {continuedLines.map((line, index) => (
                <div key={index} className="command-line continued">
                  <span className="prompt">{'>>'}</span>
                  <span className="terminal-input">{line}</span>
                </div>
              ))}
              {showCommands && (
                <div className="command-suggestions">
                  {commands.map((cmd, index) => (
                    <div 
                      key={index} 
                      className={`command-suggestion ${index === selectedIndex ? 'selected' : ''}`}
                      onClick={() => handleCommandClick(cmd)}
                    >
                      {cmd}
                    </div>
                  ))}
                </div>
              )}
              {showUsage && (
                <div className="command-usage">
                  /change-theme dark  (or /change-theme: dark)
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {view === 'terminal' ? (
        <div className="terminal">
          {/* ... existing terminal code ... */}
        </div>
      ) : (
        <Home 
          theme={theme} 
          scrollTarget={scrollTarget}
          onNavigateToTerminal={() => setView('terminal')}
        />
      )}
    </div>
  );
}

export default App;
