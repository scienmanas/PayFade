"use client";
import { Navbar } from "@/app/ui/landing/Navbar";
import { Footer } from "@/app/ui/universal/Footer";
import { Hero } from "@/app/ui/landing/Hero";
import { FAQ } from "@/app/ui/landing/FAQ";
import { Demo } from "./ui/landing/Demo";
import { Contact } from "@/app/ui/landing/Contact";

export default function Home() {
  return (
    <div className="w-full h-fit flex flex-col gap-14 items-center justify-center scroll-smooth relative">
      <Navbar />
      <Hero />
      <div className="content-wrapper flex relative flex-col gap-14 items-center justify-center w-full max-w-screen-xl h-fit">
        <Demo />
        <FAQ />
        <Contact />
      </div>
      <Footer />
    </div>
  );
}
