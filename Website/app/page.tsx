"use client";
import { Navbar } from "@/app/ui/landing/Navbar";
import { Footer } from "@/app/ui/universal/Footer";
import { Hero } from "@/app/ui/landing/Hero";
import { Features } from "@/app/ui/landing/Features";
import {FAQ} from "@/app/ui/landing/FAQ"
export default function Home() {
  return (
    <div className="w-full bg-[#2E2B55] text-white flex flex-col justify-center items-center gap-5">
      <Navbar />
      <div className="content-pages w-full  flex items-center justify-center">
        <div className="wrapper w-full max-w-screen-xl  flex flex-col gap-4">
          <Hero />
          <Features />
          <FAQ />
        </div>
         {/* Custom Styles */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 1s ease-out 0.3s both;
        }
        
        .animate-slide-up-delayed {
          animation: slide-up 1s ease-out 0.6s both;
        }
      `}</style>
      </div>
      <Footer />
    </div>
  );
}
