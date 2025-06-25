"use client";

import { useState } from "react";
import { SessionProvider, useSession } from "next-auth/react";

interface ReviewFormProps {
    doctorId: string;
}

export default function ReviewFormWrapper({ doctorId }: ReviewFormProps) {
    return (
        <SessionProvider>
            <ReviewForm doctorId={doctorId} />
        </SessionProvider>
    );
}

function ReviewForm({ doctorId }: ReviewFormProps) {
    const { data: session } = useSession();
    const [rating, setRating] = useState(5);
    const [reviewText, setReviewText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!session) return;

        setIsSubmitting(true);
        try {
            const response = await fetch("/api/reviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    doctorId,
                    rate: rating,
                    text: reviewText,
                    userID: session.user.id,
                }),
            });

            if (response.ok) {
                setReviewText("");
                setRating(5);
                setSubmitSuccess(true);
                setTimeout(() => setSubmitSuccess(false), 3000);
            }
        } catch (error) {
            console.error("Failed to submit review", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!session) {
        return (
            <div className="mt-6 p-4 bg-gray-100 rounded-lg text-center">
                Пожалуйста, войдите, чтобы оставить отзыв
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="mt-6 bg-white shadow-md rounded-lg p-6"
            aria-labelledby="review-form-heading"
        >
            <h2 id="review-form-heading" className="text-xl font-semibold mb-4">
                Оставить отзыв
            </h2>

            <div className="mb-4">
                <label
                    htmlFor="rating-input"
                    className="block mb-2 font-medium"
                >
                    Оценка
                </label>
                <div className="flex" id="rating-input">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className={`text-2xl focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                                rating >= star
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                            }`}
                            aria-label={`Оценить на ${star} звезд`}
                            aria-pressed={rating === star}
                        >
                            ★
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-4">
                <label htmlFor="review-text" className="block mb-2 font-medium">
                    Ваш отзыв
                </label>
                <textarea
                    id="review-text"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                    rows={4}
                    required
                    placeholder="Поделитесь вашим мнением о враче"
                    aria-describedby="review-text-help"
                />
                <p id="review-text-help" className="text-sm text-gray-500 mt-1">
                    Напишите ваш отзыв о посещении врача
                </p>
            </div>

            <div className="flex items-center gap-4">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                    {isSubmitting ? "Отправка..." : "Отправить отзыв"}
                </button>

                {submitSuccess && (
                    <p className="text-green-600">Отзыв успешно отправлен!</p>
                )}
            </div>
        </form>
    );
}
