'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Menu, Loader2 } from 'lucide-react'; 
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

// IMPORTAÇÕES
import { Sidebar } from '@/components/Sidebar'; 
import { InventoryLayout } from '@/components/inventory/InventoryLayout';
import { SalesLayout } from '@/components/sales/SalesLayout';
import { FinanceLayout } from '@/components/finance/FinanceLayout'; 
import { UnauthorizedScreen } from '@/components/UnauthorizedScreen'; // <--- IMPORT NOVO

// ==================================================================
// CONFIGURAÇÃO DE PERMISSÕES (QUEM PODE ACESSAR O QUÊ)
// ==================================================================
const MODULE_PERMISSIONS = {
  inventory: ['Admin', 'Almoxarifado'],
  finance: ['Admin', 'Financial'],
  sales: ['Admin', 'Sales']
};

interface CustomJwtPayload {
  unique_name: string;
  role: string;
  email: string;
}

// ==================================================================
// COMPONENTE OVERVIEW (CARDS)
// ==================================================================
interface OverviewLayoutProps {
  onAttemptAccess: (moduleId: string) => void; // Mudamos de onChangeSection para onAttemptAccess
}

const OverviewLayout = ({ onAttemptAccess }: OverviewLayoutProps) => {
  const modules = [
    {
      id: 'inventory',
      title: 'Almoxarifado',
      description: 'Gestão de Estoque',
      longDescription: 'Controle total de argila, lenha e produtos acabados.',
      imageSrc: '/icons/inventory.png', 
      color: 'orange'
    },
    {
      id: 'finance',
      title: 'Financeiro',
      description: 'Fluxo de Caixa',
      longDescription: 'Controle preciso de contas a pagar, receber e fluxo de caixa.',
      imageSrc: '/icons/finance.png',
      color: 'gray'
    },
    {
      id: 'sales',
      title: 'Vendas',
      description: 'Pedidos e Clientes',
      longDescription: 'Gestão de pedidos de venda e carteira de clientes.',
      imageSrc: '/icons/sales.png',
      color: 'gray'
    }
  ];

  const colorMap = {
    orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100', hoverBorder: 'hover:border-orange-300', iconBg: 'bg-orange-100' },
    gray: { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200', hoverBorder: 'hover:border-orange-300', iconBg: 'bg-white border border-gray-100' }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* BANNER (Mantido igual) */}
      <div className="relative w-full min-h-[320px] rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center p-8 md:p-12">
        <div className="absolute top-[-50%] left-[-10%] w-96 h-96 bg-orange-100/40 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
        <div className="absolute bottom-[-50%] right-[-10%] w-96 h-96 bg-gray-100/40 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col items-center animate-float">
          <div className="w-32 h-32 md:w-40 md:h-40 relative mb-6">
             <Image src="/icons/logo.png" alt="Logo" fill className="object-contain drop-shadow-xl" priority />
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 mb-4">
            Ceramica<span className="text-orange-600">Canelas</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl font-medium leading-relaxed px-4">
            Sistema Inteligente para Gestão de Indústrias Cerâmicas
          </p>
        </div>
      </div>

      {/* CARDS COM LÓGICA DE CLIQUE */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {modules.map((mod) => {
          const colors = colorMap[mod.color as keyof typeof colorMap];
          return (
            <div 
              key={mod.id} 
              onClick={() => onAttemptAccess(mod.id)} // <--- AQUI CHAMA A VALIDAÇÃO
              className={`flex flex-col bg-white rounded-3xl border-2 ${colors.border} shadow-sm p-6 md:p-8 transition-all cursor-pointer group ${colors.hoverBorder} hover:shadow-lg hover:-translate-y-1 relative overflow-hidden`}
            >
              <div className="absolute -top-6 -right-6 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none rotate-12">
                <Image src={mod.imageSrc} alt="" fill className="object-contain" />
              </div>
              <div className="relative z-10 flex flex-col h-full">
                <div className={`w-14 h-14 md:w-16 md:h-16 ${colors.iconBg} rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300 relative shrink-0`}>
                  <div className="w-8 h-8 md:w-10 md:h-10 relative"><Image src={mod.imageSrc} alt={mod.title} fill className="object-contain" /></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{mod.title}</h3>
                <p className="text-gray-500 text-sm mb-6 min-h-[40px] md:min-h-[60px] leading-relaxed">{mod.longDescription}</p>
                <button className={`w-full py-3 rounded-xl text-sm font-bold border-2 transition-colors mt-auto ${mod.color === 'orange' ? 'border-orange-100 bg-orange-50 text-orange-700 group-hover:bg-orange-600 group-hover:text-white group-hover:border-orange-600' : 'border-gray-100 bg-gray-50 text-gray-600 group-hover:bg-gray-800 group-hover:text-white group-hover:border-gray-800'}`}>
                  Acessar Módulo
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ==================================================================
// 3. COMPONENTE PRINCIPAL (DASHBOARD PAGE)
// ==================================================================

export default function DashboardPage() {
  const router = useRouter(); 
  const [activeModule, setActiveModule] = useState('overview'); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true); 

  // Estados do Usuário
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const checkAuth = () => {
      const token = Cookies.get('auth_token');

      if (!token) {
        router.replace('/auth/login');
      } else {
        try {
            const decoded = jwtDecode<CustomJwtPayload>(token);
            setUserName(decoded.unique_name || 'Usuário');
            setUserRole(decoded.role || 'Viewer');
        } catch (error) {
            console.error("Erro ao decodificar token:", error);
            router.replace('/auth/login');
        }
        setIsLoading(false);
      }
    };

    const timeout = setTimeout(() => { checkAuth(); }, 100);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
    return () => clearTimeout(timeout);
  }, [router]);

  // --- FUNÇÃO PARA GERENCIAR ACESSO AOS MÓDULOS ---
  const handleModuleChange = (moduleId: string) => {
    if (moduleId === 'overview') {
      setActiveModule('overview');
      return;
    }

    // Verifica permissão
    const allowedRoles = MODULE_PERMISSIONS[moduleId as keyof typeof MODULE_PERMISSIONS];
    
    if (allowedRoles && allowedRoles.includes(userRole)) {
      // Tem permissão -> Navega
      setActiveModule(moduleId);
    } else {
      // Não tem permissão -> Tela de erro
      setActiveModule('unauthorized');
    }
  };

  const getInitials = (name: string) => {
      if (!name) return 'U';
      return name.substring(0, 2).toUpperCase();
  };

  const getHeaderTitle = () => {
    switch(activeModule) {
      case 'overview': return 'Visão Geral';
      case 'sales': return 'Vendas';
      case 'finance': return 'Financeiro';
      case 'inventory': return 'Almoxarifado';
      case 'unauthorized': return 'Acesso Restrito'; // Título para erro
      default: return 'CeramiSys';
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Carregando sistema...</p>
      </div>
    );
  }

  // Renderização Condicional do Conteúdo Principal
  const renderContent = () => {
    if (activeModule === 'unauthorized') {
      return <UnauthorizedScreen onBack={() => setActiveModule('overview')} />;
    }
    if (activeModule === 'inventory') return <InventoryLayout onBackToMain={() => setActiveModule('overview')} />;
    if (activeModule === 'sales') return <SalesLayout onBackToMain={() => setActiveModule('overview')} />;
    if (activeModule === 'finance') return <FinanceLayout onBackToMain={() => setActiveModule('overview')} />;
    
    // Default: Overview
    return <OverviewLayout onAttemptAccess={handleModuleChange} />;
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex font-sans overflow-hidden">
      
      {/* Sidebar usa handleModuleChange para validar cliques do menu também */}
      <Sidebar 
        activeSection={activeModule} 
        onChangeSection={handleModuleChange} 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
      />
      
      <main className={`flex-1 flex flex-col h-screen transition-all duration-300 ease-in-out ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'} ml-0`}>
        
        <header className="h-20 bg-white/90 backdrop-blur-sm border-b border-gray-200 flex items-center justify-between px-6 md:px-8 sticky top-0 z-40 shadow-sm">
           <div className="flex items-center gap-4">
             <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg md:hidden">
               <Menu size={24} />
             </button>
             <h1 className="text-xl md:text-2xl font-bold text-gray-800 capitalize truncate">
               {getHeaderTitle()}
             </h1>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="flex flex-col items-end mr-2 hidden md:flex">
                  <span className="text-sm font-bold text-gray-700">{userName}</span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{userRole}</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-orange-400 text-white flex items-center justify-center font-bold shadow-md border-2 border-white cursor-pointer shrink-0">
                  {getInitials(userName)}
              </div>
           </div>
        </header>

        <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-[#f8f9fa] custom-scrollbar pb-20">
            {renderContent()}
        </div>
      </main>
    </div>
  );
}