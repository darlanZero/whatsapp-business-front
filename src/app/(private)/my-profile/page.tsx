"use client";

import Form from "@/components/view-data/Form";
import UserDataView from "@/components/view-data/UserDataView";
import { useRouter } from "next/navigation";

const Index = () => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center overflow-hidden py-6">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-sm">
        <Form
          onEdit={() => router.push("/update-profile")}
          editLabel="Editar Perfil"
        >
          <UserDataView />
        </Form>
      </div>
    </div>
  );
};

export default Index;
