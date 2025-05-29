"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserContext } from "@/contexts/user-context";
import { UserRole } from "@/interfaces/user-role";
import { Bell, ChevronDown, MessageSquare } from "lucide-react";
import { useContext, useState } from "react";
import { ModalType } from "../modal-options";
import { NavbarUserConfigOption } from "../navbar-options-user/config-option";
import { NavBarNotificationOption } from "../navbar-options-user/notifications.option";
import { fontInter } from "@/utils/fonts";
import { IoLogoWhatsapp } from "react-icons/io5";
import { useRouter } from "next/navigation";

export const Navbar = () => {
  const { informations, whatsapp } = useContext(UserContext);
  const [modals, setModal] = useState<ModalType | null>(null);
  const router = useRouter();

  const handleModal = (name: ModalType) => {
    setModal(name);
  };

  return (
    <div className="flex items-center flex-wrap-reverse justify-between mb-6 text-gray-500 relative z-20">
      <div className="flex">
        <button
          type="button"
          onClick={() => router.push("/session-whatsapp")}
          className="p-2 bg-white border rounded-lg flex items-center gap-4 hover:bg-gray-100"
        >
          <IoLogoWhatsapp />
          <span>{whatsapp?.instanceName || "selecione um whatsapp"}</span>
        </button>
      </div>
      <div className="flex items-center gap-4 flex-wrap">
        <div className="">
          <button
            onClick={() => handleModal("notifications")}
            type="button"
            className="w-9 opacity-90 hover:opacity-100 h-9 bg-white border grid place-items-center rounded-full relative"
          >
            <Bell className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        <div className="relative">
          <button
            type="button"
            className="w-9 opacity-90 hover:opacity-100 h-9 bg-white border grid place-items-center rounded-full relative"
          >
            <MessageSquare className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        <button
          onClick={() => handleModal("config")}
          className="flex items-center gap-2 bg-white border px-2 p-1 rounded-md"
        >
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>FS</AvatarFallback>
          </Avatar>

          {informations?.email && (
            <div
              className={`${fontInter} text-gray-500 text-right flex flex-col text-sm -space-y-1`}
            >
              <span className="text-base">{informations?.name}</span>

              {informations?.role === UserRole.ADMIN && (
                <span className={`text-xs`}>{informations?.role}</span>
              )}
            </div>
          )}

          {!informations?.email && (
            <div className="text-right flex flex-col items-end gap-2 -space-y-1">
              <span className="font-medium w-28 h-4 rounded-lg animate-pulse bg-zinc-200"></span>
              <span className="text-sm w-16 bg-gray-200 animate-pulse h-4 rounded-full" />
            </div>
          )}

          <ChevronDown className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      {modals === "notifications" && (
        <NavBarNotificationOption close={() => setModal(null)} />
      )}

      {modals === "config" && (
        <NavbarUserConfigOption close={() => setModal(null)} />
      )}
    </div>
  );
};
