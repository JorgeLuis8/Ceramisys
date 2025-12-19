import React from 'react';
import { 
  Home, ShoppingCart, Clock, FileBarChart, 
  LogOut, X 
} from 'lucide-react';

interface SidebarProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  onBackToMain: () => void;
  onCloseMobile: () => void;
}

export function SalesSidebar({ currentScreen, onNavigate, onBackToMain, onCloseMobile }: SidebarProps) {
  
  const getButtonClass = (screenName: string) => {
    const isActive = currentScreen === screenName;
    return `w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
      isActive 
        ? 'bg-slate-800 text-white shadow-md' 
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
    }`;
  };

  return (
    <div className="flex flex-col h-full border-r border-slate-200 bg-white">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">V</div>
          <span className="text-lg font-bold text-slate-800">Vendas</span>
        </div>
        <button onClick={onCloseMobile} className="md:hidden text-slate-400 hover:text-red-500"><X size={20} /></button>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        <div className="space-y-1">
          <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Dashboards e Lançamentos</p>
          <button onClick={() => onNavigate('home')} className={getButtonClass('home')}>
            <Home size={18} /> <span>Início</span>
          </button>
          <button onClick={() => onNavigate('new-sale')} className={getButtonClass('new-sale')}>
            <ShoppingCart size={18} /> <span>Registrar Venda</span>
          </button>
        </div>

        <div className="space-y-1">
          <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Relatórios</p>
          <button onClick={() => onNavigate('pending')} className={getButtonClass('pending')}>
            <Clock size={18} /> <span>Vendas Pendentes</span>
          </button>
          <button onClick={() => onNavigate('history')} className={getButtonClass('history')}>
            <FileBarChart size={18} /> <span>Relatório de Vendas</span>
          </button>
        </div>
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button onClick={onBackToMain} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all">
          <LogOut size={18} className="rotate-180" /> <span>Voltar ao Menu</span>
        </button>
      </div>
    </div>
  );
}