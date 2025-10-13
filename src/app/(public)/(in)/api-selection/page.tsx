'use client'

import { UserContext } from "@/contexts/user-context";
import { IApiSelection, IApiSelectionConfig } from "@/interfaces/IApiSelection"
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";

const apiOptions: IApiSelectionConfig[] = [
    {
        type: 'meta',
        name: 'Meta WhatsApp Business API',
        description: 'API oficial do WhatsApp para empresas. Você será redirecionado para fazer login através da Meta.'
    },
    {
        type: 'evolution',
        name: 'Evolution API',
        description: 'API de terceiros com funcionalidades adicionais. Faça login com suas credenciais.'
    }
]

const SelectApiPage = () => {
    const [selectedApi, setSelectedApi] = useState<IApiSelection | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { setApiType } = useContext(UserContext);
    const router = useRouter();

    const handleApiSelection = async (apiType: IApiSelection) => {
        setIsLoading(true);
        try {
            // Salvar no contexto e nos cookies
            setApiType(apiType);

            // Redirecionar para a página de login apropriada
            if (apiType === 'evolution') {
                router.push('/login');
            } else {
                // Para Meta, redirecionar para a página que iniciará o fluxo de login da Meta
                router.push('/login'); // Você pode criar uma página específica para Meta
            }
        } catch (error) {
            console.error('Erro ao selecionar a API:', error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-6">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Escolha a API do WhatsApp
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Selecione qual API você deseja utilizar antes de fazer login
                    </p>
                </div>

                <div className="space-y-4">
                    {apiOptions.map((option) => (
                        <div
                            key={option.type}
                            className={`relative rounded-lg border p-4 cursor-pointer transition-all ${
                                selectedApi === option.type
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-300 hover:border-gray-400'
                            }`}
                            onClick={() => setSelectedApi(option.type)}
                        >
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <input 
                                        type="radio"
                                        name="api-type"
                                        checked={selectedApi === option.type}
                                        onChange={() => setSelectedApi(option.type)}
                                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-gray-900">
                                        {option.name}
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-600">
                                        {option.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div>
                    <button
                        onClick={() => selectedApi && handleApiSelection(selectedApi)}
                        disabled={!selectedApi || isLoading}
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium
                            rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2
                            focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Configurando...' : 'Continuar para Login'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SelectApiPage