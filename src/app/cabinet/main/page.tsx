"use client";
import { useSession } from "next-auth/react";

export default function CabinetMain() {
    const session = useSession();

    return (
        <div>
            <p className="font-Bold text-black text-xl">
                Добро пожаловать, {session.data?.user.name}!
            </p>
            <div className="py-80"></div>
        </div>
    );
}
