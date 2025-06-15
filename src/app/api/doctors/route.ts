import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../db";
import fs from "fs";
import path from "path";
import { writeFile } from "fs/promises";

export async function POST(request: NextRequest) {
    try {
        // const body = await request.json();
        // const { name, desc, image, rating, showed, servise } = body;
        const formData = await request.formData();
        const name = formData.get("name")?.toString();
        const desc = formData.get("desc")?.toString();
        const servicesInput = formData.get("service")?.toString();
        const showed = formData.get("showed") != null;
        const image = formData.get("image") as File | null;
        console.log(formData.entries());
        if (!name || !servicesInput || !desc || !showed) {
            return NextResponse.json(
                { error: "Все поля обязательны для заполнения" },
                { status: 400 }
            );
        }

        const services: { id: string }[] = JSON.parse(servicesInput);

        const serviceConnections = services.map((id) => ({ id }));

        // Создаем врача с связанными услугами
        const doctor = await prisma.doctor.create({
            data: {
                name,
                desc,
                image: "",
                rating: 0,
                showed,
                service: {
                    connect: serviceConnections,
                },
            },
            include: {
                service: true,
            },
        });

        if (image && image.size > 0) {
            const uploadDir = `${process.cwd()}/public/doctors`;
            const bytes = await image.arrayBuffer();
            const buffer = Buffer.from(bytes);

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const fileName = `${doctor.id}.webp`;
            const filePath = path.join(uploadDir, fileName);
            await writeFile(filePath, buffer);
        }

        return NextResponse.json(doctor);
    } catch (error) {
        console.error("Ошибка при создании врача:", error);
        return NextResponse.json(
            { error: "Ошибка при создании врача" },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, name, desc, image, rating, showed, servise } = body;

        // Обновляем врача с новыми услугами
        const doctor = await prisma.doctor.update({
            where: { id },
            data: {
                name,
                desc,
                image,
                rating,
                showed,
                service: {
                    set: servise.map((service: { id: string }) => ({
                        id: service.id,
                    })),
                },
            },
            include: {
                service: true,
            },
        });

        return NextResponse.json(doctor);
    } catch (error) {
        console.error("Ошибка при обновлении врача:", error);
        return NextResponse.json(
            { error: "Ошибка при обновлении врача" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { error: "ID врача не указан" },
                { status: 400 }
            );
        }

        await prisma.doctor.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Ошибка при удалении врача:", error);
        return NextResponse.json(
            { error: "Ошибка при удалении врача" },
            { status: 500 }
        );
    }
}
