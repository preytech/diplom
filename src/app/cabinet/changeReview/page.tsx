// app/cabinet/changeReview/page.tsx
import prisma from "../../../../db";
import { Doctor, Review, User } from "../../../../prisma/prisma-client";
import ReviewsList from "./components/ReviewList";

interface ReviewWithDetails extends Review {
    user: User;
    doctor: Doctor;
}

export default async function ReviewsPage() {
    const reviews = await prisma.review.findMany({
        include: {
            user: true,
            doctor: true,
        },
        where: {
            isApproved: false,
        },
    });

    return <ReviewsList initialReviews={reviews} />;
}
