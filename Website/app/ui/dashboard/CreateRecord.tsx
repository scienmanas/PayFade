"use client";

import { firaSansFont } from "@/app/lib/fonts";
import { IoCreateOutline } from "react-icons/io5";
import { useState } from "react";
import { motion } from "framer-motion";

export function CreateRecord() {
  // States
  const [showForm, setShowForm] = useState<boolean>(false);

  return (
    <section
      className={`create-record relative w-full h-fit flex flex-col gap-6 ${firaSansFont.className}`}
    >
      <div className="heading-description-stuff w-fit h-fit flex flex-col gap-2 relative">
        <h2 className="heading w-fit h-fit text-xl sm:text-2xl font-bold">
          Create a Record
        </h2>
        <p className="description w-fit h-fit">
          Hey Buddy :), you finally ready to begin? Let your work be rewarded,
          let you be rewarded, you deserve it buddy. We are like your bros who
          will help you to get your ex back, yeah but here ex refers to your
          work. Sorry for bad jokes :)
        </p>
      </div>
      <button
        type="button"
        className="w-fit h-fit bg-[#2e2a54] text-neutral-100 font-bold px-4 py-2 rounded-md hover:bg-[#3c376b] transition-colors duration-200 flex flex-row items-center gap-1"
      >
        <IoCreateOutline className="" />
        <span className="text-neutral-100">Create</span>
      </button>
    </section>
  );
}

function CreateRecordForm() {
  return <div className="create-record-form"></div>;
}
