'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import Image from 'next/image';

// ==================================================================
// 1. PÁGINA INICIAL (VISÃO GERAL)
// ==================================================================

const OverviewLayout = ({ onChangeSection }) => {
  
  const modules = [
    {
      id: 'inventory',
      title: 'Almoxarifado',
      description: 'Gestão Completa de Estoque',
      longDescription: 'Controle total de argila, lenha e produtos acabados. Rastreabilidade e gestão de perdas.',
      imageSrc: '/icons/inventory.png', 
      color: 'orange',
      features: ['Entrada e saída', 'Controle de queima', 'Estoque mínimo']
    },
    {
      id: 'finance',
      title: 'Financeiro',
      description: 'Fluxo de Caixa e Contas',
      longDescription: 'Controle preciso de contas a pagar, receber e fluxo de caixa diário da cerâmica.',
      imageSrc: '/icons/finance.png',
      color: 'gray',
      features: ['Contas a pagar', 'DRE Gerencial', 'Conciliação']
    },
    {
      id: 'sales',
      title: 'Vendas',
      description: 'Pedidos e Clientes',
      longDescription: 'Gestão de pedidos de venda, carteira de clientes e expedição de cargas.',
      imageSrc: '/icons/sales.png',
      color: 'gray',
      features: ['Emissão de pedidos', 'Tabela de preços', 'Histórico']
    }
  ];

  const resources = [
    { imageSrc: '/icons/box.png', title: 'Produtos', value: 'Ilimitados' },
    { imageSrc: '/icons/report.png', title: 'Relatórios', value: 'Gerenciais' },
    { imageSrc: '/icons/users.png', title: 'Acessos', value: 'Multi-nível' },
    { imageSrc: '/icons/security.png', title: 'Dados', value: 'Seguros' },
  ];

  const colorMap = {
    orange: { 
      bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100', hoverBorder: 'hover:border-orange-300', iconBg: 'bg-orange-100'
    },
    gray: { 
      bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200', hoverBorder: 'hover:border-orange-300', iconBg: 'bg-white border border-gray-100'
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* BANNER SUPERIOR - CLEAN / BRANCO */}
      <div className="relative w-full h-80 rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center p-6">
        
        {/* Blobs de fundo sutis */}
        <div className="absolute top-[-50%] left-[-10%] w-96 h-96 bg-orange-100/40 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
        <div className="absolute bottom-[-50%] right-[-10%] w-96 h-96 bg-gray-100/40 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center animate-float">
          
          {/* LOGO PRINCIPAL */}
          <div className="w-40 h-40 relative mb-4">
             <Image 
               src="/icons/logo.png" 
               alt="Logo CeramiSys" 
               fill 
               className="object-contain drop-shadow-xl" 
               priority
             />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-gray-900 mb-3">
            Cerami<span className="text-orange-600">Sys</span>
          </h1>
          
          <p className="text-xl text-gray-500 max-w-2xl font-medium">
            Sistema Inteligente para Gestão de Indústrias Cerâmicas
          </p>

          <div className="mt-8 flex gap-3">
             <span className="px-4 py-1.5 bg-orange-50 text-orange-700 text-xs font-bold uppercase tracking-wide rounded-full border border-orange-100 shadow-sm">
               Painel Administrativo
             </span>
          </div>
        </div>
      </div>

      {/* CARDS DOS MÓDULOS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {modules.map((mod) => {
          const colors = colorMap[mod.color];

          return (
            <div 
              key={mod.id}
              className={`bg-white rounded-3xl border-2 ${colors.border} shadow-sm p-8 transition-all cursor-pointer group ${colors.hoverBorder} hover:shadow-lg hover:-translate-y-1 relative overflow-hidden`}
              onClick={() => onChangeSection(mod.id)}
            >
              <div className="absolute -top-6 -right-6 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none rotate-12">
                <Image src={mod.imageSrc} alt="" fill className="object-contain" />
              </div>

              <div className="relative z-10">
                <div className={`w-16 h-16 ${colors.iconBg} rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300 relative`}>
                  <div className="w-10 h-10 relative">
                    <Image src={mod.imageSrc} alt={mod.title} fill className="object-contain" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{mod.title}</h3>
                <p className="text-gray-500 text-sm mb-6 min-h-[40px] leading-relaxed">
                  {mod.longDescription}
                </p>
                
                <ul className="space-y-3 mb-8">
                  {mod.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                      <div className={`w-1.5 h-1.5 rounded-full ${mod.color === 'orange' ? 'bg-orange-500' : 'bg-gray-400'}`}></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-3 rounded-xl text-sm font-bold border-2 transition-colors
                  ${mod.color === 'orange' 
                    ? 'border-orange-100 bg-orange-50 text-orange-700 group-hover:bg-orange-600 group-hover:text-white group-hover:border-orange-600' 
                    : 'border-gray-100 bg-gray-50 text-gray-600 group-hover:bg-gray-800 group-hover:text-white group-hover:border-gray-800'}
                `}>
                  Acessar Módulo
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* RODAPÉ INFORMATIVO */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {resources.map((res, idx) => {
          return (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-orange-200 transition-colors">
              <div className="p-3 bg-gray-50 rounded-xl relative w-12 h-12 flex-shrink-0">
                <Image src={res.imageSrc} alt={res.title} fill className="object-contain p-1 opacity-70" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase">{res.title}</p>
                <p className="text-sm font-bold text-gray-800">{res.value}</p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

// ==================================================================
// PLACEHOLDERS
// ==================================================================

const InventoryLayoutPlaceholder = () => (
  <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-white rounded-3xl border border-gray-100 shadow-sm animate-fade-in min-h-[500px]">
    <div className="w-24 h-24 relative mb-6 opacity-50">
        <Image src="/icons/inventory.png" alt="Almoxarifado" fill className="object-contain" />
    </div>
    <h2 className="text-3xl font-bold text-gray-800 mb-2">Módulo Almoxarifado</h2>
    <p className="text-gray-500 max-w-md text-center text-lg">Menu lateral laranja e funcionalidades em breve.</p>
  </div>
);

const SalesLayoutPlaceholder = () => (
  <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-white rounded-3xl border border-gray-100 shadow-sm animate-fade-in min-h-[500px]">
    <div className="w-24 h-24 relative mb-6 opacity-50">
        <Image src="/icons/sales.png" alt="Vendas" fill className="object-contain" />
    </div>
    <h2 className="text-3xl font-bold text-gray-800 mb-2">Módulo de Vendas</h2>
    <p className="text-gray-500 max-w-md text-center text-lg">Em breve.</p>
  </div>
);

const FinanceLayoutPlaceholder = () => (
  <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-white rounded-3xl border border-gray-100 shadow-sm animate-fade-in min-h-[500px]">
    <div className="w-24 h-24 relative mb-6 opacity-50">
        <Image src="/icons/finance.png" alt="Financeiro" fill className="object-contain" />
    </div>
    <h2 className="text-3xl font-bold text-gray-800 mb-2">Módulo Financeiro</h2>
    <p className="text-gray-500 max-w-md text-center text-lg">Em breve.</p>
  </div>
);

// ==================================================================
// COMPONENTE PRINCIPAL
// ==================================================================

export default function DashboardPage() {
  const [activeModule, setActiveModule] = useState('overview'); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const renderModule = () => {
    switch (activeModule) {
      case 'overview': return <OverviewLayout onChangeSection={setActiveModule} />;
      case 'inventory': return <InventoryLayoutPlaceholder />;
      case 'sales': return <SalesLayoutPlaceholder />;
      case 'finance': return <FinanceLayoutPlaceholder />;
      default: return <OverviewLayout onChangeSection={setActiveModule} />;
    }
  };

  const getHeaderTitle = () => {
    switch(activeModule) {
      case 'overview': return 'Visão Geral';
      case 'inventory': return 'Almoxarifado';
      case 'sales': return 'Vendas';
      case 'finance': return 'Financeiro';
      default: return 'CeramiSys';
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex font-sans overflow-hidden">
      
      <Sidebar 
        activeSection={activeModule} 
        onChangeSection={setActiveModule}
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <main 
        className={`flex-1 flex flex-col h-screen transition-all duration-300 ease-in-out 
        ${isSidebarOpen ? 'ml-72' : 'ml-20'}`}
      >
        
        <header className="h-20 bg-white/90 backdrop-blur-sm border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-40 shadow-sm">
           <h1 className="text-2xl font-bold text-gray-800 capitalize">
             {getHeaderTitle()}
           </h1>
           
           <div className="flex items-center gap-4">
              <div className="flex flex-col items-end mr-2 hidden md:block">
                <span className="text-sm font-bold text-gray-700">Admin</span>
                <span className="text-xs text-gray-500">CeramiSys</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-orange-400 text-white flex items-center justify-center font-bold shadow-md border-2 border-white cursor-pointer">
                AD
              </div>
           </div>
        </header>

        <div className="flex-1 p-6 overflow-y-auto bg-[#f8f9fa] custom-scrollbar">
           {renderModule()}
        </div>

      </main>
    </div>
  );
}