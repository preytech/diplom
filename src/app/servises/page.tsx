import prisma from "../../../db";
import Services from "./components/servisesList";

export default async function ServicesPage() {
    const services = await prisma.service.findMany({
        orderBy: { name: "asc" },
    });

    const categories = await prisma.category.findMany({
        orderBy: { name: "asc" },
    });

    return <Services services={services} categories={categories} />;
}
