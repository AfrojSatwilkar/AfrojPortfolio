"use client";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import Achievements from "@/components/Achievements";
import NeuralNetworkBackground from "@/components/NeuralNetworkBackground";
import Technologies from "@/components/Technologies";
import Publications from "@/components/Publications";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
        <NeuralNetworkBackground />
        <Hero />
        <div className="relative z-10 w-full">
          <About />
          <Technologies />
          <Experience />
          <Projects />
          <Publications />
          <Achievements />
          <Education />
          <Contact />
        </div>
    </main>
  );
}
