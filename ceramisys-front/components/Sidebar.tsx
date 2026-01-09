'use client';

import React, { useEffect, useState } from 'react';
import { LayoutDashboard, Box, ShoppingCart, Wallet, X, LogOut } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

// Interface do Payload do Token
interface CustomJwtPayload {
  role: string; // Ex: "Admin", "Financial"
  unique_name: string;
  exp: number;
}

interface SidebarProps {
  activeSection: string;
  onChangeSection: (section: string) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

// CONFIGURAÇÃO DOS MENUS E PERMISSÕES (ROLES DO SEU ENUM C#)
const MENU_ITEMS_CONFIG = [
  { 
    id: 'overview', 
    icon: LayoutDashboard, 
    label: 'Visão Geral', 
    // Todos têm acesso à visão geral
    allowedRoles: ['Admin', 'Viewer', 'Financial', 'Almoxarifado', 'Sales'] 
  },
  { 
    id: 'inventory', 
    icon: Box, 
    label: 'Almoxarifado', 
    // Apenas Admin e Almoxarifado
    allowedRoles: ['Admin', 'Almoxarifado'] 
  },
  { 
    id: 'sales', 
    icon: ShoppingCart, 
    label: 'Vendas', 
    // Apenas Admin e Sales
    allowedRoles: ['Admin', 'Sales'] 
  },
  { 
    id: 'finance', 
    icon: Wallet, 
    label: 'Financeiro', 
    // Apenas Admin e Financial
    allowedRoles: ['Admin', 'Financial'] 
  },
];

export function Sidebar({ activeSection, onChangeSection, isOpen, toggleSidebar }: SidebarProps) {
  const router = useRouter();
  const [itemsToShow, setItemsToShow] = useState<typeof MENU_ITEMS_CONFIG>([]);
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    const token = Cookies.get('auth_token');

    if (token) {
      try {
        const decoded = jwtDecode<CustomJwtPayload>(token);
        // Garante que a role existe, senão define como vazio
        const role = decoded.role || '';
        
        console.log("🔍 Sidebar - Role detectada no Token:", role);
        setUserRole(role);

        // FILTRAGEM: Verifica se a role do usuário está na lista de permitidos do item
        const filtered = MENU_ITEMS_CONFIG.filter(item => 
          item.allowedRoles.includes(role)
        );

        setItemsToShow(filtered);

      } catch (error) {
        console.error("Erro ao decodificar token na Sidebar:", error);
        setItemsToShow([]); // Em caso de erro, não mostra nada por segurança
      }
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove('auth_token', { path: '/' });
    router.replace('/auth/login');
  };

  return (
    <>
      {/* OVERLAY ESCURO (Mobile) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={toggleSidebar} 
        />
      )}

      {/* SIDEBAR CONTAINER */}
      <aside 
        className={`
          fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50 transition-all duration-300 ease-in-out flex flex-col
          ${isOpen ? 'w-64 translate-x-0' : 'w-20 -translate-x-full md:translate-x-0'} 
        `}
      >
        {/* HEADER */}
        <div className="h-20 flex items-center justify-center border-b border-gray-100 relative shrink-0">
          <div className="relative w-10 h-10">
             <Image src="/icons/logo.png" alt="Logo" fill className="object-contain" />
          </div>
          
          {isOpen && (
            <span className="ml-3 font-bold text-gray-800 text-lg animate-fade-in">
              CeramiSys
            </span>
          )}

          <button 
            onClick={toggleSidebar}
            className="md:hidden absolute right-4 text-gray-500 hover:text-red-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* MENU DE NAVEGAÇÃO */}
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {itemsToShow.length === 0 && isOpen && (
             <div className="text-xs text-center text-gray-400 mt-4">
                Carregando menu ou sem permissão... <br/>
                (Role: {userRole})
             </div>
          )}

          {itemsToShow.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onChangeSection(item.id);
                  // Fecha sidebar no mobile ao clicar
                  if (typeof window !== 'undefined' && window.innerWidth < 768) {
                    toggleSidebar();
                  }
                }}
                className={`
                  w-full flex items-center p-3 rounded-xl transition-all duration-200 group relative
                  ${isActive 
                    ? 'bg-orange-50 text-orange-600 shadow-sm font-bold' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
                  ${!isOpen ? 'justify-center' : ''}
                `}
              >
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                
                {isOpen && (
                  <span className="ml-3 font-medium text-sm whitespace-nowrap">
                    {item.label}
                  </span>
                )}

                {/* Tooltip quando fechado */}
                {!isOpen && (
                  <div className="absolute left-full ml-4 px-3 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap hidden md:block shadow-lg">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* BOTÃO DE LOGOUT */}
        <div className="p-4 border-t border-gray-100 shrink-0">
            <button
              onClick={handleLogout}
              className={`
                w-full flex items-center p-3 rounded-xl transition-all duration-200 group relative
                text-gray-500 hover:bg-red-50 hover:text-red-600
                ${!isOpen ? 'justify-center' : ''}
              `}
            >
              <LogOut size={22} strokeWidth={2} />
              
              {isOpen && (
                <span className="ml-3 font-medium text-sm whitespace-nowrap">
                  Sair
                </span>
              )}

              {!isOpen && (
                <div className="absolute left-full ml-4 px-3 py-1 bg-red-600 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap hidden md:block shadow-lg">
                  Sair
                </div>
              )}
            </button>
        </div>

      </aside>
    </>
  );
}