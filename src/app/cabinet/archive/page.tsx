"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Button, CustomH, FormatterToRubbles } from "@/components/lilcoms";

interface Service {
    id: string;
    name: string;
    prices: string;
}

interface Doctor {
    id: string;
    name: string;
    image: string;
}

interface Order {
    id: string;
    date: string;
    status: "VACANT" | "OCCUPIED" | "CANCELED" | "ARCHIVED";
    service: Service;
    doctor: Doctor;
}

export default function ArchivePage() {
    const { DateTime } = require("luxon");
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchArchivedOrders = async () => {
            try {
                const response = await fetch("/api/orders/archive", {
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch archived orders");
                }

                const data = await response.json();
                setOrders(data);
            } catch (error) {
                console.error("Error fetching archived orders:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchArchivedOrders();
    }, []);

    if (isLoading) {
        return <div className="text-center py-72">Загрузка архива...</div>;
    }

    return (
        <div className="bg-BgWhite min-h-screen">
            <div className="container mx-auto py-20 px-4">
                <p className="text-2xl font-bold">Архив записей</p>

                {orders.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-xl text-Gray3">
                            В вашем архиве пока нет записей
                        </p>
                    </div>
                ) : (
                    <div className="mt-10 grid gap-6">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-white p-6 rounded-lg shadow-md border border-Trans20"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-bold">
                                            {order.service.name}
                                        </h3>
                                        <p className="text-Gray3 mt-2">
                                            Врач: {order.doctor.name}
                                        </p>
                                        <p className="text-Gray3">
                                            Дата:{" "}
                                            {DateTime.fromISO(
                                                order.date
                                            ).toFormat("dd.MM.yyyy HH:mm")}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-semibold">
                                            <FormatterToRubbles
                                                price={parseFloat(
                                                    order.service.prices
                                                )}
                                            />
                                        </p>
                                        <span className="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                                            Завершено
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
