import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../../db";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const doctors = await prisma.doctor.findMany({
            where: {
                service: {
                    some: {
                        id: (await params).id,
                    },
                },
            },
            select: {
                id: true,
                name: true,
                image: true,
            },
        });

        return NextResponse.json(doctors);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch doctors" },
            { status: 500 }
        );
    }
}
