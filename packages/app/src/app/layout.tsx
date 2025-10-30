import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Madar Market",
    description: "Madar Market Application",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ar" dir="rtl">
            <body>{children}</body>
        </html>
    );
}




