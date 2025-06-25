import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../db";

export async function POST(request: NextRequest) {
    try {
        const { filter } = await request.json();

        if (!filter?.date) {
            return NextResponse.json(
                { error: "Дата обязательна" },
                { status: 400 }
            );
        }

        // Обновляем статус отфильтрованных записей
        await prisma.order.updateMany({
            where: filter,
            data: {
                status: "CANCELED",
            },
        });

        // Получаем обновленные записи для возврата
        const orders = await prisma.order.findMany({
            where: filter,
            include: {
                service: true,
                doctor: true,
                user: true,
            },
            orderBy: {
                date: "asc",
            },
        });

        return NextResponse.json(orders);
    } catch (error) {
        console.error("Error canceling filtered orders:", error);
        return NextResponse.json(
            { error: "Failed to cancel filtered orders" },
            { status: 500 }
        );
    }
}
