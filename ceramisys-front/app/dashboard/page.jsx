'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import Image from 'next/image';
import { 
  Package, 
  Banknote, 
  ShoppingCart, 
  CheckCircle, 
  ShieldCheck, 
  Users, 
  FileText, 
  Boxes 
} from 'lucide-react';

// ==================================================================
// 1. PÁGINA INICIAL (VISÃO GERAL) - IDENTIDADE CERAMISYS
// ==================================================================

const OverviewLayout = ({ onChangeSection }) => {
  
  // Dados dos Cards Principais
  const modules = [
    {
      id: 'inventory',
      title: 'Almoxarifado',
      description: 'Gestão Completa de Estoque',
      longDescription: 'Controle total de argila, lenha e produtos acabados. Rastreabilidade e gestão de perdas.',
      icon: Package,
      color: 'orange', // Mantém a cor da marca
      features: [
        'Entrada e saída de insumos',
        'Controle de queima e produção',
        'Relatórios de estoque mínimo'
      ]
    },
    {
      id: 'finance',
      title: 'Financeiro',
      description: 'Fluxo de Caixa e Contas',
      longDescription: 'Controle preciso de contas a pagar, receber e fluxo de caixa diário da cerâmica.',
      icon: Banknote,
      color: 'gray', // Neutro/Profissional
      features: [
        'Contas a pagar e receber',
        'Demonstrativo de Resultados (DRE)',
        'Conciliação bancária'
      ]
    },
    {
      id: 'sales',
      title: 'Vendas',
      description: 'Pedidos e Clientes',
      longDescription: 'Gestão de pedidos de venda, carteira de clientes e expedição de cargas.',
      icon: ShoppingCart,
      color: 'gray', // Neutro/Profissional
      features: [
        'Emissão de pedidos',
        'Tabela de preços dinâmica',
        'Histórico de compras por cliente'
      ]
    }
  ];

  // Dados do Rodapé
  const resources = [
    { icon: Boxes, title: 'Produtos', value: 'Gestão Total' },
    { icon: FileText, title: 'Relatórios', value: 'Gerenciais' },
    { icon: Users, title: 'Acessos', value: 'Multi-nível' },
    { icon: ShieldCheck, title: 'Dados', value: 'Seguros' },
  ];

  // Mapeamento de cores (Focado na identidade Laranja CeramiSys)
  const colorMap = {
    orange: { 
      bg: 'bg-orange-50', 
      text: 'text-orange-600', 
      border: 'border-orange-100', 
      hoverBorder: 'hover:border-orange-300',
      iconBg: 'bg-orange-100'
    },
    gray: { 
      bg: 'bg-gray-50', 
      text: 'text-gray-600', 
      border: 'border-gray-200', 
      hoverBorder: 'hover:border-orange-300', // Hover fica laranja para identidade
      iconBg: 'bg-white border border-gray-100'
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* BANNER SUPERIOR - LIMPO (BRANDING CERAMISYS) */}
      <div className="relative w-full h-64 rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center p-6">
        
        {/* Blobs Sutis de Fundo (Identidade Visual) */}
        <div className="absolute top-[-50%] left-[-10%] w-96 h-96 bg-orange-100/50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
        <div className="absolute bottom-[-50%] right-[-10%] w-96 h-96 bg-gray-100/50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-24 h-24 relative mb-4">
             <Image 
               src="/icons/logo.png" 
               alt="Logo CeramiSys" 
               fill 
               className="object-contain" 
             />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 mb-2">
            Cerami<span className="text-orange-600">Sys</span>
          </h1>
          
          <p className="text-lg text-gray-500 max-w-2xl font-medium">
            Sistema Inteligente para Gestão de Indústrias Cerâmicas
          </p>

          <div className="mt-6 flex gap-2">
             <span className="px-3 py-1 bg-orange-50 text-orange-700 text-xs font-bold uppercase tracking-wide rounded-full border border-orange-100">
               Versão 1.0
             </span>
             <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wide rounded-full border border-green-100">
               Online
             </span>
          </div>
        </div>
      </div>

      {/* CARDS DOS MÓDULOS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {modules.map((mod) => {
          const colors = colorMap[mod.color];
          const Icon = mod.icon;

          return (
            <div 
              key={mod.id}
              className={`bg-white rounded-3xl border-2 ${colors.border} shadow-sm p-8 transition-all cursor-pointer group ${colors.hoverBorder} hover:shadow-md hover:-translate-y-1 relative overflow-hidden`}
              onClick={() => onChangeSection(mod.id)}
            >
              {/* Efeito sutil no hover */}
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Icon size={100} className={mod.color === 'orange' ? 'text-orange-500' : 'text-gray-400'} />
              </div>

              <div className="relative z-10">
                <div className={`w-14 h-14 ${colors.iconBg} rounded-2xl flex items-center justify-center mb-6 text-gray-700 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={28} className={mod.color === 'orange' ? 'text-orange-600' : 'text-gray-600'} strokeWidth={2} />
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
          const Icon = res.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-gray-50 rounded-xl text-gray-400">
                <Icon size={24} />
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
// PLACEHOLDERS (MANTIDOS IGUAIS PARA FUNCIONAR)
// ==================================================================

const InventoryLayoutPlaceholder = () => (
  <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-white rounded-3xl border border-gray-100 shadow-sm animate-fade-in">
    <div className="p-5 bg-orange-50 rounded-full mb-4">
      <Package size={48} className="text-orange-500" />
    </div>
    <h2 className="text-2xl font-bold text-gray-800 mb-2">Módulo Almoxarifado</h2>
    <p className="text-gray-500 max-w-md text-center">Menu lateral laranja e funcionalidades em breve.</p>
  </div>
);

const SalesLayoutPlaceholder = () => (
  <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-white rounded-3xl border border-gray-100 shadow-sm animate-fade-in">
    <div className="p-5 bg-gray-50 rounded-full mb-4">
      <ShoppingCart size={48} className="text-gray-500" />
    </div>
    <h2 className="text-2xl font-bold text-gray-800 mb-2">Módulo de Vendas</h2>
    <p className="text-gray-500 max-w-md text-center">Em breve.</p>
  </div>
);

const FinanceLayoutPlaceholder = () => (
  <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-white rounded-3xl border border-gray-100 shadow-sm animate-fade-in">
    <div className="p-5 bg-gray-50 rounded-full mb-4">
      <Banknote size={48} className="text-gray-500" />
    </div>
    <h2 className="text-2xl font-bold text-gray-800 mb-2">Módulo Financeiro</h2>
    <p className="text-gray-500 max-w-md text-center">Em breve.</p>
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