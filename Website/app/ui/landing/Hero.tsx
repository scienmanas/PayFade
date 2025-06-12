import { FaMagic, FaLongArrowAltRight } from "react-icons/fa";
import Link from "next/link";
import { firaSansFont } from "@/app/lib/fonts";
import { Grid } from "@/app/ui/components/grid";

// Hero component definition
export function Hero() {
  return (
    <div
      className={`relative upper-part-nav-and-hero flex w-full h-fit flex-col items-center justify-center ${firaSansFont.className}`}
    >
      {/* Grid layout component */}
      <Grid />
      <div className="relative z-10 top-under-warpper w-full h-fit flex flex-col gap-24 items-center justify-center mt-20 md:mt-24 lg:mt-28">
        <div className="content-wrapper w-full max-w-screen-2xl flex flex-col gap-28">
          {/* Hero section */}
          <div className="relative hero w-full h-fit z-10">
            <section id="hero" className="relative z-20 hero w-full h-fit">
              {/* Wrapper for the centered content */}
              <div className="content-all-center-wrapper w-full h-fit flex flex-col items-center justify-center gap-5 p-4">
                {/* Updates button with icon and text */}
                <div className="updates-click w-fit h-fit group cursor-pointer flex flex-row gap-1 items-center border-2 rounded-2xl px-2 py-1 border-[#bdb9ff] hover:border-[#2d2b55] hover:shadow-2xl hover:shadow-purple-200  bg-neutral-200 duration-300">
                  <FaMagic className="text-sm text-purple-700 group-hover:text-purple-800 duration-300" />
                  <span className="text-sm text-neutral-600 hover:text-neutral-800 duration-300">
                    Only for developers!
                  </span>
                </div>
                {/* Header, description, and buttons */}
                <div className="head-description-and-buttons-wrapper flex flex-col w-fit h-fit items-center justify-center gap-8">
                  <div className="head-and-description w-fit h-fit flex items-center justify-center flex-col gap-4">
                    {/* Main heading */}
                    <h1 className="w-fit relative h-fit font-extrabold sm:text-5xl text-4xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-br from-neutral-900 to-neutral-700 text-center selection:text-[#2d2b55] selection:bg-blue-200 mx-auto">
                      Welcome to{" "}
                      <Link
                        href="https://github.com/scienmanas/PayFade"
                        className="inline-block"
                      >
                        <span className="decoration-[#2d2b55] relative underline decoration-double text-neutral-700 hover:text-[#4a4788] duration-200 py-[5px] px-[10px] rotating-dashed-border">
                          <svg className="absolute inset-0">
                            <rect
                              className="rotating-border-rect"
                              x="1"
                              y="1"
                              width="calc(100% - 2px)"
                              height="calc(100% - 2px)"
                              rx="0"
                            />
                          </svg>
                          PayFade
                        </span>
                      </Link>
                    </h1>
                    {/* Description text */}
                    <p className="w-fit h-fit max-w-[512px] text-center text-sm sm:text-base md:text-lg">
                      Ever happened when the client didn't pay you for your
                      app/web development work which you delivered? We have here
                      a nasty solution,{" "}
                      <span className="underline decoration-[#2d2b55] decoration-double">
                        make their website transparent
                      </span>{" "}
                      ☺️.
                    </p>
                  </div>
                  {/* Buttons for actions */}
                  <div className="buttons w-fit h-fit flex flex-row flex-wrap gap-6 items-center justify-center">
                    <button
                      className="w-fit h-fit px-4 py-2 bg-[#2d2b55] duration-300 rounded-md border border-[#7e3eee] font-semibold text-neutral-200"
                      onClick={() => (window.location.href = "/dashboard")}
                    >
                      Get started
                    </button>

                    {/* Overview button */}
                    <button className="px-4 py-2 flex flex-row gap-2 items-center justify-center bg-neutral-300 border rounded-md font-bold border-[#2d2b55] duration-300 group">
                      <span className="text-neutral-800">GitHub</span>
                      <FaLongArrowAltRight className="group-hover:translate-x-1 duration-300 group-hover:text-purple-700 text-neutral-800" />
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
