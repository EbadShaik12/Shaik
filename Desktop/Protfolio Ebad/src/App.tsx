import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import {
  Shield,
  Zap,
  Target,
  Cpu,
  Mail,
  Github,
  Linkedin,
  ExternalLink,
  ChevronDown,
  Menu,
  X,
  Flame,
  Rocket,
  Sword,
  MapPin
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Jarvis } from './Jarvis';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const ScrollReveal = ({ children, direction = 'up', delay = 0, className }: { children: React.ReactNode, direction?: 'up' | 'down' | 'left' | 'right', delay?: number, className?: string, key?: string | number }) => {
  const directions = {
    up: { y: 40 },
    down: { y: -40 },
    left: { x: 40 },
    right: { x: -40 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'ORIGIN', href: '#origin' },
    { name: 'INTERNSHIP', href: '#internship' },
    { name: 'MISSIONS', href: '#missions' },
    { name: 'ARSENAL', href: '#arsenal' },
    { name: 'ACADEMY', href: '#academy' },
    { name: 'SIGNAL', href: '#signal' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 w-full z-50 transition-all duration-300 px-6 py-4",
      isScrolled ? "bg-black/90 backdrop-blur-md border-b border-white/10" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <div className="bg-marvel-red px-2 py-1 rounded-sm">
            <span className="font-display text-2xl tracking-normal text-white">EBAD</span>
          </div>
          <span className="font-display text-2xl tracking-normal text-white">PORTFOLIO</span>
        </motion.div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link, i) => (
            <motion.a
              key={link.name}
              href={link.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="font-display text-sm tracking-widest text-white/70 hover:text-marvel-red transition-colors"
            >
              {link.name}
            </motion.a>
          ))}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => {
              setSelectedRole(null);
              setIsModalOpen(true);
            }}
            className="bg-marvel-red hover:bg-red-700 text-white font-display px-6 py-2 rounded-sm tracking-widest text-sm transition-all"
          >
            ASSEMBLE
          </motion.button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black border-b border-white/10 overflow-hidden"
          >
            <div className="flex flex-col gap-4 p-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="font-display text-xl tracking-widest text-white hover:text-marvel-red"
                >
                  {link.name}
                </a>
              ))}
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setSelectedRole(null);
                  setIsModalOpen(true);
                }}
                className="bg-marvel-red text-center text-white font-display py-3 rounded-sm tracking-widest text-lg mt-4 uppercase"
              >
                Assemble
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Assemble Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-zinc-950 border border-white/10 rounded-sm w-full max-w-md p-6 relative flex flex-col items-center text-center"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-white/50 hover:text-white"
              >
                <X size={20} />
              </button>

              {!selectedRole ? (
                <div className="w-full">
                  <h3 className="font-display text-2xl tracking-normal text-white mb-2 uppercase">How can I help you?</h3>
                  <p className="text-white/60 mb-6 text-sm font-sans">Select a professional role to continue:</p>

                  <div className="space-y-3">
                    {['Product Manager', 'UI/UX Designer', 'Frontend Developer', 'Full-Stack Developer'].map((role) => (
                      <button
                        key={role}
                        onClick={() => setSelectedRole(role)}
                        className="w-full text-left bg-white/5 border border-white/10 p-4 rounded-sm font-display tracking-widest hover:border-marvel-red hover:bg-marvel-red/10 transition-all uppercase"
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="w-full">
                  <h3 className="font-display text-2xl tracking-normal text-white mb-2 uppercase">Initiate Protocol</h3>
                  <p className="text-white/60 mb-6 text-sm font-sans">
                    You've selected <span className="text-marvel-red font-display tracking-widest">{selectedRole}</span>.
                    Please send the task or problem details to my mail to assemble our forces.
                  </p>

                  <a
                    href={`mailto:shaik.ibad4455@gmail.com?subject=${encodeURIComponent(`Assemble: Inquiry for ${selectedRole}`)}`}
                    onClick={() => setIsModalOpen(false)}
                    className="block w-full text-center bg-marvel-red hover:bg-red-700 text-white font-display py-4 rounded-sm tracking-[0.3em] transition-all"
                  >
                    SEND TRANSMISSION
                  </a>
                  <button
                    onClick={() => setSelectedRole(null)}
                    className="w-full mt-4 text-center text-white/40 hover:text-white font-display tracking-widest text-xs transition-colors"
                  >
                    BACK TO ROLES
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 250]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 500], [1, 1.1]);

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <motion.div style={{ scale }} className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?q=80&w=2000&auto=format&fit=crop"
          alt="Marvel Background"
          className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-1000"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      </motion.div>

      <motion.div
        style={{ y: y1, opacity }}
        className="relative z-10 text-center px-6"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-block bg-marvel-red px-4 py-1 mb-6 rounded-sm"
        >
          <span className="font-display text-sm tracking-[0.3em] text-white">PRODUCT DESIGNER & DEVELOPER</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="font-display text-7xl md:text-9xl tracking-normal leading-none mb-6"
        >
          SHAIK <span className="text-marvel-red">EBAD</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="max-w-2xl mx-auto text-white/60 text-lg md:text-xl font-sans tracking-wide mb-10"
        >
          Crafting digital experiences with the precision of Stark Industries and the strategic vision of a Product Manager.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <a href="#missions" className="bg-white text-black font-display px-8 py-4 rounded-sm tracking-widest hover:bg-marvel-red hover:text-white transition-all">
            VIEW MISSIONS
          </a>
          <a href="#signal" className="border border-white/20 text-white font-display px-8 py-4 rounded-sm tracking-widest hover:bg-white hover:text-black transition-all">
            SEND SIGNAL
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-white/30"
      >
        <ChevronDown size={32} />
      </motion.div>
    </section>
  );
};

const SectionTitle = ({ title, subtitle }: { title: string, subtitle: string }) => (
  <div className="mb-16">
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="flex items-center gap-4 mb-2"
    >
      <div className="h-[2px] w-12 bg-marvel-red" />
      <span className="font-display text-marvel-red tracking-[0.3em] text-sm uppercase">{subtitle}</span>
    </motion.div>
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="font-display text-5xl md:text-7xl tracking-normal uppercase"
    >
      {title}
    </motion.h2>
  </div>
);

const About = () => {
  return (
    <section id="origin" className="py-24 px-6 max-w-7xl mx-auto">
      <ScrollReveal>
        <SectionTitle title="THE ORIGIN STORY" subtitle="About Me" />
      </ScrollReveal>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        <ScrollReveal direction="right">
          <div className="relative group">
            <div className="absolute -inset-4 bg-marvel-red/20 rounded-2xl blur-2xl group-hover:bg-marvel-red/30 transition-all" />
            <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/10">
              <img
                src="/Gemini_Generated_Image_yuwgshyuwgshyuwg.png"
                alt="Shaik Mohammad Ebad"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </div>
        </ScrollReveal>

        <div className="space-y-6">
          <ScrollReveal delay={0.2}>
            <p className="text-xl text-white/80 leading-relaxed font-sans">
              I am Shaik Mohammad Ebad, a Product Designer and Developer dedicated to building user-centric platforms that drive real impact. Currently serving as a Product Designer & Management Intern at Languify, I specialize in identifying user pain points and transforming them into seamless digital solutions.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.4}>
            <p className="text-lg text-white/60 leading-relaxed font-sans">
              From designing interview-practice platforms for MBA students to developing full-stack booking systems, my mission is to merge technical excellence with strategic product thinking. I believe every line of code and every pixel should serve a greater purpose.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-2 gap-6 pt-6">
            {[
              { label: 'POWER LEVEL', value: 'B.TECH CSE' },
              { label: 'ALLIANCE', value: 'LANGUIFY' },
              { label: 'BASE', value: 'PHAGWARA, PB' },
              { label: 'STATUS', value: 'ACTIVE' },
            ].map((stat, i) => (
              <ScrollReveal key={stat.label} delay={0.6 + i * 0.1}>
                <div className="border-l-2 border-marvel-red pl-4">
                  <div className="text-[10px] font-display tracking-widest text-white/40 uppercase mb-1">{stat.label}</div>
                  <div className="font-display text-xl tracking-normal">{stat.value}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ProjectCard = ({ project, index }: { project: any; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
    >
      <div className="aspect-video overflow-hidden relative">
        {project.image.endsWith('.mp4') ? (
          <video
            src={project.image}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 pointer-events-none"
          />
        ) : (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
        )}
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-display text-2xl tracking-normal group-hover:text-marvel-red transition-colors">{project.title}</h3>
          <div className="flex gap-2">
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
                <Github size={20} />
              </a>
            )}
            {project.link && (
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
                <ExternalLink size={20} />
              </a>
            )}
          </div>
        </div>
        <p className="text-white/60 font-sans text-sm mb-6 line-clamp-2">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag: string) => (
            <span key={tag} className="text-[10px] font-mono bg-white/10 px-2 py-1 rounded-sm text-white/80 uppercase tracking-wider">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const Internship = () => {
  const points = [
    "Designed 'Case Master', an interview-practice platform for MBA & BBA students.",
    "Collaborated with product and development teams to identify user pain points and improve platform usability.",
    "Collected and analyzed user feedback to enhance onboarding and engagement features.",
    "Helped improve adoption by launching four key features, contributing to 40% revenue growth.",
    "Assisted users in understanding platform features and resolving usability queries through structured feedback."
  ];

  return (
    <section id="internship" className="py-24 px-6 bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <SectionTitle title="FIELD EXPERIENCE" subtitle="Internship" />
        </ScrollReveal>

        <div className="glass-panel p-8 md:p-12 border-marvel-blue/30 hover:border-marvel-blue transition-all">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h3 className="font-display text-3xl md:text-4xl tracking-normal text-white mb-2">PRODUCT DESIGNER & MANAGEMENT INTERN</h3>
              <div className="flex items-center gap-2 text-marvel-blue font-display tracking-widest text-sm">
                <Rocket size={16} />
                <span>LANGUIFY</span>
              </div>
            </div>
            <div className="bg-marvel-blue/10 border border-marvel-blue/20 px-4 py-2 rounded-sm">
              <span className="font-mono text-marvel-blue text-sm tracking-widest">SINCE AUG '25</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-4">
              {points.map((point, i) => (
                <ScrollReveal key={i} delay={i * 0.1} direction="right">
                  <div className="flex gap-4 group">
                    <div className="mt-1.5 h-1.5 w-1.5 bg-marvel-blue rounded-full flex-shrink-0 group-hover:scale-150 transition-transform shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                    <p className="text-white/70 font-sans leading-relaxed group-hover:text-white transition-colors">{point}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-marvel-blue/5 rounded-2xl blur-3xl" />
              <div className="relative border border-white/10 rounded-2xl overflow-hidden aspect-video">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000&auto=format&fit=crop"
                  alt="Product Management"
                  className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/60 backdrop-blur-md p-6 border border-white/10 rounded-sm text-center">
                    <div className="text-3xl font-display text-marvel-blue mb-1">40%</div>
                    <div className="text-[10px] font-display tracking-widest text-white/60 uppercase">Revenue Growth Contribution</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Missions = () => {
  const projects = [
    {
      title: "BOOKING MGMT SYSTEM",
      description: "A full-stack Online Booking Management System with secure user authentication, admin roles, and RESTful APIs for seamless data management.",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop",
      tags: ["React", "Node.js", "MongoDB", "Tailwind"],
      github: "https://github.com/Mahi-Gupta/Online-Booking-Management-System"
    },
    {
      title: "EV CHARGING APP",
      description: "User-centric mobile app design for EV charging station discovery, featuring real-time availability tracking and smart route planning.",
      image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=1000&auto=format&fit=crop",
      tags: ["Figma", "UI/UX", "Wireframes", "Product Design"],
      link: "https://www.figma.com/proto/S3cuD5jGZE1PYjhkr2yhJl/Untitled?node-id=4-69&starting-point-node-id=4%3A68&t=mSTLpvS2CgkcPW54-1"
    },
    {
      title: "GAMIFIED LEGAL PLATFORM",
      description: "An engaging web platform aimed at educating Indian children about their legal rights through interactive quizzes and puzzles.",
      image: "/gamified_legal_project_1773162925993.png",
      tags: ["HTML/CSS", "JavaScript", "PHP", "Gamification"],
      github: "https://github.com/sudhanshu898/ChildRightsEduGame"
    },
    {
      title: "CASE MASTER @ LANGUIFY",
      description: "Designed an interview-practice platform for MBA students, contributing to 40% revenue growth through user-centric feature launches.",
      image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=1000&auto=format&fit=crop",
      tags: ["Product Management", "UX Research", "Internship"]
    }
  ];

  return (
    <section id="missions" className="py-24 px-6 bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <SectionTitle title="COMPLETED MISSIONS" subtitle="Projects" />
        </ScrollReveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {projects.map((project, i) => (
            <ScrollReveal key={project.title} delay={i * 0.1}>
              <ProjectCard project={project} index={i} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const Arsenal = () => {
  const skills = [
    { name: "LANGUAGES", icon: <Zap className="text-marvel-gold" />, items: ["C++", "JavaScript", "C", "Java", "Python"] },
    { name: "FRAMEWORKS", icon: <Cpu className="text-marvel-blue" />, items: ["React", "Node.js", "Tailwind CSS", "HTML/CSS", "Next.js"] },
    { name: "TOOLS", icon: <Shield className="text-marvel-red" />, items: ["Figma", "MongoDB", "Canva", "Git", "Product Support"] },
    { name: "TACTICS", icon: <Target className="text-emerald-500" />, items: ["Product Management", "UX Research", "Agile", "Problem Solving", "Analytical Thinking"] },
  ];

  return (
    <section id="arsenal" className="py-24 px-6 max-w-7xl mx-auto">
      <ScrollReveal>
        <SectionTitle title="THE ARSENAL" subtitle="Skills" />
      </ScrollReveal>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {skills.map((skill, i) => (
          <ScrollReveal key={skill.name} delay={i * 0.1}>
            <div className="glass-panel p-8 group hover:border-marvel-red transition-all h-full">
              <div className="mb-6 p-3 bg-white/5 rounded-xl inline-block group-hover:scale-110 transition-transform">
                {skill.icon}
              </div>
              <h3 className="font-display text-2xl tracking-normal mb-4">{skill.name}</h3>
              <ul className="space-y-2">
                {skill.items.map((item) => (
                  <li key={item} className="text-white/50 font-sans text-sm flex items-center gap-2">
                    <div className="w-1 h-1 bg-marvel-red rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};

const Academy = () => {
  const education = [
    {
      school: "LOVELY PROFESSIONAL UNIVERSITY",
      degree: "Bachelor of Technology - Computer Science and Engineering",
      period: "Aug' 23 - Present",
      stats: "CGPA: 7.21",
      location: "Phagwara, Punjab"
    },
    {
      school: "REGENCY NALANDA EDUCATIONAL INSTITUTIONS",
      degree: "Intermediate",
      period: "Apr' 21 - Mar' 23",
      stats: "Percentage: 80%",
      location: "Rajampet, Andhra Pradesh"
    },
    {
      school: "SRI SAI VIDYALAYA SCHOOL",
      degree: "Matriculation",
      period: "Mar' 20 - Mar' 21",
      stats: "Percentage: 98%",
      location: "Rajampet, Andhra Pradesh"
    }
  ];

  const certificates = [
    { name: "Product Management", issuer: "Cipher Schools", date: "Jul' 25", link: "https://drive.google.com/file/d/1gCOGH7UdgaXMCT4Asi7NhOeWI277abZ6/view?usp=sharing" },
    { name: "UI/UX Designing", issuer: "Cipher Schools", date: "Jun' 25", link: "https://drive.google.com/file/d/1hmCuoLsCegW7m5N2bmSHokPDB6t6WZdL/view" },
    { name: "Web Development", issuer: "FreeCodeCamp", date: "Oct' 23", link: "https://drive.google.com/file/d/1AGddg40hwzBs615Gxme1sw8F4vPIJF_3/view" },
    { name: "AI APPs", issuer: "Cipher Schools", date: "Jul' 25", link: "https://drive.google.com/file/d/1cPMC2fkSQyJN27jmP_IVyS_UdDitpsA-/view?usp=sharing" },
    { name: "Automata Theory", issuer: "Online Certification", date: "Recent", link: "https://drive.google.com/file/d/1tGFOM6JWsY1Ei95YGWV9e_e6hZ1mZh6k/view?usp=sharing" },
  ];

  const achievements = [
    {
      title: "TOP 10 LEARNER",
      desc: "Ranked in the Top 10 in Cipher Schools learners list among 1,000+ active learners.",
      icon: <Rocket className="text-marvel-gold" />,
      date: "JUN '25"
    },
    {
      title: "REVENUE CATALYST",
      desc: "Contributed to 40% revenue growth at Languify through strategic feature launches.",
      icon: <Target className="text-emerald-500" />,
      date: "AUG '25"
    }
  ];

  return (
    <section id="academy" className="py-24 px-6 bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <SectionTitle title="THE ACADEMY" subtitle="Education & Certificates" />
        </ScrollReveal>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <h3 className="font-display text-3xl tracking-normal text-marvel-red mb-8">EDUCATION</h3>
            {education.map((edu, i) => (
              <ScrollReveal key={edu.school} delay={i * 0.1}>
                <div className="relative pl-8 border-l border-white/10 group">
                  <div className="absolute left-[-5px] top-0 w-[9px] h-[9px] bg-marvel-red rounded-full group-hover:scale-150 transition-transform" />
                  <div className="mb-1 text-xs font-mono text-white/40 uppercase tracking-widest">{edu.period}</div>
                  <h4 className="font-display text-xl tracking-normal mb-1 group-hover:text-marvel-red transition-colors">{edu.school}</h4>
                  <p className="text-white/60 text-sm mb-2">{edu.degree}</p>
                  <div className="flex gap-4 text-[10px] font-display tracking-widest text-marvel-gold uppercase">
                    <span>{edu.stats}</span>
                    <span className="text-white/20">|</span>
                    <span>{edu.location}</span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <div className="space-y-8">
            <h3 className="font-display text-3xl tracking-normal text-marvel-blue mb-8">CERTIFICATES</h3>
            <div className="space-y-4">
              {certificates.map((cert, i) => (
                <ScrollReveal key={cert.name} delay={0.3 + i * 0.1}>
                  {cert.link ? (
                    <a href={cert.link} target="_blank" rel="noopener noreferrer" className="block bg-white/5 border border-white/10 p-6 rounded-sm hover:bg-white/10 hover:border-marvel-blue/50 transition-all group">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-[10px] font-mono text-marvel-blue uppercase tracking-widest">{cert.date}</div>
                        <ExternalLink size={14} className="text-white/40 group-hover:text-marvel-blue transition-colors" />
                      </div>
                      <h4 className="font-display text-lg tracking-normal mb-1 group-hover:text-marvel-blue transition-colors">{cert.name}</h4>
                      <p className="text-white/40 text-xs uppercase tracking-widest">{cert.issuer}</p>
                    </a>
                  ) : (
                    <div className="bg-white/5 border border-white/10 p-6 rounded-sm hover:bg-white/10 transition-all group">
                      <div className="text-[10px] font-mono text-marvel-blue mb-2 uppercase tracking-widest">{cert.date}</div>
                      <h4 className="font-display text-lg tracking-normal mb-1">{cert.name}</h4>
                      <p className="text-white/40 text-xs uppercase tracking-widest">{cert.issuer}</p>
                    </div>
                  )}
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>

        {/* Dedicated Achievements Section */}
        <div className="mt-24">
          <ScrollReveal>
            <h3 className="font-display text-3xl tracking-normal text-marvel-gold mb-12 text-center">HALL OF ACHIEVEMENTS</h3>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 max-w-4xl mx-auto gap-8">
            {achievements.map((ach, i) => (
              <ScrollReveal key={ach.title} delay={i * 0.2}>
                <div className="bg-white/5 border border-marvel-gold/20 p-8 rounded-sm hover:border-marvel-gold transition-all text-center group h-full flex flex-col items-center">
                  <div className="mb-6 p-4 bg-marvel-gold/10 rounded-full group-hover:scale-110 transition-transform">
                    {ach.icon}
                  </div>
                  <div className="text-[10px] font-mono text-marvel-gold mb-2 uppercase tracking-widest">{ach.date}</div>
                  <h4 className="font-display text-2xl tracking-normal mb-4">{ach.title}</h4>
                  <p className="text-white/60 text-sm font-sans leading-relaxed">{ach.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Signal = () => {
  return (
    <section id="signal" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-marvel-red/5 -z-10" />
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <SectionTitle title="SEND THE SIGNAL" subtitle="Contact" />
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-12">
          <ScrollReveal direction="right">
            <div>
              <p className="text-2xl font-display tracking-normal mb-8">
                READY TO <span className="text-marvel-red">ASSEMBLE</span> A TEAM FOR YOUR NEXT BIG PROJECT?
              </p>
              <div className="space-y-6">
                <a href="mailto:shaik.ibad4455@gmail.com" className="flex items-center gap-4 group cursor-pointer">
                  <div className="p-4 bg-white/5 rounded-full group-hover:bg-marvel-red transition-colors">
                    <Mail size={24} />
                  </div>
                  <div>
                    <div className="text-[10px] font-display tracking-widest text-white/40 uppercase">EMAIL</div>
                    <div className="text-lg font-sans group-hover:text-marvel-red transition-colors">shaik.ibad4455@gmail.com</div>
                  </div>
                </a>
                <a href="https://linkedin.com/in/ebad06" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group cursor-pointer">
                  <div className="p-4 bg-white/5 rounded-full group-hover:bg-marvel-blue transition-colors">
                    <Linkedin size={24} />
                  </div>
                  <div>
                    <div className="text-[10px] font-display tracking-widest text-white/40 uppercase">LINKEDIN</div>
                    <div className="text-lg font-sans group-hover:text-marvel-blue transition-colors">linkedin.com/in/ebad06</div>
                  </div>
                </a>
                <a href="https://github.com/EbadShaik12" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group cursor-pointer">
                  <div className="p-4 bg-white/5 rounded-full group-hover:bg-zinc-700 transition-colors">
                    <Github size={24} />
                  </div>
                  <div>
                    <div className="text-[10px] font-display tracking-widest text-white/40 uppercase">GITHUB</div>
                    <div className="text-lg font-sans group-hover:text-zinc-400 transition-colors">github.com/EbadShaik12</div>
                  </div>
                </a>
                <div className="flex items-center gap-4 group">
                  <div className="p-4 bg-white/5 rounded-full group-hover:bg-marvel-gold transition-colors">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <div className="text-[10px] font-display tracking-widest text-white/40 uppercase">LOCATION</div>
                    <div className="text-lg font-sans">Rajampet, Andhra Pradesh</div>
                  </div>
                </div>

                {/* Tactical Marvel Map */}
                <div className="mt-8 relative group overflow-hidden rounded-sm border border-white/10 p-1">
                  <div className="absolute inset-0 bg-marvel-red/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10" />

                  {/* Decorative UI elements for the map */}
                  <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-marvel-red pointer-events-none z-10" />
                  <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-marvel-red pointer-events-none z-10" />
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-marvel-red pointer-events-none z-10" />
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-marvel-red pointer-events-none z-10" />

                  <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                    <div className="w-2 h-2 bg-marvel-red rounded-full animate-ping" />
                    <span className="font-mono text-[10px] text-marvel-red tracking-widest bg-black/60 backdrop-blur-sm px-2 py-1 uppercase rounded-sm border border-marvel-red/30">
                      TRACKING
                    </span>
                  </div>

                  {/* Central Targeting Highlight for Rajampet */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none flex flex-col items-center justify-center">
                    <div className="relative flex items-center justify-center">
                      <div className="absolute w-24 h-24 border-2 border-marvel-red rounded-full animate-ping opacity-20" />
                      <div className="absolute w-16 h-16 border border-marvel-red rounded-full animate-spin [animation-duration:3s]" />
                      <div className="w-8 h-8 border-2 border-marvel-red/50 relative flex items-center justify-center">
                        <div className="w-1 h-full bg-marvel-red/50 absolute" />
                        <div className="w-full h-1 bg-marvel-red/50 absolute" />
                        <div className="w-2 h-2 bg-marvel-red rounded-full z-10" />
                      </div>
                    </div>
                    <div className="mt-4 bg-black/80 backdrop-blur-md px-4 py-2 border-2 border-marvel-red rounded-sm">
                      <span className="font-display text-2xl tracking-widest text-marvel-red uppercase font-bold drop-shadow-[0_0_8px_rgba(226,54,54,0.8)]">
                        RAJAMPET
                      </span>
                    </div>
                  </div>

                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d61545.98929737191!2d79.141705!3d14.1952443!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb32d847847cd3b%3A0xe5a3c260ff0d8804!2sRajampet%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                    width="100%"
                    height="300"
                    className="w-full grayscale invert contrast-150 opacity-70 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                    style={{ filter: 'grayscale(1) invert(0.9) contrast(1.2) brightness(0.9)' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="left">
            <form
              action="https://formsubmit.co/shaik.ibad4455@gmail.com"
              method="POST"
              className="space-y-4"
            >
              {/* Optional FormSubmit Configuration */}
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_template" value="table" />
              
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="NAME"
                  required
                  className="bg-white/5 border border-white/10 p-4 rounded-sm font-display tracking-widest focus:border-marvel-red outline-none transition-all"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="EMAIL"
                  required
                  className="bg-white/5 border border-white/10 p-4 rounded-sm font-display tracking-widest focus:border-marvel-red outline-none transition-all"
                />
              </div>
              <input
                type="text"
                name="_subject"
                placeholder="SUBJECT"
                required
                className="w-full bg-white/5 border border-white/10 p-4 rounded-sm font-display tracking-widest focus:border-marvel-red outline-none transition-all"
              />
              <textarea
                name="message"
                placeholder="MESSAGE"
                required
                rows={5}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-sm font-display tracking-widest focus:border-marvel-red outline-none transition-all resize-none"
              />
              <button type="submit" className="w-full bg-marvel-red hover:bg-red-700 text-white font-display py-4 rounded-sm tracking-[0.3em] transition-all">
                TRANSMIT SIGNAL
              </button>
            </form>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="py-12 px-6 border-t border-white/10 text-center">
    <div className="font-display text-2xl tracking-normal mb-4">
      <span className="bg-marvel-red px-2 py-1 mr-1">EBAD</span> PORTFOLIO
    </div>
    <p className="text-white/40 text-sm font-sans mb-6">Designed and developed with precision.</p>
    <div className="flex justify-center gap-6">
      <a href="https://github.com/EbadShaik12" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
        <Github size={20} />
      </a>
      <a href="https://linkedin.com/in/ebad06" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
        <Linkedin size={20} />
      </a>
      <a href="mailto:shaik.ibad4455@gmail.com" className="text-white/40 hover:text-white transition-colors">
        <Mail size={20} />
      </a>
    </div>
  </footer>
);

function App() {
  const [showIntro, setShowIntro] = useState(true);

  if (showIntro) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden">
        <video
          src="/intro.mp4"
          autoPlay
          muted
          playsInline
          onEnded={() => setShowIntro(false)}
          className="w-full h-full object-cover"
        />
        <button
          onClick={() => setShowIntro(false)}
          className="absolute bottom-10 right-10 z-50 text-white font-display tracking-widest text-sm transition-all uppercase bg-white/10 hover:bg-marvel-red hover:text-white px-8 py-3 rounded-sm border border-white/20 hover:border-marvel-red backdrop-blur-md"
        >
          SKIP INTRO
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-marvel-red selection:text-white overflow-x-hidden">
      <Jarvis />
      <Navbar />
      <Hero />
      <About />
      <Internship />
      <Missions />
      <Arsenal />
      <Academy />
      <Signal />
      <Footer />
    </div>
  );
}

export default App;
