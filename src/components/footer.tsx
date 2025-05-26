import { Contacts } from "./lilcoms";

const footerText = [
    {
        text: "8 800 555 35 35",
        image: "/media/contacts/phone.svg"
    },
    {
        text: "abc@gmail.com",
        image: "/media/contacts/mail.svg"
    },
    {
        text: "Руставели 33, Санкт-Петербург",
        image: "/media/contacts/geo.svg"
    },
]

const footerText2 = ["О нас", "Свяжитесь с нами", "События"]
const footerText3 = ["Политика конфиденциальности", "Условия и услуги", "Политика возврата"]


function Footer()
{
    return(
        <footer className = "bg-Blue relative">
            <div className = "container mx-auto">
                <div className = "w-full h-24 relative">
                    <img className = "absolute right-[1510px] top-4" src = "/media/footer/bigTransStar.svg" alt = ""/>
                    <img className = "absolute right-[1570px] top-8" src = "/media/footer/medWhiteStar.svg" alt = ""/>
                </div>
                <div className = "flex justify-between pt-6 pb-14 border-t border-white items-start">
                    <TextMaker name = "Контакты" textArr = {footerText} isContacts={true}/>
                    <TextMaker name = "Компания" textArr = {footerText2} isContacts={false}/>
                    <TextMaker name = "Условия использования" textArr = {footerText3} isContacts={false}/>
                    <div className = "bg-white p-3 flex flex-col gap-6 rounded-xl z-10">
                        <p className = "font-Black text-lg">Подпишитесь на рассылку</p>
                        <div className = "flex pb-4">
                            <input className = "placeholder:font-Light border border-Trans20 pl-1" placeholder = "Ваша почта" type = "email"/>
                            <button className = "border border-Blue bg-Blue text-white font-Light py-1.5 px-3">Подписаться</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className = "bg-[#2159D7] font-Light text-white text-center py-1.5">
                DENTIQUE. 2024
            </div>
            <img className = "absolute bottom-0 right-0" src = "/media/footer/bigWaves.svg" alt = ""/>
        </footer>
    );
}

function TextMaker({name, textArr, isContacts}:{name: string, textArr: Array<any>, isContacts: boolean})
{
    let text;

    if (isContacts)
    {
        text = textArr.map((elem, i) => { return <Contacts image = {elem.image} text = {elem.text} key = {i}/>})
    }
    else
    {
        text = textArr.map((elem, i) => { return <p key = {i}>{elem}</p> })  
    }

    return (
        <div className = "text-white font-Light flex flex-col gap-4">
            <p className = "font-Bold">{name}</p>
            {text}
        </div>
    );
}

export default Footer;