"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function SideMenu() {
    const session = useSession();
    return (
        <>
            {session.data?.user.role === "ADMIN" ? (
                <div className="flex flex-col gap-4 font-Bold text-black text-xl pr-20 w-48 border-Gray border-r-2 pb-40">
                    <Link href="/cabinet/main">Главная</Link>
                    <Link href="/cabinet/createOrder">Управление записями</Link>
                    <Link href="/cabinet/createDoctor">Управление врачами</Link>
                    <Link href="/cabinet/createServise">
                        Управление услугами
                    </Link>
                    <Link href="/cabinet/changeReview">
                        Управление коментариями
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col gap-4 font-Bold text-black text-xl pr-20 border-Gray border-r-2 pb-80">
                    <Link href="/cabinet/main">Главная</Link>
                    <Link href="/cabinet/order">Ваши записи</Link>
                    <Link href="/cabinet/archive">Архив записей</Link>
                </div>
            )}
        </>
    );
}
