import React, { useRef, useEffect, useState } from 'react';
import { TypeAnimation } from 'react-type-animation';
import './Home.css';

type Theme = 'dark' | 'light' | 'os' | { base: 'dark' | 'light', colors: string[] };

interface HomeProps {
  theme: Theme;
  scrollTarget: string | null;
  onNavigateToTerminal: () => void;
}

const Home: React.FC<HomeProps> = ({ theme, scrollTarget, onNavigateToTerminal }) => {
  const projectsRef = useRef<HTMLDivElement>(null);
  const contactsRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = Math.min((window.scrollY / totalScroll) * 100, 100);
      setScrollProgress(currentProgress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (scrollTarget === 'projects' && projectsRef.current) {
      projectsRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (scrollTarget === 'contacts' && contactsRef.current) {
      contactsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [scrollTarget]);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`home ${typeof theme === 'object' ? theme.base : theme}`}
         data-gradient={typeof theme === 'object'}
         style={typeof theme === 'object' ? {
           '--gradient-color-1': theme.colors[0],
           '--gradient-color-2': theme.colors[1] || theme.colors[0],
           '--text-color': theme.base === 'dark' ? '#fff' : '#000',
         } as React.CSSProperties : {}}
    >
      <header className="home-header">
        <nav style={{ 
          '--scroll-progress': `${scrollProgress}%`,
        } as React.CSSProperties}>
          <div className="nav-links">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Home</button>
            <button onClick={() => scrollToSection(projectsRef)}>Projects</button>
            <button onClick={() => scrollToSection(contactsRef)}>Contact</button>
            <button onClick={onNavigateToTerminal} className="terminal-link">Terminal</button>
          </div>
        </nav>
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="glitch-text">Welcome to My Portfolio</h1>
            <TypeAnimation
              sequence={[
                'Full Stack Developer',
                2000,
                'UI/UX Designer',
                2000,
                'Problem Solver',
                2000,
              ]}
              wrapper="h2"
              speed={50}
              repeat={Infinity}
              className="animated-text"
            />
            <p className="hero-description">
              Crafting digital experiences that combine creativity with technical excellence
            </p>
            <div className="hero-buttons">
              <button onClick={() => scrollToSection(projectsRef)} className="primary-btn">
                View Projects
              </button>
              <button onClick={onNavigateToTerminal} className="secondary-btn">
                Open Terminal
              </button>
            </div>
          </div>
          <div className="hero-background">
            <div className="animated-circles">
              <div className="circle"></div>
              <div className="circle"></div>
              <div className="circle"></div>
            </div>
          </div>
        </div>
      </header>

      <section className="projects-section" ref={projectsRef}>
        <h2>Projects</h2>
        <div className="projects-grid">
          <div className="project-card">
            <h3>Project 1</h3>
            <p>Description of project 1</p>
          </div>
          <div className="project-card">
            <h3>Project 2</h3>
            <p>Description of project 2</p>
          </div>
          <div className="project-card">
            <h3>Project 3</h3>
            <p>Description of project 3</p>
          </div>
        </div>
      </section>

      <section className="contacts-section" ref={contactsRef}>
        <h2>Contact Me</h2>
        <div className="contact-content">
          <div className="contact-info">
            <h3>Get in Touch</h3>
            <p>Feel free to reach out through any of these channels:</p>
            <div className="contact-links">
              <a href="mailto:example@email.com">Email</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
            </div>
          </div>
          <form className="contact-form">
            <input type="text" placeholder="Name" />
            <input type="email" placeholder="Email" />
            <textarea placeholder="Message"></textarea>
            <button type="submit">Send Message</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home; 