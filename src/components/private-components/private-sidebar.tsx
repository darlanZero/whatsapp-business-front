"use client";

import { Button } from "@/components/ui/button";
import { UserContext } from "@/contexts/user-context";
import { UserRole } from "@/interfaces/user-role";
import { Home, MessageCircle } from "lucide-react";
import { useContext, useState } from "react";
import { TbBrandCampaignmonitor } from "react-icons/tb";
import { Menu } from "../menu-section";
import { AdminPages } from "./admin-pages";
import { ConfigurationPage } from "./configuration-pages";
import { SaveContacts } from "./save-contacts";
import { SidebarSkeleton } from "./sidebar-skeleton";
import { usePathname, useRouter } from "next/navigation";

const HeaderSidebar = () => (
  <div className="p-4">
    <div className="flex items-center gap-3">
      <div className="bg-blue-600 text-white p-2 rounded-md">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 4L4 8L12 12L20 8L12 4Z" fill="currentColor" />
          <path d="M4 12L12 16L20 12" fill="currentColor" />
          <path d="M4 16L12 20L20 16" fill="currentColor" />
        </svg>
      </div>
      <h1 className="text-xl text-black font-bold">Salva Zap!</h1>
    </div>
  </div>
);

const SidebarButtons = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
      <Menu.Container>
        <Menu.Trigger
          selected={pathname.startsWith("/dashboard")}
          onPress={() => router.push("/dashboard")}
          isTri={false}
          icon={Home}
          label="Dashboard"
        />
      </Menu.Container>

      <SaveContacts />

      <Menu.Container>
        <Menu.Trigger icon={TbBrandCampaignmonitor} label="Configurar Camp." />
      </Menu.Container>

      <Menu.Container>
        <Menu.Trigger icon={MessageCircle} label="Chatbot" />
      </Menu.Container>

      <ConfigurationPage />
    </>
  );
};

const PremiumSection = () => (
  <div className="p-4 mt-auto">
    <div className="bg-blue-600 rounded-lg p-4 text-white font-bold">
      <div className="mb-4 text-center">
        <h3 className="text-xl font-medium">Adquira o Premium</h3>
        <p className="text-sm">Pacote completo</p>
      </div>
      <Button
        variant="outline"
        className="w-full bg-white text-blue-600 hover:bg-gray-100"
      >
        Quero Adquirir
      </Button>
    </div>
  </div>
);

const SidebarComponent = () => {
  const { informations } = useContext(UserContext);

  if (!informations) {
    return (
      <div className="p-2 px-4 flex-1 flex-col gap-2 flex">
        <SidebarSkeleton />
        <SidebarSkeleton />
        <SidebarSkeleton />
        <SidebarSkeleton />
        <SidebarSkeleton />
      </div>
    );
  }

  return (
    <div className="flex-1 flex-col flex px-3 gap-2 w-full">
      <SidebarButtons />
      {informations?.role === UserRole.ADMIN && <AdminPages />}
      <PremiumSection />
    </div>
  );
};

export const Sidebar = () => {
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const toggleMobileSidebar = () => setMobileSidebarOpen(!isMobileSidebarOpen);

  return (
    <>
      <div className="md:hidden p-4">
        <Button
          variant="default"
          onClick={toggleMobileSidebar}
          className="bg-transparent text-black"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={
                isMobileSidebarOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </Button>
      </div>

      <div
        className={`md:hidden fixed inset-0 z-50 bg-white border-r border-gray-200 flex flex-col h-screen overflow-auto transition-transform duration-300 ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 flex justify-between items-center">
          <HeaderSidebar />
          <Button
            variant="default"
            onClick={toggleMobileSidebar}
            className="bg-transparent text-black"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Button>
        </div>
        <SidebarComponent />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex bottom-0 w-auto max-w-[20rem]  bg-white border-r border-gray-200 flex-col h-screen overflow-auto">
        <HeaderSidebar />
        <SidebarComponent />
      </div>
    </>
  );
};
