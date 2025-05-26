'use client'

import { useState } from "react";
import { CustomH } from "@/components/lilcoms";
import Link from "next/link";

const serviseData = [
    {
        name: "Консультация у стоматолога",
        categories: ""
    },
    {
        name: "Рентгендиагностика в стоматологии",
        categories: "Ортопантонограмма%Компьютерная 3D-томография%Телерентгенография (ТРГ)"
    },
    {
        name: "Лечение зубов",
        categories: "Лечение кариеса%Лечение каналов зуба с использованием микроскопа"
    },
    {
        name: "Микропротезирование зубов",
        categories: "Вкладки%Ультраниры%Виниры на зубы"
    },
    {
        name: "Детская стоматология",
        categories: "Консультация детского стоматолога%Профилактика кариеса у детей%Лечение молочных зубов%Герметизация фиссур%Лечение постоянных зубов у детей%Детская хирургия"
    },
    {
        name: "Отбеливание зубов",
        categories: "Отбеливание зубов ZOOM 4%Лазерное отбеливание зубов%Отбеливание Belle%Домашнее отбеливание зубов"
    },
    {
        name: "Лечение десен (заболеваний пародонта)",
        categories: "Диагностика заболеваний пародонта%Пародонтальная терапия%Лечение подвижных зубов%Фотодинамическая терапия%Озонотерапия%Терапия осложнений после имплантации%Базовая хирургическая пародонтология%Хирургическая пародонтология с элементами пластики%Восстановление эстетики десны"
    },
    {
        name: "Протезирование зубов",
        categories: "Протезирование на диоксиде циркония%Протезирование на благородных сплавах%Протезирование на металлокерамике%Протезирование на керамике (e.max)%Бюгельные протезы"
    },
    {
        name: "Хирургия и имплантация зубов",
        categories: "Имплантация зубов%Удаление зубов%Хирургическое лечение%Хирургическая подготовка к имплантации зубов"
    },
    {
        name: "Ортодонтия (исправление прикуса)",
        categories: "Эстетические брекет-системы%Металлические брекет-системы%Лингвальные брекет-системы%Элайнеры%Ортодонтические аппараты%Обслуживание ортодонтических конструкций"
    },
    {
        name: "Гигиеническая чистка зубов",
        categories: "Профессиональная гигиена для взрослых пациентов%Профессиональная гигиена для детей"
    },
    {
        name: "Анестезия (наркоз) в стоматологии",
        categories: "Анестезия (наркоз) в детской стоматологии%Анестезия (наркоз) во взрослой стоматологии"
    }
]

function Servises()
{
    return(
        <div className = "bg-BgWhite  relative">
            <div className = "container mx-auto py-28 flex flex-col items-center gap-4">
                <CustomH text = "Наши услуги" star = "/media/sales/blackBigStar.svg"/>
                <div className = "flex flex-col gap-8 z-10">
                    {serviseData.map((elem, i) => { return <Servise name = {elem.name} categories = {elem.categories} key = {i}/> })}
                </div>
            </div>
            <img className = "absolute left-0 top-64" src = "/media/servise/blueLittleCircle.svg" alt = ""/>
            <img className = "absolute right-0 bottom-96" src = "/media/servise/blueMediumCircle.svg" alt = ""/>
        </div>
    );
}

function Servise({name, categories}:{name: string, categories: string})
{
    const [isActive, setIsActive] = useState(false);

    let links = categories.split("%");
    let justLink =
    <Link href = "/servise">
        <div className = "flex justify-start items-center text-center cursor-pointer select-none z-10 border w-[1000px] border-Trans20 p-6 rounded-xl">
            <p className = "font-Black text-2xl">{name}</p>
        </div>
    </Link>;

    let moreLinks = 
    <div className = "flex flex-col gap-8 z-10 border w-[1000px] border-Trans20 p-6 rounded-xl">
        <div className = "flex justify-between items-center text-center gap-10 cursor-pointer select-none" onClick = {() => setIsActive(!isActive)}>
            <p className = "font-Black text-2xl">{name}</p>
            <p className = "flex text-5xl">{isActive ? "-": "+"}</p>
        </div>
        {isActive && <div className = "font-Light text-Gray3 grid grid-cols-2 gap-4">{links.map((elem, i) => {return <ServiseLink text = {elem} key = {i}/>})}</div>}
    </div>


    return(
        <>
            {categories ? moreLinks : justLink}
        </>
    );
}

function ServiseLink({text}: {text: string})
{
    return <Link href = "/servise">{text}</Link>;
}

export default Servises;