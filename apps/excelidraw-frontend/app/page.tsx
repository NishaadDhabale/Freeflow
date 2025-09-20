"use client";

import Link from "next/link";
import { Button } from "@repo/ui/button";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";


export default function Home() {
  const router=useRouter();
  return (
    <main className="bg-slate-950 text-white flex flex-col min-h-screen">
      {/* ================= HEADER ================= */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-lg sticky top-0 z-50">
        <h1 className="text-2xl font-extrabold tracking-wide text-indigo-400">
          FreeFlow
        </h1>
        <nav className="hidden md:flex space-x-8 text-slate-300 text-sm">
          <a href="#features" className="hover:text-indigo-400 transition">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-indigo-400 transition">
            How it Works
          </a>
          <a href="#pricing" className="hover:text-indigo-400 transition">
            Pricing
          </a>
          <a href="#testimonials" className="hover:text-indigo-400 transition">
            Testimonials
          </a>
        </nav>
        <div className="space-x-4">
          <Link href="/signin">
            <Button size="lg"
             variant="outline" className="border-slate-600 bg-slate-800 hover:bg-slate-700">
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="primary" size="lg" className="bg-indigo-600 rounded-lg hover:bg-indigo-700">Sign Up</Button>
          </Link>
        </div>
      </header>

      {/* ================= HERO SECTION ================= */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900">
        <h2 className="text-5xl sm:text-6xl font-extrabold mb-6 leading-tight">
          Collaborate. Organize. <span className="text-indigo-400">Create.</span>
        </h2>
        <p className="text-lg text-slate-300 max-w-2xl mb-8">
          FreeFlow empowers teams to brainstorm, design, and build projects
          together on one powerful digital workspace. No limits, just flow.
        </p>
        <div className="space-x-4">
          <Link href="/signup">
            <Button variant="primary" size="lg" className=" rounded-lg bg-indigo-600 hover:bg-indigo-700 px-6 py-3 ">
              Get Started
            </Button>
          </Link>
          <a href="#features">
            <Button size="lg" variant="outline" className="px-6 py-3 rounded-xl border-slate-600">
              Learn More
            </Button>
          </a>
        </div>

        {/* Decorative shapes */}
        <div className="absolute top-32 left-20 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="px-6 py-24 max-w-6xl mx-auto text-center">
        <h3 className="text-3xl font-bold mb-12">Why Choose FreeFlow?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Real-Time Collaboration",
              desc: "Work together with your team in real-time, no matter where you are.",
            },
            {
              title: "Intuitive Design Tools",
              desc: "A powerful canvas with shapes, connectors, and creative freedom.",
            },
            {
              title: "Project Organization",
              desc: "Keep everything structured, organized, and accessible.",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg hover:scale-105 transition"
            >
              <CheckCircle className="mx-auto mb-4 text-indigo-400 w-10 h-10" />
              <h4 className="text-xl font-semibold mb-2">{f.title}</h4>
              <p className="text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section id="how-it-works" className="bg-slate-900 py-24 px-6 text-center">
        <h3 className="text-3xl font-bold mb-12">How It Works</h3>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[
            {
              step: "1",
              title: "Create An Account",
              desc: "Sign up and start a new team workspace instantly.",
            },
            {
              step: "2",
              title: "Create Canvas",
              desc: "Give a Name to your Canvas and co-create in real time.",
            },
            {
              step: "3",
              title: "Organise Your Canvases and Share Them With you Colleagues.",
              desc: "Structure your project and export results just By Sharing Your Canvas Id/ Link seamlessly.",
            },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-slate-800 p-8 rounded-2xl shadow-lg hover:scale-105 transition"
            >
              <div className="text-4xl font-bold text-indigo-400 mb-4">
                {s.step}
              </div>
              <h4 className="text-xl font-semibold mb-2">{s.title}</h4>
              <p className="text-slate-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= PRICING ================= */}
      <section id="pricing" className="py-24 px-6 max-w-6xl mx-auto  text-center">
        <h3 className="text-3xl font-bold mb-12">! Free Of Cost !</h3>
        <div className=" gap-8">
          <div>

              <Button variant="primary" size="lg" onClick={()=>{
                router.push('/signup')
              }}className="mt-auto bg-indigo-600 rounded-lg text-lg hover:bg-indigo-700">
                Get Started Now
              </Button>
            </div>

        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section id="testimonials" className="bg-slate-900 py-24 px-6 text-center">
        <h3 className="text-3xl font-bold mb-12">Loved by Many</h3>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {[
            {
              name: "Aditya Deshmane",
              role: "Student Developer",
              text: "FreeFlow transformed how our team collaborates. It's like working side by side even when remote!",
            },
            {
              name: "Padmaja Sirmewar",
              role: "Design Club Lead",
              text: "Super intuitive and fun to use. It makes brainstorming sessions actually enjoyable.",
            },
          ].map((t, i) => (
            <div
              key={i}
              className="bg-slate-800 p-8 rounded-2xl shadow-lg text-left"
            >
              <p className="text-slate-300 mb-4 italic">“{t.text}”</p>
              <h4 className="font-semibold">{t.name}</h4>
              <p className="text-slate-400 text-sm">{t.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="px-6 py-10 border-t border-slate-800 bg-slate-950 text-center text-slate-500">
        <p>© {new Date().getFullYear()} FreeFlow. All rights reserved.</p>
        <div className="flex justify-center space-x-6 mt-4 text-sm">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms</a>
          <a href="#">Support</a>
        </div>
      </footer>
    </main>
  );
}