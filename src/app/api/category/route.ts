import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../db";

export async function POST(request: Request) {
    try {
        const { name } = await request.json();

        if (!name) {
            return NextResponse.json(
                { error: "Имя обязательно" },
                { status: 400 }
            );
        }

        const category = await prisma.category.create({
            data: {
                name,
            },
        });

        return NextResponse.json(category, { status: 201 });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { message: "Ошибка при создании товара" },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    const result = await prisma.category.findMany({
        select: {
            id: true,
            name: true,
        },
    });

    if (!result) {
        return new Response(JSON.stringify([]), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    return new Response(JSON.stringify(result), {
        status: 201,
        headers: { "Content-Type": "application/json" },
    });
}
