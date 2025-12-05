import { getCompras } from '@/lib/googleSheets';
import Link from 'next/link';
import { List, Edit, TrendingUp, DollarSign, Package } from 'lucide-react';
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
    // Fundo removido aqui pois já vem do body (preto)
    <div className="p-6 md:p-8 font-sans text-slate-200">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* --- CABEÇALHO --- */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-[#111111] p-6 rounded-2xl border border-slate-800 shadow-lg">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
              Dashboard <span className="text-[#00ffa3]">Financeiro</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">Visão geral em tempo real</p>
          </div>
          
          <div className="flex flex-wrap gap-3 items-center">
            <Link 
              href="/lancamentos" 
              className="flex items-center gap-2 bg-slate-900 border border-slate-700 px-4 py-2 rounded-lg hover:border-[#00ffa3] hover:text-[#00ffa3] transition"
            >
              <List size={18} /> Ver Lista
            </Link>
            
            <ImportadorPlanilha />
          </div>
        </div>

        {/* --- KPIS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card Total (Destaque) */}
          <div className="bg-gradient-to-br from-[#0a1f16] to-black p-6 rounded-2xl border border-[#00ffa3]/30 shadow-[0_0_15px_-5px_#00ffa3]">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[#00ffa3] text-xs font-bold uppercase tracking-widest mb-2">Total Consolidado</p>
                <h3 className="text-3xl font-bold text-white">
                  {totalGasto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </h3>
              </div>
              <div className="p-2 bg-[#00ffa3]/20 rounded-lg text-[#00ffa3]">
                <DollarSign size={24} />
              </div>
            </div>
          </div>

          {/* Cards por Empresa */}
          {Object.entries(gastosPorEmpresa).map(([empresa, valor]) => (
            <div key={empresa} className="bg-[#111111] p-6 rounded-2xl border border-slate-800 hover:border-[#00ffa3]/50 transition duration-300">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#00ffa3] shadow-[0_0_8px_#00ffa3]"></span>
                <p className="text-xs font-bold uppercase text-slate-400 tracking-wide">{empresa}</p>
              </div>
              <h3 className="text-2xl font-bold text-slate-100">
                {valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </h3>
            </div>
          ))}
        </div>

        {/* --- TABELA --- */}
        <div className="bg-[#111111] rounded-2xl border border-slate-800 overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <h2 className="text-lg font-bold text-white">Últimos Lançamentos</h2>
            <Link href="/lancamentos" className="text-[#00ffa3] text-xs uppercase font-bold hover:underline tracking-wider">
              Ver tudo →
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-black/40 text-slate-500 uppercase text-xs font-semibold">
                <tr>
                  <th className="p-4">Data</th>
                  <th className="p-4">Empresa</th>
                  <th className="p-4">Descrição</th>
                  <th className="p-4 text-right">Valor</th>
                  <th className="p-4 text-center">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {compras.slice(0, 5).map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 text-slate-400 font-mono text-xs">
                      {c.data.split(' ')[0]}
                    </td>
                    <td className="p-4">
                      <span className="bg-[#00ffa3]/10 text-[#00ffa3] px-2 py-1 rounded text-[10px] font-bold uppercase border border-[#00ffa3]/20">
                        {c.empresa}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300 font-medium truncate max-w-[250px]">
                      {c.descricao}
                    </td>
                    <td className="p-4 text-right font-bold text-[#00ffa3] whitespace-nowrap">
                      {c.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td className="p-4 text-center">
                      <Link 
                        href={`/compras/${c.id}/editar`} 
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-900 hover:bg-[#00ffa3] text-slate-400 hover:text-black transition"
                      >
                        <Edit size={16} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}