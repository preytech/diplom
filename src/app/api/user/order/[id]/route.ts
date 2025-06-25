// app/api/user/orders/[orderId]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from "../../../../../../db";

export async function GET(
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

        const order = await prisma.order.findUnique({
            where: {
                id: orderId,
                userID: session.user.id, // Гарантируем, что запись принадлежит пользователю
            },
            include: {
                service: true,
                doctor: {
                    include: {
                        service: true,
                    },
                },
                user: true,
            },
        });

        if (!order) {
            return NextResponse.json(
                { error: "Запись не найдена или нет доступа" },
                { status: 404 }
            );
        }

        return NextResponse.json(order);
    } catch (error) {
        console.error("Ошибка при получении записи:", error);
        return NextResponse.json(
            { error: "Ошибка сервера при получении записи" },
            { status: 500 }
        );
    }
}
