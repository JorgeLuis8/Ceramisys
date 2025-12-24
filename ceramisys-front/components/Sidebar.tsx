'use client';

import React from 'react';
import { LayoutDashboard, Box, ShoppingCart, Wallet, X, LogOut } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface SidebarProps {
  activeSection: string;
  onChangeSection: (section: string) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

export function Sidebar({ activeSection, onChangeSection, isOpen, toggleSidebar }: SidebarProps) {
  const router = useRouter();

  const menuItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Visão Geral' },
    { id: 'inventory', icon: Box, label: 'Almoxarifado' },
    { id: 'sales', icon: ShoppingCart, label: 'Vendas' },
    { id: 'finance', icon: Wallet, label: 'Financeiro' },
  ];

  // Função para deslogar
  const handleLogout = () => {
    // 1. Remove o token (Importante usar path: '/' para garantir que apague o global)
    Cookies.remove('auth_token', { path: '/' });
    
    // 2. Redireciona para o login
    router.replace('/auth/login');
  };

  return (
    <>
      {/* OVERLAY ESCURO (Apenas Mobile quando aberto) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={toggleSidebar} 
        />
      )}

      {/* SIDEBAR */}
      <aside 
        className={`
          fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50 transition-all duration-300 ease-in-out flex flex-col
          ${isOpen ? 'w-64 translate-x-0' : 'w-20 -translate-x-full md:translate-x-0'} 
        `}
        // Adicionei 'flex flex-col' na classe acima para permitir empurrar o botão de sair para baixo
      >
        {/* Header da Sidebar */}
        <div className="h-20 flex items-center justify-center border-b border-gray-100 relative shrink-0">
          <div className="relative w-10 h-10">
             <Image src="/icons/logo.png" alt="Logo" fill className="object-contain" />
          </div>
          
          {isOpen && (
            <span className="ml-3 font-bold text-gray-800 text-lg animate-fade-in">
              CeramiSys
            </span>
          )}

          {/* Botão de Fechar (Só aparece no Mobile quando aberto) */}
          <button 
            onClick={toggleSidebar}
            className="md:hidden absolute right-4 text-gray-500 hover:text-red-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Links de Navegação (flex-1 para ocupar o espaço disponível) */}
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onChangeSection(item.id);
                  if (typeof window !== 'undefined' && window.innerWidth < 768) {
                    toggleSidebar();
                  }
                }}
                className={`
                  w-full flex items-center p-3 rounded-xl transition-all duration-200 group relative
                  ${isActive 
                    ? 'bg-orange-50 text-orange-600 shadow-sm font-bold' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
                  ${!isOpen ? 'justify-center' : ''}
                `}
              >
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                
                {isOpen && (
                  <span className="ml-3 font-medium text-sm whitespace-nowrap">
                    {item.label}
                  </span>
                )}

                {/* Tooltip para Sidebar Fechada (Desktop) */}
                {!isOpen && (
                  <div className="absolute left-full ml-4 px-3 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap hidden md:block shadow-lg">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* --- BOTÃO DE LOGOUT (Rodapé da Sidebar) --- */}
        <div className="p-4 border-t border-gray-100 shrink-0">
            <button
              onClick={handleLogout}
              className={`
                w-full flex items-center p-3 rounded-xl transition-all duration-200 group relative
                text-gray-500 hover:bg-red-50 hover:text-red-600
                ${!isOpen ? 'justify-center' : ''}
              `}
            >
              <LogOut size={22} strokeWidth={2} />
              
              {isOpen && (
                <span className="ml-3 font-medium text-sm whitespace-nowrap">
                  Sair
                </span>
              )}

              {/* Tooltip de Logout */}
              {!isOpen && (
                <div className="absolute left-full ml-4 px-3 py-1 bg-red-600 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap hidden md:block shadow-lg">
                  Sair
                </div>
              )}
            </button>
        </div>

      </aside>
    </>
  );
}