import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Sistema Nicopel",
  description: "Gestão de Compras e Estoque",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning={true}>
      {/* O fundo base já está definido no globals.css via @apply */}
      <body>
        <div className="flex min-h-screen">
          <Sidebar />
          
          {/* ml-64 = margem esquerda de 16rem (256px) para dar espaço ao menu fixo 
             flex-1 = ocupa o resto do espaço
             min-h-screen = garante altura total
          */}
          <main className="flex-1 ml-64 bg-slate-50 min-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}