import Image from "next/image";
//import logoImg from "@/public/logo/logo.png";
//import { firaSansFont } from "@/app/utils/fonts";
import Link from "next/link";
import BMCsvg from "@/public/assets/donation/bmc.svg";
import { FaGithub } from "react-icons/fa";
import { RiUserCommunityLine } from "react-icons/ri";
export function Navbar() {
  const donationLink = {
    community: "",
    github: "",
    bmc: "https://www.buymeacoffee.com/scienmanas",
  };

  return (
    <nav className="w-full fixed z-20 h-fit flex items-center justify-center bg-white border border-neutral-200">
      <div className="wrapper w-full max-w-screen-xl h-fit p-2 flex flex-row items-center justify-between gap-4 flex-wrap">
        <div className="logo w-fit h-fit flex flex-row font-bold items-center">
          {/* <Image src={logoImg} alt="img" height={50} /> */}
          <div>Did Client Pay</div>
        </div>
        <div className="options flex flex-row gap-3 items-center">
          <Link href={donationLink.community}>
            <RiUserCommunityLine />
          </Link>
          <Link href={donationLink.github}>
            <FaGithub/>
          </Link>
          <Link href={donationLink.bmc}>
            <Image height={35} src={BMCsvg} alt="donate" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
