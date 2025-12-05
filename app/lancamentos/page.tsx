import { getCompras } from '@/lib/googleSheets';
import Link from 'next/link';
import { Layers } from 'lucide-react';
import LancamentosClient from './LancamentosClient'; // Importa nosso novo componente

export const dynamic = 'force-dynamic';

export default async function Lancamentos() {
  const compras = await getCompras();

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Cabeçalho */}
        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Layers className="text-blue-600" />
              Lançamentos Agrupados
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Visualização hierárquica por Item
            </p>
          </div>
          <Link href="/" className="btn-primary no-underline text-sm">
            Voltar ao Dashboard
          </Link>
        </div>

        {/* Aqui entra o Componente Cliente com a lógica de Pesquisa e Agrupamento */}
        <LancamentosClient compras={compras} />
        
      </div>
    </div>
  );
}