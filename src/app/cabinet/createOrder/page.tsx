"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
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

interface Service {
    id: string;
    name: string;
}

interface Doctor {
    id: string;
    name: string;
    service: {
        id: string;
        name: string;
    }[];
}

interface OrderFormProps {
    order?: Order;
    onClose?: () => void;
}

interface CreateOrderFormData {
    date: string;
    time: string;
    serviceID: string;
    doctorID: string;
    createFor: "day" | "hour";
}

export default function OrderManagement() {
    const { DateTime } = require("luxon");
    const [orders, setOrders] = useState<Order[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<CreateOrderFormData>({
        date: DateTime.now().toISODate()!,
        time: "08:00",
        serviceID: "",
        doctorID: "",
        createFor: "hour",
    });
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(
        DateTime.now().toISODate()!
    );
    const [selectedService, setSelectedService] = useState<string>("");
    const [selectedDoctor, setSelectedDoctor] = useState<string>("");
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ordersRes, servicesRes, doctorsRes] = await Promise.all([
                    fetch("/api/orders"),
                    fetch("/api/services"),
                    fetch("/api/doctors"),
                ]);

                if (ordersRes.ok) {
                    const ordersData = await ordersRes.json();
                    setOrders(ordersData);
                }

                if (servicesRes.ok) {
                    const servicesData = await servicesRes.json();
                    setServices(servicesData);
                }

                if (doctorsRes.ok) {
                    const doctorsData = await doctorsRes.json();
                    setDoctors(doctorsData);
                    setFilteredDoctors(doctorsData);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Фильтрация врачей при изменении выбранной услуги
    useEffect(() => {
        if (formData.serviceID) {
            const filtered = doctors.filter((doctor) =>
                doctor.service.some(
                    (service) => service.id === formData.serviceID
                )
            );
            setFilteredDoctors(filtered);

            // Сбросить выбранного врача, если он не оказывает выбранную услугу
            if (
                formData.doctorID &&
                !filtered.some((d) => d.id === formData.doctorID)
            ) {
                setFormData((prev) => ({ ...prev, doctorID: "" }));
            }
        } else {
            setFilteredDoctors(doctors);
        }
    }, [formData.serviceID, doctors]);

    const handleCreateOrders = async (e: React.FormEvent) => {
        e.preventDefault();

        // Проверка, что выбранный врач оказывает выбранную услугу
        const selectedDoctor = doctors.find((d) => d.id === formData.doctorID);
        if (
            selectedDoctor &&
            !selectedDoctor.service.some((s) => s.id === formData.serviceID)
        ) {
            alert("Выбранный врач не оказывает выбранную услугу");
            return;
        }

        try {
            const response = await fetch("/api/orders/batch", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Failed to create orders");
            }

            const newOrders = await response.json();
            setOrders([...orders, ...newOrders]);
            setShowForm(false);
            router.refresh();
        } catch (error) {
            console.error("Error:", error);
            alert(error || "Ошибка при создании записей");
        }
    };

    const handleCancelFilteredDay = async () => {
        if (
            !confirm(
                `Вы уверены, что хотите отменить все отфильтрованные записи на ${DateTime.fromISO(
                    selectedDate
                ).toFormat("dd.MM.yyyy")}?`
            )
        )
            return;

        try {
            // Создаем объект для фильтрации
            const filter: any = {
                date: {
                    gte: DateTime.fromISO(selectedDate)
                        .startOf("day")
                        .toJSDate(),
                    lte: DateTime.fromISO(selectedDate).endOf("day").toJSDate(),
                },
                status: {
                    in: ["VACANT", "OCCUPIED"],
                },
            };

            // Добавляем фильтр по услуге, если выбрана
            if (selectedService) {
                filter.serviceID = selectedService;
            }

            // Добавляем фильтр по врачу, если выбран
            if (selectedDoctor) {
                filter.doctorID = selectedDoctor;
            }

            const response = await fetch("/api/orders/cancel-filtered", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ filter }),
            });

            if (!response.ok) {
                throw new Error("Failed to cancel filtered day orders");
            }

            const updatedOrders = await response.json();
            setOrders(
                orders.map((order) =>
                    updatedOrders.some(
                        (updated: Order) => updated.id === order.id
                    )
                        ? updatedOrders.find(
                              (updated: Order) => updated.id === order.id
                          )
                        : order
                )
            );
            router.refresh();
        } catch (error) {
            console.error("Error:", error);
            alert("Ошибка при отмене отфильтрованных записей на день");
        }
    };

    const handleCancelOrder = async (orderId: string) => {
        if (!confirm("Вы уверены, что хотите отменить эту запись?")) return;

        try {
            const response = await fetch("/api/orders/${orderId}", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: "CANCELED" }),
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

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 8; hour < 20; hour++) {
            slots.push(`${hour.toString().padStart(2, "0")}:00`);
        }
        return slots;
    };

    const handleDeleteOrder = async (orderId: string) => {
        if (!confirm("Вы уверены, что хотите полностью удалить эту запись?"))
            return;

        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete order");
            }

            setOrders(orders.filter((order) => order.id !== orderId));
            router.refresh();
        } catch (error) {
            console.error("Error:", error);
            alert("Ошибка при удалении записи");
        }
    };

    const timeSlots = generateTimeSlots();

    const filteredOrders = useMemo(() => {
        let result = orders.filter((order) => {
            const orderDate = DateTime.fromISO(order.date).toISODate();
            return orderDate === selectedDate;
        });

        // Фильтрация по услуге
        if (selectedService) {
            result = result.filter(
                (order) => order.serviceID === selectedService
            );
        }

        // Фильтрация по врачу
        if (selectedDoctor) {
            result = result.filter(
                (order) => order.doctorID === selectedDoctor
            );
        }

        return result;
    }, [orders, selectedDate, selectedService, selectedDoctor]);

    // Группировка по времени с учетом фильтров
    const groupedByTime = useMemo(() => {
        return timeSlots.map((time) => {
            const ordersForTime = filteredOrders.filter((order) => {
                const orderTime = DateTime.fromISO(order.date).toFormat(
                    "HH:mm"
                );
                return orderTime === time;
            });
            return { time, orders: ordersForTime };
        });
    }, [filteredOrders, timeSlots]);

    const availableDates = Array.from({ length: 14 }, (_, i) =>
        DateTime.now().plus({ days: i }).toISODate()
    ).filter(Boolean) as string[];

    return (
        <div className="space-y-6 p-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">
                    Управление записями на приём
                </h1>
            </div>

            <div className="flex flex-wrap gap-4 mb-4">
                <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="border p-2 rounded"
                >
                    {availableDates.map((date) => (
                        <option key={date} value={date}>
                            {DateTime.fromISO(date).toFormat("dd.MM.yyyy")}
                        </option>
                    ))}
                </select>

                <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="">Все услуги</option>
                    {services.map((service) => (
                        <option key={service.id} value={service.id}>
                            {service.name}
                        </option>
                    ))}
                </select>

                <select
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="">Все врачи</option>
                    {doctors.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                            {doctor.name}
                        </option>
                    ))}
                </select>

                <button
                    onClick={() => {
                        setSelectedService("");
                        setSelectedDoctor("");
                    }}
                    className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                >
                    Сбросить фильтры
                </button>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Создать записи
                </button>
                <button
                    onClick={handleCancelFilteredDay}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    Отменить все отфильтрованные записи на день
                </button>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full m-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">
                                Создать записи на приём
                            </h2>
                            <button
                                onClick={() => setShowForm(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        <form
                            onSubmit={handleCreateOrders}
                            className="space-y-4"
                        >
                            <div>
                                <label className="block mb-1">Дата</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    min={DateTime.now().toISODate()}
                                    max={DateTime.now()
                                        .plus({ weeks: 2 })
                                        .toISODate()}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-1">
                                    Создать для
                                </label>
                                <select
                                    name="createFor"
                                    value={formData.createFor}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="hour">
                                        Конкретного времени
                                    </option>
                                    <option value="day">Всего дня</option>
                                </select>
                            </div>

                            {formData.createFor === "hour" && (
                                <div>
                                    <label className="block mb-1">Время</label>
                                    <select
                                        name="time"
                                        value={formData.time}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded"
                                    >
                                        {timeSlots.map((time) => (
                                            <option key={time} value={time}>
                                                {time}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div>
                                <label className="block mb-1">Услуга</label>
                                <select
                                    name="serviceID"
                                    value={formData.serviceID}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                >
                                    <option value="">Выберите услугу</option>
                                    {services.map((service) => (
                                        <option
                                            key={service.id}
                                            value={service.id}
                                        >
                                            {service.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block mb-1">Врач</label>
                                <select
                                    name="doctorID"
                                    value={formData.doctorID}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                    disabled={!formData.serviceID}
                                >
                                    <option value="">Выберите врача</option>
                                    {filteredDoctors.map((doctor) => (
                                        <option
                                            key={doctor.id}
                                            value={doctor.id}
                                        >
                                            {doctor.name}
                                        </option>
                                    ))}
                                </select>
                                {formData.serviceID &&
                                    filteredDoctors.length === 0 && (
                                        <p className="text-red-500 text-sm mt-1">
                                            Нет врачей, оказывающих выбранную
                                            услугу
                                        </p>
                                    )}
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    Создать
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                >
                                    Отмена
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isLoading ? (
                <div className="text-center py-8">Загрузка...</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Время
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Услуга
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Врач
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Статус
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Пациент
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Действия
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {groupedByTime.map(({ time, orders }) =>
                                orders.length > 0 ? (
                                    orders.map((order) => (
                                        <tr
                                            key={order.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {DateTime.fromISO(
                                                    order.date
                                                ).toFormat("HH:mm")}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {order.service.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {order.doctor.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        order.status ===
                                                        "VACANT"
                                                            ? "bg-green-100 text-green-800"
                                                            : order.status ===
                                                              "OCCUPIED"
                                                            ? "bg-blue-100 text-blue-800"
                                                            : order.status ===
                                                              "CANCELED"
                                                            ? "bg-red-100 text-red-800"
                                                            : "bg-gray-100 text-gray-800"
                                                    }`}
                                                >
                                                    {order.status === "VACANT"
                                                        ? "Свободно"
                                                        : order.status ===
                                                          "OCCUPIED"
                                                        ? "Занято"
                                                        : order.status ===
                                                          "CANCELED"
                                                        ? "Отменено"
                                                        : "Архив"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {order.user?.name || "-"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex gap-2">
                                                    {(order.status ===
                                                        "VACANT" ||
                                                        order.status ===
                                                            "OCCUPIED") && (
                                                        <button
                                                            onClick={() =>
                                                                handleCancelOrder(
                                                                    order.id
                                                                )
                                                            }
                                                            className="text-blue-600 hover:text-blue-900"
                                                        >
                                                            Отменить
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteOrder(
                                                                order.id
                                                            )
                                                        }
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Удалить
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr key={time}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {time}
                                        </td>
                                        <td
                                            colSpan={5}
                                            className="px-6 py-4 text-gray-500"
                                        >
                                            Нет записей
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
