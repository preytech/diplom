"use client";

import { CustomH } from "@/components/lilcoms";
import Link from "next/link";

interface Doctor {
    id: string;
    name: string;
    desc: string;
    image: string | null;
    rating: number;
    showed: boolean;
}

interface Doctors {
    doctors: Doctor[];
}

export default function Doctors({ doctors }: Doctors) {
    const visibleDoctors = doctors.filter((doctor) => doctor.showed);

    return (
        <div className="bg-[#F9F9FA]">
            <div className="flex flex-col justify-between container mx-auto py-20 ">
                <CustomH
                    text="Наши врачи"
                    star="/media/sales/blackBigStar.svg"
                />

                {visibleDoctors.length === 0 ? (
                    <div className="text-Black text-center py-8 text-Gray2">
                        В данный момент нет доступных врачей
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {visibleDoctors.map((doctor) => (
                            <div
                                key={doctor.id}
                                className="bg-white rounded-lg shadow-md overflow-hidden"
                            >
                                <div className="p-4">
                                    <img
                                        src={`/doctors/${doctor.id}.webp`}
                                        alt={doctor.name}
                                        className="w-full object-cover rounded-md mb-4"
                                        onError={(e) => {
                                            e.currentTarget.src =
                                                "/placeholder-image.jpg";
                                        }}
                                    />
                                    <Link href={`/doctors/${doctor.id}`}>
                                        <h3 className="text-xl font-semibold">
                                            {doctor.name}
                                        </h3>
                                    </Link>
                                    <p className="text-gray-600 mt-2 line-clamp-3">
                                        {doctor.desc}
                                    </p>

                                    <div className="mt-4 flex items-center">
                                        <div className="flex items-center text-yellow-400">
                                            {"★".repeat(doctor.rating)}
                                            {"☆".repeat(5 - doctor.rating)}
                                        </div>
                                        <span className="ml-2 text-sm text-gray-500">
                                            ({doctor.rating}/5)
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
