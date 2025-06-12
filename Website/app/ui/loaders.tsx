"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import logoImg from "@/public/assets/logo/logo_letter.png";
import Link from "next/link";

export function AuthPageLoader() {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Loading");

  // Simulate loading progress
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 80) {
          setLoadingText("Almost there...");
          clearInterval(progressInterval);
          return prev;
        } else if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    // Animate loading text
    const textInterval = setInterval(() => {
      setLoadingText((prev) => {
        if (prev === "Loading...") return "Loading";
        if (prev === "Loading") return "Loading.";
        if (prev === "Loading.") return "Loading..";
        return "Loading...";
      });
    }, 500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="text-center space-y-8">
        {/* Main Logo/Brand */}
        <div className="flex items-center justify-center mb-8">
          <div className="relative">
            {/* Spinning outer ring */}
            <div className="w-20 h-20 bg-transparent border-4 border-gray-200 rounded-full animate-spin border-t-black"></div>
            {/* Inner logo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Link href={"/"}>
                <Image
                  alt="logo"
                  src={logoImg}
                  height={40}
                  className="rounded-full"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-black">{loadingText}</h2>
          <p className="text-gray-600">
            Please wait while we prepare everything for you
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-80 mx-auto space-y-2">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-black rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Animated Dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-black rounded-full animate-bounce"></div>
          <div
            className="w-3 h-3 bg-black rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-3 h-3 bg-black rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>

        {/* Loading Steps Indicator */}
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-black rounded-full"></div>
            <span className="text-gray-700">Initializing application</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                progress > 30 ? "bg-black" : "bg-gray-300"
              }`}
            ></div>
            <span
              className={`transition-colors duration-300 ${
                progress > 30 ? "text-gray-700" : "text-gray-400"
              }`}
            >
              Loading resources
            </span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                progress > 60 ? "bg-black" : "bg-gray-300"
              }`}
            ></div>
            <span
              className={`transition-colors duration-300 ${
                progress > 60 ? "text-gray-700" : "text-gray-400"
              }`}
            >
              Preparing interface
            </span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                progress > 90 ? "bg-black" : "bg-gray-300"
              }`}
            ></div>
            <span
              className={`transition-colors duration-300 ${
                progress > 90 ? "text-gray-700" : "text-gray-400"
              }`}
            >
              Almost ready
            </span>
          </div>
        </div>

        {/* Pulse Animation Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-96 h-96 border border-gray-100 rounded-full animate-ping opacity-20"></div>
          <div
            className="absolute w-64 h-64 border border-gray-200 rounded-full animate-ping opacity-30"
            style={{ animationDelay: "0.5s" }}
          ></div>
        </div>
      </div>

      {/* Corner Elements */}
      <div className="absolute top-8 left-8">
        <div className="w-8 h-8 border-l-2 border-t-2 border-black"></div>
      </div>
      <div className="absolute top-8 right-8">
        <div className="w-8 h-8 border-r-2 border-t-2 border-black"></div>
      </div>
      <div className="absolute bottom-8 left-8">
        <div className="w-8 h-8 border-l-2 border-b-2 border-black"></div>
      </div>
      <div className="absolute bottom-8 right-8">
        <div className="w-8 h-8 border-r-2 border-b-2 border-black"></div>
      </div>
    </div>
  );
}
