"use client";

import { useEffect, useRef } from "react";
import QrScanner from "qr-scanner";
import Image from "next/image";
import { toast } from "react-toastify";

interface QRCodeDecoderProps {
  base64: string;
}

export function QRCodeDecoder({ base64 }: QRCodeDecoderProps) {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    img.src = base64;

    const handleImageLoad = async () => {
      try {
        await QrScanner.scanImage(img);
      } catch {
        console.log("error");
      }
    };

    img.onload = handleImageLoad;
    img.onerror = () => {
      toast("Houve um erro ao tentar gerar um QR code")
    };

    return () => {
      img.onload = null;
    };
  }, [base64]);

  return (
    base64 && (
      <div className="w-full min-h-[20rem] relative">
        <Image
          ref={imgRef}
          alt="QR Code"
          fill
          style={{ objectFit: "contain" }}
          src={base64}
        />
      </div>
    )
  );
}
