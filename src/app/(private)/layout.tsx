"use client";

import { Navbar } from "@/components/private-components/nav-bar";
import { Sidebar } from "@/components/private-components/private-sidebar";
import { UserProvider } from "@/providers/user-provider";
import { Provider } from "jotai";
import { Suspense } from "react";

interface LayoutPrivateProps {
  children: React.ReactNode;
}

export default function LayoutPrivate({ children }: LayoutPrivateProps) {
  return (
    <UserProvider>
      <Provider>
        <div className="bg-gray-50 flex h-screen">
          <Sidebar />
          <section className="flex w-full p-2 flex-col flex-1 overflow-auto h-screen">
            <Suspense fallback={<>loading</>}>
              <Navbar />
              {children}
            </Suspense>
          </section>
        </div>
      </Provider>
    </UserProvider>
  );
}
