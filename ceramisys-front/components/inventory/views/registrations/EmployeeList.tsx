import React from 'react';
import { Save, Search, Filter, User, X, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { TableAction } from '@/components/ui/TableAction';

export function EmployeeList() {
  return (
    <div className="space-y-8 animate-fade-in p-6 pb-20 bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4"><div><h1 className="text-2xl font-bold text-slate-800">Funcionários</h1><p className="text-slate-500">Gerencie colaboradores.</p></div></div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3"><div className="p-2 bg-slate-100 text-slate-600 rounded-lg"><Users size={20} /></div><h2 className="text-lg font-bold text-slate-800">Novo Funcionário</h2></div>
        <div className="p-6 space-y-6"><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div><label className="block text-sm font-semibold text-slate-700 mb-1">Nome</label><input type="text" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" /></div><div><label className="block text-sm font-semibold text-slate-700 mb-1">CPF</label><input type="text" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" /></div></div></div>
        {/* PADRONIZADO: Alinhado à direita */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end"><Button variant="primary" icon={Save}>SALVAR FUNCIONÁRIO</Button></div>
      </div>
      {/* Tabela mantida igual... */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200"><div className="bg-slate-50 p-6 rounded-lg border border-slate-200 flex flex-col md:flex-row gap-4 items-end"><div className="flex-1 w-full"><label className="text-xs font-bold text-slate-500 uppercase">Buscar</label><div className="relative mt-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input type="text" className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg outline-none" /></div></div><div className="flex gap-2 w-full md:w-auto"><Button variant="soft" icon={Filter}>FILTRAR</Button><Button variant="outline" icon={X}>LIMPAR</Button></div></div></div>
        <div className="overflow-x-auto"><table className="w-full text-left border-collapse min-w-[700px]"><thead className="bg-slate-50 text-slate-600 text-xs uppercase font-bold border-b border-slate-200"><tr><th className="p-4">Foto</th><th className="p-4">Nome</th><th className="p-4">Cargo</th><th className="p-4 text-center">Status</th><th className="p-4 text-right">Ações</th></tr></thead><tbody className="text-sm text-slate-600"><tr className="hover:bg-slate-50"><td className="p-4"><div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center"><User size={20} /></div></td><td className="p-4 font-bold text-slate-800">João Silva</td><td className="p-4">Operador</td><td className="p-4 text-center"><span className="text-emerald-600 font-bold text-xs">Ativo</span></td><td className="p-4 text-right"><div className="flex justify-end gap-2"><TableAction variant="edit" /><TableAction variant="delete" /></div></td></tr></tbody></table></div></div>
    </div>
  );
}