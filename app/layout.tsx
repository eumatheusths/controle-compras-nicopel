import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sistema Nicopel",
  description: "Gestão de Compras",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning={true}>
      <body className={inter.className}>
        <div className="layout-wrapper">
          {/* Menu Lateral Seguro */}
          <div className="sidebar-container">
            <Sidebar />
          </div>
          
          {/* Conteúdo Principal Seguro */}
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}