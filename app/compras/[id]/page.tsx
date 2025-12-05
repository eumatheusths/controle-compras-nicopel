import { getCompras } from '@/lib/googleSheets';
import Link from 'next/link';

// Atenção na tipagem do params: agora é uma Promise
export default async function Detalhes({ params }: { params: Promise<{ id: string }> }) {
  
  // 1. AQUI ESTÁ A CORREÇÃO: "Desembrulhamos" o ID com await
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const compras = await getCompras();
  // 2. Usamos o "id" que acabamos de extrair
  const item = compras.find((c) => c.id === id);

  if (!item) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-800">Item não encontrado</h2>
        <Link href="/" className="text-blue-600 hover:underline mt-2 block">Voltar ao início</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-8 flex justify-center items-center">
      <div className="bg-white max-w-2xl w-full rounded-2xl shadow-lg p-8 border border-slate-100">
        <div className="mb-6 flex justify-between items-center">
          <span className="text-sm font-bold text-slate-400">#{item.nfe}</span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
             item.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {item.status}
          </span>
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 mb-2">{item.descricao}</h1>
        <p className="text-slate-500 mb-8 pb-8 border-b border-slate-100">{item.fornecedor}</p>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">Data de Entrada</label>
            <p className="text-lg text-slate-700">{item.data}</p>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">Almoxarifado</label>
            <p className="text-lg text-slate-700">{item.almoxarifado}</p>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">Quantidade</label>
            <p className="text-lg text-slate-700">{item.quantidade} {item.unidade}</p>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">Valor Unitário</label>
            <p className="text-lg text-slate-700">
               {item.valorUnitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
          <div className="col-span-2 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <label className="text-xs font-bold text-slate-500 uppercase">Valor Total do Pedido</label>
            <p className="text-3xl font-bold text-green-600 mt-1">
              {item.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
        </div>

        <Link href="/" className="block w-full text-center bg-slate-900 text-white py-3 rounded-lg hover:bg-slate-800 transition font-medium">
          Voltar para Dashboard
        </Link>
      </div>
    </div>
  );
}