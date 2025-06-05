
// Hero Component (Enhanced version of your existing component)
export function Hero() {
  return (
    <div className="hero flex flex-col items-center justify-center mt-36 px-4">
      <div className="heading font-extrabold text-7xl md:text-8xl lg:text-9xl bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-6 animate-fade-in">
        PayFade
      </div>
      <div className="description text-slate-300 text-xl md:text-2xl text-center max-w-3xl mb-8 animate-slide-up">
        The next generation payment platform that makes transactions seamless, secure, and lightning-fast
      </div>
      <div className="flex gap-4 animate-slide-up-delayed">
        <button className="bg-white text-[#2E2B55] px-8 py-4 rounded-lg font-semibold hover:bg-slate-200 transform hover:scale-105 transition-all duration-300 shadow-lg">
          Get Started
        </button>
        <button className="border border-slate-300 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-[#2E2B55] transition-all duration-300">
          Learn More
        </button>
      </div>
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
  );
}

