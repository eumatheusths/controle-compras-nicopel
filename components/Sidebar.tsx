'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingCart, Package } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  if (pathname === '/login') return null;

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Lançamentos', icon: ShoppingCart, path: '/lancamentos' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-corporate-slate text-white flex flex-col shadow-xl z-50">
      <div className="p-6 border-b border-slate-700/50 flex items-center gap-3">
        <div className="bg-corporate-blue p-2 rounded-lg">
          <Package size={24} className="text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg">NICOPEL</h1>
          <p className="text-xs text-slate-400">Gestão</p>
        </div>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${
                isActive 
                  ? 'bg-corporate-blue text-white shadow-md' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-slate-800 text-center text-xs text-slate-500">
        v2.0 Stable
      </div>
    </aside>
  );
}