"use client";

import { ModalLayout } from "@/components/modal-layout";
import { ModalDelete } from "./delete";
import { GenerateQrCode } from "./generate-code";
import { CreateWhatsapp } from "./create";
import { Disconnect } from "./disconnect";

interface WhatsappLayoutProps {
  children: React.ReactNode;
}

const modals = {
  delete: ModalDelete,
  qr: GenerateQrCode,
  create: CreateWhatsapp,
  disconnect: Disconnect,
};

export default function WhatsappLayout({ children }: WhatsappLayoutProps) {
  return <ModalLayout modals={modals}>{children}</ModalLayout>;
}
