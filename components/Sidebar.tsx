'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingCart, LogOut, Package } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  if (pathname === '/login') return null;

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Lançamentos', icon: ShoppingCart, path: '/lancamentos' },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Logo Area */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-700/50">
        <div className="bg-blue-600 p-2 rounded-lg text-white">
          <Package size={20} />
        </div>
        <div>
          <h1 className="font-bold text-white tracking-wide">NICOPEL</h1>
          <p className="text-xs text-slate-400">Gestão de Compras</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700/50">
        <p className="text-xs text-center text-slate-500">
          &copy; 2025 Nicopel Embalagens
        </p>
      </div>
    </div>
  );
}