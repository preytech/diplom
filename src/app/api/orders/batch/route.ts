import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../db";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { date, time, serviceID, doctorID, createFor } = body;

        const { DateTime } = require("luxon");
        if (!date || !serviceID || !doctorID || !createFor) {
            return NextResponse.json(
                { error: "Все поля обязательны" },
                { status: 400 }
            );
        }

        const orders = [];

        if (createFor === "day") {
            // Create for all working hours (8:00-20:00)
            for (let hour = 8; hour < 20; hour++) {
                const orderDate = DateTime.fromISO(date)
                    .set({ hour, minute: 0 })
                    .toJSDate();

                const order = await prisma.order.create({
                    data: {
                        serviceID,
                        doctorID,
                        status: "VACANT",
                        date: orderDate,
                        userID: null,
                    },
                    include: {
                        service: true,
                        doctor: true,
                    },
                });

                orders.push(order);
            }
        } else {
            // Create for specific time
            if (!time) {
                return NextResponse.json(
                    {
                        error: "Время обязательно",
                    },
                    { status: 400 }
                );
            }

            const [hours, minutes] = time.split(":").map(Number);
            const orderDate = DateTime.fromISO(date)
                .set({ hour: hours, minute: minutes })
                .toJSDate();

            const order = await prisma.order.create({
                data: {
                    serviceID,
                    doctorID,
                    status: "VACANT",
                    date: orderDate,
                    userID: null,
                },
                include: {
                    service: true,
                    doctor: true,
                },
            });

            orders.push(order);
        }

        return NextResponse.json(orders);
    } catch (error) {
        console.error("Error creating orders:", error);
        return NextResponse.json(
            { error: "Failed to create orders" },
            { status: 500 }
        );
    }
}
