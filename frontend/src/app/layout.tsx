import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Súper Liga Villetana - App del Hincha",
    description: "Seguimiento en vivo, estadísticas e interacción para hinchas de la LVF.",
    manifest: "/manifest.json",
};

export const viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <body className="antialiased">
                <main className="min-h-screen bg-gray-50 dark:bg-black">
                    {children}
                </main>
            </body>
        </html>
    );
}
