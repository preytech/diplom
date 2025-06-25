import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../db";
export async function GET(request: NextRequest) {
    try {
        const orders = await prisma.order.findMany({
            include: {
                service: true,
                doctor: {
                    include: {
                        service: true,
                    },
                },
                user: true,
            },
            orderBy: {
                date: "asc",
            },
        });
        return NextResponse.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json(
            { error: "Failed to fetch orders" },
            { status: 500 }
        );
    }
}
