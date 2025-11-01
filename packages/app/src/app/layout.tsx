import "./globals.css";
import type { Metadata } from "next";
import Footer from "./components/footer";

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
        <html lang="fa" dir="rtl">
            <body className="min-h-screen flex items-center justify-center">
                <div className="w-full max-w-sm mx-auto px-4">
                    {children}
                </div>
                <Footer />
            </body>
        </html>
    );
}





