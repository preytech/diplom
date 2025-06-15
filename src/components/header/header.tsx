"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/lilcoms";
import { use, useState } from "react";
import { InputForm } from "@/components/form";
import { createUser } from "./actions";
import Form from "next/form";
import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const links = [
    {
        text: "Услуги",
        url: "/servises",
    },
    {
        text: "Врачи",
        url: "/doctors",
    },
    {
        text: "О нас",
        url: "/about",
    },
];

function Header() {
    const [isOpened, setIsOpened] = useState(false);
    const [isReg, setIsReg] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const session = useSession();

    function openModal() {
        setIsOpened(true);
        document.body.style.overflow = "hidden";
    }

    function closeModal() {
        setIsOpened(false);
        document.body.style.overflow = "scroll";
    }

    function reg(formData: FormData) {
        if (isReg) {
            createUser(formData);
            setIsReg(false);
        } else {
            onSignInHandler(formData);
        }
    }

    function exit() {
        return session.status == "authenticated"
            ? onLogOutHandler()
            : openModal();
    }

    const onSignInHandler = async (formData: FormData) => {
        const result = await signIn("credentials", {
            phone: formData.get("phone"),
            password: formData.get("password"),
            redirect: false,
        });

        if (result?.error) {
            setError("Логин или пароль введён неправильно");
        } else {
            router.push("/");
            router.refresh();
            closeModal();
        }
    };

    const onLogOutHandler = async () => {
        await signOut({ redirect: false });
        window.location.href = "/";
    };

    const Modal = () => {
        return (
            <div className="fixed top-0 w-[100vw] h-[100vh] flex justify-center items-center bg-[#00000080] z-30">
                <div className="bg-white rounded-xl p-4 relative">
                    <Form
                        action={reg}
                        className="flex flex-col gap-4 items-center"
                    >
                        {isReg ? (
                            <InputForm
                                name="name"
                                text="Имя"
                                type="text"
                                placeText="Олег"
                                w=""
                            />
                        ) : (
                            ""
                        )}
                        <InputForm
                            name="phone"
                            text="Номер телефона"
                            type="text"
                            placeText="8 800 555 35 35"
                            w=""
                        />
                        <InputForm
                            name="password"
                            text="Пароль"
                            type="password"
                            placeText=""
                            w=""
                        />
                        {isReg ? (
                            <p
                                className="flex font-Light cursor-pointer text-black text-sm pb-2.5"
                                onClick={() => setIsReg(false)}
                            >
                                Войти.
                            </p>
                        ) : (
                            <p className="flex font-Light text-Gray3 text-sm pb-2.5">
                                У вас нет аккаунта? &nbsp;{" "}
                                <span
                                    onClick={() => setIsReg(true)}
                                    className="text-black cursor-pointer"
                                >
                                    Зарегистрируйтесь.
                                </span>
                            </p>
                        )}
                        {error ? (
                            <div className="font-Bold text-red-600 text-sm">
                                {error}
                            </div>
                        ) : (
                            ""
                        )}
                        <input
                            value={isReg ? "Зарегистрироваться" : "Войти"}
                            className="px-10 flex items-center transition duration-150 rounded-md border-Blue border py-2.5 font-Bold bg-Blue  text-white  hover:border hover:bg-BgWhite hover:text-black"
                            type="submit"
                        />
                    </Form>
                    <p
                        onClick={closeModal}
                        className="cursor-pointer absolute top-0 right-4"
                    >
                        x
                    </p>
                </div>
            </div>
        );
    };

    return (
        <>
            <header className="border-b border-Trans20 px-16 py-3 bg-white">
                <div className="flex justify-between items-center container mx-auto">
                    <Link href="/">
                        <div className="flex items-center gap-1.5">
                            <div className="w-8">
                                <Image
                                    width={39}
                                    height={44}
                                    src="/media/header/logo.svg"
                                    alt=""
                                />
                            </div>
                            <p className="font-Black text-4xl text-Blue">
                                DENTIQUE
                            </p>
                        </div>
                    </Link>
                    <nav className="flex gap-16">
                        {links.map((elem, i) => {
                            return (
                                <LinkCustomized
                                    text={elem.text}
                                    url={elem.url}
                                    key={i}
                                />
                            );
                        })}
                    </nav>
                    <div className="flex gap-4">
                        <Button
                            text={
                                session.status == "authenticated"
                                    ? "Выйти"
                                    : "Войти"
                            }
                            font="Bold"
                            isBlue={true}
                            link=""
                            hoverArrow=""
                            smth={exit}
                        />
                        {session.status == "authenticated" ? (
                            <Button
                                text="Личный кабинет"
                                font="Bold"
                                isBlue={true}
                                link="/cabinet/main"
                                hoverArrow=""
                            />
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            </header>
            {isOpened ? <Modal /> : ""}
        </>
    );
}

function LinkCustomized({ text, url }: { text: string; url: string }) {
    return (
        <div className="font-Light transition duration-150 text-sm text-Gray hover:text-black">
            <Link href={url}>{text}</Link>
        </div>
    );
}

export default function HeaderWrapper() {
    return (
        <SessionProvider>
            <Header />
        </SessionProvider>
    );
}
