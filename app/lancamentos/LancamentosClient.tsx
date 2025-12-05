'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronRight, Layers, User, Package, Search, Calendar, FileText } from 'lucide-react';
import { Compra } from '@/lib/googleSheets';

// Tipagem para o novo agrupamento: Empresa -> Fornecedor -> Produto -> Lista de Compras
type GroupedData = Record<string, Record<string, Record<string, Compra[]>>>;

export default function LancamentosClient({ compras }: { compras: Compra[] }) {
  // Estado para armazenar o texto de pesquisa de CADA empresa individualmente
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});

  // Função para atualizar a pesquisa de uma empresa específica
  const handleSearchChange = (empresa: string, term: string) => {
    setSearchTerms(prev => ({ ...prev, [empresa]: term }));
  };

  // 1. Lógica de Agrupamento Hierárquico (Empresa > Fornecedor > Produto)
  const dadosAgrupados = useMemo(() => {
    return compras.reduce<GroupedData>((acc, item) => {
      const empresa = item.empresa || 'Sem Empresa';
      const fornecedor = item.fornecedor || 'Desconhecido';
      const produto = item.descricao || 'Item Sem Nome';

      if (!acc[empresa]) acc[empresa] = {};
      if (!acc[empresa][fornecedor]) acc[empresa][fornecedor] = {};
      if (!acc[empresa][fornecedor][produto]) acc[empresa][fornecedor][produto] = [];

      acc[empresa][fornecedor][produto].push(item);
      return acc;
    }, {});
  }, [compras]);

  return (
    <div className="space-y-4">
      {Object.entries(dadosAgrupados).map(([empresaNome, fornecedores]) => {
        // Pega o termo de pesquisa digitado para ESTA empresa (ou vazio)
        const searchTerm = searchTerms[empresaNome]?.toLowerCase() || '';

        // Filtra os fornecedores/produtos baseados na pesquisa
        const fornecedoresFiltrados = Object.entries(fornecedores).filter(([fornecedorNome, produtos]) => {
          // Se não tiver pesquisa, mostra tudo
          if (!searchTerm) return true;

          // Se pesquisou, verifica se o termo existe no nome do fornecedor OU em algum produto
          const matchFornecedor = fornecedorNome.toLowerCase().includes(searchTerm);
          const matchProduto = Object.keys(produtos).some(prod => prod.toLowerCase().includes(searchTerm));
          
          return matchFornecedor || matchProduto;
        });

        // Se a pesquisa filtrou tudo e não sobrou nada, não renderiza a empresa (opcional)
        // Mas vamos manter a empresa e mostrar aviso de "não encontrado" dentro.

        return (
          // NÍVEL 1: EMPRESA
          <details key={empresaNome} className="group card-panel p-0 overflow-hidden mb-4 open:ring-2 open:ring-blue-100 transition-all">
            <summary className="flex items-center justify-between p-6 cursor-pointer bg-white hover:bg-slate-50 transition list-none border-b border-transparent group-open:border-slate-100">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 text-white p-2 rounded-lg shadow-sm">
                  <Layers size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">{empresaNome}</h2>
                  <p className="text-xs text-slate-500">{Object.keys(fornecedores).length} fornecedores totais</p>
                </div>
              </div>
              <ChevronRight className="text-slate-400 group-open:rotate-90 transition-transform duration-300" />
            </summary>

            <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-3">
              
              {/* --- BARRA DE PESQUISA DA EMPRESA --- */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder={`Buscar item ou fornecedor em ${empresaNome}...`}
                  className="w-full pl-10 p-2.5 rounded-lg border border-slate-300 focus:border-blue-500 outline-none text-sm"
                  value={searchTerms[empresaNome] || ''}
                  onChange={(e) => handleSearchChange(empresaNome, e.target.value)}
                  onClick={(e) => e.stopPropagation()} // Para não fechar o accordion ao clicar no input
                />
              </div>

              {/* LISTA DE FORNECEDORES FILTRADOS */}
              {fornecedoresFiltrados.length === 0 ? (
                <p className="text-center text-sm text-slate-500 py-4">Nenhum item encontrado para esta pesquisa.</p>
              ) : (
                fornecedoresFiltrados.map(([fornecedorNome, produtos]) => {
                  
                  // Calcula total gasto com este fornecedor (somando todos produtos)
                  const totalFornecedor = Object.values(produtos).flat().reduce((acc, i) => acc + i.valorTotal, 0);

                  return (
                    // NÍVEL 2: FORNECEDOR
                    <details key={fornecedorNome} className="group/inner bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                      <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition list-none">
                        <div className="flex items-center gap-3">
                          <User size={18} className="text-slate-400" />
                          <span className="font-semibold text-slate-700">{fornecedorNome}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-bold text-slate-600">
                            {totalFornecedor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </span>
                          <ChevronRight size={16} className="text-slate-400 group-open/inner:rotate-90 transition-transform" />
                        </div>
                      </summary>

                      <div className="p-2 bg-slate-50 space-y-2">
                        {Object.entries(produtos).map(([nomeProduto, listaCompras]) => {
                          
                          // Se houver filtro de pesquisa, e o nome do produto não bater, esconde (caso o usuario tenha pesquisado por fornecedor)
                          if (searchTerm && !nomeProduto.toLowerCase().includes(searchTerm) && !fornecedorNome.toLowerCase().includes(searchTerm)) {
                            return null;
                          }

                          // Totais do Produto (Agrupado)
                          const qtdTotal = listaCompras.reduce((acc, i) => acc + i.quantidade, 0);
                          const valorTotalProd = listaCompras.reduce((acc, i) => acc + i.valorTotal, 0);
                          const unidade = listaCompras[0].unidade; // Pega a unidade do primeiro

                          return (
                            // NÍVEL 3: PRODUTO (ITEM)
                            <details key={nomeProduto} className="group/item bg-white border border-slate-200 rounded-md overflow-hidden ml-4">
                              <summary className="flex items-center justify-between p-3 cursor-pointer hover:bg-blue-50 transition list-none">
                                <div className="flex items-center gap-3 overflow-hidden">
                                  <Package size={16} className="text-blue-500 flex-shrink-0" />
                                  <span className="font-medium text-sm text-slate-700 truncate">{nomeProduto}</span>
                                </div>
                                <div className="flex items-center gap-4 flex-shrink-0">
                                  <div className="text-xs text-slate-500 text-right">
                                    <div className="font-bold text-slate-700">{qtdTotal} {unidade}</div>
                                    <div>{valorTotalProd.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                                  </div>
                                  <ChevronRight size={14} className="text-slate-300 group-open/item:rotate-90 transition-transform" />
                                </div>
                              </summary>

                              {/* NÍVEL 4: TABELA DETALHADA DAS COMPRAS DESSE ITEM */}
                              <div className="overflow-x-auto border-t border-slate-100">
                                <table className="w-full text-xs text-left text-slate-600">
                                  <thead className="bg-slate-50 text-slate-400 uppercase font-medium">
                                    <tr>
                                      <th className="p-2 pl-4">Data</th>
                                      <th className="p-2">NFe</th>
                                      <th className="p-2 text-right">Qtd</th>
                                      <th className="p-2 text-right">Unitário</th>
                                      <th className="p-2 text-right">Total</th>
                                      <th className="p-2 text-center">Ação</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                    {listaCompras.map((compra) => (
                                      <tr key={compra.id} className="hover:bg-slate-50">
                                        <td className="p-2 pl-4 flex items-center gap-2">
                                          <Calendar size={12} className="text-slate-300" />
                                          {compra.data.split(' ')[0]}
                                        </td>
                                        <td className="p-2 font-mono text-slate-500">
                                          <span className="flex items-center gap-1">
                                            <FileText size={12} /> {compra.nfe}
                                          </span>
                                        </td>
                                        <td className="p-2 text-right">{compra.quantidade}</td>
                                        <td className="p-2 text-right">
                                          {compra.valorUnitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </td>
                                        <td className="p-2 text-right font-bold text-slate-700">
                                          {compra.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </td>
                                        <td className="p-2 text-center">
                                          <Link href={`/compras/${compra.id}/editar`} className="text-blue-600 hover:underline">
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
                  );
                })
              )}
            </div>
          </details>
        );
      })}
    </div>
  );
}