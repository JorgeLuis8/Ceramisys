'use client';

import Image from 'next/image';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Banknote, 
  Package, 
  LogOut, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;               // Qual módulo está visível agora?
  onChangeSection: (section: string) => void; // Função para trocar o módulo
  isOpen: boolean;                     // O menu está expandido ou recolhido?
  toggleSidebar: () => void;           // Função para expandir/recolher
}

export function Sidebar({ activeSection, onChangeSection, isOpen, toggleSidebar }: SidebarProps) {
  
  // Definição dos itens do menu principal
  const navItems = [
    { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'inventory', label: 'Almoxarifado', icon: Package },
    { id: 'sales', label: 'Vendas', icon: ShoppingCart },
    { id: 'finance', label: 'Financeiro', icon: Banknote },
  ];

  return (
    <aside 
      className={`fixed left-0 top-0 z-50 h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col
      ${isOpen ? 'w-72' : 'w-20'} `}
    >
      
      {/* --- 1. ÁREA DA LOGO --- */}
      <div className="h-24 flex items-center justify-center border-b border-gray-100 relative">
        <div className="relative w-10 h-10 mr-2 flex-shrink-0">
          <Image 
            src="/icons/logo.png" // Certifique-se que essa imagem existe em public/icons/
            alt="Logo CeramiSys" 
            fill 
            className="object-contain" 
          />
        </div>
        
        {/* Mostra o nome apenas se o menu estiver aberto */}
        <div className={`transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
           <span className="text-2xl font-black text-gray-900 tracking-tight whitespace-nowrap">
             Cerami<span className="text-orange-600">Sys</span>
           </span>
        </div>
        
        {/* Botão de Recolher/Expandir (Bolinha na borda) */}
        <button 
           onClick={toggleSidebar}
           className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-orange-600 shadow-sm z-50 hover:scale-110 transition-all"
        >
           {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>
      </div>

      {/* --- 2. ITENS DE NAVEGAÇÃO --- */}
      <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto custom-scrollbar">
        <p className={`text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-4 transition-opacity ${!isOpen && 'opacity-0 hidden'}`}>
          Módulos
        </p>
        
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onChangeSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group relative
                ${isActive 
                  ? 'bg-orange-50 text-orange-700 shadow-sm font-bold' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium'}
              `}
              title={!isOpen ? item.label : ''} // Tooltip nativo se estiver fechado
            >
              <Icon 
                size={22} 
                className={`flex-shrink-0 transition-colors ${isActive ? 'text-orange-600' : 'text-gray-400 group-hover:text-gray-600'}`} 
              />
              
              {/* Texto do Botão (Esconde se menu fechado) */}
              <span className={`whitespace-nowrap transition-all duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                {item.label}
              </span>
              
              {/* Bolinha indicadora de "Ativo" (Só aparece se menu aberto) */}
              {isActive && isOpen && (
                <div className="ml-auto w-2 h-2 rounded-full bg-orange-500"></div>
              )}
            </button>
          );
        })}
      </nav>

      {/* --- 3. RODAPÉ (PERFIL E SAIR) --- */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
         <button className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-xl transition-all group">
            <LogOut size={22} className="flex-shrink-0" />
            <span className={`font-medium whitespace-nowrap transition-all duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
              Sair do Sistema
            </span>
         </button>
      </div>

    </aside>
  );
}