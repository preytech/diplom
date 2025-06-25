"use server";

import { NextRequest, NextResponse } from "next/server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import prisma from "../../../../db";

// GET reviews for a specific doctor
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const doctorId = searchParams.get("doctorId");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");

        if (!doctorId) {
            return NextResponse.json(
                { error: "Doctor ID is required" },
                { status: 400 }
            );
        }

        const reviews = await prisma.review.findMany({
            where: {
                doctorID: doctorId,
                isApproved: true,
            },
            include: {
                user: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: {
                id: "desc",
            },
            skip: (page - 1) * limit,
            take: limit,
        });

        const totalReviews = await prisma.review.count({
            where: {
                doctorID: doctorId,
                isApproved: true,
            },
        });

        return NextResponse.json({
            reviews,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalReviews / limit),
                totalReviews,
            },
        });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return NextResponse.json(
            { error: "Failed to fetch reviews" },
            { status: 500 }
        );
    }
}

// POST a new review
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { doctorId, rate, text } = body;

        if (!doctorId || !rate || !text) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const newReview = await prisma.review.create({
            data: {
                userID: session.user.id,
                doctorID: doctorId,
                rate,
                text,
                isApproved: false, // Admin will need to approve the review
            },
        });

        return NextResponse.json(newReview, { status: 201 });
    } catch (error) {
        console.error("Error creating review:", error);
        return NextResponse.json(
            { error: "Failed to create review" },
            { status: 500 }
        );
    }
}
