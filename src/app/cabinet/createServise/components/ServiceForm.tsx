"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ServiceFormProps {
    service?: {
        id: string;
        name: string;
        desc: string;
        prices: string;
        image: string;
        categoryId?: string;
    };
    onClose?: () => void;
}

interface Category {
    id: string;
    name: string;
}

export default function ServiceForm({ service, onClose }: ServiceFormProps) {
    const [formData, setFormData] = useState({
        name: service?.name || "",
        desc: service?.desc || "",
        prices: service?.prices || "",
        categoryId: service?.categoryId || "",
    });
    const [image, setImage] = useState<File | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Fetch existing categories
        const fetchCategories = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/categories`
                );
                if (response.ok) {
                    const data = await response.json();
                    setCategories(data);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (showNewCategoryInput && newCategoryName) {
                const categoryResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/categories`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ name: newCategoryName }),
                    }
                );

                if (categoryResponse.ok) {
                    const newCategory = await categoryResponse.json();
                    formData.categoryId = newCategory.id;
                } else {
                    throw new Error("Failed to create category");
                }
            }
            const formDataToSend = new FormData();
            formDataToSend.append("name", formData.name);
            formDataToSend.append("desc", formData.desc);
            formDataToSend.append("prices", formData.prices);
            formDataToSend.append("categoryId", formData.categoryId);
            console.log(image);
            if (image) {
                formDataToSend.append("image", image, image.name);
            }

            const url = service
                ? `${process.env.NEXT_PUBLIC_API_URL}/api/services/${service.id}`
                : `${process.env.NEXT_PUBLIC_API_URL}/api/services`;

            const method = service ? "PUT" : "POST";
            const response = await fetch(url, {
                method,
                body: formDataToSend,
            });

            if (response.ok) {
                setFormData({ name: "", desc: "", prices: "", categoryId: "" });
                setImage(null);
                router.refresh();
                if (onClose) onClose();
            } else {
                const errorText = await response.text();
                console.error("Server Error:", errorText);
                alert(errorText);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Ошибка при сохранении услуги");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            console.log(e.target.files[0]);
            setImage(e.target.files[0]);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-white p-6 rounded-lg shadow"
        >
            <div>
                <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    Название услуги
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label
                    htmlFor="desc"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    Описание
                </label>
                <textarea
                    id="desc"
                    name="desc"
                    value={formData.desc}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label
                    htmlFor="prices"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    Цены
                </label>
                <input
                    type="text"
                    id="prices"
                    name="prices"
                    value={formData.prices}
                    onChange={handleChange}
                    required
                    placeholder="например: от 1000 руб"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div>
                <label
                    htmlFor="categoryId"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    Категория
                </label>
                <div className="flex items-center space-x-2">
                    <select
                        id="categoryId"
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Выберите категорию</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <button
                        type="button"
                        onClick={() =>
                            setShowNewCategoryInput(!showNewCategoryInput)
                        }
                        className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
                    >
                        {showNewCategoryInput ? "Отмена" : "Создать"}
                    </button>
                </div>

                {showNewCategoryInput && (
                    <div className="mt-2">
                        <input
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="Введите название новой категории"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                )}
            </div>
            <div>
                <label
                    htmlFor="image"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    Изображение
                </label>
                <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="flex gap-2">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    {isSubmitting
                        ? "Сохранение..."
                        : service
                        ? "Обновить"
                        : "Добавить"}
                </button>
                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Отмена
                    </button>
                )}
            </div>
        </form>
    );
}
