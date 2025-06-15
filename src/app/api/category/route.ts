import { NextResponse } from "next/server";
import prisma from "../../../../db";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const name = formData.get("name")?.toString();

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
