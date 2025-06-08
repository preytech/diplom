import Link from "next/link";
import { ButtonHTMLAttributes } from "react";


export function Button({text, font, isBlue, arrow, link, hoverArrow, buttontype, smth}: {text: string, font: string, isBlue: boolean, arrow?: string, link: string, hoverArrow: string, buttontype?: string, smth?: object})
{
    return(
        <Link href = {link}>
            <button onClick={smth} type = {buttontype} className = {"px-10 flex items-center transition duration-150 rounded-md border-Blue border py-2.5 font-" + font 
            + (isBlue ? " bg-Blue  text-white  hover:border hover:bg-BgWhite hover:text-black" : "  bg-BgWhite text-black hover:bg-Blue hover:text-white")
            + (arrow ? " gap-2" : " gap-0")}>
                {text}
                {/* <div className = {"bg-[url(" + arrow + ")] w-[15px] h-[15px]"}></div> */}
                {(arrow ? <img src = {arrow} alt = ""/>: "")}
            </button>
        </Link>
    );
}

export function Contacts({image, text}:{image: string, text: string})
{
    return(
        <div className = "flex gap-3">
            <img src = {image} alt = ""/>
            <p className = "font-Light">{text}</p>
        </div>
    );
}

export function CustomH({text, star}:{text: string, star: string})
{
    return(
        <p className = "font-Black text-Black text-6xl pb-10 relative text-center">
            {text}
            <img className = "absolute bottom-28  inset-x-2/4" src = {star} alt = ""/>
        </p>
    );
  
}

export function FormatterToRubbles({price}:{price: number})
{

    const formatter = new Intl.NumberFormat("ru-RU", { 
        style: "currency",
        currency: "RUB",
    });

    return formatter.format(price);
}