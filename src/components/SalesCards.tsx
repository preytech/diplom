import { Button, FormatterToRubbles } from "@/components/lilcoms";
import { faIR } from "@mui/material/locale";

function Cards()
{
    return (
        <div className = "flex justify-center items-end gap-14">
            <Card
                priceNoDiscount = {2999}
                priceDiscount = {2399}
                name = "Скидка  на первое посещение клиники"
                desc = "Все лечение проводится при помощи бинокуляров или дентального микроскопа"
                list1 = "Консультация стоматолога"
                list2 = "Леч88ие кариеса одного зуба, либо удаление одного зуба"
                list3 = "Лечение высококачественным оборудованием"
                isBlue = {false}
            />
            <Card
                priceNoDiscount = {2999}
                priceDiscount = {1488}
                name = "Профессиональная диагностика полости рта"
                desc = "Ежедневная чистка зубов и своевременное выявление заболевания"
                list1 = "Осмотр ротовой полости"
                list2 = "3D цифровая рентгенодиагностика (КТ)"
                list3 = "Профессиональная гигиена полости рта AIR Flow"
                isBlue = {true}
            />
            <Card
                priceNoDiscount = {7999}
                priceDiscount = {4799}
                name = "Лечение кариеса под увеличением"
                desc = "Спасаем 90% зубов, которые рекомендовали удалить в других клиниках"
                list1 = "Изоляция зубов коффердамом"
                list2 = "Пломбировочные материалы последнего поколения"
                list3 = "Терапевт лечит кариес, пульпит, периодонтитции"
                isBlue = {false}
            />
        </div>
    );
}

function Card({priceNoDiscount, priceDiscount, name, desc, list1, list2, list3, isBlue}:{priceNoDiscount: number, priceDiscount: number, name: string, desc: string, list1: string, list2: string, list3: string, isBlue: boolean})
{
    let blueBlock;
    let button = <Button text = "Запись" font = "Bold" arrow = "/media/buttons/mainButtonArrow.svg" link = "/servise" isBlue = {false} hoverArrow=""/>;
    let borderColor = "Trans20";

    if (isBlue)
    {
        blueBlock = <div className = "bg-Blue text-white font-Bold border border-Blue rounded-xl text-2xl text-center relative w-full py-2.5">
            Лучшая цена!
            <img src = "/media/sales/whiteMicroStar1.svg" className = "absolute top-1 right-20" alt = ""/>
        </div>

        button = <Button text = "Запись" font = "Bold" isBlue = {true} arrow = "/media/buttons/whiteButtonArrow.svg" link = "/servise" hoverArrow=""/>;
        borderColor = "Blue";
    }

    return(
        <div className = {"border rounded-xl border-" + borderColor}>
            <div>
                {blueBlock}
            </div>
            <div className = "p-6">
                <div className = "flex font-Bold justify-end gap-5 text-lg">
                    <p className = "line-through text-Gray2 decoration-Gray2"><FormatterToRubbles price = {priceNoDiscount}/></p>
                    <p className = "text-Blue"><FormatterToRubbles price = {priceDiscount}/></p>
                </div>
                <div className = "flex flex-col gap-2 justify-center w-72">
                    <p className = "font-Bold text-2xl text-center">{name}</p>
                    <p className = "font-Light text-Gray3 text-sm border-b border-Trans20 pb-2.5">{desc}</p>
                </div>
                <div className = "font-Light text-Gray3 ml-10 py-6 text-sm w-60 flex flex-col gap-2">  
                    <ListElem text = {list1}/>
                    <ListElem text = {list2}/>
                    <ListElem text = {list3}/>
                </div>
                <div className = "w-full flex justify-center">
                    {button}
                </div>
            </div>

        </div>
    );
}

function ListElem({text}:{text: string})
{
    return(
        <div className = "flex gap-2 items-start">
            <img className = "w-5" src = "/media/sales/checkIcon.svg" alt=""/>
            {text}
        </div>
    );
}

export default Cards;