import React from "react";
import Image from "next/image";

const MascotRecovery = () => {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <div className="relative">
        <Image
          src="/mascot-recovery.png"
          alt=""
          width={500}
          height={500}
          className="h-auto max-h-[500px] object-contain animate-float"
        />
      </div>
    </div>
  );
};

export default MascotRecovery;
