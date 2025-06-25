"use client";

import { useState, useEffect } from "react";

interface Review {
    id: string;
    user: {
        name: string;
    };
    rate: number;
    text: string;
    createdAt: Date;
}

interface ApiResponse {
    reviews: Review[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalReviews: number;
    };
}

export default function ReviewList({ doctorId }: { doctorId: string }) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 0,
        totalReviews: 0,
    });

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch(
                    `/api/reviews?doctorId=${doctorId}`
                );

                if (!response.ok) {
                    throw new Error(`Ошибка загрузки: ${response.status}`);
                }

                const data: ApiResponse = await response.json();

                if (!data || !Array.isArray(data.reviews)) {
                    throw new Error("Некорректный формат ответа");
                }

                setReviews(data.reviews);
                setPagination(data.pagination);
            } catch (error) {
                console.error("Ошибка при загрузке отзывов:", error);
                setError(
                    error instanceof Error
                        ? error.message
                        : "Неизвестная ошибка"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [doctorId]);

    if (loading) return <div>Загрузка отзывов...</div>;
    if (error)
        return (
            <div className="text-red-500 p-4 bg-red-50 rounded-lg">{error}</div>
        );

    if (reviews.length === 0) {
        return (
            <div className="mt-6 p-4 bg-gray-100 rounded-lg text-center">
                Пока нет отзывов
            </div>
        );
    }

    return (
        <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Отзывы</h2>
            {reviews.map((review) => (
                <div
                    key={review.id}
                    className="bg-white shadow-md rounded-lg p-4 mb-4"
                >
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">{review.user.name}</h3>
                        <div className="flex items-center text-yellow-400">
                            {"★".repeat(review.rate)}
                            {"☆".repeat(5 - review.rate)}
                        </div>
                    </div>
                    <p className="text-gray-700">{review.text}</p>
                </div>
            ))}

            {/* Пагинация (если нужно) */}
            {pagination.totalPages > 1 && (
                <div className="mt-4 flex justify-center">
                    <span className="text-gray-600">
                        Страница {pagination.currentPage} из{" "}
                        {pagination.totalPages}
                    </span>
                </div>
            )}
        </div>
    );
}
