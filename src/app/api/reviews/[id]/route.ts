import { NextResponse } from "next/server";
import prisma from "../../../../../db";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const updatedReview = await prisma.review.update({
        where: { id: (await params).id },
        data: { isApproved: true },
        include: { doctor: true },
    });

    void updateDoctorRating(updatedReview.doctorID);

    return NextResponse.json(updatedReview);
}

async function updateDoctorRating(doctorId: string) {
    const aggregated = await prisma.review.aggregate({
        where: { doctorID: doctorId, isApproved: true },
        _avg: { rate: true },
        _count: { rate: true },
    });

    await prisma.doctor.update({
        where: { id: doctorId },
        data: {
            rating: aggregated._avg.rate ?? 0,
        },
    });
}
