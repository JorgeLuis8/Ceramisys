import React from 'react';
import { LayoutDashboard, Box, ShoppingCart, Wallet, X } from 'lucide-react';
import Image from 'next/image';

interface SidebarProps {
  activeSection: string;
  onChangeSection: (section: string) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

export function Sidebar({ activeSection, onChangeSection, isOpen, toggleSidebar }: SidebarProps) {
  
  const menuItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Visão Geral' },
    { id: 'inventory', icon: Box, label: 'Almoxarifado' },
    // O ID 'sales' aqui é o que aciona o SalesLayout no page.tsx
    { id: 'sales', icon: ShoppingCart, label: 'Vendas' },
    { id: 'finance', icon: Wallet, label: 'Financeiro' },
  ];

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
          fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50 transition-all duration-300 ease-in-out
          ${isOpen ? 'w-64 translate-x-0' : 'w-20 -translate-x-full md:translate-x-0'} 
        `}
      >
        {/* Header da Sidebar */}
        <div className="h-20 flex items-center justify-center border-b border-gray-100 relative">
          <div className="relative w-10 h-10">
             {/* Certifique-se que o logo existe em public/icons/logo.png */}
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

        {/* Links de Navegação */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onChangeSection(item.id);
                  // No mobile, fecha o menu ao clicar para melhorar a experiência
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
      </aside>
    </>
  );
}