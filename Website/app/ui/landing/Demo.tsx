"use client";

import Image, { StaticImageData } from "next/image";
import { useState, useRef } from "react";
import { IoPlayOutline } from "react-icons/io5";
import placeholderImg from "@/public/assets/landing/Demo.png";
import { firaSansFont } from "@/app/lib/fonts";

interface heroVideoProps {
  img: StaticImageData;
  video: string;
  heading: string;
  description: string;
}

const ImgVideoData: heroVideoProps = {
  img: placeholderImg,
  video: "/assets/landing/demo.mp4",
  heading: "Demo Video",
  description: "See the Demo Video and get to know.",
};

export function Demo() {
  const [isVideoPlayed, setIsVideoPlayed] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <section
      className={`relative demo-video w-full h-fit flex flex-col items-center justify-center gap-8 p-8 ${firaSansFont.className}`}
    >
      <div className="head-and-description flex flex-col gap-4 items-center justify-center">
        <h1 className="w-fit h-fit text-center text-transparent bg-clip-text bg-gradient-to-br from-[#2d2b51]  to-neutral-700 sm:text-lg text-base font-bold ">
          {ImgVideoData.heading}
        </h1>
        <p className="w-fit h-fit text-center sm:text-2xl text-xl text-transparent bg-clip-text bg-gradient-to-tr  from-neutral-800 to-neutral-900 font-semibold">
          {ImgVideoData.description}
        </p>
      </div>
      <div className="relative video-image-placeholder rounded-xl w-fit h-fit before:absolute before:h-[100%] before:w-full before:bg-gradient-to-tl before:from-purple-500 before:to-purple-800 before:opacity-60 before:blur-2xl before:content-[''] before:right-5 before:-top-5 after:absolute after:h-[100%] after:w-full after:bg-gradient-br after:from-purple-500 after:to-purple-800 after:blur-2xl after:opacity-60 after:content-[''] after:left-5 after:-bottom-5 after:z-0">
        {!isVideoPlayed && (
          <div className="relative z-10 placehold-image  md:w-[700px] lg:w-[800px] flex items-center justify-center">
            <Image
              className="w-full relative rounded-xl"
              src={ImgVideoData.img}
              width={800}
              height={400}
              alt="placeholder-img"
            />
            <button
              onClick={() => {
                setIsVideoPlayed(true);
                videoRef.current?.play();
              }}
              className="absolute z-10 p-4 w-full h-full flex items-center justify-center"
            >
              <div className="relative w-fit h-fit flex justify-center items-center group bg-[#27272a] rounded-full">
                <div className="z-0 absolute shadow-pulsing bg-transparent bg-gradient-radial w-[120%] h-[120%] blur-2xl hover:w-[150%] hover:h-[150%] "></div>
                <IoPlayOutline className=" relative z-10 lg:text-6xl md:text-4xl sm:text-3xl text-2xl border-[2px] border-[#8b5cf6] text-white w-fit h-fit p-4 rounded-full flex items-center justify-center group-hover:scale-105 duration-300 " />
              </div>
            </button>
          </div>
        )}
        <div
          className={`relative z-10 actual-video w-fit h-fit ${
            isVideoPlayed ? "flex" : "hidden"
          }`}
        >
          <video
            ref={videoRef}
            preload="auto"
            controls
            className="w-[700px] h-[400px] rounded-lg"
          >
            <source src={ImgVideoData.video} type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  );
}
