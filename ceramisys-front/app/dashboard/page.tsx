'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { InventoryLayout } from '@/components/dashboard/inventory/InventoryLayout';
import Image from 'next/image';
import { Menu } from 'lucide-react'; // Ícone para menu mobile se necessário

// ==================================================================
// TIPAGEM
// ==================================================================

interface OverviewLayoutProps {
  onChangeSection: (section: string) => void;
}

// ==================================================================
// 1. PÁGINA INICIAL (VISÃO GERAL - DESIGN MELHORADO)
// ==================================================================

const OverviewLayout = ({ onChangeSection }: OverviewLayoutProps) => {
  
  const modules = [
    {
      id: 'inventory',
      title: 'Almoxarifado',
      description: 'Gestão de Estoque', // Encurtei para mobile
      longDescription: 'Controle total de argila, lenha e produtos acabados. Rastreabilidade e gestão de perdas.',
      imageSrc: '/icons/inventory.png', 
      color: 'orange',
      features: ['Entrada e saída', 'Controle de queima', 'Estoque mínimo']
    },
    {
      id: 'finance',
      title: 'Financeiro',
      description: 'Fluxo de Caixa',
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
    <div className="space-y-8 animate-fade-in pb-12"> {/* Aumentei space-y e padding bottom */}
      
      {/* BANNER SUPERIOR - RESPONSIVO */}
      <div className="relative w-full min-h-[320px] rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center p-8 md:p-12">
        
        {/* Blobs de fundo sutis */}
        <div className="absolute top-[-50%] left-[-10%] w-96 h-96 bg-orange-100/40 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
        <div className="absolute bottom-[-50%] right-[-10%] w-96 h-96 bg-gray-100/40 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center animate-float">
          
          {/* LOGO PRINCIPAL */}
          <div className="w-32 h-32 md:w-40 md:h-40 relative mb-6">
             <Image 
               src="/icons/logo.png" 
               alt="Logo CeramiSys" 
               fill 
               className="object-contain drop-shadow-xl" 
               priority
             />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 mb-4">
            Cerami<span className="text-orange-600">Sys</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl font-medium leading-relaxed px-4">
            Sistema Inteligente para Gestão de Indústrias Cerâmicas
          </p>

          <div className="mt-8 flex gap-3">
             <span className="px-5 py-2 bg-orange-50 text-orange-700 text-xs md:text-sm font-bold uppercase tracking-wide rounded-full border border-orange-100 shadow-sm">
               Painel Administrativo
             </span>
          </div>
        </div>
      </div>

      {/* CARDS DOS MÓDULOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {modules.map((mod) => {
          const colors = colorMap[mod.color as keyof typeof colorMap];

          return (
            <div 
              key={mod.id}
              className={`flex flex-col bg-white rounded-3xl border-2 ${colors.border} shadow-sm p-6 md:p-8 transition-all cursor-pointer group ${colors.hoverBorder} hover:shadow-lg hover:-translate-y-1 relative overflow-hidden`}
              onClick={() => onChangeSection(mod.id)}
            >
              {/* Background Decorativo */}
              <div className="absolute -top-6 -right-6 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none rotate-12">
                <Image src={mod.imageSrc} alt="" fill className="object-contain" />
              </div>

              <div className="relative z-10 flex flex-col h-full">
                <div className={`w-14 h-14 md:w-16 md:h-16 ${colors.iconBg} rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300 relative shrink-0`}>
                  <div className="w-8 h-8 md:w-10 md:h-10 relative">
                    <Image src={mod.imageSrc} alt={mod.title} fill className="object-contain" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{mod.title}</h3>
                
                {/* Altura mínima fixa para alinhar os botões em telas grandes */}
                <p className="text-gray-500 text-sm mb-6 min-h-[40px] md:min-h-[60px] leading-relaxed">
                  {mod.longDescription}
                </p>
                
                <ul className="space-y-3 mb-8 flex-1">
                  {mod.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${mod.color === 'orange' ? 'bg-orange-500' : 'bg-gray-400'}`}></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-3 rounded-xl text-sm font-bold border-2 transition-colors mt-auto
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {resources.map((res, idx) => {
          return (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-orange-200 transition-colors">
              <div className="p-3 bg-gray-50 rounded-xl relative w-12 h-12 shrink-0">
                <Image src={res.imageSrc} alt={res.title} fill className="object-contain p-1 opacity-70" />
              </div>
              <div>
                <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-wider">{res.title}</p>
                <p className="text-sm md:text-base font-bold text-gray-800">{res.value}</p>
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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Fecha a sidebar automaticamente no mobile ao carregar
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, []);

  if (!isMounted) return null;

  // Lógica de Renderização do Layout do Almoxarifado
  if (activeModule === 'inventory') {
    return (
      <InventoryLayout 
        onBackToMain={() => setActiveModule('overview')} 
      />
    );
  }

  const renderModule = () => {
    switch (activeModule) {
      case 'overview': return <OverviewLayout onChangeSection={setActiveModule} />;
      case 'sales': return <SalesLayoutPlaceholder />;
      case 'finance': return <FinanceLayoutPlaceholder />;
      default: return <OverviewLayout onChangeSection={setActiveModule} />;
    }
  };

  const getHeaderTitle = () => {
    switch(activeModule) {
      case 'overview': return 'Visão Geral';
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
        ${isSidebarOpen ? 'md:ml-72' : 'md:ml-20'} ml-0`} 
      >
        {/* ^ CORREÇÃO DE RESPONSIVIDADE: 
            No mobile (padrão) a margem é ml-0. 
            Apenas em md (desktop) aplicamos a margem da sidebar. 
        */}
        
        <header className="h-20 bg-white/90 backdrop-blur-sm border-b border-gray-200 flex items-center justify-between px-6 md:px-8 sticky top-0 z-40 shadow-sm">
           <div className="flex items-center gap-4">
             <button 
               onClick={() => setIsSidebarOpen(!isSidebarOpen)}
               className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg md:hidden"
             >
               <Menu size={24} />
             </button>
             <h1 className="text-xl md:text-2xl font-bold text-gray-800 capitalize truncate">
               {getHeaderTitle()}
             </h1>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="flex flex-col items-end mr-2 hidden md:flex">
                <span className="text-sm font-bold text-gray-700">Admin</span>
                <span className="text-xs text-gray-500">CeramiSys</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-orange-400 text-white flex items-center justify-center font-bold shadow-md border-2 border-white cursor-pointer shrink-0">
                AD
              </div>
           </div>
        </header>

        {/* Adicionei 'pb-20' para garantir que o conteúdo final não fique colado na borda da tela */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-[#f8f9fa] custom-scrollbar pb-20">
           {renderModule()}
        </div>

      </main>
    </div>
  );
}