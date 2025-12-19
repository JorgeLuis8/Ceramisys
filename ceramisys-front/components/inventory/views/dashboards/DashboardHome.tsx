import React from 'react';
import { Package, Layers, DollarSign, AlertTriangle, ArrowDownLeft } from 'lucide-react';

export function DashboardHome() {
  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div><h1 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2">Dashboard <span className="text-gray-300">/</span> <span className="text-blue-600">Almoxarifado</span></h1><p className="text-sm text-gray-500 mt-1">Resumo das operações.</p></div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0"><button className="whitespace-nowrap px-4 py-2 text-xs font-semibold bg-blue-50 text-blue-600 rounded-lg border border-blue-100">Este Mês</button></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[{ label: 'Produtos', val: '446', icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' }, { label: 'Valor Estoque', val: 'R$ 128k', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' }, { label: 'Volume', val: '2.463', icon: Layers, color: 'text-purple-600', bg: 'bg-purple-50' }, { label: 'Alertas', val: '25', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' }].map((kpi, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-between hover:-translate-y-1 transition-transform"><div className="flex justify-between items-start mb-4"><div className={`p-3 rounded-xl ${kpi.bg} ${kpi.color}`}><kpi.icon size={22} /></div></div><div><p className="text-sm font-medium text-gray-500">{kpi.label}</p><h3 className="text-2xl md:text-3xl font-bold text-slate-800 mt-1">{kpi.val}</h3></div></div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-200"><h2 className="text-lg font-bold text-slate-800 mb-6">Entradas Mensais</h2><div className="h-64 flex items-end justify-between gap-2 overflow-x-auto pb-2">{[...Array(12)].map((_, i) => (<div key={i} className="flex flex-col items-center w-full min-w-[20px] group"><div className="w-full bg-blue-100 rounded-t-sm group-hover:bg-blue-600 transition-colors" style={{ height: `${Math.random() * 80 + 20}%` }}></div></div>))}</div></div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200"><h2 className="text-lg font-bold text-slate-800 mb-4">Recentes</h2><div className="space-y-4">{[1, 2, 3].map((_, i) => (<div key={i} className="flex items-center gap-3 pb-3 border-b border-gray-50 last:border-0"><div className="p-2 bg-slate-50 rounded-lg text-slate-500"><ArrowDownLeft size={16}/></div><div><p className="text-sm font-bold text-slate-700">Entrada de Argila</p><p className="text-xs text-gray-400">Há 2 horas</p></div></div>))}</div></div>
      </div>
    </div>
  );
}