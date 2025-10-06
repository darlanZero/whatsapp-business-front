'use client'

import { IApiSelection, IApiSelectionConfig } from "@/interfaces/IApiSelection"
import { API_TYPE_KEY } from "@/utils/cookies-keys";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useState } from "react";

const apiOptions: IApiSelectionConfig[] = [
    {
        type: 'meta',
        name: 'Meta Whatsapp Business API',
        description: 'API oficial do Whatsapp para empresas, integrada através do nosso backend.'
    },
    {
        type: 'evolution',
        name: 'Evolution API',
        description: 'API de terceiros que oferece funcionalidades adicionais e flexibilidade.'
    }
]

const SelectApiPage = () => {
    const [selectedApi, setSelectedApi] = useState<IApiSelection | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const handleApiSelection = (apiType: IApiSelection) => {
        setIsLoading(true);
        try {
            Cookies.set(API_TYPE_KEY, apiType, { expires: 30 });

            if (apiType === 'evolution') {
                router.push('/session-whatsapp');
            } else {
                router.push('/dashboard');
            }
        } catch (error) {
            console.error('Erro ao selecionar a API:', error);
        } finally {
            setIsLoading(false);
        }
    }
  return (
    <div
        className="min-h-screen flex items-center justify-center bg-gray-50"
    >
        <div
            
        >

        </div>
    </div>
  )
}

export default SelectApiPage