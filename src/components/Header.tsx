"use client";

import { useState, useEffect, useCallback } from "react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeLink, setActiveLink] = useState("Home");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    },
    []
  );

  const navLinks = [
    { label: "Home", href: "#" },
    { label: "Sobre", href: "#" },
    { label: "Contato", href: "#" },
  ];

  return (
    <header
      onMouseMove={handleMouseMove}
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/80 backdrop-blur-xl shadow-[0_0_30px_rgba(139,92,246,0.3)]"
          : "bg-gradient-to-r from-black via-zinc-900 to-black"
      }`}
    >
      {/* Animated glow that follows the cursor */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(139,92,246,0.25), transparent 60%)`,
        }}
      />

      {/* Top glowing border line */}
      <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-violet-500 to-transparent animate-pulse" />

      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <a href="#" className="group flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center">
            {/* Rotating ring */}
            <div className="absolute inset-0 rounded-full border-2 border-violet-500/50 animate-[spin_6s_linear_infinite]" />
            <div className="absolute inset-0.5 rounded-full border border-cyan-400/30 animate-[spin_4s_linear_infinite_reverse]" />
            {/* Core */}
            <div className="h-4 w-4 rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 shadow-[0_0_15px_rgba(139,92,246,0.6)] group-hover:shadow-[0_0_25px_rgba(139,92,246,0.9)] transition-shadow duration-300" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-wider text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-violet-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-300">
              n8n
            </span>
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-violet-400/70">
              Automation
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setActiveLink(link.label)}
              className="group relative px-4 py-2 text-sm font-medium transition-all duration-300"
            >
              {/* Active / hover background */}
              <span
                className={`absolute inset-0 rounded-lg transition-all duration-300 ${
                  activeLink === link.label
                    ? "bg-violet-500/15 shadow-[inset_0_0_12px_rgba(139,92,246,0.15)]"
                    : "bg-transparent group-hover:bg-white/5"
                }`}
              />
              {/* Bottom indicator */}
              <span
                className={`absolute bottom-0 left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-300 ${
                  activeLink === link.label
                    ? "w-3/4 opacity-100"
                    : "w-0 opacity-0 group-hover:w-1/2 group-hover:opacity-60"
                }`}
              />
              <span
                className={`relative z-10 transition-colors duration-300 ${
                  activeLink === link.label
                    ? "text-white"
                    : "text-zinc-400 group-hover:text-white"
                }`}
              >
                {link.label}
              </span>
            </a>
          ))}

          {/* CTA Button */}
          <a
            href="#"
            className="group relative ml-4 overflow-hidden rounded-full px-5 py-2 text-sm font-semibold text-white transition-all duration-300"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-violet-600 to-cyan-500 transition-opacity duration-300 group-hover:opacity-90" />
            <span className="absolute inset-0 opacity-0 bg-gradient-to-r from-cyan-500 to-violet-600 transition-opacity duration-300 group-hover:opacity-100" />
            <span className="absolute inset-[1px] rounded-full bg-black/20 backdrop-blur-sm" />
            <span className="relative z-10">Iniciar</span>
          </a>
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          aria-label="Menu"
        >
          <span
            className={`h-0.5 w-6 rounded-full bg-white transition-all duration-300 ${
              menuOpen ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`h-0.5 w-6 rounded-full bg-white transition-all duration-300 ${
              menuOpen ? "opacity-0 scale-0" : ""
            }`}
          />
          <span
            className={`h-0.5 w-6 rounded-full bg-white transition-all duration-300 ${
              menuOpen ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile menu overlay */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ${
          menuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col items-center gap-2 border-t border-violet-500/20 px-6 py-4 bg-black/50 backdrop-blur-xl">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => {
                setActiveLink(link.label);
                setMenuOpen(false);
              }}
              className={`w-full rounded-lg px-4 py-3 text-center text-sm font-medium transition-all duration-300 ${
                activeLink === link.label
                  ? "bg-violet-500/15 text-white"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#"
            className="mt-2 w-full rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-5 py-3 text-center text-sm font-semibold text-white"
          >
            Iniciar
          </a>
        </nav>
      </div>

      {/* Bottom glowing border */}
      <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
    </header>
  );
}
