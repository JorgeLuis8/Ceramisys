'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Menu, Loader2 } from 'lucide-react'; 
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

// --- IMPORTAÇÕES DOS MÓDULOS ---
import { Sidebar } from '@/components/Sidebar'; 
import { InventoryLayout } from '@/components/inventory/InventoryLayout';
import { SalesLayout } from '@/components/sales/SalesLayout';
import { FinanceLayout } from '@/components/finance/FinanceLayout'; 

// ==================================================================
// TIPAGEM DO TOKEN
// ==================================================================
interface CustomJwtPayload {
  unique_name: string; // Ex: "Admin"
  role: string;        // Ex: "Admin"
  email: string;       // Ex: "admin@gmail.com"
  nameid?: string;
  nbf?: number;
  exp?: number;
  iat?: number;
  iss?: string;
  aud?: string;
}

// ==================================================================
// 1. COMPONENTE DE VISÃO GERAL (DASHBOARD HOME) - VISUAL APENAS
// ==================================================================

const OverviewLayout = () => {
  
  const modules = [
    {
      id: 'inventory',
      title: 'Almoxarifado',
      description: 'Gestão de Estoque',
      longDescription: 'Controle total de argila, lenha e produtos acabados. Rastreabilidade e gestão de perdas.',
      imageSrc: '/icons/inventory.png', 
      color: 'orange'
    },
    {
      id: 'finance',
      title: 'Financeiro',
      description: 'Fluxo de Caixa',
      longDescription: 'Controle preciso de contas a pagar, receber e fluxo de caixa diário da cerâmica.',
      imageSrc: '/icons/finance.png',
      color: 'gray'
    },
    {
      id: 'sales',
      title: 'Vendas',
      description: 'Pedidos e Clientes',
      longDescription: 'Gestão de pedidos de venda, carteira de clientes e expedição de cargas.',
      imageSrc: '/icons/sales.png',
      color: 'gray'
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
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* BANNER SUPERIOR */}
      <div className="relative w-full min-h-[320px] rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center p-8 md:p-12 transition-all hover:shadow-md duration-500">
        <div className="absolute top-[-50%] left-[-10%] w-96 h-96 bg-orange-100/40 rounded-full blur-3xl opacity-60 pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-[-50%] right-[-10%] w-96 h-96 bg-gray-100/40 rounded-full blur-3xl opacity-60 pointer-events-none animate-pulse delay-700"></div>

        <div className="relative z-10 flex flex-col items-center animate-float">
          <div className="w-32 h-32 md:w-40 md:h-40 relative mb-6 transition-transform hover:scale-105 duration-300">
             <Image src="/icons/logo.png" alt="Logo CeramiSys" fill className="object-contain drop-shadow-xl" priority />
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 mb-4">
            Cerami<span className="text-orange-600">Sys</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl font-medium leading-relaxed px-4">
            Sistema Inteligente para Gestão de Indústrias Cerâmicas
          </p>
          <div className="mt-8 flex gap-3">
             <span className="px-5 py-2 bg-orange-50 text-orange-700 text-xs md:text-sm font-bold uppercase tracking-wide rounded-full border border-orange-100 shadow-sm select-none">
               Painel Administrativo
             </span>
          </div>
        </div>
      </div>

      {/* CARDS DOS MÓDULOS (SEM CLIQUE, COM ANIMAÇÃO VISUAL) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {modules.map((mod) => {
          const colors = colorMap[mod.color as keyof typeof colorMap];
          return (
            <div 
                key={mod.id} 
                className={`
                  flex flex-col bg-white rounded-3xl border-2 ${colors.border} shadow-sm p-6 md:p-8 
                  relative overflow-hidden cursor-default group
                  /* ANIMAÇÕES AQUI: */
                  transition-all duration-300 ease-out
                  hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] ${colors.hoverBorder}
                `} 
            >
              {/* Imagem de Fundo Rotacionada */}
              <div className="absolute -top-6 -right-6 w-32 h-32 opacity-5 transition-all duration-500 pointer-events-none rotate-12 group-hover:rotate-45 group-hover:opacity-10 group-hover:scale-110">
                <Image src={mod.imageSrc} alt="" fill className="object-contain" />
              </div>

              <div className="relative z-10 flex flex-col h-full">
                {/* Ícone com animação de pulso/escala */}
                <div className={`w-14 h-14 md:w-16 md:h-16 ${colors.iconBg} rounded-2xl flex items-center justify-center mb-6 shadow-sm relative shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  <div className="w-8 h-8 md:w-10 md:h-10 relative">
                    <Image src={mod.imageSrc} alt={mod.title} fill className="object-contain" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">{mod.title}</h3>
                <p className="text-gray-500 text-sm mb-6 min-h-[40px] md:min-h-[60px] leading-relaxed">{mod.longDescription}</p>
                
                {/* Botão Visual (Estático mas bonito) */}
                <div className={`w-full py-3 rounded-xl text-sm font-bold border-2 transition-colors mt-auto text-center select-none ${mod.color === 'orange' ? 'border-orange-100 bg-orange-50 text-orange-700' : 'border-gray-100 bg-gray-50 text-gray-600 group-hover:bg-gray-100'}`}>
                  Módulo Disponível
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* RODAPÉ INFORMATIVO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {resources.map((res, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 transition-all duration-300 hover:border-orange-200 hover:shadow-md hover:-translate-y-1">
            <div className="p-3 bg-gray-50 rounded-xl relative w-12 h-12 shrink-0">
              <Image src={res.imageSrc} alt={res.title} fill className="object-contain p-1 opacity-70" />
            </div>
            <div>
              <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-wider">{res.title}</p>
              <p className="text-sm md:text-base font-bold text-gray-800">{res.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================================================================
// 2. COMPONENTE PRINCIPAL (DASHBOARD)
// ==================================================================

export default function DashboardPage() {
  const router = useRouter();
  const [activeModule, setActiveModule] = useState('overview'); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Estados do Usuário Logado
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userInitials, setUserInitials] = useState('');

  useEffect(() => {
    const checkAuth = () => {
      const token = Cookies.get('auth_token');

      if (!token) {
        console.log("Token não encontrado. Redirecionando...");
        router.replace('/auth/login');
      } else {
        // --- DECODIFICA O TOKEN E ATUALIZA O ESTADO ---
        try {
            const decoded = jwtDecode<CustomJwtPayload>(token);
            
            // Mapeia os campos do token
            const name = decoded.unique_name || 'Usuário';
            const role = decoded.role || 'Visitante';

            setUserName(name);
            setUserRole(role);
            
            // Lógica para Iniciais (Ex: "Jorge Luis" -> "JL")
            let initials = 'US';
            if (name) {
                const parts = name.trim().split(' ');
                if (parts.length === 1) {
                    initials = parts[0].substring(0, 2).toUpperCase();
                } else {
                    initials = (parts[0][0] + parts[1][0]).toUpperCase();
                }
            }
            setUserInitials(initials);

        } catch (error) {
            console.error("Erro ao decodificar token:", error);
            setUserName('Erro Token');
            setUserInitials('ER');
        }

        setIsLoading(false);
      }
    };

    const timeout = setTimeout(() => {
        checkAuth();
    }, 100);

    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }

    return () => clearTimeout(timeout);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Verificando credenciais...</p>
      </div>
    );
  }

  // --- ROTEAMENTO DOS MÓDULOS ---
  if (activeModule === 'inventory') return <InventoryLayout onBackToMain={() => setActiveModule('overview')} />;
  if (activeModule === 'sales') return <SalesLayout onBackToMain={() => setActiveModule('overview')} />;
  if (activeModule === 'finance') return <FinanceLayout onBackToMain={() => setActiveModule('overview')} />;

  const getHeaderTitle = () => activeModule === 'overview' ? 'Visão Geral' : 'CeramiSys';

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <Sidebar 
        activeSection={activeModule} 
        onChangeSection={setActiveModule} 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
      />

      <main className={`flex-1 flex flex-col h-screen transition-all duration-300 ease-in-out ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'} ml-0`}>
        
        {/* --- HEADER --- */}
        <header className="h-20 bg-white/90 backdrop-blur-sm border-b border-gray-200 flex items-center justify-between px-6 md:px-8 sticky top-0 z-40 shadow-sm">
           
           <div className="flex items-center gap-4">
             <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg md:hidden">
               <Menu size={24} />
             </button>
             <h1 className="text-xl md:text-2xl font-bold text-gray-800 capitalize truncate">
               {getHeaderTitle()}
             </h1>
           </div>
           
           {/* ÁREA DO USUÁRIO */}
           <div className="flex items-center gap-4">
              <div className="flex flex-col items-end mr-2 hidden md:flex">
                <span className="text-sm font-bold text-gray-700">
                    {userName}
                </span>
                <span className="text-xs text-gray-500">
                    {userRole}
                </span>
              </div>
              
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-orange-400 text-white flex items-center justify-center font-bold shadow-md border-2 border-white cursor-pointer shrink-0 hover:scale-105 transition-transform">
                {userInitials}
              </div>
           </div>
        </header>

        {/* CONTEÚDO PRINCIPAL */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-[#f8f9fa] custom-scrollbar pb-20">
           <OverviewLayout />
        </div>

      </main>
    </div>
  );
}