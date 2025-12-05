import { getCompras } from '@/lib/googleSheets';
import Link from 'next/link';
import { List, DollarSign, TrendingUp, BarChart3 } from 'lucide-react';
import ImportadorPlanilha from '@/components/ImportadorPlanilha';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function Dashboard() {
  const compras = await getCompras();
  const totalGasto = compras.reduce((acc, item) => acc + item.valorTotal, 0);
  const gastosPorEmpresa = compras.reduce((acc, item) => {
    const empresaNome = item.empresa || 'Outros';
    acc[empresaNome] = (acc[empresaNome] || 0) + item.valorTotal;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* --- CABEÇALHO (Card Branco) --- */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Visão Geral
            </h1>
            <p className="text-slate-500 mt-1">Resumo financeiro e operacional</p>
          </div>
          
          <div className="flex flex-wrap gap-3 items-center">
            <Link 
              href="/lancamentos" 
              className="flex items-center gap-2 bg-white border-2 border-slate-200 px-4 py-2.5 rounded-lg hover:border-corporate-blue hover:text-corporate-blue transition font-semibold text-slate-600"
            >
              <List size={18} /> Ver Lançamentos
            </Link>
            <ImportadorPlanilha />
          </div>
        </div>

        {/* --- KPIS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card Total (Destaque Azul) */}
          <div className="bg-corporate-blue p-6 rounded-2xl shadow-lg shadow-blue-500/20 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 bg-white/10 w-24 h-24 rounded-full blur-2xl"></div>
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <p className="text-blue-100 text-sm font-medium uppercase tracking-wider mb-2">Total Consolidado</p>
                <h3 className="text-4xl font-bold">
                  {totalGasto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </h3>
              </div>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <DollarSign size={28} className="text-white" />
              </div>
            </div>
          </div>

          {/* Cards por Empresa (Brancos) */}
          {Object.entries(gastosPorEmpresa).map(([empresa, valor]) => (
            <div key={empresa} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-corporate-blue ring-4 ring-blue-50"></span>
                  <p className="text-sm font-bold uppercase text-slate-500 tracking-wide">{empresa}</p>
                </div>
                <TrendingUp className="text-slate-300 group-hover:text-corporate-blue transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">
                {valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </h3>
            </div>
          ))}
        </div>

        {/* ... (A tabela de últimos lançamentos pode ser adaptada similarmente) ... */}

      </div>
    </div>
  );
}