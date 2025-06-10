"use client";

import { SessionProvider, useSession } from "next-auth/react";
import Link from "next/link";

function Cabinet() {
    const session = useSession();

    return (
        <div className="bg-[#F9F9FA]">
            <div className="container mx-auto">
                <div className="flex gap-10 py-20">
                    {session.data?.user.role === "ADMIN" ? (
                        <div className="flex flex-col gap-4 font-Bold text-black text-xl pr-20 border-Gray border-r-2">
                            <p>Управление записями</p>
                            <p>Добавление врачей</p>
                            <p>Добавление услуг</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4 font-Bold text-black text-xl pr-20 border-Gray border-r-2">
                            <p>Ваши записи</p>
                            <p>Ваши данные</p>
                        </div>
                    )}

                    <div>
                        <p className="font-Bold text-black text-xl">
                            Добро пожаловать, {session.data?.user.name}
                        </p>
                        <div className="py-80"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CabinetWhrapper() {
    return (
        <SessionProvider>
            <Cabinet />
        </SessionProvider>
    );
}
