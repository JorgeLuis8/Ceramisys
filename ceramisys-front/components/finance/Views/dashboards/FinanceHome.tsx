import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

export function FinanceHome() {
  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h1 className="text-xl md:text-2xl font-bold text-slate-800">Painel Financeiro</h1>
        <p className="text-sm text-gray-500 mt-1">Visão geral do fluxo de caixa.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[{ label: 'Saldo Atual', val: 'R$ 12.450,00', icon: Wallet, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Receitas (Mês)', val: 'R$ 45.200,00', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Despesas (Mês)', val: 'R$ 32.750,00', icon: TrendingDown, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'A Pagar (Hoje)', val: 'R$ 1.200,00', icon: DollarSign, color: 'text-orange-600', bg: 'bg-orange-50' }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-between">
             <div className="flex justify-between items-start mb-4"><div className={`p-3 rounded-xl ${kpi.bg} ${kpi.color}`}><kpi.icon size={22} /></div></div>
             <div><p className="text-sm font-medium text-gray-500">{kpi.label}</p><h3 className="text-2xl font-bold text-slate-800 mt-1">{kpi.val}</h3></div>
          </div>
        ))}
      </div>
    </div>
  );
}