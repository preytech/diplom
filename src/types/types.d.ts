import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name?: string | null;
            phone?: string | null;
            role?: string | null;
        };
    }

    interface User {
        id: string;
        name?: string | null;
        phone?: string | null;
        role?: string | null;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        name?: string | null;
        phone?: string | null;
        role?: string | null;
    }
}

export interface Service {
    id: string;
    name: string;
    desc: string;
    prices: string;
    image: string;
}

export interface Doctor {
    id: string;
    name: string;
    desc: string;
    image: string;
    rating: number;
    showed: boolean;
    servise: Service[];
}

export interface CreateDoctorData {
    name: string;
    desc: string;
    image: string;
    rating: number;
    showed: boolean;
    serviceIds: string[];
}

export interface UpdateDoctorData extends Partial<CreateDoctorData> {
    id: string;
}
