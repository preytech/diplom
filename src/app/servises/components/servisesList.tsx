"use client";
import { useState } from "react";
import { CustomH } from "@/components/lilcoms";
import Link from "next/link";

interface Service {
    id: string;
    name: string;
    desc: string;
    prices: string;
    image: string | null;
    categoryID?: string | null;
}

interface Category {
    id: string;
    name: string;
}

interface ServiceTableProps {
    services: Service[];
    categories: Category[];
}

export default function Services({ services, categories }: ServiceTableProps) {
    return (
        <div className="bg-BgWhite relative">
            <div className="container mx-auto py-28 flex flex-col items-center gap-4">
                <CustomH
                    text="Наши услуги"
                    star="/media/sales/blackBigStar.svg"
                />
                <div className="flex flex-col gap-8 z-10">
                    {categories.map((category) => (
                        <details
                            key={category.id}
                            className="w-[1000px] border border-Trans20 rounded-xl"
                        >
                            <summary className="p-6 cursor-pointer font-Black text-2xl">
                                {category.name}
                            </summary>
                            <div className="p-6 grid grid-cols-1 gap-4">
                                {services
                                    .filter(
                                        (service) =>
                                            service.categoryID === category.id
                                    )
                                    .map((service) => (
                                        <ServiceItem
                                            key={service.id}
                                            service={service}
                                        />
                                    ))}
                            </div>
                        </details>
                    ))}
                    {/* Services without a category */}
                    {services
                        .filter((service) => !service.categoryID)
                        .map((service) => (
                            <ServiceItem key={service.id} service={service} />
                        ))}
                </div>
            </div>
            <img
                className="absolute left-0 top-64"
                src="/media/servise/blueLittleCircle.svg"
                alt=""
            />
            <img
                className="absolute right-0 bottom-96"
                src="/media/servise/blueMediumCircle.svg"
                alt=""
            />
        </div>
    );
}

function ServiceItem({ service }: { service: Service }) {
    return (
        <Link href={`/servises/${service.id}`} className="block">
            <div className="flex justify-start items-center text-center cursor-pointer select-none z-10 border border-Trans20 p-6 rounded-xl">
                <p className="font-Black text-2xl">{service.name}</p>
            </div>
        </Link>
    );
}
