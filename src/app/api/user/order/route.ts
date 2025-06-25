// app/api/user/orders/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import prisma from "../../../../../db";

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Необходима авторизация" },
                { status: 401 }
            );
        }

        // Получаем записи пользователя
        const orders = await prisma.order.findMany({
            where: {
                userID: session.user.id,
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
            orderBy: {
                date: "asc",
            },
        });

        // Автоматически архивируем прошедшие записи
        const now = new Date();
        const updatePromises = orders
            .filter(
                (order) =>
                    order.status === "OCCUPIED" && new Date(order.date) < now
            )
            .map((order) =>
                prisma.order.update({
                    where: { id: order.id },
                    data: { status: "ARCHIVED" },
                })
            );

        await Promise.all(updatePromises);

        // Если были обновления, получаем свежие данные
        const updatedOrders =
            updatePromises.length > 0
                ? await prisma.order.findMany({
                      where: {
                          userID: session.user.id,
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
                      orderBy: {
                          date: "asc",
                      },
                  })
                : orders;

        return NextResponse.json(updatedOrders);
    } catch (error) {
        console.error("Ошибка при получении записей:", error);
        return NextResponse.json(
            { error: "Ошибка сервера при получении записей" },
            { status: 500 }
        );
    }
}
