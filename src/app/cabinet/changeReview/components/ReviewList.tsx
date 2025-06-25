"use client";

import { useState } from "react";
import { Review, User, Doctor } from "../../../../../prisma/prisma-client";

interface ReviewWithDetails extends Review {
    user: User;
    doctor: Doctor;
}

interface ReviewsListProps {
    initialReviews: ReviewWithDetails[];
}

export default function ReviewsList({ initialReviews }: ReviewsListProps) {
    const [reviews, setReviews] = useState<ReviewWithDetails[]>(initialReviews);

    const handleApproveReview = async (reviewId: string) => {
        try {
            const response = await fetch(`/api/reviews/${reviewId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                setReviews((prevReviews) =>
                    prevReviews.map((review) =>
                        review.id === reviewId
                            ? { ...review, isApproved: true }
                            : review
                    )
                );
            } else {
                console.error(
                    "Failed to approve review:",
                    await response.text()
                );
            }
        } catch (error) {
            console.error("Error approving review:", error);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Управление отзывами</h1>
            {reviews.map((review) => (
                <div
                    key={review.id}
                    className={`mb-4 p-4 rounded ${
                        review.isApproved
                            ? "bg-green-100 border-green-300"
                            : "bg-yellow-100 border-yellow-300"
                    } border`}
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-bold">
                                Доктор: {review.doctor.name}
                            </p>
                            <p className="text-gray-600">
                                Пациент: {review.user.name}
                            </p>
                            <p className="mt-2">{review.text}</p>
                            <p className="text-sm text-gray-500">
                                Рейтинг: {review.rate}/5
                            </p>
                        </div>
                        {!review.isApproved && (
                            <button
                                onClick={() => handleApproveReview(review.id)}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            >
                                Одобрить
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
