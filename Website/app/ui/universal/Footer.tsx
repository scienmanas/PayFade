"use client";

import Link from "next/link";
import Image from "next/image";
import logoImg from "@/public/assets/logo/logo.png";
import { motion } from "framer-motion";
import { FaBitcoin } from "react-icons/fa";
import { SiSolana } from "react-icons/si";
import { FaEthereum } from "react-icons/fa";
import { SiBuymeacoffee } from "react-icons/si";
import { IconType } from "react-icons";
import { useState, useEffect, useRef } from "react";

interface Author {
  name: string;
  url: string;
}

interface donationType {
  name: string;
  icon: IconType;
  address: string;
}

export function Footer() {
  // Components States
  const [isDonationOpened, setisDonationOpened] = useState<boolean>(false);
  // Ref for the container that holds both the button and the dropdown
  const donationContainerRef = useRef<HTMLDivElement>(null);

  // Authors and their details
  const authors: Author[] = [
    {
      name: "Manas",
      url: "https://scienmanas.xyz",
    },
    {
      name: "Nikhil Srivastava",
      url: "https://nikhilsrv.page",
    },
  ];
  const mailTo = "iamscientistmanas@gmail.com";

  // Close the donation dropdown when clicking outside of it
  useEffect(() => {
    if (!isDonationOpened) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        donationContainerRef.current &&
        !donationContainerRef.current.contains(event.target as Node)
      )
        setisDonationOpened(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDonationOpened]);

  return (
    <footer className="w-full bg-neutral-900 text-white mt-20">
      <div className="max-w-screen-xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          {/* Brand/Logo Section */}
          <div className="flex flex-col gap-2">
            <Image
              alt="logo"
              src={logoImg}
              height={30}
              className="rounded-lg"
            />
            <p className="text-gray-300 text-sm leading-relaxed">
              Crafted with passion and precision by two dedicated developers.
            </p>
            <Link
              target="_blank"
              href={`mailto:${mailTo}?subject=Report%20An%20Issue%20PayFade`}
              className="text-sm decoration-dashed underline decoration-slate-500 hover:decoration-slate-200 duration-200 mt-3"
            >
              Report an Issue
            </Link>
          </div>

          {/* Creators Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-100">Created By</h3>
            <div className="space-y-1">
              {authors.map((author, index) => (
                <div key={index} className="flex items-center space-x-2 w-fit">
                  <Link
                    href={author.url}
                    className="text-gray-300 hover:text-white transition-colors duration-200 underline decoration-gray-500 hover:decoration-white"
                  >
                    {author.name}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Support Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-100">Support Us</h3>
            <p className="text-gray-300 text-sm">
              Consider supporting our work through donations to help us continue
              building amazing projects.
            </p>
            <div ref={donationContainerRef} className="donate-button relative">
              <Donation isDonationOpened={isDonationOpened} />
              <button
                onClick={() => setisDonationOpened(!isDonationOpened)}
                className="bg-white text-black px-4 py-2 text-sm font-medium hover:bg-gray-200 transition-colors duration-200 rounded"
              >
                Donate Now
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-800 mb-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-gray-400 text-sm">
            © 2025 All rights reserved.
          </div>

          <div className="flex items-center space-x-6 text-sm">
            <Link
              href="/legal/terms-and-conditions"
              className="text-gray-400 hover:text-white transition-colors duration-200 underline decoration-gray-600 hover:decoration-white"
            >
              Terms & Conditions
            </Link>
            <div className="w-px h-4 bg-gray-600"></div>
            <Link
              href="/legal/privacy-policy"
              className="text-gray-400 hover:text-white transition-colors duration-200 underline decoration-gray-600 hover:decoration-white"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Donation({ isDonationOpened }: { isDonationOpened: boolean }) {
  // All address are of Manas
  const donationLinks: donationType[] = [
    {
      name: "Buy me a coffee",
      icon: SiBuymeacoffee,
      address: "https://buymeacoffee.com/scienmanas",
    },
    {
      name: "Bitcoin",
      icon: FaBitcoin,
      address:
        "https://btcscan.org/address/bc1qwcahm8aq9uqg5zthnvnkvl0vxkm3wku90hs4j4",
    },
    {
      name: "Ethereum",
      icon: FaEthereum,
      address:
        "https://etherscan.io/address/0x54da97548d91f8A157634C3a60f82831cD913A9c",
    },
    {
      name: "Solana",
      icon: SiSolana,
      address:
        "https://solscan.io/account/E3FrcftDnb1FXDpRBA96ja7vQmWnQ8mTk85i7m85FmhD",
    },
  ];

  return (
    <motion.div
      animate={{
        opacity: isDonationOpened ? 1 : 0,
        y: isDonationOpened ? 0 : -10,
      }}
      className="donation-box-links absolute w-fit px-3 py-2 bg-neutral-700 flex flex-row gap-2 rounded-2xl border border-neutral-600 top-11 -left-3"
    >
      {donationLinks.map((link, index) => (
        <motion.div
          animate={{
            opacity: isDonationOpened ? 1 : 0,
            y: isDonationOpened ? 0 : -10,
          }}
          transition={{
            delay: index * 0.1,
            duration: 0.3,
            ease: "easeInOut",
          }}
          key={index}
          className="w-fit h-fit"
        >
          <Link href={link.address}>
            <link.icon className="text-xl text-white" />
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
