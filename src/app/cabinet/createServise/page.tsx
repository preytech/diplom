import ServiceTable from "./components/ServiceTable";
import ServiceForm from "./components/ServiceForm";
import prisma from "../../../../db";

export default async function ServicesPage() {
    const services = await prisma.service.findMany({
        orderBy: { name: "asc" },
    });

    return (
        <div className="p-6">
            <h1 className="font-bold text-black text-2xl mb-6">
                Управление услугами
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h2 className="font-semibold text-lg mb-4">
                        Добавить новую услугу
                    </h2>
                    <ServiceForm />
                </div>

                <div>
                    <h2 className="font-semibold text-lg mb-4">Список услуг</h2>
                    <ServiceTable services={services} />
                </div>
            </div>
        </div>
    );
}
