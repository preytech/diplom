// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import ServiceForm from "./ServiceForm";

// interface Service {
//     id: string;
//     name: string;
//     desc: string;
//     prices: string;
//     image: string | null;
//     categoryId?: string | null;
// }

// interface Category {
//     id: string;
//     name: string;
// }

// interface ServiceTableProps {
//     services: Service[];
//     categories: Category[];
// }

// export default function ServiceTable({
//     services,
//     categories,
// }: ServiceTableProps) {
//     const [editingService, setEditingService] = useState<Service | null>(null);
//     const [isDeleting, setIsDeleting] = useState<string | null>(null);
//     const router = useRouter();

//     const handleDelete = async (id: string) => {
//         if (!confirm("Вы уверены, что хотите удалить эту услугу?")) return;

//         setIsDeleting(id);
//         try {
//             const response = await fetch(`/api/services/${id}`, {
//                 method: "DELETE",
//             });

//             if (response.ok) {
//                 router.refresh();
//             } else {
//                 alert("Ошибка при удалении услуги");
//             }
//         } catch (error) {
//             console.error("Error:", error);
//             alert("Ошибка при удалении услуги");
//         } finally {
//             setIsDeleting(null);
//         }
//     };

//     return (
//         <div>
//             {editingService && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                     <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
//                         <h3 className="text-lg font-semibold mb-4">
//                             Редактировать услугу
//                         </h3>
//                         <ServiceForm
//                             service={{
//                                 ...editingService,
//                                 image: editingService.image || undefined,
//                             }}
//                             onClose={() => setEditingService(null)}
//                         />
//                     </div>
//                 </div>
//             )}

//             <div className="overflow-x-auto">
//                 <table className="min-w-full bg-white border border-gray-300">
//                     <thead className="bg-gray-50">
//                         <tr>
//                             <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
//                                 Название
//                             </th>
//                             <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
//                                 Описание
//                             </th>
//                             <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
//                                 Категория
//                             </th>
//                             <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
//                                 Цены
//                             </th>
//                             <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
//                                 Изображение
//                             </th>
//                             <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
//                                 Действия
//                             </th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {services.map((service) => (
//                             <tr key={service.id} className="hover:bg-gray-50">
//                                 <td className="px-4 py-2 border-b font-medium">
//                                     {service.name}
//                                 </td>
//                                 <td className="px-4 py-2 border-b text-sm text-gray-600">
//                                     {service.desc.length > 50
//                                         ? `${service.desc.substring(0, 50)}...`
//                                         : service.desc}
//                                 </td>
//                                 <td className="px-4 py-2 border-b text-sm text-gray-600">
//                                     {categories.find(
//                                         (c) => c.id === service.categoryId
//                                     )?.name || "Без категории"}
//                                 </td>
//                                 <td className="px-4 py-2 border-b text-sm">
//                                     {service.prices}
//                                 </td>
//                                 <td className="px-4 py-2 border-b">
//                                     <img
//                                         src={`/services/${service.id}.webp`}
//                                         alt={service.name}
//                                         className="w-16 h-16 object-cover rounded"
//                                         onError={(e) => {
//                                             e.currentTarget.src =
//                                                 "/placeholder-image.jpg";
//                                         }}
//                                     />
//                                 </td>
//                                 <td className="px-4 py-2 border-b">
//                                     <div className="flex gap-2">
//                                         <button
//                                             onClick={() =>
//                                                 setEditingService(service)
//                                             }
//                                             className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
//                                         >
//                                             Изменить
//                                         </button>
//                                         <button
//                                             onClick={() =>
//                                                 handleDelete(service.id)
//                                             }
//                                             disabled={isDeleting === service.id}
//                                             className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 disabled:opacity-50"
//                                         >
//                                             {isDeleting === service.id
//                                                 ? "Удаление..."
//                                                 : "Удалить"}
//                                         </button>
//                                     </div>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>

//                 {services.length === 0 && (
//                     <div className="text-center py-8 text-gray-500">
//                         Услуги не найдены
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ServiceForm from "./ServiceForm";

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

export default function ServiceTable({
    services,
    categories,
}: ServiceTableProps) {
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const router = useRouter();

    const handleDelete = async (id: string) => {
        if (!confirm("Вы уверены, что хотите удалить эту услугу?")) return;

        setIsDeleting(id);
        try {
            const response = await fetch(`/api/services/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                router.refresh();
            } else {
                const errorData = await response.json();
                alert(errorData.error || "Ошибка при удалении услуги");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Ошибка при удалении услуги");
        } finally {
            setIsDeleting(null);
        }
    };

    return (
        <div className="space-y-4">
            {editingService && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">
                                Редактировать услугу
                            </h3>
                            <button
                                onClick={() => setEditingService(null)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        <ServiceForm
                            service={{
                                ...editingService,
                                image: editingService.image || undefined,
                            }}
                            onClose={() => setEditingService(null)}
                        />
                    </div>
                </div>
            )}

            <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                        <tr>
                            {[
                                "Название",
                                "Описание",
                                "Категория",
                                "Цены",
                                "Изображение",
                                "Действия",
                            ].map((header) => (
                                <th
                                    key={header}
                                    scope="col"
                                    className="px-3 py-3 text-left text-sm font-semibold text-gray-900"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {services.map((service) => (
                            <tr key={service.id} className="hover:bg-gray-50">
                                <td className="whitespace-nowrap px-3 py-4 font-medium">
                                    {service.name}
                                </td>
                                <td className="px-3 py-4 text-sm text-gray-600 max-w-xs truncate">
                                    {service.desc}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {categories.find(
                                        (c) => c.id === service.categoryID
                                    )?.name || "Без категории"}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm">
                                    {service.prices}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm">
                                    <img
                                        src={`/services/${service.id}.webp`}
                                        alt={service.name}
                                        className="w-16 h-16 object-cover rounded"
                                        onError={(e) => {
                                            e.currentTarget.src =
                                                "/placeholder-image.jpg";
                                        }}
                                    />
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() =>
                                                setEditingService(service)
                                            }
                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                                        >
                                            Изменить
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(service.id)
                                            }
                                            disabled={isDeleting === service.id}
                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none disabled:opacity-50"
                                        >
                                            {isDeleting === service.id
                                                ? "Удаление..."
                                                : "Удалить"}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {services.length === 0 && (
                    <div className="text-center py-12 text-gray-500 bg-white">
                        <p className="text-lg">Услуги не найдены</p>
                        <p className="text-sm mt-1">Добавьте первую услугу</p>
                    </div>
                )}
            </div>
        </div>
    );
}
