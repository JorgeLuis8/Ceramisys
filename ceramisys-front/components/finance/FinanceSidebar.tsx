import React from 'react';
import { 
  Home, Tags, Users, Banknote, Clock, FileText, 
  Layers, BarChart3, ArrowDownCircle, ArrowUpCircle, 
  PieChart, ScrollText, FileBarChart, LogOut, X 
} from 'lucide-react';

interface SidebarProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  onBackToMain: () => void;
  onCloseMobile: () => void;
}

export function FinanceSidebar({ currentScreen, onNavigate, onBackToMain, onCloseMobile }: SidebarProps) {
  
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
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">F</div>
          <span className="text-lg font-bold text-slate-800">Financeiro</span>
        </div>
        <button onClick={onCloseMobile} className="md:hidden text-slate-400 hover:text-red-500"><X size={20} /></button>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        <div className="space-y-1">
          <button onClick={() => onNavigate('home')} className={getButtonClass('home')}>
            <Home size={18} /> <span>Início</span>
          </button>
        </div>

        <div className="space-y-1">
          <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Cadastros e Lançamentos</p>
          <button onClick={() => onNavigate('categories')} className={getButtonClass('categories')}>
            <Tags size={18} /> <span>Categorias Financeiras</span>
          </button>
          <button onClick={() => onNavigate('customers')} className={getButtonClass('customers')}>
            <Users size={18} /> <span>Cadastro de Clientes</span>
          </button>
          <button onClick={() => onNavigate('transactions')} className={getButtonClass('transactions')}>
            <Banknote size={18} /> <span>Lançamentos</span>
          </button>
          <button onClick={() => onNavigate('pending')} className={getButtonClass('pending')}>
            <Clock size={18} /> <span>Pendentes</span>
          </button>
          <button onClick={() => onNavigate('register-statement')} className={getButtonClass('register-statement')}>
            <FileText size={18} /> <span>Cadastrar Extrato</span>
          </button>
          <button onClick={() => onNavigate('main-categories')} className={getButtonClass('main-categories')}>
            <Layers size={18} /> <span>Categorias Principais</span>
          </button>
        </div>

        <div className="space-y-1">
          <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Relatórios e Balancetes</p>
          <button onClick={() => onNavigate('cash-flow')} className={getButtonClass('cash-flow')}>
            <BarChart3 size={18} /> <span>Movimento Caixa</span>
          </button>
          <button onClick={() => onNavigate('balance-out')} className={getButtonClass('balance-out')}>
            <ArrowDownCircle size={18} /> <span>Balancete de Saídas</span>
          </button>
          <button onClick={() => onNavigate('balance-in')} className={getButtonClass('balance-in')}>
            <ArrowUpCircle size={18} /> <span>Balancete de Entradas</span>
          </button>
          <button onClick={() => onNavigate('report-customers')} className={getButtonClass('report-customers')}>
            <PieChart size={18} /> <span>Relatório dos Clientes</span>
          </button>
          <button onClick={() => onNavigate('report-statements')} className={getButtonClass('report-statements')}>
            <ScrollText size={18} /> <span>Relatório de Extratos</span>
          </button>
          <button onClick={() => onNavigate('verification')} className={getButtonClass('verification')}>
            <FileBarChart size={18} /> <span>Balancete De Verificacao</span>
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