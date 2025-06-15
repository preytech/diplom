"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, ChangeEvent } from "react";

interface Service {
    id: string;
    name: string;
    desc: string;
    prices: string;
    image: string;
}

interface Doctor {
    id?: string;
    name: string;
    desc: string;
    image: string;
    showed: boolean;
    service: Service[];
}

interface DoctorFormProps {
    editingDoctor?: Doctor | null;
    onCancel?: () => void;
}

interface FormDataState {
    name: string;
    desc: string;
    showed: boolean;
    service: Service[];
}

export default function DoctorForm({
    editingDoctor,
    onCancel,
}: DoctorFormProps) {
    const [formData, setFormData] = useState<FormDataState>({
        name: "",
        desc: "",
        showed: true,
        service: [],
    });
    const [services, setServices] = useState<Service[]>([]);
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/services`
                );
                if (response.ok) {
                    const data = await response.json();
                    setServices(data);
                }
            } catch (error) {
                console.error("Ошибка при загрузке услуг:", error);
            }
        };
        fetchServices();
        console.log(fetchServices());
    }, []);

    useEffect(() => {
        if (editingDoctor) {
            setFormData({
                name: editingDoctor.name,
                desc: editingDoctor.desc,
                showed: editingDoctor.showed,
                service: editingDoctor.service,
            });
            setSelectedServices(editingDoctor.service.map((s) => s.id));
        } else {
            setFormData({
                name: "",
                desc: "",
                showed: true,
                service: [],
            });
            setImage(null);
            setSelectedServices([]);
        }
    }, [editingDoctor]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("name", formData.name);
            formDataToSend.append("desc", formData.desc);
            formDataToSend.append("showed", formData.showed.toString());
            formDataToSend.append("service", JSON.stringify(selectedServices));
            console.log(selectedServices);
            if (image) {
                formDataToSend.append("image", image, image.name);
            }
            // const selectedServiceObjects = services.filter((service) =>
            //     selectedServices.includes(service.id)
            // );

            // const doctorData = {
            //     ...formDataToSend,
            //     servise: selectedServiceObjects,
            // };

            const url = editingDoctor
                ? `${process.env.NEXT_PUBLIC_API_URL}/api/doctors/${editingDoctor.id}`
                : `${process.env.NEXT_PUBLIC_API_URL}/api/doctors`;
            const method = editingDoctor ? "PUT" : "POST";
            const response = await fetch(url, {
                method,
                body: formDataToSend,
            });

            if (response.ok) {
                setFormData({ name: "", desc: "", showed: true, service: [] });
                setImage(null);
                router.refresh();
                if (onCancel) onCancel();
            } else {
                const errorText = await response.text();
                console.error("Server Error:", errorText);
                alert(errorText);
            }
        } catch (error) {
            console.error("Ошибка при сохранении врача:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleServiceChange = (serviceId: string, checked: boolean) => {
        if (checked) {
            setSelectedServices((prev) => [...prev, serviceId]);
        } else {
            setSelectedServices((prev) =>
                prev.filter((id) => id !== serviceId)
            );
        }
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            console.log(e.target.files[0]);
            setImage(e.target.files[0]);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">
                {editingDoctor
                    ? "Редактировать врача"
                    : "Добавить нового врача"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label
                        htmlFor="doctor-name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        ФИО врача *
                    </label>
                    <input
                        id="doctor-name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                name: e.target.value,
                            }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        placeholder="Введите полное имя врача"
                    />
                </div>

                <div>
                    <label
                        htmlFor="doctor-desc"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Описание *
                    </label>
                    <textarea
                        id="doctor-desc"
                        value={formData.desc}
                        name="desc"
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                desc: e.target.value,
                            }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={4}
                        required
                        placeholder="Введите описание врача, его специализацию и опыт работы"
                    />
                </div>

                <div>
                    <label
                        htmlFor="doctor-image"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        URL фотографии
                    </label>
                    <input
                        id="doctor-image"
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Услуги врача *
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-300 rounded-md p-3">
                        {services.length === 0 ? (
                            <p className="text-gray-500 text-sm">
                                Загрузка услуг...
                            </p>
                        ) : (
                            services.map((service) => (
                                <div
                                    key={service.id}
                                    className="flex items-center"
                                >
                                    <input
                                        id={`service-${service.id}`}
                                        type="checkbox"
                                        name="service"
                                        checked={selectedServices.includes(
                                            service.id
                                        )}
                                        onChange={(e) =>
                                            handleServiceChange(
                                                service.id,
                                                e.target.checked
                                            )
                                        }
                                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label
                                        htmlFor={`service-${service.id}`}
                                        className="text-sm text-gray-700 cursor-pointer"
                                    >
                                        {service.name} - {service.prices}
                                    </label>
                                </div>
                            ))
                        )}
                    </div>
                    {selectedServices.length === 0 && (
                        <p className="text-red-500 text-xs mt-1">
                            Выберите хотя бы одну услугу
                        </p>
                    )}
                </div>

                <div className="flex items-center">
                    <input
                        id="doctor-showed"
                        type="checkbox"
                        name="showed"
                        checked={formData.showed}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                showed: e.target.checked,
                            }))
                        }
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                        htmlFor="doctor-showed"
                        className="text-sm text-gray-700 cursor-pointer"
                    >
                        Показывать врача на сайте
                    </label>
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={loading || selectedServices.length === 0}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading
                            ? "Сохранение..."
                            : editingDoctor
                            ? "Обновить"
                            : "Создать"}
                    </button>

                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            Отмена
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
