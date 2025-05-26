import Cards from "@/components/SalesCards";
import Advantages from '@/components/advantages';
import Form from "@/components/form";

import { Button, CustomH } from '@/components/lilcoms';

export default function Home() {
  return(
    <main className="bg-[#F9F9FA]">
        <div className = "flex justify-between container mx-auto py-5 ">
            <div className = "flex flex-col justify-center gap-12">
                <div className = "font-Black 2xl:text-8xl xl:text-7xl lg:text-6xl flex flex-col gap-7">
                    <p className = "text-Gray font-Light text-lg">Стоматологические услуги по бюджетным ценам</p>
                    <p>Ваша улыбка -</p>
                    <p className = "text-Blue">наш приоритет</p>
                </div>
                    <div className = "flex gap-8 font-Light relative items-center">
                        <Button text = "Каталог услуг" font = "Light" isBlue = {true} link = "/servises" arrow = "" hoverArrow=""/>
                        <Button text = "Подробнее" font = "Light" arrow = "/media/buttons/mainButtonArrow.svg" link = "/about" hoverArrow="" isBlue = {false}/>
                        <img className = "absolute top-0 right-48" src = "/media/heroPage/blueArrow.svg" alt = ""/>
                        <img className = "absolute top-10 left-24" src = "/media/heroPage/blackArrow.svg" alt = ""/>
                    </div>
                <div className = "relative flex justify-end pr-24 text-sm">
                    <p className = "font-Light text-Blue w-40 top-0 absolute">Начните знакомство с нашей стоматологией выгодно</p>
                    <p className = "font-Light w-40 left-10 top-6 absolute">Хватит стоять в очередях запишитесь онлайн сейчас!</p>
                    <img className = "absolute right-64 bottom-0" src = "/media/heroPage/blackMicroStar2.svg" alt = ""/>
                    <img className = "absolute top-2 left-6" src = "/media/heroPage/blueMicroStar2.svg" alt = ""/>
                </div>
            </div>            
            <div className = "relative">
                <img className = "rounded-full flex shrink w-[580px] h-[580px] object-cover" src = "/media/heroPage/kid.webp" alt = ""/>
                <img className = "absolute 2xl:top-12 2xl:left-[420px] xl:top-0 xl:left-88 object-cover rounded-full" src = "/media/heroPage/blackCircle.svg" alt = ""/>
                <img className = "absolute top-5 left-5" src = "/media/heroPage/whiteStar1.svg" alt = ""/>
                <img className = "absolute top-[90px] left-0" src = "/media/heroPage/blackMiniStar1.svg" alt = ""/>
                <img className = "absolute bottom-6 left-6" src = "/media/heroPage/blueRing.svg" alt = ""/>
            </div>
        </div>
        <div className = "bg-[#151516] rounded-xl w-full container mx-auto text-white flex justify-between py-8 px-20 relative">
            <div className = "flex flex-col gap-5 items-center w-full">
                <p className = "text-5xl font-Bold">12000+</p>
                <p className = "text-Trans76 font-Light">Проведённых процедур</p>
            </div>
            <div className = "flex flex-col gap-5 items-center border-x-2 border-[#FFFFFF24] w-full">
                <p className = "text-5xl font-Bold">4,6+</p>
                <p className = "text-Trans76 font-Light">Средняя оценка</p>
            </div>
            <div className = "flex flex-col gap-5 items-center w-full">
                <p className = "text-5xl font-Bold">600+</p>
                <p className = "text-Trans76 font-Light">Довольных клиенов</p>
            </div>
            <img className = "absolute left-0 top-0" src = "/media/heroPage/leftWaves.svg" alt = ""/>
            <img className = "absolute right-0 top-0" src = "/media/heroPage/rightWaves.svg" alt = ""/>
        </div>
        <div className = "pt-40 flex flex-col items-center relative">
            <CustomH text = "Акции и предложения" star = "/media/sales/blackBigStar.svg"/>
            <Cards/>
            <img className = "absolute left-0 bottom-0" src = "/media/sales/blueCircle.svg" alt = ""/>
        </div>
        <div className = "pt-40 flex flex-col items-center relative">
            <CustomH text = "Почему люди выбирают нас?" star = "/media/advantages/bigTransStar.svg"/>
            <Advantages/>
            <img className = "absolute right-0 bottom-0" src = "/media/advantages/blueCircle.svg" alt = ""/>
        </div>
        <div className = "py-40 flex flex-col items-center relative">
            <CustomH text = "Свяжитесь с нами!" star = "/media/form/bigBlackStar.svg"/>
            <Form/>
            <img className = "absolute left-52 top-36" src = "/media/form/blackCircle.svg" alt = ""/>
            <img className = "absolute right-56 bottom-20" src = "/media/form/blueRing.svg" alt = ""/>
        </div>
    </main>
);
}