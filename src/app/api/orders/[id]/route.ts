import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../db";
import { authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        const orderId = (await params).id;
        const { status } = await request.json();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Требуется авторизация" },
                { status: 401 }
            );
        }

        if (!orderId) {
            return NextResponse.json(
                { error: "ID записи обязательно" },
                { status: 400 }
            );
        }

        if (!status) {
            return NextResponse.json(
                { error: "Статус обязателен" },
                { status: 400 }
            );
        }

        // Проверяем существование записи
        const existingOrder = await prisma.order.findUnique({
            where: { id: orderId },
        });

        if (!existingOrder) {
            return NextResponse.json(
                { error: "Запись не найдена" },
                { status: 404 }
            );
        }

        // Если запись уже занята другим пользователем
        if (
            existingOrder.status === "OCCUPIED" &&
            existingOrder.userID !== session.user.id
        ) {
            return NextResponse.json(
                { error: "Это время уже занято другим пользователем" },
                { status: 409 }
            );
        }

        // Обновляем запись
        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: {
                status,
                // При бронировании привязываем пользователя
                ...(status === "OCCUPIED" && { userID: session.user.id }),
                // При отмене освобождаем запись
                ...(status === "VACANT" && { userID: null }),
            },
            include: {
                service: true,
                doctor: true,
                user: true,
            },
        });

        return NextResponse.json(updatedOrder);
    } catch (error) {
        console.error("Ошибка при обновлении записи:", error);
        return NextResponse.json(
            { error: "Ошибка сервера при обновлении записи" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id;

        if (!id) {
            return NextResponse.json(
                { error: "ID записи обязательно" },
                { status: 400 }
            );
        }

        await prisma.order.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting order:", error);
        return NextResponse.json(
            { error: "Failed to delete order" },
            { status: 500 }
        );
    }
}
