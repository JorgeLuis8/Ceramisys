import React from 'react';
import { Save, Search, Banknote } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function Transactions() {
  return (
    <div className="space-y-8 animate-fade-in p-6 pb-20 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center"><h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Banknote className="text-blue-600"/> Lançamentos</h1></div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
        <h2 className="font-bold text-slate-800 border-b border-slate-100 pb-2">Novo Lançamento</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <div className="md:col-span-2"><label className="text-sm font-semibold text-slate-700">Descrição</label><input className="w-full px-4 py-2 border border-slate-300 rounded-lg" type="text" /></div>
           <div><label className="text-sm font-semibold text-slate-700">Valor (R$)</label><input className="w-full px-4 py-2 border border-slate-300 rounded-lg" type="number" /></div>
           <div><label className="text-sm font-semibold text-slate-700">Categoria</label><select className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white"><option>Energia</option></select></div>
           <div><label className="text-sm font-semibold text-slate-700">Data Vencimento</label><input className="w-full px-4 py-2 border border-slate-300 rounded-lg" type="date" /></div>
           <div><label className="text-sm font-semibold text-slate-700">Status</label><select className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white"><option>Pago</option><option>Pendente</option></select></div>
        </div>
        <div className="flex justify-end"><Button variant="primary" icon={Save}>SALVAR LANÇAMENTO</Button></div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-center text-slate-500 italic">Lista de lançamentos recentes aparecerá aqui.</div>
    </div>
  );
}