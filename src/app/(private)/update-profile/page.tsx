import UpdateUserForm from "@/components/update-user/UpdateUserForm";
import { fontSaira } from "@/utils/fonts";

const Index = () => {
  return (
    <div className="bg-gradient-to-br from-white to-indigo-50 flex items-center justify-center overflow-auto py-6">
      <div className="w-full max-w-4xl px-4">
        <div className="mb-6 text-center">
          <h1 className={`${fontSaira} flex justify-start text-gray-700 font-bold text-2xl`}>Editar Informações</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
            <UpdateUserForm />
        </div>
      </div>
    </div>
  );
};

export default Index;
