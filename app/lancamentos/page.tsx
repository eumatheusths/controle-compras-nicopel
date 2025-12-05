import { getCompras, Compra } from '@/lib/googleSheets';
import Link from 'next/link';
import { ChevronRight, Layers, User, Package } from 'lucide-react';

export const dynamic = 'force-dynamic';

type GroupedData = Record<string, Record<string, Compra[]>>;

export default async function Lancamentos() {
  const compras = await getCompras();

  const dadosAgrupados = compras.reduce<GroupedData>((acc, item) => {
    const empresa = item.empresa || 'Sem Empresa';
    const fornecedor = item.fornecedor || 'Desconhecido';
    if (!acc[empresa]) acc[empresa] = {};
    if (!acc[empresa][fornecedor]) acc[empresa][fornecedor] = [];
    acc[empresa][fornecedor].push(item);
    return acc;
  }, {});

  return (
    <div className="p-6 md:p-8 text-slate-200">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-[#111111] p-6 rounded-2xl shadow-lg border border-slate-800">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Layers className="text-[#00ffa3]" />
              Lançamentos
            </h1>
          </div>
          <Link href="/" className="text-sm font-bold text-slate-900 bg-[#00ffa3] hover:bg-[#00dd8d] px-4 py-2 rounded-lg transition">
            Voltar
          </Link>
        </div>

        <div className="space-y-4">
          {Object.entries(dadosAgrupados).map(([empresaNome, fornecedores]) => (
            
            // NÍVEL 1: EMPRESA
            <details key={empresaNome} className="group bg-[#111111] rounded-xl border border-slate-800 overflow-hidden open:border-[#00ffa3]/50 transition-all">
              <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-slate-900 transition list-none">
                <div className="flex items-center gap-3">
                  <div className="bg-[#00ffa3]/20 text-[#00ffa3] p-2 rounded-lg">
                    <Layers size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">{empresaNome}</h2>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">{Object.keys(fornecedores).length} fornecedores</p>
                  </div>
                </div>
                <ChevronRight className="text-slate-500 group-open:rotate-90 group-open:text-[#00ffa3] transition-transform duration-300" />
              </summary>

              <div className="p-4 bg-black/30 border-t border-slate-800 space-y-3">
                {Object.entries(fornecedores).map(([fornecedorNome, itens]) => {
                  const totalFornecedor = itens.reduce((acc, i) => acc + i.valorTotal, 0);

                  return (
                    // NÍVEL 2: FORNECEDOR
                    <details key={fornecedorNome} className="group/inner border border-slate-800 rounded-lg overflow-hidden bg-[#0a0a0a]">
                      <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-900 transition list-none">
                        <div className="flex items-center gap-3">
                          <User size={18} className="text-slate-500" />
                          <span className="font-semibold text-slate-300">{fornecedorNome}</span>
                          <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
                            {itens.length}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-bold text-[#00ffa3]">
                            {totalFornecedor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </span>
                          <ChevronRight size={16} className="text-slate-600 group-open/inner:rotate-90 transition-transform" />
                        </div>
                      </summary>

                      {/* NÍVEL 3: TABELA */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-400">
                          <thead className="bg-slate-900/50 text-slate-500 uppercase text-xs">
                            <tr>
                              <th className="p-3 pl-6">Data</th>
                              <th className="p-3">Item</th>
                              <th className="p-3 text-right">Qtd</th>
                              <th className="p-3 text-right">Total</th>
                              <th className="p-3 text-center">Status</th>
                              <th className="p-3 text-center"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800">
                            {itens.map((item) => (
                              <tr key={item.id} className="hover:bg-slate-800/50 transition">
                                <td className="p-3 pl-6 text-xs font-mono">{item.data.split(' ')[0]}</td>
                                <td className="p-3 font-medium text-slate-300 truncate max-w-[200px]">
                                  {item.descricao}
                                </td>
                                <td className="p-3 text-right text-xs">
                                  {item.quantidade} {item.unidade}
                                </td>
                                <td className="p-3 text-right font-bold text-[#00ffa3] text-xs">
                                  {item.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </td>
                                <td className="p-3 text-center">
                                  <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${
                                    item.status === 'Ativo' ? 'text-green-400 bg-green-900/30' : 'text-red-400 bg-red-900/30'
                                  }`}>
                                    {item.status}
                                  </span>
                                </td>
                                <td className="p-3 text-center">
                                  <Link 
                                    href={`/compras/${item.id}/editar`} 
                                    className="text-slate-500 hover:text-[#00ffa3] text-xs underline"
                                  >
                                    Editar
                                  </Link>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </details>
                  );
                })}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}