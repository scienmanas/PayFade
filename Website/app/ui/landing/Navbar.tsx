"use client";

import Image from "next/image";
import Link from "next/link";
import logoImg from "@/public/assets/logo/logo.png";
import { useState } from "react";
import { firaSansFont } from "@/app/lib/fonts";

export function Navbar() {
  // Hamburger Menu
  const [isHamburgerOpened, setIsHamburgerOpened] = useState<boolean>(false);

  const tabs = [
    { text: "Github", link: "https://github.com/scienmanas/PayFade" },
    { text: "Contact", link: "mailto:iamscientistmanas@gmail.com" },
  ];

  return (
    <nav
      className={`w-full h-fit flex items-center justify-center bg-[#c9c9ca] fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b backdrop-blur-sm border-[#aaa8a8] border-opacity-60 bg-opacity-30  ${firaSansFont.className}`}
    >
      <div className="wrapper relative flex w-full max-w-screen-2xl items-center justify-between">
        <div className="relative flex px-2 py-2 flex-row items-center justify-between w-full">
          <Link href={"/"} className="w-fit h-fit">
            <div className="logo-place flex flex-row gap-2 items-center w-fit h-fit">
              <Image
                src={logoImg}
                alt="logo"
                width={85}
                height={85}
                className=" rounded-sm"
              />
            </div>
          </Link>
          <button
            onClick={() => setIsHamburgerOpened(!isHamburgerOpened)}
            className="relative h-fit w-fit flex sm:hidden hamburger flex-col gap-[6px] items-end"
          >
            <div
              style={{
                transform: isHamburgerOpened
                  ? "rotate(45deg) translateY(5px)"
                  : "rotate(0deg) translateY(0px)",
              }}
              className="line relative w-6 h-[3px] bg-neutral-800 duration-200"
            ></div>
            <div
              style={{
                transform: isHamburgerOpened
                  ? "rotate(-45deg) translateY(-5px)"
                  : "rotate(0deg) translateY(0px)",
                width: isHamburgerOpened ? "24px" : "16px",
              }}
              className="line relative w-4 text-end h-[3px] bg-neutral-800 duration-200"
            ></div>
          </button>
          <div className="link-wrapper sm:relative absolute w-full h-fit inset-0 p-4 sm:p-0 top-12 sm:top-0 sm:w-fit ">
            <div
              className={`link-tabs relative inset-0 w-full p-[2px] h-fit items-center`}
            >
              {isHamburgerOpened && (
                <div className="absolute z-0 glow-gradient flex sm:hidden bg-transparent bg-gradient-to-br from-[#2d2b55] to-pink-500 w-full h-full inset-0 rounded-lg m-auto blur-md"></div>
              )}
              <div
                className={`relative z-10 bg-[#f4f4f5] sm:bg-transparent w-full h-full content-wrapper flex sm:flex-row flex-col gap-4 rounded-lg  p-4 sm:p-0 sm:items-center items-start sm:border-none border-2 border-[#2d2b55] sm:flex ${
                  isHamburgerOpened ? "flex" : "hidden"
                } `}
              >
                <ul className="relative z-10  flex w-fit h-fit gap-4 sm:flex-row flex-col">
                  {tabs.map((tab, index) => (
                    <li key={index}>
                      <Link
                        onClick={() => setIsHamburgerOpened(!isHamburgerOpened)}
                        href={tab.link}
                        className="duration-200 text-neutral-700 hover:text-neutral-950"
                      >
                        {tab.text}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="buttons flex flex-col w-fit h-fit gap-4 sm:flex-row items-start sm:items-center">
                  <button
                    onClick={() => (window.location.href = "/dashboard")}
                    className="px-3 py-[5px] bg-[#2d2b51] rounded-md text-white"
                  >
                    Ready ?
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
