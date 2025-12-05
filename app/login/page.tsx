'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Loader2, AlertCircle, Package } from 'lucide-react';

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
        setError('Credenciais inválidas. Verifique e-mail e senha.');
        setLoading(false);
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setError('Erro de conexão. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    // Fundo cinza claro, centralizado
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      
      {/* Card Branco flutuante */}
      <div className="bg-white w-full max-w-md rounded-2xl p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-200">
        
        <div className="text-center mb-8">
          <div className="bg-corporate-blue w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
            <Package className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Acesso Nicopel</h1>
          <p className="text-slate-500 mt-2">Entre com suas credenciais corporativas</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700 text-sm">
            <AlertCircle size={20} className="flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-slate-400" size={20} />
              {/* Input padronizado com Tailwind */}
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 p-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-corporate-blue focus:border-transparent outline-none transition-all text-slate-700 placeholder:text-slate-400" 
                placeholder="seu.nome@nicopel.com" 
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-slate-400" size={20} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 p-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-corporate-blue focus:border-transparent outline-none transition-all text-slate-700 placeholder:text-slate-400" 
                placeholder="••••••••" 
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            // Botão com a cor corporativa definida no config
            className={`w-full py-3.5 rounded-xl font-bold text-white transition-all shadow-md flex items-center justify-center gap-2 mt-6 ${
              loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-corporate-blue hover:bg-corporate-blue-dark hover:shadow-lg'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} /> Acessando...
              </>
            ) : (
              'Entrar no Sistema'
            )}
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs text-slate-400">
          &copy; 2025 Nicopel Embalagens. Todos os direitos reservados.
        </div>
      </div>
    </div>
  );
}