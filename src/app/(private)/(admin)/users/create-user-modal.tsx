"use client";

import { CreateUserModal } from "@/components/admin/CreateUser";
import { Modal } from "@/components/modal-base";

export const CreateUser = () => {
  return (
    <Modal.container className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 p-4">
        <Modal.header
          title="Criar novo usuário"
          className="text-lg font-semibold text-gray-800"
        />
        <CreateUserModal />
    </Modal.container>
  );
};
