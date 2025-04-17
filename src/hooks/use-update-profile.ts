import { User } from "@/schemas/user-schema";
import { api } from "@/utils/api";



export const updateUser = async (id: number, data: User) : Promise<User | null> => {
    try {
        const { data: user } = await api.put<User>(`/users/${id}`, data);
        return user;
    } catch(error)  {
        console.error(error, "Failet to fetch user profile data");
        return null;
    }
}
