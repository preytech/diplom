import prisma from "../../../../../db";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { writeFile } from "fs/promises";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const service = await prisma.service.findUnique({
            where: { id: (await params).id },
        });

        if (!service) {
            return NextResponse.json(
                { error: "Service not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(service);
    } catch (error) {
        console.error("Error fetching service:", error);
        return NextResponse.json(
            { error: "Failed to fetch service" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // const body = await request.json();
        // const { name, desc, prices, image } = body;
        const formData = await request.formData();
        const name = formData.get("name")?.toString();
        const desc = formData.get("desc")?.toString();
        const prices = formData.get("prices")?.toString();
        const categoryID = formData.get("categoryID")?.toString();
        const image = formData.get("image") as File | null;

        if (!name || !desc || !prices) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        const service = await prisma.service.update({
            where: { id: (await params).id },
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
        return NextResponse.json(service);
    } catch (error) {
        console.error("Error updating service:", error);
        return NextResponse.json(
            { error: "Failed to update service" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Проверяем, используется ли услуга врачами
        const doctorsWithService = await prisma.doctor.findMany({
            where: {
                service: {
                    some: {
                        id: (await params).id,
                    },
                },
            },
        });

        if (doctorsWithService.length > 0) {
            return NextResponse.json(
                { error: "Cannot delete service that is assigned to doctors" },
                { status: 400 }
            );
        }

        await prisma.service.delete({
            where: { id: (await params).id },
        });

        return NextResponse.json({ message: "Service deleted successfully" });
    } catch (error) {
        console.error("Error deleting service:", error);
        return NextResponse.json(
            { error: "Failed to delete service" },
            { status: 500 }
        );
    }
}
