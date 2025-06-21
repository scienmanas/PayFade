import Image from "next/image";
import logoImg from "@/public/assets/logo/logo.png";
import Link from "next/link";
import BMCsvg from "@/public/assets/donation/bmc.svg";
import { FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { firaSansFont } from "@/app/lib/fonts";
import { FaSortDown } from "react-icons/fa";
import noProfilePic from "@/public/assets/misc/noProfilePic.png";

export function Navbar({
  name,
  email,
  profilePic,
}: {
  name: string;
  email: string;
  profilePic: string | null;
}) {
  const componentLink = {
    github: "https://github.com/scienmanas/PayFade",
    bmc: "https://www.buymeacoffee.com/scienmanas",
  };

  console.log(profilePic);

  return (
    <nav className="w-full fixed top-0 z-20 h-fit flex items-center justify-center bg-white border  border-neutral-200 backdrop-blur-xl">
      <div className="wrapper w-full max-w-screen-xl h-fit p-2 flex flex-row items-center justify-between gap-4 flex-wrap">
        <div className="logo w-fit h-fit flex flex-row font-bold items-center">
          <Link href="/" className="w-fit h-fit">
            <Image src={logoImg} alt="img" height={40} className="rounded-lg" />
          </Link>
        </div>
        <div className="options flex flex-row gap-3 items-center">
          <Link href={componentLink.github}>
            <FaGithub className="text-2xl" />
          </Link>
          <Link href={componentLink.bmc}>
            <Image height={35} src={BMCsvg} alt="donate" />
          </Link>
          <AccountDetails name={name} email={email} profilePic={profilePic} />
        </div>
      </div>
    </nav>
  );
}

export function AccountDetails({
  name,
  email,
  profilePic,
}: {
  name: string;
  email: string;
  profilePic: string | null;
}) {
  // State and refs for managing the modal and logout state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoggingout, setIsLoggingout] = useState<boolean>(false);
  const accountDetailsContainerRef = useRef<HTMLDivElement>(null);

  // Effect to handle outside clicks to close the modal
  useEffect(() => {
    if (!isModalOpen) return;
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        accountDetailsContainerRef.current &&
        !accountDetailsContainerRef.current.contains(event.target as Node)
      )
        setIsModalOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }),
    [isModalOpen];

  return (
    <div
      ref={accountDetailsContainerRef}
      className="account-details w-fit h-fit relative flex items-center justify-center group"
    >
      <Image
        draggable={false}
        onClick={() => setIsModalOpen((prev) => !prev)}
        src={profilePic ? profilePic : noProfilePic}
        alt="user_pic"
        width={35}
        height={35}
        className="rounded-lg cursor-pointer"
      />
      <motion.div
        initial={{
          opacity: 0,
          scale: 0,
        }}
        animate={{
          opacity: isModalOpen ? 1 : 0,
          scale: isModalOpen ? 1 : 0,
        }}
        transition={{
          duration: 0.3,
          ease: "circInOut",
        }}
        className={`profile-user ${firaSansFont.className} absolute right-0 -bottom-[100px] mt-2 w-36 bg-neutral-100 border border-[#e9e4e4] rounded-md shadow-lg p-2 flex flex-col gap-1`}
      >
        <FaSortDown className="w-fit h-fit text-neutral-100 absolute -top-2 right-2 text-xl rotate-180 " />
        <div className="text-sm truncate">
          <span className="text-black font-semibold">Name</span>:{" "}
          <span className="text-blue-700 font-semibold">{name}</span>
        </div>
        <div className="text-sm truncate">
          <span className="text-black font-semibold">Email</span>:{" "}
          <span className="text-blue-700 font-semibold">{email}</span>
        </div>
        <button
          disabled={isLoggingout}
          onClick={async () => {
            setIsLoggingout(true);
            const response = await fetch("/api/auth/logout", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
            });

            if (response.status === 200) window.location.href = "/";
            else setIsLoggingout(false);
          }}
          className={`px-[10px] py-[6px] text-xs rounded-lg bg-[#1e40af] text-white font-semibold h-fit ${
            isLoggingout ? "cursor-not-allowed opacity-60" : "cursor-pointer"
          }`}
        >
          {isLoggingout ? "Logging out..." : "Logout"}
        </button>
      </motion.div>
    </div>
  );
}
