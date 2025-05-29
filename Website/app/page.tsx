import Image from "next/image";
import { Navbar } from "./ui/landing/Navbar";

export default function Home() {
  return (
    <div className="w-full flex flex-col justify-center items-center gap-5">
       <Navbar/>
    </div>
  );
}
