"use client";

import { ModalLayout } from "@/components/modal-layout";
import React from "react";
import { EditUserModal } from "./edit-user";
import { WhatsDetails } from "./whats-details";

interface LayoutUsersProps {
  children: React.ReactNode;
}

const MODALS = {
  ["edit-user"]: EditUserModal,
  ["crete-user"]: EditUserModal,
  ["whats"]: WhatsDetails,
};

export default function LayoutUsers({ children }: LayoutUsersProps) {
  return <ModalLayout modals={MODALS}>{children}</ModalLayout>;
}
