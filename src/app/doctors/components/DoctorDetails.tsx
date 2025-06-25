"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface Doctor {
    id: string;
    name: string;
    desc: string;
    image: string | null;
    rating: number;
    showed: boolean;
}

export default function DoctorDetails({ doctorId }: { doctorId: string }) {
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDoctorDetails = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/doctors/${doctorId}`);

                if (!response.ok) {
                    throw new Error("Не удалось загрузить данные врача");
                }

                const data = await response.json();
                setDoctor(data);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "Произошла ошибка"
                );
                console.error("Ошибка загрузки:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctorDetails();
    }, [doctorId]);

    if (loading)
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );

    if (error)
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
            </div>
        );

    if (!doctor)
        return (
            <div className="text-center py-8 text-gray-500">
                Данные врача не найдены
            </div>
        );

    return (
        <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-md p-6">
            <div className="md:w-1/3 mb-4 md:mb-0 flex justify-center">
                <img
                    src={`/doctors/${doctor.id}.webp`}
                    alt={doctor.name}
                    className="w-72 object-cover rounded"
                    onError={(e) => {
                        e.currentTarget.src = "/placeholder-image.jpg";
                    }}
                />
            </div>
            <div className="md:w-2/3 md:pl-6">
                <h1 className="text-2xl font-bold mb-4">{doctor.name}</h1>
                <div className="flex items-center mb-4">
                    <div className="flex items-center text-yellow-400">
                        {"★".repeat(doctor.rating)}
                        {"☆".repeat(5 - doctor.rating)}
                    </div>
                    <span className="ml-2 text-sm text-gray-500">
                        ({doctor.rating}/5)
                    </span>
                </div>
                <p className="text-gray-700 mb-4">{doctor.desc}</p>

                {!doctor.showed && (
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
                        <p>Этот врач скрыт от публичного просмотра</p>
                    </div>
                )}
            </div>
        </div>
    );
}
