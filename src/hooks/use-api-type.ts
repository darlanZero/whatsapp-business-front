import { IApiSelection } from "@/interfaces/IApiSelection";
import { API_TYPE_KEY } from "@/utils/cookies-keys";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export const useApiType = () => {
    const [apiType, setApiType] = useState<IApiSelection | null>(null);

    useEffect(() => {
        const savedApiType = Cookies.get(API_TYPE_KEY) as IApiSelection;
        if (savedApiType) {
            setApiType(savedApiType);
        }
    }, [])

    const updateApiType = (newApiType: IApiSelection) => {
        Cookies.set(API_TYPE_KEY, newApiType, { expires: 30 });
        setApiType(newApiType);
    }

    const clearApiType = () => {
        Cookies.remove(API_TYPE_KEY);
        setApiType(null);
    }

    return { apiType, updateApiType, clearApiType, 
        isMeta: apiType === 'meta', isEvolution: apiType === 'evolution' };
}