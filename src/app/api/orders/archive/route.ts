import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import prisma from "../../../../../db";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Требуется авторизация" },
                { status: 401 }
            );
        }

        // Получаем только архивные записи пользователя
        const archivedOrders = await prisma.order.findMany({
            where: {
                userID: session.user.id,
                status: "ARCHIVED",
            },
            include: {
                service: true,
                doctor: true,
                user: true,
            },
            orderBy: {
                date: "desc", // Сначала новые записи
            },
        });

        return NextResponse.json(archivedOrders);
    } catch (error) {
        console.error("Error fetching archived orders:", error);
        return NextResponse.json(
            { error: "Ошибка сервера при получении архива записей" },
            { status: 500 }
        );
    }
}
