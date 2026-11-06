import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google"; // Corrected import
import "./globals.css";
import clsx from "clsx";
import SessionProvider from "@/components/providers/SessionProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-jetbrains-mono"
});

export const metadata: Metadata = {
    title: "NUMU | Ciberseguridad y Transformación Digital",
    description: "Venture Builder & Cybersecurity Expert in Panama/Latam.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <body className={clsx(inter.variable, jetbrainsMono.variable, "antialiased bg-cyber-dark text-foreground min-h-screen selection:bg-cyber-primary selection:text-cyber-black")}>
                <SessionProvider>
                    <ThemeProvider>
                        {children}
                    </ThemeProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
