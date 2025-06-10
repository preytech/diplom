import { NextAuthOptions } from "next-auth";
import prisma from "../../../../../db";
import bcrypt from "bcryptjs";
import { User } from "../../../../../prisma/prisma-client";
import Credentials from "next-auth/providers/credentials";

export const options: NextAuthOptions = {
    providers: [
        Credentials({
            name: "Аккаунт",
            credentials: {
                phone: { label: "phone", type: "text" },
                password: { label: "Password", type: "password" },
            },

            async authorize(credentials, req) {
                if (!credentials?.phone || !credentials?.password) {
                    return null;
                }
                const user: User | null = await prisma.user.findUnique({
                    where: {
                        phone: credentials?.phone,
                    },
                });

                if (
                    user &&
                    (await bcrypt.compare(credentials?.password, user.password))
                ) {
                    return user;
                } else {
                    return null;
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,

    pages: {
        signIn: "/auth/login",
        error: "/auth/error",
        verifyRequest: "/auth/verify",
        newUser: "/auth/register",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                console.log("user", user);
                token.name = user.name;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            console.log("token", token);

            if (!token.sub || !token.name) return session;

            session.user.id = token.sub;
            session.user.name = token.name;
            session.user.role = token.role;

            console.log("session", session);

            return session;
        },
    },
};
