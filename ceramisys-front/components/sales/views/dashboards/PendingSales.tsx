import React from 'react';
import { Search, Filter, X, Clock, User, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { TableAction } from '@/components/ui/TableAction';

export function PendingSales() {
  return (
    <div className="space-y-8 animate-fade-in p-6 pb-20 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center"><div><h1 className="text-2xl font-bold text-slate-800">Vendas Pendentes</h1><p className="text-slate-500">Recebimentos em aberto.</p></div></div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
           <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 w-full"><label className="text-xs font-bold text-slate-500 uppercase">Buscar Cliente</label><div className="relative mt-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input type="text" className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white" placeholder="Nome do cliente..." /></div></div>
              {/* PADRONIZADO */}
              <div className="flex gap-2 w-full md:w-auto"><Button variant="soft" icon={Filter}>FILTRAR</Button><Button variant="outline" icon={X}>LIMPAR</Button></div>
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-bold border-b border-slate-200"><tr><th className="p-4">Cliente</th><th className="p-4 text-center">Data Venda</th><th className="p-4 text-center">Valor Total</th><th className="p-4 text-center">Saldo Devedor</th><th className="p-4 text-center">Status</th><th className="p-4 text-right">Ações</th></tr></thead>
            <tbody className="text-sm text-slate-600"><tr className="hover:bg-slate-50 border-b border-slate-100 last:border-0"><td className="p-4 font-bold text-slate-800 flex items-center gap-2"><User size={16}/> Construtora Silva</td><td className="p-4 text-center">10/12/2025</td><td className="p-4 text-center font-bold text-slate-800">R$ 2.500,00</td><td className="p-4 text-center font-bold text-red-600 flex items-center justify-center gap-1"><DollarSign size={14}/> R$ 1.250,00</td><td className="p-4 text-center"><span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-bold flex items-center justify-center gap-1 w-fit mx-auto"><Clock size={12}/> Parcial</span></td><td className="p-4 text-right"><div className="flex justify-end gap-2"><TableAction variant="edit" title="Receber" /><TableAction variant="view" /></div></td></tr></tbody>
          </table>
        </div>
      </div>
    </div>
  );
}