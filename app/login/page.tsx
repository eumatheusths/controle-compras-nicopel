'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Loader2, AlertTriangle, ArrowRight } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError('Credenciais inválidas.');
        setLoading(false);
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setError('Erro de conexão.');
      setLoading(false);
    }
  };

  // Componente do Logo "N" estilizado
  const NicopelLogo = () => (
    <div className="w-20 h-20 rounded-full bg-black border-2 border-[#00ffa3] flex items-center justify-center mx-auto mb-6 glow-tech shadow-[0_0_30px_-5px_#00ffa3]">
      <span className="text-4xl font-extrabold text-[#00ffa3] tracking-tighter">
        N.
      </span>
    </div>
  );

  return (
    // Fundo Tecnológico com gradiente sutil
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#050505] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0a1f16] via-[#050505] to-[#050505]">
      
      {/* Card de Login "Glassmorphism" */}
      <div className="bg-[#111111]/80 backdrop-blur-xl w-full max-w-md rounded-3xl p-8 shadow-2xl border border-[#00ffa3]/30 relative overflow-hidden">
        
        {/* Efeito de luz decorativa no topo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-[#00ffa3] blur-sm rounded-b-full opacity-70"></div>

        <div className="text-center mb-8 relative z-10">
          <NicopelLogo />
          <h1 className="text-3xl font-bold text-white tracking-wide">
            NICOPEL
            <span className="text-[#00ffa3] text-sm block font-normal tracking-widest mt-1 uppercase opacity-80">
              Sistema de Compras
            </span>
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-950/50 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-200 text-sm animate-pulse">
            <AlertTriangle size={20} className="text-red-500" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div className="group">
            <label className="block text-xs font-medium text-[#00ffa3] uppercase tracking-wider mb-2 ml-1">ID Corporativo</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-[#00ffa3] transition-colors" size={20} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 p-3.5 bg-[#0a0a0a] border border-slate-800 text-slate-200 rounded-xl focus:ring-2 focus:ring-[#00ffa3]/50 focus:border-[#00ffa3] outline-none transition-all placeholder:text-slate-600" 
                placeholder="usuario@nicopel.com.br" 
              />
            </div>
          </div>
          
          <div className="group">
            <label className="block text-xs font-medium text-[#00ffa3] uppercase tracking-wider mb-2 ml-1">Chave de Acesso</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-[#00ffa3] transition-colors" size={20} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 p-3.5 bg-[#0a0a0a] border border-slate-800 text-slate-200 rounded-xl focus:ring-2 focus:ring-[#00ffa3]/50 focus:border-[#00ffa3] outline-none transition-all placeholder:text-slate-600 font-mono" 
                placeholder="••••••••" 
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-black transition-all relative overflow-hidden group flex items-center justify-center gap-2 mt-8 ${
              loading ? 'bg-slate-600 cursor-not-allowed opacity-70' : 'bg-[#00ffa3] hover:bg-[#00dd8d] hover:shadow-[0_0_20px_-3px_#00ffa3] hover:scale-[1.02]'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} /> Autenticando...
              </>
            ) : (
              <>
                Conectar Sistema <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-slate-500 flex justify-between items-center relative z-10">
          <p>NICOPEL v2.0</p>
          <p className="flex items-center gap-1"><Lock size={12} /> Conexão Segura</p>
        </div>
      </div>
    </div>
  );
}