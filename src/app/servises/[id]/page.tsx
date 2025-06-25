"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import {
    Button,
    Contacts,
    CustomH,
    FormatterToRubbles,
} from "@/components/lilcoms";

interface Doctor {
    id: string;
    name: string;
    image: string;
}

interface Order {
    id: string;
    date: Date;
    status: "VACANT" | "OCCUPIED" | "CANCELED";
    doctor: Doctor;
}

export default function ServiceDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    // Разворачиваем Promise params
    const { id } = use(params);
    const { DateTime } = require("luxon");
    const [service, setService] = useState<any>(null);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [selectedDoctor, setSelectedDoctor] = useState<string>("");
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Загружаем данные услуги
                const serviceRes = await fetch(`/api/services/${id}`);
                const serviceData = await serviceRes.json();
                setService(serviceData);

                // Загружаем врачей, которые оказывают эту услугу
                const doctorsRes = await fetch(`/api/services/${id}/doctors`);
                const doctorsData = await doctorsRes.json();
                setDoctors(doctorsData);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]); // Используем id как зависимость

    useEffect(() => {
        if (selectedDoctor) {
            fetchOrders(selectedDoctor);
        }
    }, [selectedDoctor, id]); // Добавляем id в зависимости

    const fetchOrders = async (doctorId: string) => {
        try {
            const res = await fetch(
                `/api/orders?serviceId=${id}&doctorId=${doctorId}`
            );
            const data = await res.json();
            setOrders(data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    const handleBookOrder = async () => {
        if (!selectedOrder) return;

        try {
            const response = await fetch(`/api/orders/${selectedOrder}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: "OCCUPIED" }),
            });

            if (!response.ok) {
                throw new Error("Failed to book order");
            }

            fetchOrders(selectedDoctor);
            alert("Запись успешно оформлена!");
        } catch (error) {
            console.error("Error:", error);
            alert("Ошибка при оформлении записи");
        }
    };

    if (isLoading)
        return <div className="font-Black text-black py-72">Загрузка...</div>;
    if (!service) return <div>Service not found</div>;

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
                </div>

                <div className="font-Light text-xl text-Gray3 flex flex-col gap-4 border border-Trans20 rounded-xl py-6 w-2/3">
                    <div className="flex justify-between items-center font-Light py-2 px-6 text-xl text-Gray3">
                        <p className="w-[700px]">
                            Приблизительная стоимость услуги
                        </p>
                        <p>
                            <FormatterToRubbles
                                price={parseFloat(service.prices || "0")}
                            />
                        </p>
                    </div>
                </div>

                <div className="w-2/3 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">Запись на прием</h2>

                    <div className="mb-4">
                        <label className="block text-Gray3 mb-2">
                            Выберите врача:
                        </label>
                        <select
                            value={selectedDoctor}
                            onChange={(e) => setSelectedDoctor(e.target.value)}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Выберите врача</option>
                            {doctors.map((doctor) => (
                                <option key={doctor.id} value={doctor.id}>
                                    {doctor.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedDoctor && (
                        <div className="mb-4">
                            <label className="block text-Gray3 mb-2">
                                Доступные записи:
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {orders
                                    .filter(
                                        (order) => order.status === "VACANT"
                                    )
                                    .map((order) => (
                                        <button
                                            key={order.id}
                                            onClick={() =>
                                                setSelectedOrder(order.id)
                                            }
                                            className={`p-2 border rounded ${
                                                selectedOrder === order.id
                                                    ? "bg-Blue text-white"
                                                    : "hover:bg-gray-100"
                                            }`}
                                        >
                                            {DateTime.fromJSDate(
                                                new Date(order.date)
                                            ).toFormat("HH:mm, dd.MM.yyyy")}
                                        </button>
                                    ))}
                            </div>
                        </div>
                    )}

                    {selectedOrder && (
                        <button
                            onClick={handleBookOrder}
                            className="bg-Blue text-white px-4 py-2 rounded hover:bg-BlueDark"
                        >
                            Записаться
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
