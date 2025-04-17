"use client";

import { ModalLayout } from "@/components/modal-layout";
import React from "react";
import { EditUserModal } from "./edit-user";

interface LayoutUsersProps {
  children: React.ReactNode;
}

const MODALS = {
  "edit-user": EditUserModal,
  "crete-user": EditUserModal,
};

export default function LayoutUsers({ children }: LayoutUsersProps) {
  return <ModalLayout modals={MODALS}>{children}</ModalLayout>;
}
