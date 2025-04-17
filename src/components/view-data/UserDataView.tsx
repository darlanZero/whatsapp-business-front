"use client";

import { Card, CardContent } from "@/components/ui/card";
import { fetchUserProfile } from "@/hooks/use-profile";
import { fontInter, fontOpenSans, fontSaira } from '@/utils/fonts';
import { IUser } from '@/interfaces/IUser';
import { formatNumber } from '@/utils/format-number';
import formatCep from '@/utils/format-cep';
import { useQuery } from "@tanstack/react-query";


export default function UserDataView() {
  const { data, isLoading, error } = useQuery<IUser | null>({
    queryKey: ["users"],
    queryFn: async () => {
      return await fetchUserProfile();
    },
  });

  if (isLoading) {
    return <div className="text-center py-8">Carregando dados...</div>;
  }

  if (error || !data) {
    return (
      <div className="text-center py-8 text-red-500">
        Erro ao carregar dados do perfil
        <br />
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm bg-gray-50">
        <CardContent className="p-6">
          <h2
            className={`${fontSaira} text-xl font-medium text-indigo-700 mb-4`}
          >
            Informações Pessoais
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className={`${fontInter} text-sm font-medium text-indigo-500`}>Nome</p>
                <p className={`${fontInter} text-sm font-medium text-gray-900`}>{data.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-indigo-500">Email</p>
                <p className={`${fontInter} text-sm font-medium text-gray-900`}>{data.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-indigo-500">Celular</p>
                <p className={`${fontInter} text-sm font-medium text-gray-900`}>{formatNumber(data.phoneNumber)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm bg-gray-50">
        <CardContent className="p-6">
          <h2
            className={`${fontSaira} text-xl font-medium text-indigo-700 mb-4`}
          >
            Endereço
          </h2>
          <div className="space-y-4">
            <div>
              <p className={`${fontOpenSans} text-sm font-bold text-indigo-500`}>Rua</p>
              <p className={`${fontInter} text-sm font-medium text-gray-900`}>{data.address?.street ?? "Não informado"}</p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className={`${fontOpenSans} text-sm font-bold text-indigo-500`}>Cidade</p>
                <p className={`${fontInter} text-sm font-medium text-gray-900`}>{data.address?.city ?? "Não informado"}</p>
              </div>
              <div>
                <p className={`${fontOpenSans} text-sm font-bold text-indigo-500`}>Estado</p>
                <p className={`${fontInter} text-sm font-medium text-gray-900`}>{data.address?.state ?? "Não informado"}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className={`${fontOpenSans} text-sm font-bold text-indigo-500`}>Código Postal</p>
                <p className={`${fontInter} text-sm font-medium text-gray-900`}>{formatCep(data.address?.zipCode) ?? "Não informado"}</p>
              </div>
              <div>
                <p className={`${fontOpenSans} text-sm font-bold text-indigo-500`}>País</p>
                <p className={`${fontInter} text-sm font-medium text-gray-900`}>{data.address?.country ?? "Não informado"}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
