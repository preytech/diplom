"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Order {
    id: string;
    serviceID: string;
    service: {
        id: string;
        name: string;
    };
    doctorID: string;
    doctor: {
        id: string;
        name: string;
        service: {
            id: string;
            name: string;
        }[];
    };
    status: "VACANT" | "OCCUPIED" | "CANCELED" | "ARCHIVED";
    date: string;
    userID?: string;
    user?: {
        id: string;
        name: string;
    };
}

export default function UserAppointments() {
    const { DateTime } = require("luxon");
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUserOrders = async () => {
            try {
                const response = await fetch("/api/user/order", {
                    credentials: "include",
                });

                if (response.ok) {
                    const ordersData = await response.json();
                    setOrders(ordersData);
                } else {
                    throw new Error("Failed to fetch user orders");
                }
            } catch (error) {
                console.error("Error fetching user orders:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserOrders();

        // Проверка и архивация прошедших записей
        const checkAndArchivePastOrders = () => {
            setOrders((prevOrders) =>
                prevOrders.map((order) => {
                    const orderDateTime = DateTime.fromISO(order.date);
                    const now = DateTime.now();

                    // Если время записи прошло и статус OCCUPIED, меняем на ARCHIVED
                    if (orderDateTime < now && order.status === "OCCUPIED") {
                        return { ...order, status: "ARCHIVED" };
                    }
                    return order;
                })
            );
        };

        // Проверяем каждую минуту
        const interval = setInterval(checkAndArchivePastOrders, 60000);

        // Первая проверка сразу после загрузки
        checkAndArchivePastOrders();

        return () => clearInterval(interval);
    }, []);

    const handleCancelOrder = async (orderId: string) => {
        if (!confirm("Вы уверены, что хотите отменить эту запись?")) return;

        try {
            const response = await fetch("/api/user/order/${orderId}/cancel", {
                method: "POST",
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to cancel order");
            }

            const updatedOrder = await response.json();
            setOrders(
                orders.map((order) =>
                    order.id === orderId ? updatedOrder : order
                )
            );
            router.refresh();
        } catch (error) {
            console.error("Error:", error);
            alert("Ошибка при отмене записи");
        }
    };

    // Фильтруем только записи пользователя со статусом OCCUPIED
    const userOccupiedOrders = orders.filter(
        (order) => order.status === "OCCUPIED"
    );

    // Сортируем по дате (от ближайших к самым дальним)
    const sortedOrders = [...userOccupiedOrders].sort(
        (a, b) =>
            DateTime.fromISO(a.date).toMillis() -
            DateTime.fromISO(b.date).toMillis()
    );

    // Группируем по дате
    const groupedByDate = sortedOrders.reduce((acc, order) => {
        const date = DateTime.fromISO(order.date).toFormat("yyyy-MM-dd");
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(order);
        return acc;
    }, {} as Record<string, Order[]>);

    if (isLoading) {
        return (
            <div className="text-center py-8">Загрузка ваших записей...</div>
        );
    }

    return (
        <div className="space-y-6 p-4 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold">Мои записи на приём</h1>

            {sortedOrders.length === 0 ? (
                <div className="text-center py-8">
                    У вас нет активных записей на приём.
                </div>
            ) : (
                <div className="space-y-8">
                    {Object.entries(groupedByDate).map(([date, dateOrders]) => (
                        <div
                            key={date}
                            className="border rounded-lg overflow-hidden"
                        >
                            <div className="bg-gray-50 px-4 py-2 font-medium">
                                {DateTime.fromISO(date).toFormat("dd.MM.yyyy")}
                            </div>
                            <div className="divide-y divide-gray-200">
                                {dateOrders.map((order) => {
                                    const orderTime = DateTime.fromISO(
                                        order.date
                                    ).toFormat("HH:mm");
                                    const isPast =
                                        DateTime.fromISO(order.date) <
                                        DateTime.now();

                                    return (
                                        <div
                                            key={order.id}
                                            className={`p-4 flex justify-between items-center ${
                                                isPast ? "bg-gray-50" : ""
                                            }`}
                                        >
                                            <div className="space-y-1">
                                                <div className="font-medium">
                                                    {orderTime} -{" "}
                                                    {order.service.name}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    Врач: {order.doctor.name}
                                                </div>
                                                {isPast && (
                                                    <div className="text-sm text-yellow-600">
                                                        Запись уже прошла
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                onClick={() =>
                                                    handleCancelOrder(order.id)
                                                }
                                                disabled={isPast}
                                                className={`px-4 py-2 rounded ${
                                                    isPast
                                                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                                        : "bg-red-500 text-white hover:bg-red-600"
                                                }`}
                                            >
                                                Отменить
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
