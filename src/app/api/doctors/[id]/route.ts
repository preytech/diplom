import { UpdateDoctorData } from "@/types/types";
import prisma from "../../../../../db";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { writeFile } from "fs/promises";

interface RouteParams {
    params: {
        id: string;
    };
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
    try {
        // const { id } = params;
        // const body: UpdateDoctorData = await request.json();
        // const { name, desc, image, rating, showed, serviceIds } = body;
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
        const doctor = await prisma.doctor.update({
            where: { id: (await params).id },
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
        console.error("Error updating doctor:", error);
        return NextResponse.json(
            { error: "Ошибка при обновлении врача" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
    try {
        const id = (await params).id;

        // Проверка существования врача
        const existingDoctor = await prisma.doctor.findUnique({
            where: { id },
        });

        if (!existingDoctor) {
            return NextResponse.json(
                { error: "Врач не найден" },
                { status: 404 }
            );
        }

        // Удаление врача (связи с услугами удалятся автоматически)
        await prisma.doctor.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Врач успешно удален" });
    } catch (error) {
        console.error("Error deleting doctor:", error);
        return NextResponse.json(
            { error: "Ошибка при удалении врача" },
            { status: 500 }
        );
    }
}

// export async function GET(
//     request: NextRequest,
//     { params }: RouteParams
// ): Promise<NextResponse> {
//     try {
//         const { id } = params;

//         const doctor = await prisma.doctor.findUnique({
//             where: { id },
//             include: {
//                 service: true,
//             },
//         });

//         if (!doctor) {
//             return NextResponse.json(
//                 { error: "Врач не найден" },
//                 { status: 404 }
//             );
//         }

//         return NextResponse.json(doctor);
//     } catch (error) {
//         console.error("Error fetching doctor:", error);
//         return NextResponse.json(
//             { error: "Ошибка при получении данных врача" },
//             { status: 500 }
//         );
//     }
// }
