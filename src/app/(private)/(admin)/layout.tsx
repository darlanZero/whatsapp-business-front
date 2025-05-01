import { JWT_DECODED_DATA } from "@/interfaces/jwt-decoded-data";
import { UserRole } from "@/interfaces/user-role";
import { TOKEN_KEY } from "@/utils/cookies-keys";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface LayoutAdminProps {
  children: React.ReactNode;
}

export default async function LayoutAdmin({ children }: LayoutAdminProps) {
  const allCookies = await cookies();

  const token = allCookies.get(TOKEN_KEY)?.value;
  if (!token) throw new Error("Sessão inválida");

  const decoded = jwtDecode<JWT_DECODED_DATA>(token);
  if (decoded.role !== UserRole.ADMIN) {
    redirect("/dashboard");
  }

  return children;
}
