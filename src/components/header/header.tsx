'use client'

import Link from "next/link";
import Image from 'next/image'
import { Button } from '@/components/lilcoms';
import { useState } from 'react';
import { InputForm } from '@/components/form';
import { createUser } from "./actions";

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
    }
];

function Header()
{
    const [isOpened, setIsOpened] = useState(false);

    function openModal()
    {
        setIsOpened(true);
        document.body.style.overflow = "hidden";
    }

    function closeModal()
    {
        setIsOpened(false)
        document.body.style.overflow = "scroll";
    }

    const modal = 
        <div className = "fixed top-0 w-[100vw] h-[100vh] flex justify-center items-center bg-[#00000080] z-10">
            <div className = "bg-white rounded-xl p-4 relative">
                <form action = {createUser} className = "flex flex-col gap-4 items-center">
                    <InputForm name = "name" text = "Имя" type = "text" placeText = "Олег" w = ""/>
                    <InputForm name = "phone" text = "Номер телефона" type = "text" placeText = "8 800 555 35 35" w = ""/>
                    <input className = "px-10 flex items-center transition duration-150 border border-Blue py-2.5 font-Light bg-Blue rounded-md text-white hover:bg-white hover:text-black " type = "submit"/>
                </form>
                <p onClick = {closeModal} className = "cursor-pointer absolute top-0 right-4">x</p>
            </div>
        </div>
    
    return(
        <>
        <header className = "border-b border-Trans20 px-16 py-3 bg-white">
            <div className='flex justify-between items-center container mx-auto'>
                <Link href = "/">
                    <div className = "flex items-center gap-1.5">
                        <div className = "w-8">
                            <Image width={39} height={44} src = "/media/header/logo.svg" alt = ""/>
                        </div>
                        <p className = "font-Black text-4xl text-Blue">DENTIQUE</p>
                    </div>
                </Link>
                <nav className = "flex gap-16">
                    {links.map((elem, i) => { return <LinkCustomized text = {elem.text} url = {elem.url} key = {i}/>})}
                </nav>
                <div onClick = {openModal}>
                    <Button text = "Запись" font = "Bold" isBlue = {true} arrow = "" link = "" hoverArrow=""/>
                </div>
            </div>
        </header>
        {isOpened ? modal : ""}
        </>
    );
}

function LinkCustomized({text, url}:{text: string, url: string}) {
    return <div className = "font-Light transition duration-150 text-sm text-Gray hover:text-black"><Link href = {url}>{text}</Link></div>
}

export default Header;