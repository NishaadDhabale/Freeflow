'use client';
import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { Sun, Moon } from 'lucide-react';

// --- Types ---
interface AnimateOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  animation?: 'fade-up' | 'fade-in' | 'fade-left' | 'fade-right' | 'scale-up';
}

interface DarkModeProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

interface BlobProps {
  children: ReactNode;
}

// --- Animation Wrapper Component ---
const AnimateOnScroll: React.FC<AnimateOnScrollProps> = ({
  children,
  className = '',
  delay = 0,
  animation = 'fade-up',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    const currentRef = domRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  const baseClasses = 'transition-all duration-1000 ease-out';
  const delayStyle = { transitionDelay: `${delay}ms` };

  const animations = {
    'fade-up': `translate-y-16 opacity-0 ${isVisible ? 'translate-y-0 opacity-100' : ''}`,
    'fade-in': `opacity-0 ${isVisible ? 'opacity-100' : ''}`,
    'fade-left': `translate-x-16 opacity-0 ${isVisible ? 'translate-x-0 opacity-100' : ''}`,
    'fade-right': `-translate-x-16 opacity-0 ${isVisible ? 'translate-x-0 opacity-100' : ''}`,
    'scale-up': `scale-90 opacity-0 ${isVisible ? 'scale-100 opacity-100' : ''}`,
  };

  return (
    <div
      ref={domRef}
      className={`${baseClasses} ${animations[animation]} ${className}`}
      style={delayStyle}
    >
      {children}
    </div>
  );
};

// --- SVGs & Assets ---
const AbstractShape1: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 100 150"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path d="M45,150 C45,100 55,50 50,10" stroke="currentColor" fill="none" />
    <path d="M55,150 C55,100 65,50 50,10" stroke="currentColor" fill="none" />
    <path
      d="M50,10 C30,0 10,20 0,40 C15,35 30,30 50,10"
      stroke="currentColor"
      fill="none"
    />
    <path
      d="M50,10 C70,0 90,20 100,40 C85,35 70,30 50,10"
      stroke="currentColor"
      fill="none"
    />
    <path d="M50,10 C30,10 10,30 50,10" stroke="currentColor" fill="none" />
    <path
      d="M50,10 C70,10 90,30 95,60 C80,50 65,30 50,10"
      stroke="currentColor"
      fill="none"
    />
  </svg>
);

const AbstractShape2: React.FC = () => (
  <svg
    viewBox="0 0 300 200"
    className="w-full h-full"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="0" y="150" width="300" height="50" fill="#90CA5A" />
    <rect x="40" y="80" width="220" height="80" fill="#FF5277" />
    <polygon
      points="20,80 150,40 280,80"
      fill="#F8F8F8"
      stroke="#E0E0E0"
      strokeWidth="2"
    />
    <polygon points="40,80 150,45 260,80" fill="#FFFFFF" />
    <rect x="60" y="100" width="80" height="60" fill="#1EB5D4" />
    <line x1="60" y1="115" x2="140" y2="115" stroke="#169CB8" strokeWidth="2" />
    <line x1="60" y1="130" x2="140" y2="130" stroke="#169CB8" strokeWidth="2" />
    <line x1="60" y1="145" x2="140" y2="145" stroke="#169CB8" strokeWidth="2" />
    <rect
      x="180"
      y="100"
      width="40"
      height="30"
      fill="#FFFFFF"
      stroke="#E0E0E0"
      strokeWidth="2"
    />
    <rect x="185" y="105" width="13" height="20" fill="#1EB5D4" opacity="0.5" />
    <rect x="202" y="105" width="13" height="20" fill="#1EB5D4" opacity="0.5" />
  </svg>
);

const Blob1: React.FC<BlobProps> = ({ children }) => (
  <div className="w-24 h-24 md:w-32 md:h-32 bg-[#E1E6F9] dark:bg-[#1E2540] rounded-[40%_60%_70%_30%/40%_50%_60%_50%] flex items-center justify-center relative shadow-sm transition-transform hover:scale-105 duration-300">
    {children}
  </div>
);

const Blob2: React.FC<BlobProps> = ({ children }) => (
  <div className="w-24 h-24 md:w-32 md:h-32 bg-[#E1E6F9] dark:bg-[#1E2540] rounded-[60%_40%_30%_70%/60%_30%_70%_40%] flex items-center justify-center relative shadow-sm transition-transform hover:scale-105 duration-300">
    {children}
  </div>
);

const ConcentricCircles: React.FC = () => (
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center pointer-events-none -z-10 opacity-20 dark:opacity-10">
    <div className="absolute w-[400px] h-[400px] rounded-full border border-gray-400 dark:border-gray-500"></div>
    <div className="absolute w-[600px] h-[600px] rounded-full border border-gray-400 dark:border-gray-500"></div>
    <div className="absolute w-[800px] h-[800px] rounded-full border border-gray-400 dark:border-gray-500"></div>
    <div className="absolute w-[1000px] h-[1000px] rounded-full border border-gray-400 dark:border-gray-500"></div>
  </div>
);

// --- Sections ---

const Navbar: React.FC<DarkModeProps> = ({ isDarkMode, toggleDarkMode }) => (
  <header className="relative w-full z-50 flex justify-between items-center px-6 mr-5 md:px-12 py-4">
    <AnimateOnScroll animation="fade-right" className=" relative z-10">
      <div className="absolute -top-6 -left-6 w-24 h-24 md:-top-12 md:-left-12 md:w-32 md:h-32 bg-[#0E0E0E] dark:bg-white rounded-br-[100px] -z-10 transition-colors duration-500"></div>
      <div className=" text-white -top-6 dark:text-[#0E0E0E] font-extrabold text-xl md:text-2xl tracking-wide leading-tight mt-[-15px] transition-colors duration-500">
        N.
      </div>
    </AnimateOnScroll>

    <AnimateOnScroll
      animation="fade-in"
      delay={200}
      className="hidden lg:flex items-center gap-8 text-sm text-gray-500 dark:text-gray-400 font-medium"
    >
      <a
        href="#features"
        className="hover:text-black dark:hover:text-white transition-colors"
      >
        Features
      </a>
      <a
        href="#how-it-works"
        className="hover:text-black dark:hover:text-white transition-colors"
      >
        How it Works
      </a>
      <a
        href="#pricing"
        className="hover:text-black dark:hover:text-white transition-colors"
      >
        Pricing
      </a>
      <a
        href="#testimonials"
        className="hover:text-black dark:hover:text-white transition-colors"
      >
        Testimonials
      </a>
    </AnimateOnScroll>

    <AnimateOnScroll
      animation="fade-left"
      delay={400}
      className="flex items-center gap-4"
    >
      <button
        onClick={toggleDarkMode}
        className="p-2.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
        aria-label="Toggle Dark Mode"
      >
        {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <a
        href="/signin"
        className="hidden sm:flex border border-gray-200 dark:border-gray-700 px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-black dark:text-white"
      >
        Sign In
      </a>
      <a
        href="/signup"
        className="hidden sm:flex bg-[#E5DFA9] hover:bg-[#d4cd95] text-[#1A1A1A] px-6 py-2.5 rounded-full text-sm font-medium transition-all shadow-md"
      >
        Sign Up
      </a>
    </AnimateOnScroll>
  </header>
);

const Hero: React.FC = () => (
  <section className="relative w-full max-w-[1400px] mx-auto px-6 md:px-12 pt-8 md:pt-16 pb-20 flex flex-col lg:flex-row items-center gap-12">
    <div className="flex-1 w-full z-10">
      <AnimateOnScroll animation="fade-up" delay={100}>
        <div className="text-gray-500 dark:text-gray-400 font-medium mb-4 flex items-center gap-2">
          <span className="w-3 h-[0.5px] bg-gray-400 dark:bg-gray-500"></span>{' '}
          Digital Workspace FreeFlow
        </div>
        <h1 className="text-[3.5rem] md:text-[5.5rem] leading-[1.1] font-extrabold text-[#1A1A1A] dark:text-[#F3F4F6] mb-6 tracking-tight transition-colors duration-500">
          Collaborate. <br /> Organize. <br />
          <span className="text-transparent [-webkit-text-stroke:1px_#1A1A1A] md:[-webkit-text-stroke:2px_#1A1A1A] dark:[-webkit-text-stroke:1px_#F3F4F6] dark:md:[-webkit-text-stroke:2px_#F3F4F6]">
            Create.
          </span>
        </h1>
        <p className="text-gray-400 dark:text-gray-400 text-lg md:text-xl mb-10 max-w-lg leading-relaxed">
          FreeFlow empowers teams to brainstorm, design, and build projects
          together on one powerful digital workspace. No limits, just flow.
        </p>
      </AnimateOnScroll>

      <AnimateOnScroll animation="fade-up" delay={300}>
        <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-none border border-transparent dark:border-gray-700 flex flex-col sm:flex-row items-center gap-4 max-w-[500px]">
          <a
            href="/signup"
            className="w-full sm:w-auto flex-1 text-center bg-[#E5DFA9] hover:bg-[#d4cd95] text-[#1A1A1A] px-8 py-3.5 rounded-xl font-medium transition-colors"
          >
            Get Started
          </a>
          <a
            href="#how-it-works"
            className="w-full sm:w-auto flex-1 text-center bg-transparent border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-[#1A1A1A] dark:text-white px-8 py-3.5 rounded-xl font-medium transition-colors"
          >
            Learn More
          </a>
        </div>
      </AnimateOnScroll>
    </div>

    <AnimateOnScroll
      animation="fade-left"
      delay={200}
      className="flex-1 w-full relative min-h-[400px] md:min-h-[500px]"
    >
      <div className="absolute inset-0 flex items-end justify-center">
        <AbstractShape1 className="absolute left-0 bottom-10 w-48 h-64 text-gray-700/80 dark:text-gray-400/50 -z-10" />
        <AbstractShape1 className="absolute left-32 bottom-20 w-40 h-48 text-gray-700/80 dark:text-gray-400/50 -z-20" />
        <div className="w-full max-w-lg h-64 relative -mb-4">
          <AbstractShape2 />
        </div>
      </div>
    </AnimateOnScroll>
  </section>
);

const HowItWorks: React.FC = () => (
  <section
    id="how-it-works"
    className="relative w-full max-w-[1400px] mx-auto px-6 md:px-12 py-24"
  >
    <AnimateOnScroll animation="fade-up" className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] dark:text-[#F3F4F6] mb-4">
        How It Works
      </h2>
      <svg
        className="mx-auto w-32 h-4 text-gray-300 dark:text-gray-700"
        viewBox="0 0 100 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M0,5 Q25,0 50,5 T100,5" />
      </svg>
    </AnimateOnScroll>

    <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start relative z-10">
      <AnimateOnScroll
        animation="fade-right"
        delay={100}
        className="lg:col-span-1 pt-4"
      >
        <p className="text-[#1A1A1A] dark:text-gray-300 text-lg leading-relaxed">
          No limits, just flow. <br />
          <span className="relative z-10 inline-block font-medium dark:text-white mt-2">
            Start a new workspace
            <span className="absolute bottom-1 left-[-4px] right-[-4px] h-3 bg-[#FFE1E6] dark:bg-[#FF5277]/30 -z-10 rounded-sm"></span>
          </span>
          <br /> instantly with your team.
        </p>
      </AnimateOnScroll>

      <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            step: '1',
            title: 'CREATE AN ACCOUNT',
            desc: 'Sign up and start a new team workspace instantly.',
            type: 'card',
          },
          {
            step: '2',
            title: 'CREATE CANVAS',
            desc: 'Give a Name to your Canvas and co-create in real time.',
            type: 'blob1',
          },
          {
            step: '3',
            title: 'ORGANISE & SHARE',
            desc: 'Structure your project and export results just by sharing your Canvas Link seamlessly.',
            type: 'blob2',
          },
        ].map((item, idx) => (
          <AnimateOnScroll
            key={idx}
            animation="fade-up"
            delay={200 * (idx + 1)}
            className={
              item.type === 'card'
                ? 'bg-[#E9EDF8] dark:bg-[#1E2540] rounded-[32px] p-8 min-h-[250px] transition-transform hover:-translate-y-2'
                : 'flex flex-col items-center md:items-start p-8'
            }
          >
            {item.type === 'card' ? (
              <>
                <div className="w-16 h-16 bg-white/60 dark:bg-gray-900/40 rounded-2xl flex items-center justify-center mb-8 shadow-sm">
                  <span className="text-3xl text-[#1A1A1A] dark:text-white font-extrabold">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-sm font-bold tracking-widest text-[#1A1A1A] dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-black dark:bg-white block"></span>{' '}
                  {item.title}
                </h3>
              </>
            ) : item.type === 'blob1' ? (
              <Blob1>
                <span className="text-4xl opacity-80 text-gray-800 dark:text-gray-200 border-2 border-gray-800/20 dark:border-gray-200/20 rounded-full p-3 font-extrabold flex items-center justify-center w-16 h-16">
                  {item.step}
                </span>
              </Blob1>
            ) : (
              <Blob2>
                <span className="text-4xl opacity-80 text-gray-800 dark:text-gray-200 font-extrabold">
                  {item.step}
                </span>
              </Blob2>
            )}
            {item.type !== 'card' && (
              <h3 className="text-sm font-bold tracking-widest text-[#1A1A1A] dark:text-white mb-4 mt-8">
                {item.title}
              </h3>
            )}
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed text-left">
              {item.desc}
            </p>
          </AnimateOnScroll>
        ))}
      </div>
    </div>
  </section>
);

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Aditya Deshmane',
      role: 'Student Developer',
      quote:
        "FreeFlow transformed how our team collaborates. It's like working side by side even when remote!",
      color: 'bg-[#90CA5A]',
    },
    {
      name: 'Padmaja Sirmewar',
      role: 'Design Club Lead',
      quote:
        'Super intuitive and fun to use. It makes brainstorming sessions actually enjoyable.',
      color: 'bg-[#1EB5D4]',
    },
    {
      name: 'Siddhant Kadam',
      role: 'Malware Analyst',
      quote:
        'The best canvas tool we have used. Period. Everything just flows perfectly.',
      color: 'bg-[#FF5277]',
    },
  ];

  return (
    <section
      id="testimonials"
      className="relative w-full max-w-[1400px] mx-auto px-6 md:px-12 py-32 overflow-hidden flex flex-col items-center"
    >
      <ConcentricCircles />
      <div className="w-full flex justify-between items-end mb-16 max-w-5xl relative z-10">
        <AnimateOnScroll animation="fade-right">
          <h2 className="text-[3rem] leading-[1.1] font-bold text-[#1A1A1A] dark:text-white">
            Loved by <br /> Many
          </h2>
        </AnimateOnScroll>
        <AnimateOnScroll
          animation="fade-left"
          delay={200}
          className="text-right"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Active Workspaces
          </p>
        </AnimateOnScroll>
      </div>

      <AnimateOnScroll
        animation="fade-up"
        delay={300}
        className="w-full max-w-5xl relative z-10"
      >
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-4 rounded-[40px] shadow-[0_20px_50px_rgb(0,0,0,0.05)] border border-white dark:border-gray-700 transition-colors">
          <div className="flex gap-4 overflow-x-auto snap-x pb-4 custom-scrollbar">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="min-w-[300px] md:min-w-[350px] snap-center"
              >
                <div
                  className={`w-full h-[220px] ${t.color} rounded-[24px] mb-4 p-6 relative group cursor-pointer flex flex-col justify-center shadow-inner`}
                >
                  <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                  <p className="text-white text-lg font-medium italic relative z-10">
                    "{t.quote}"
                  </p>
                </div>
                <div className="px-2">
                  <p className="font-bold text-[#1A1A1A] dark:text-white">
                    {t.name}
                  </p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                    {t.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimateOnScroll>
    </section>
  );
};

// --- Main App Entry ---

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <div className={`${isDarkMode ? 'dark ' : ''}`}>
      <div className="pr-10 min-h-screen bg-[#FEFCFB] dark:bg-[#0a0a0a] text-[#1A1A1A] dark:text-gray-100 font-sans overflow-x-hidden transition-colors duration-500 selection:bg-pink-100 dark:selection:bg-pink-900 selection:text-pink-900 dark:selection:text-pink-100">
        <style
          dangerouslySetInnerHTML={{
            __html: `
            scrollbar-hide
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
            body {
              font-family: 'Outfit', sans-serif;
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
            body::-webkit-scrollbar { display: none; }
            .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            .custom-scrollbar::-webkit-scrollbar { display: none; }
            html { scroll-behavior: smooth; }
        `,
          }}
        />
        <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        <main>
          <Hero />
          <HowItWorks />
          <TestimonialsSection />
        </main>

        <footer className="w-full px-6 py-10 border-t border-gray-100 dark:border-gray-800 bg-[#FEFCFB] dark:bg-[#0a0a0a] text-center text-gray-500 transition-colors duration-500">
          <p>© {new Date().getFullYear()} FreeFlow. </p>
        </footer>
      </div>
    </div>
  );
}
