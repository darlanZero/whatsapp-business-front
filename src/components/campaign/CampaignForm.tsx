"use client"

import {InputField} from "./InputField";
import { DateTimeForm } from "./DateTimeForm";
import { ImageUploader } from "./ImageUploader";
import MessageTextarea from "./MessageTextarea";
import { FormActions } from "./FormActions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fontInter, fontSaira } from "@/utils/fonts";
import { toast } from "react-toastify";

const listOptions = [
  //TODO: Realizar chamada para buscar as listas de contato e exibir aqui
  { label: "Selecione a lista", value: "" },
  { label: "Leads - Março", value: "leads-mar" },
  { label: "Clientes Ativos", value: "clientes-ativos" },
];

const CampaignForm: React.FC = () => {
  const queryClient = useQueryClient();

  // Mutação para criar a campanha
  const { mutate: createCampaign, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      // Simulação - substitua por sua chamada API real
      return new Promise((resolve) => {
        setTimeout(() => resolve(formData), 1500);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success("Campanha criada com sucesso");
      //TODO: Redirecionar para o painel de campanhas ou dashboard
    },
    onError: (error) => {
      console.error("Erro ao criar campanha:", error);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    createCampaign(formData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
      <form
        className="bg-white w-full max-w-screen-lg mx-auto p-4 sm:p-6 md:p-8 lg:p-10 rounded-xl shadow-lg flex flex-col gap-6"
        aria-label="Formulário de criação de campanha"
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <header>
          <h2 className={`${fontSaira} text-xl sm:text-2xl font-bold text-indigo-700 mb-2`}>
            Nova Campanha
          </h2>
        </header>
  
        <div className={`${fontInter} grid grid-cols-1 md:grid-cols-2 gap-4`}>
          <InputField
            label="Nome da Campanha"
            placeholder="Digite o nome da campanha"
            ariaLabel="Nome da Campanha"
            name="campaignName"
          />
          <InputField
            label="Lista de Contatos"
            as="select"
            options={listOptions}
            ariaLabel="Lista de Contatos"
            name="list"
          />
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <DateTimeForm />
          <div className="flex flex-col w-full">
            <label htmlFor="recurrence" className={`${fontInter} mb-1 text-sm font-medium text-gray-800`}>
              Recorrência
            </label>
            <select
              id="recurrence"
              name="recurrence"
              disabled={isPending}
              className={`${fontInter} p-2 border border-gray-300 rounded-md bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50`}
              aria-label="Recorrência"
            >
              <option value="uma-vez">Uma vez</option>
              <option value="diariamente">Diariamente</option>
              <option value="semanalmente">Semanalmente</option>
              <option value="mensalmente">Mensalmente</option>
            </select>
          </div>
        </div>
  
        <div className="w-full">
          <ImageUploader setFile={() => {}} />
        </div>
  
        <div className="w-full">
          <MessageTextarea  />
        </div>
  
        <div className="w-full flex justify-end">
          <FormActions  />
        </div>
      </form>
    </div>
  );
};

export  {CampaignForm};