"use client";

import { Navbar } from "@/components/private-components/nav-bar";
import { Sidebar } from "@/components/private-components/private-sidebar";
import { UserProvider } from "@/providers/user-provider";
import { Suspense } from "react";

interface LayoutPrivateProps {
  children: React.ReactNode;
}

export default function LayoutPrivate({ children }: LayoutPrivateProps) {
  return (
    <UserProvider>
      <div className="bg-gray-50 flex h-screen">
        <Sidebar />
        <section className="flex w-full flex-col flex-1 overflow-auto h-screen">
          <div className="p-6 flex flex-col">
            <Suspense fallback={<>loading</>}>
              <Navbar />
              {children}
            </Suspense>
          </div>
        </section>
      </div>
    </UserProvider>
  );
}
