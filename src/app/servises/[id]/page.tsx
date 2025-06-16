import prisma from "../../../../db";
import {
    Button,
    Contacts,
    CustomH,
    FormatterToRubbles,
} from "@/components/lilcoms";

export default async function ServiceDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const service = await prisma.service.findUnique({
        where: { id: (await params).id },
    });

    if (!service) {
        return <div>Service not found</div>;
    }

    return (
        <div className="bg-BgWhite">
            <div className="container mx-auto py-28 flex flex-col items-center gap-10">
                <CustomH
                    text={service.name}
                    star="/media/advantages/bigTransStar.svg"
                />
                <div className="flex w-full justify-around items-center">
                    <p className="font-Light text-Gray3 text-xl w-[650px]">
                        {service.desc}
                    </p>

                    <img
                        className="w-[450px] h-[450px] object-cover rounded-full"
                        src={`/services/${service.id}.webp`}
                        alt={service.name}
                    />
                </div>

                <div className="rounded-xl flex justify-between p-4 items-end w-2/3 bg-Blue">
                    <div className="bg-Blue rounded-xl p-2 text-white flex flex-col gap-4 pr-20 ">
                        <Contacts
                            image="/media/contacts/phone.svg"
                            text="8 800 555 35 35"
                        />
                        <Contacts
                            image="/media/contacts/mail.svg"
                            text="abc@gmail.com"
                        />
                        <Contacts
                            image="/media/contacts/geo.svg"
                            text="Руставели 33, Санкт-Петербург"
                        />
                    </div>
                    <div className="pb-6 pr-10 m-4">
                        <Button
                            text="Запись"
                            font="Bold"
                            isBlue={false}
                            link="/"
                        />
                    </div>
                </div>

                <div className="font-Light text-xl text-Gray3 flex flex-col gap-4 border border-Trans20 rounded-xl py-6 w-2/3">
                    <div className="flex justify-between items-center font-Light py-2 px-6 text-xl text-Gray3">
                        <p className="w-[700px]">{service.name}</p>
                        <p>
                            <FormatterToRubbles
                                price={parseFloat(service.prices || "0")}
                            />
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Generates static params for services
export async function generateStaticParams() {
    const services = await prisma.service.findMany();

    return services.map((service) => ({
        id: service.id,
    }));
}
