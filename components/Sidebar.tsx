'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingCart, LogOut } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  if (pathname === '/login') return null;

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Lançamentos', icon: ShoppingCart, path: '/lancamentos' },
  ];

  // Logo "N" pequeno para o menu
  const NicopelSmallLogo = () => (
    <div className="w-10 h-10 rounded-lg bg-black border border-[#00ffa3] flex items-center justify-center shadow-[0_0_10px_-3px_#00ffa3]">
      <span className="text-lg font-extrabold text-[#00ffa3]">N.</span>
    </div>
  );

  return (
    // Sidebar com fundo preto e borda sutil
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#080808] border-r border-slate-900 text-slate-200 flex flex-col z-50 font-sans">
      {/* Área da Logo */}
      <div className="p-6 flex items-center gap-3">
        <NicopelSmallLogo />
        <div>
          <h1 className="font-bold text-lg tracking-wider text-white">NICOPEL</h1>
          <p className="text-[10px] text-[#00ffa3] uppercase tracking-widest opacity-80">Compras</p>
        </div>
      </div>

      {/* Links de Navegação */}
      <nav className="flex-1 py-6 px-4 space-y-3">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                isActive 
                  ? 'bg-[#00ffa3]/10 text-[#00ffa3] border border-[#00ffa3]/30 shadow-[0_0_15px_-5px_#00ffa3]' 
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <item.icon size={20} className={isActive ? 'text-[#00ffa3]' : 'text-slate-500 group-hover:text-[#00ffa3] transition-colors'} />
              <span className="font-medium tracking-wide">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Rodapé do Menu */}
      <div className="p-4 border-t border-slate-900/50">
        <div className="flex items-center gap-2 text-xs text-slate-500">
           <div className="w-2 h-2 rounded-full bg-[#00ffa3] animate-pulse"></div>
           Sistema Online
        </div>
      </div>
    </aside>
  );
}