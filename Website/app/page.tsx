import Image from "next/image";
import { Navbar } from "@/app/ui/landing/Navbar";
import { Hero } from "@/app/ui/landing/Hero";
import { Features } from "@/app/ui/landing/Features";

export default function Home() {
  return (
    <div className="w-full flex flex-col justify-center items-center gap-5">
      <Navbar />
      <div className="content-pages w-full h-fit flex items-center justify-center">
        <div className="wrapper w-full max-w-screen-xl h-fit flex flex-col gap-4">
          <Hero />
          <Features />
        </div>
      </div>
    </div>
  );
}
