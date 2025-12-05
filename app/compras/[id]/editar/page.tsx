import { getCompras, updateCompra } from '@/lib/googleSheets';
import { redirect } from 'next/navigation';

export default async function EditarCompra({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const compras = await getCompras();
  const compra = compras.find(c => c.id === resolvedParams.id);

  if (!compra) return <div className="text-white p-8">Não encontrado</div>;

  async function saveAction(formData: FormData) {
    'use server';
    if (!compra) return;
    
    await updateCompra(compra.rowIndex, {
      status: formData.get('status') as string,
      descricao: formData.get('descricao') as string,
      empresa: formData.get('empresa') as string
    });
    redirect('/lancamentos');
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form action={saveAction} className="bg-[#111111] border border-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-lg space-y-6">
        <h1 className="text-2xl font-bold text-white border-b border-slate-800 pb-4">
          Editar <span className="text-[#00ffa3]">Lançamento</span>
        </h1>
        
        <div>
          <label className="block text-xs font-bold text-[#00ffa3] uppercase mb-2">Empresa</label>
          <select name="empresa" defaultValue={compra.empresa} className="w-full p-3 rounded-xl bg-[#0a0a0a] border border-slate-800 text-white focus:border-[#00ffa3] outline-none">
            <option value="NICOPEL EMBALAGENS">NICOPEL EMBALAGENS</option>
            <option value="OUTRA EMPRESA">OUTRA EMPRESA</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#00ffa3] uppercase mb-2">Descrição</label>
          <textarea 
            name="descricao" 
            defaultValue={compra.descricao}
            className="w-full p-3 rounded-xl bg-[#0a0a0a] border border-slate-800 text-white focus:border-[#00ffa3] outline-none h-24"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#00ffa3] uppercase mb-2">Status</label>
          <select name="status" defaultValue={compra.status} className="w-full p-3 rounded-xl bg-[#0a0a0a] border border-slate-800 text-white focus:border-[#00ffa3] outline-none">
            <option value="Ativo">Ativo</option>
            <option value="Cancelado">Cancelado</option>
            <option value="Pendente">Pendente</option>
          </select>
        </div>

        <div className="flex gap-4 pt-4">
          <button type="submit" className="flex-1 bg-[#00ffa3] text-black py-3 rounded-xl hover:bg-[#00dd8d] font-bold shadow-[0_0_15px_-5px_#00ffa3] transition">
            Salvar
          </button>
          <a href="/lancamentos" className="flex-1 bg-slate-800 text-slate-300 py-3 rounded-xl text-center hover:bg-slate-700 font-bold transition">
            Cancelar
          </a>
        </div>
      </form>
    </div>
  );
}