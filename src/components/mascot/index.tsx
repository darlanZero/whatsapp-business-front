"use client";

import React from "react";
import Image from "next/image";

const Mascot = () => {
  return (
    <div className="w-[23rem] h-[40rem] overflow-visible relative">
      <Image
        src="/mascotregister.png"
        alt="mascotregister"
        className="z-20"
        fill
        style={{ objectFit: "cover" }}
      />

      <div className="flex w-[12rem] h-[2rem] bg-black rounded-full blur-xl absolute bottom-20 right-5" />
    </div>
  );
};

export default Mascot;
