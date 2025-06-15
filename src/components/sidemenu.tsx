"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function SideMenu() {
    const session = useSession();
    return (
        <>
            {session.data?.user.role === "ADMIN" ? (
                <div className="flex flex-col gap-4 font-Bold text-black text-xl pr-20 border-Gray border-r-2">
                    <Link href="/cabinet/main">Главная</Link>
                    <p>Управление записями</p>
                    <Link href="/cabinet/createDoctor">Управление врачами</Link>
                    <Link href="/cabinet/createServise">
                        Управление услугами
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col gap-4 font-Bold text-black text-xl pr-20 border-Gray border-r-2">
                    <Link href="/cabinet/main">Главная</Link>
                    <p>Ваши записи</p>
                    <p>Ваши данные</p>
                </div>
            )}
        </>
    );
}
