"use client";
import { ReactNode } from "react";
import SideMenu from "@/components/sidemenu";
import { SessionProvider } from "next-auth/react";

export default function CabinetLayout({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            <div className="bg-[#F9F9FA]">
                <div className="container mx-auto">
                    <div className="flex gap-10 py-20">
                        <SideMenu />
                        {children}
                    </div>
                </div>
            </div>
        </SessionProvider>
    );
}
