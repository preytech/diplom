import prisma from "../../../db";
import Doctors from "./components/doctorList";

export default async function DoctorsPage() {
    const doctors = await prisma.doctor.findMany({
        orderBy: { name: "asc" },
    });

    return <Doctors doctors={doctors} />;
}
