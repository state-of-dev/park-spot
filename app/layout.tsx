import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ParkSpot CDMX - Estacionamiento para Eventos",
  description: "Plataforma de renta de estacionamientos para eventos masivos en CDMX",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.variable} antialiased`}>
        {children}
        <Toaster position="top-center" theme="dark" />
      </body>
    </html>
  );
}
