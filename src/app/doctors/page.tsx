import { CustomH } from "@/components/lilcoms";
import { InputForm } from "@/components/form";
import React from "react";
// import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import Carousel from "@/components/carousel";



const reviews = [
    {
        profilePic: "",
        name: "Альберт Энштейн",
        text: "ыыыыыыуууууууооооооаааааа",
        starCount: 4
    },
    {
        profilePic: "",
        name: "Джо Байден",
        text: "Круто, но не понял за что 5 тыщ отдал",
        starCount: 3
    },
    {
        profilePic: "",
        name: "Владимир Путин",
        text: "Не рекомендую",
        starCount: 5
    },
]

function Doctors()
{
    return(
        <div className = "bg-BgWhite relative">
            <div className = "container mx-auto py-28 flex flex-col items-center">
                <CustomH text = "Наши врачи" star = "/media/advantages/bigTransStar.svg"/>
                <p className="font-Black text-red-600 text-9xl">В РАБОТЕ</p>
                {/* <Carousel/> */}
                <p className = "font-Black text-3xl pt-14">Отзывы</p>
                <div className = "flex flex-col gap-8 py-10 w-1/2 ">
                    { reviews.map((elem, i) => { return <Review name = {elem.name} text = {elem.text} starCount = {elem.starCount} key = {i}/>; }) }
                </div>
                <CreateNewReview/>
            </div>
            <img className = "absolute bottom-52" src = "/media/doctors/blueCircle.svg" alt = ""/>
        </div>
    );
}

function Review({name, text, starCount}:{name: string, text: string, starCount: number})
{   
    let grayStars = 5 - starCount;
    let stars = [];

    while (starCount)
    {
        stars.push(<img src = "/media/doctors/star.svg" alt = ""/>);
        starCount--
    }

    while (grayStars)
    {
        stars.push(<img src = "/media/doctors/grayStar.svg" alt = ""/>);
        grayStars--
    }

    return(
        <div className = "p-4 border border-Trans20 rounded-xl">
            <div className = "flex flex-col gap-2">
                <p className = "text-xl font-Bold">{name}</p>
                <div className = "flex gap-2">
                    {stars}
                </div>
                <p className = "font-Light text-Gray3">{text}</p>
            </div>
        </div>
    );
}

function CreateNewReview()
{
    return(
        <div className = "border border-Trans20 rounded-xl w-1/2 p-10">
            <form className = "flex flex-col gap-8">
                <p className = "font-Black text-3xl">Оставте ваш отзыв!</p>
                <div className = "flex justify-between">
                    <InputForm text = "Почта" type = "email" placeText = "abc@gmail.com" w = ""/>
                    <InputForm text = "Имя" type = "text" placeText = "Олег" w = ""/>
                </div>
                <InputForm text = "Отзыв" type = "text" placeText = "Напишите ваш отзыв" w = "full"/>
                <input className = "self-center px-10 flex items-center py-2.5 font-Light bg-Blue rounded-md text-white" type = "submit"/>
            </form>
        </div>
    );
}

export default Doctors;