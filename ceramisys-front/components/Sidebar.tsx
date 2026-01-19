'use client';

import React, { useEffect, useState } from 'react';
// ADICIONEI O ÍCONE ShieldCheck
import { LayoutDashboard, Box, ShoppingCart, Wallet, X, LogOut, ArrowLeft, LucideIcon, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

interface CustomJwtPayload {
  role: string;
  unique_name: string;
  exp: number;
}

export interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  allowedRoles?: string[];
}

interface SidebarProps {
  activeSection: string;
  onChangeSection: (section: string) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
  customMenuItems?: MenuItem[]; 
  onBack?: () => void;          
}

// --- ATUALIZEI AQUI: ADICIONEI O MENU 'ADMIN' ---
const GLOBAL_MENU_ITEMS: MenuItem[] = [
  { id: 'overview', icon: LayoutDashboard, label: 'Visão Geral', allowedRoles: ['Admin', 'Viewer', 'Financial', 'Almoxarifado', 'Sales'] },
  { id: 'inventory', icon: Box, label: 'Almoxarifado', allowedRoles: ['Admin', 'Almoxarifado'] },
  { id: 'sales', icon: ShoppingCart, label: 'Vendas', allowedRoles: ['Admin', 'Sales'] },
  { id: 'finance', icon: Wallet, label: 'Financeiro', allowedRoles: ['Admin', 'Financial'] },
  // NOVO ITEM:
  { id: 'admin', icon: ShieldCheck, label: 'Administração', allowedRoles: ['Admin'] },
];

export function Sidebar({ 
  activeSection, 
  onChangeSection, 
  isOpen, 
  toggleSidebar, 
  customMenuItems, 
  onBack 
}: SidebarProps) {
  const router = useRouter();
  const [itemsToShow, setItemsToShow] = useState<MenuItem[]>([]);
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    const token = Cookies.get('auth_token');
    if (token) {
      try {
        const decoded = jwtDecode<CustomJwtPayload>(token);
        const role = decoded.role || '';
        setUserRole(role);

        const sourceList = customMenuItems || GLOBAL_MENU_ITEMS;

        const filtered = sourceList.filter(item => {
          if (!item.allowedRoles || item.allowedRoles.length === 0) return true;
          return item.allowedRoles.includes(role);
        });

        setItemsToShow(filtered);
      } catch (error) {
        setItemsToShow([]);
      }
    }
  }, [customMenuItems]);

  const handleLogout = () => {
    Cookies.remove('auth_token', { path: '/' });
    router.replace('/auth/login');
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm" onClick={toggleSidebar} />
      )}

      <aside className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50 transition-all duration-300 ease-in-out flex flex-col ${isOpen ? 'w-64 translate-x-0' : 'w-20 -translate-x-full md:translate-x-0'}`}>
        <div className="h-20 flex items-center justify-center border-b border-gray-100 relative shrink-0">
          {onBack ? (
             <button onClick={onBack} className="flex items-center justify-center w-full h-full text-gray-500 hover:text-orange-600 hover:bg-orange-50 transition-colors gap-2">
                <ArrowLeft size={24} />
                {isOpen && <span className="font-bold text-sm">Voltar</span>}
             </button>
          ) : (
            <>
              <div className="relative w-10 h-10">
                 <Image src="/icons/logo.png" alt="Logo" fill className="object-contain" />
              </div>
              {isOpen && <span className="ml-3 font-bold text-gray-800 text-lg animate-fade-in">CeramiSys</span>}
            </>
          )}
          <button onClick={toggleSidebar} className="md:hidden absolute right-4 text-gray-500 hover:text-red-500"><X size={20} /></button>
        </div>

        <nav className="p-4 space-y-2 flex-1 overflow-y-auto custom-scrollbar">
          {itemsToShow.length === 0 && isOpen && (
             <div className="text-xs text-center text-gray-400 mt-4 px-2">Nenhum menu disponível.<br/><span className="font-mono text-[10px]">({userRole})</span></div>
          )}
          {itemsToShow.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onChangeSection(item.id);
                  if (typeof window !== 'undefined' && window.innerWidth < 768) toggleSidebar();
                }}
                className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group relative ${isActive ? 'bg-orange-50 text-orange-600 shadow-sm font-bold border border-orange-100' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 border border-transparent'} ${!isOpen ? 'justify-center' : ''}`}
              >
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                {isOpen && <span className="ml-3 font-medium text-sm whitespace-nowrap">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 shrink-0">
            <button onClick={handleLogout} className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group relative text-gray-500 hover:bg-red-50 hover:text-red-600 border border-transparent ${!isOpen ? 'justify-center' : ''}`}>
              <LogOut size={22} strokeWidth={2} />
              {isOpen && <span className="ml-3 font-medium text-sm whitespace-nowrap">Sair</span>}
            </button>
        </div>
      </aside>
    </>
  );
}