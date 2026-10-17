"use client";

import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => { const saved = localStorage.getItem("room-lobby-theme"); const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches; const enabled = saved ? saved === "dark" : prefersDark; setDark(enabled); document.documentElement.classList.toggle("dark", enabled); }, []);
  function toggleTheme() { const next = !dark; setDark(next); document.documentElement.classList.toggle("dark", next); localStorage.setItem("room-lobby-theme", next ? "dark" : "light"); }
  return <motion.button whileHover={{ y: -2, rotate: 4 }} whileTap={{ scale: 0.92 }} type="button" onClick={toggleTheme} aria-label={`Switch to ${dark ? "light" : "dark"} mode`} title={`Switch to ${dark ? "light" : "dark"} mode`} className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-[#34322C] transition dark:bg-[#2B2B27] dark:text-[#F4EED1]"><motion.span key={dark ? "sun" : "moon"} initial={{ opacity: 0, rotate: -35, scale: 0.7 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} transition={{ duration: 0.2 }}>{dark ? <Sun size={18} /> : <Moon size={18} />}</motion.span></motion.button>;
}
