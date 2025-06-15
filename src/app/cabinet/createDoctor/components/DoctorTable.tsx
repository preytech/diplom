"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import DoctorForm from "./DoctorForm";

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

interface DoctorTableProps {
    doctors: Doctor[];
}

export default function DoctorTable({ doctors }: DoctorTableProps) {
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
    const router = useRouter();
    const toggleRowExpansion = (doctorId: string) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(doctorId)) {
            newExpanded.delete(doctorId);
        } else {
            newExpanded.add(doctorId);
        }
        setExpandedRows(newExpanded);
    };

    if (doctors.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">Врачи не найдены</p>
            </div>
        );
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Вы уверены, что хотите удалить эту врача?")) return;

        setIsDeleting(id);
        try {
            const response = await fetch(`/api/doctors/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                router.refresh();
            } else {
                alert("Ошибка при удалении врача");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Ошибка при удалении врача");
        } finally {
            setIsDeleting(null);
        }
    };

    return (
        <div className="overflow-x-auto">
            {editingDoctor && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">
                            Редактировать врача
                        </h3>
                        <DoctorForm
                            editingDoctor={editingDoctor}
                            onCancel={() => setEditingDoctor(null)}
                        />
                    </div>
                </div>
            )}
            <table className="min-w-full bg-white border border-gray-300">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            ФИО
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            Описание
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            Рейтинг
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            Услуги
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            Показывать
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            Действия
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {doctors.map((doctor) => (
                        <>
                            <tr key={doctor.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">
                                    {doctor.id.slice(0, 8)}...
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-b">
                                    {doctor.name}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900 border-b max-w-xs">
                                    <div
                                        className="truncate"
                                        title={doctor.desc}
                                    >
                                        {doctor.desc.length > 100
                                            ? `${doctor.desc.slice(0, 100)}...`
                                            : doctor.desc}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">
                                    <div className="flex items-center">
                                        <span className="mr-1">
                                            {doctor.rating}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">
                                    <div className="flex items-center">
                                        <span className="mr-2">
                                            {doctor.service.length} услуг(и)
                                        </span>
                                        <button
                                            onClick={() =>
                                                toggleRowExpansion(doctor.id)
                                            }
                                            className="text-blue-600 hover:text-blue-800 focus:outline-none focus:underline"
                                            aria-label={`${
                                                expandedRows.has(doctor.id)
                                                    ? "Скрыть"
                                                    : "Показать"
                                            } услуги врача ${doctor.name}`}
                                        >
                                            {expandedRows.has(doctor.id)
                                                ? "▼"
                                                : "▶"}
                                        </button>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">
                                    <span
                                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            doctor.showed
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        {doctor.showed ? "Да" : "Нет"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium border-b">
                                    <button
                                        onClick={() => setEditingDoctor(doctor)}
                                        className="text-indigo-600 hover:text-indigo-900 mr-4 focus:outline-none focus:underline"
                                        aria-label={`Редактировать врача ${doctor.name}`}
                                    >
                                        Редактировать
                                    </button>
                                    <button
                                        onClick={() => handleDelete(doctor.id)}
                                        className="text-red-600 hover:text-red-900 focus:outline-none focus:underline"
                                        aria-label={`Удалить врача ${doctor.name}`}
                                    >
                                        Удалить
                                    </button>
                                </td>
                            </tr>
                            {expandedRows.has(doctor.id) && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-6 py-4 bg-gray-50 border-b"
                                    >
                                        <div className="space-y-2">
                                            <h4 className="font-medium text-gray-900">
                                                Услуги врача:
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                {doctor.service.map(
                                                    (service) => (
                                                        <div
                                                            key={service.id}
                                                            className="bg-white p-3 rounded border"
                                                        >
                                                            <h5 className="font-medium text-sm">
                                                                {service.name}
                                                            </h5>
                                                            <p className="text-xs text-gray-600 mt-1">
                                                                {service.desc}
                                                            </p>
                                                            <p className="text-sm font-semibold text-green-600 mt-1">
                                                                {service.prices}
                                                            </p>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
