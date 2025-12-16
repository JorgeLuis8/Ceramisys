'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';

// ==================================================================
// PLACEHOLDERS (Conteúdos Provisórios)
// Usamos isso para a página não quebrar enquanto os arquivos reais estão vazios
// ==================================================================

const InventoryLayout = () => (
  <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-white rounded-3xl border border-gray-100 shadow-sm animate-fade-in">
    <div className="p-4 bg-orange-50 rounded-full mb-4">
      {/* Ícone de caixa simples */}
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
    </div>
    <h2 className="text-2xl font-bold text-gray-800">Módulo Almoxarifado</h2>
    <p className="text-gray-500">O layout com menu laranja entrará aqui depois.</p>
  </div>
);

const OverviewLayout = () => (
  <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-white rounded-3xl border border-gray-100 shadow-sm animate-fade-in">
    <h2 className="text-2xl font-bold text-gray-300">Visão Geral</h2>
    <p>Em desenvolvimento...</p>
  </div>
);

const SalesLayout = () => (
  <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-white rounded-3xl border border-gray-100 shadow-sm animate-fade-in">
    <h2 className="text-2xl font-bold text-gray-300">Módulo de Vendas</h2>
    <p>Em desenvolvimento...</p>
  </div>
);

const FinanceLayout = () => (
  <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-white rounded-3xl border border-gray-100 shadow-sm animate-fade-in">
    <h2 className="text-2xl font-bold text-gray-300">Módulo Financeiro</h2>
    <p>Em desenvolvimento...</p>
  </div>
);

// ==================================================================
// PÁGINA PRINCIPAL
// ==================================================================

export default function DashboardPage() {
  // Começa no inventory para você testar, mas renderiza o placeholder acima
  const [activeModule, setActiveModule] = useState('inventory'); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const renderModule = () => {
    switch (activeModule) {
      case 'overview': return <OverviewLayout />;
      case 'inventory': return <InventoryLayout />;
      case 'sales': return <SalesLayout />;
      case 'finance': return <FinanceLayout />;
      default: return <OverviewLayout />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex font-sans overflow-hidden">
      
      {/* MENU LATERAL PRINCIPAL */}
      <Sidebar 
        activeSection={activeModule} 
        onChangeSection={setActiveModule}
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* ÁREA DE CONTEÚDO */}
      <main 
        className={`flex-1 flex flex-col h-screen transition-all duration-300 ease-in-out 
        ${isSidebarOpen ? 'ml-72' : 'ml-20'}`}
      >
        
        {/* Header Simples */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-40">
           <h1 className="text-2xl font-bold text-gray-800 capitalize">
             {activeModule === 'inventory' ? 'Gestão de Estoque' : 
              activeModule === 'overview' ? 'Visão Geral' : 
              activeModule === 'sales' ? 'Vendas' : 'Financeiro'}
           </h1>
           
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-red-500 text-white flex items-center justify-center font-bold shadow-md">
                AD
              </div>
           </div>
        </header>

        {/* Renderiza o Módulo Escolhido */}
        <div className="flex-1 p-6 overflow-hidden bg-[#f8f9fa]">
           {renderModule()}
        </div>

      </main>
    </div>
  );
}