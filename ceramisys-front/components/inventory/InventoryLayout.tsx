'use client';

import React, { useState, useEffect } from 'react';
import { InventorySidebar } from './InventorySidebar';
import { Menu } from 'lucide-react';

// --- IMPORTAÇÃO DAS VIEWS ---
import { DashboardHome } from './views/dashboards/DashboardHome';
import { ProductList } from './views/registrations/ProductList';
import { StockIn } from './views/controls/StockIn';
import { StockOut } from './views/controls/StockOut';
import { ProductReturns } from './views/controls/ProductReturns';
import { EmployeeList } from './views/registrations/EmployeeList';
import { CategoryList } from './views/registrations/CategoryList';
import { SupplierList } from './views/registrations/SupplierList';
import { ExpensesByCategory } from './views/dashboards/ExpensesByCategory';
import { MissingProducts } from './views/dashboards/MissingProducts';
import { NotReturnedProducts } from './views/dashboards/NotReturnedProducts';
import { RecurringWithdrawals } from './views/dashboards/RecurringWithdrawals';
import { EmployeeWithdrawals } from './views/dashboards/EmployeeWithdrawals';

interface InventoryLayoutProps {
  onBackToMain: () => void;
}

export function InventoryLayout({ onBackToMain }: InventoryLayoutProps) {
  const [activeScreen, setActiveScreen] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ========================================================
  // RESTAURA A TELA ATIVA DO localStorage AO CARREGAR
  // ========================================================
  useEffect(() => {
    const savedScreen = localStorage.getItem('inventoryActiveScreen');
    if (savedScreen) {
      setActiveScreen(savedScreen);
    }
  }, []);

  // ========================================================
  // FUNÇÃO PARA MUDAR DE TELA E SALVAR NO localStorage
  // ========================================================
  const handleNavigate = (screen: string) => {
    setActiveScreen(screen);
    localStorage.setItem('inventoryActiveScreen', screen);
    setIsMobileMenuOpen(false);
  };

  const renderContent = () => {
    switch (activeScreen) {
      // Dashboards & KPIs
      case 'home': return <DashboardHome />;
      
      // Relatórios
      case 'expenses': return <ExpensesByCategory />;
      case 'not-returned': return <NotReturnedProducts />;
      case 'missing': return <MissingProducts />;
      case 'recurring': return <RecurringWithdrawals />;
      case 'withdrawals': return <EmployeeWithdrawals />;

      // Cadastros
      case 'products': return <ProductList />;
      case 'employees': return <EmployeeList />;
      case 'categories': return <CategoryList />;
      case 'suppliers': return <SupplierList />;

      // Movimentação
      case 'stock-in': return <StockIn />;
      case 'stock-out': return <StockOut />;
      case 'returns': return <ProductReturns />;

      default: return <DashboardHome />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      
      {/* 1. SIDEBAR RESPONSIVA */}
      {/* Overlay Escuro para Mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Componente Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:shadow-none
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <InventorySidebar 
          currentScreen={activeScreen} 
          onNavigate={handleNavigate} 
          onBackToMain={onBackToMain}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />
      </div>

      {/* 2. ÁREA DE CONTEÚDO PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Header Mobile (Só aparece em telas pequenas) */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center px-4 md:hidden shrink-0">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={24} />
          </button>
          <span className="ml-4 font-bold text-gray-800">Almoxarifado</span>
        </header>

        {/* Conteúdo com Scroll */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}