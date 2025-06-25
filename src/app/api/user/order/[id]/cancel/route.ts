// app/api/user/orders/[orderId]/cancel/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from "../../../../../../../db";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        const orderId = (await params).id;

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Необходима авторизация" },
                { status: 401 }
            );
        }

        if (!orderId) {
            return NextResponse.json(
                { error: "ID записи обязательно" },
                { status: 400 }
            );
        }

        // Проверяем принадлежность записи пользователю
        const order = await prisma.order.findUnique({
            where: { id: orderId },
        });

        if (!order) {
            return NextResponse.json(
                { error: "Запись не найдена" },
                { status: 404 }
            );
        }

        if (order.userID !== session.user.id) {
            return NextResponse.json(
                { error: "Нет доступа к этой записи" },
                { status: 403 }
            );
        }

        // Проверяем статус записи
        if (order.status !== "OCCUPIED") {
            return NextResponse.json(
                { error: "Можно отменять только активные записи" },
                { status: 400 }
            );
        }

        // Обновляем статус записи
        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { status: "CANCELED" },
            include: {
                service: true,
                doctor: true,
                user: true,
            },
        });

        return NextResponse.json(updatedOrder);
    } catch (error) {
        console.error("Ошибка при отмене записи:", error);
        return NextResponse.json(
            { error: "Ошибка сервера при отмене записи" },
            { status: 500 }
        );
    }
}
