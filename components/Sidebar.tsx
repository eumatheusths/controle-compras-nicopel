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

  return (
    <div className="flex flex-col h-full text-slate-300">
      {/* Logo Area */}
      <div className="p-6 flex items-center gap-3 border-b border-gray-900">
        <div className="w-10 h-10 rounded bg-black border border-[#00ffa3] flex items-center justify-center shadow-[0_0_10px_#00ffa3]">
          <span className="text-[#00ffa3] font-bold text-lg">N.</span>
        </div>
        <div>
          <h1 className="font-bold text-white tracking-wider">NICOPEL</h1>
          <p className="text-[10px] text-[#00ffa3]">SYSTEM V2.0</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-[#00ffa3]/10 text-[#00ffa3] border border-[#00ffa3]/30' 
                  : 'hover:bg-gray-900 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-900 text-center text-xs text-gray-600">
        Conectado como Admin
      </div>
    </div>
  );
}