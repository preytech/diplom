import { useEffect, useState } from "react";
import prisma from "../../../../db";
import DoctorTable from "./components/DoctorTable";
import DoctorForm from "./components/DoctorForm";

interface Service {
    id: string;
    name: string;
    desc: string;
    prices: string;
    image: string;
}

interface Doctor {
    id: string;
    name: string;
    desc: string;
    image: string;
    rating: number;
    showed: boolean;
    service: Service[];
}

export default async function DoctorsPage() {
    const doctors = await prisma.doctor.findMany({
        orderBy: { name: "asc" },
        include: {
            service: true,
        },
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Управление врачами
                </h1>
                <p className="text-gray-600">
                    Добавляйте, редактируйте и управляйте врачами вашей клиники
                </p>
            </div>

            <div className="space-y-8">
                <DoctorForm />

                <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                        Список врачей
                    </h2>
                    <DoctorTable doctors={doctors} />
                </div>
            </div>
        </div>
    );
}
