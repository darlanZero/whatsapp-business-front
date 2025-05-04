"use client";

import Cookies from "js-cookie";
import { LogOut } from "lucide-react";
import { ModalOptions } from "../modal-options";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useRef } from "react";
import { useClickOutside } from "@/hooks/use-click-outside";
import { FaUser } from "react-icons/fa";
import { queryClient } from "@/providers/query-provider";
import { TOKEN_KEY } from "@/utils/cookies-keys";

interface NavBarUserConfigOptionProps {
  close: () => void;
}

const LogoutToast = () => (
  <div className="text-indigo-200">Logout realizado</div>
);

export const NavbarUserConfigOption = (props: NavBarUserConfigOptionProps) => {
  const { close } = props;
  const ref = useRef<HTMLDivElement>(null);

  const router = useRouter();

  useClickOutside(ref, close);

  const logout = async () => {
    const cookies = Cookies.get();
    Object.keys(cookies)?.forEach((cookieName) => {
      Cookies.remove(cookieName, { path: "/" });
    });

    queryClient.clear();

    toast(<LogoutToast />, {
      hideProgressBar: true,
    });

    window.location.href = '/login';
  };

  return (
    <ModalOptions.container ref={ref}>
      <ModalOptions.button onClick={logout} name="logout">
        <LogOut size={14} />
      </ModalOptions.button>
      <ModalOptions.button
        onClick={() => router.push("/my-profile")}
        name="Perfil"
      >
        <FaUser size={14} />
      </ModalOptions.button>
    </ModalOptions.container>
  );
};
