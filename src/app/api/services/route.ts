import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../db";
import fs from "fs";
import path from "path";
import { writeFile } from "fs/promises";

export async function GET() {
    try {
        const services = await prisma.service.findMany({
            orderBy: { name: "asc" },
        });

        return NextResponse.json(services);
    } catch (error) {
        console.error("Ошибка при получении услуг:", error);
        return NextResponse.json(
            { error: "Ошибка при получении услуг" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const name = formData.get("name")?.toString();
        const desc = formData.get("desc")?.toString();
        const prices = formData.get("prices")?.toString();
        const categoryID = formData.get("categoryID")?.toString();
        const image = formData.get("image") as File | null;

        if (!name || !prices || !desc) {
            return NextResponse.json(
                { error: "Все поля обязательны для заполнения" },
                { status: 400 }
            );
        }

        const service = await prisma.service.create({
            data: {
                name,
                desc,
                prices,
                image: "",
                categoryID,
            },
        });

        if (image && image.size > 0) {
            const uploadDir = `${process.cwd()}/public/services`;
            const bytes = await image.arrayBuffer();
            const buffer = Buffer.from(bytes);

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const fileName = `${service.id}.webp`;
            const filePath = path.join(uploadDir, fileName);
            await writeFile(filePath, buffer);
        }

        return NextResponse.json(service, { status: 201 });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { message: "Ошибка при создании товара" },
            { status: 500 }
        );
    }
}
