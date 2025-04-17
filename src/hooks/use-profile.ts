import { IUser } from "@/interfaces/IUser";
import { api } from "@/utils/api";



export const fetchUserProfile = async () : Promise<IUser | null> => {
    try {
        const { data } = await api.get<IUser>(`/user-profile/i`);
        return data;
    } catch  {
        console.error( "Failet to fetch user profile data");
        return null;
    }
}

