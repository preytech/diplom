import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Footer from "@/components/footer";
import HeaderWrapper from "@/components/header/header";

export const metadata: Metadata = {
    title: "Dentique",
    description: "Dentique",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ru">
            <body>
                <HeaderWrapper />
                {children}
                <Footer />
            </body>
        </html>
    );
}
