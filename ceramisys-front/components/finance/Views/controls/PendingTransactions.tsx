import React from 'react';
import { Clock, Filter } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function PendingTransactions() {
  return (
    <div className="space-y-8 animate-fade-in p-6 pb-20 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center"><h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Clock className="text-orange-600"/> Pendentes</h1></div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
         <div className="flex gap-4 items-end">
            <div className="flex-1"><label className="text-sm font-semibold text-slate-700">Vencimento até</label><input className="w-full px-4 py-2 border border-slate-300 rounded-lg" type="date" /></div>
            <Button variant="soft" icon={Filter}>FILTRAR</Button>
         </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
         <table className="w-full text-left text-sm"><thead className="bg-slate-100 text-slate-600 font-bold uppercase"><tr><th className="p-4">Descrição</th><th className="p-4">Vencimento</th><th className="p-4">Valor</th><th className="p-4">Status</th></tr></thead><tbody><tr><td className="p-4">Conta de Luz</td><td className="p-4">25/12/2025</td><td className="p-4 font-bold">R$ 500,00</td><td className="p-4 text-orange-600 font-bold">Pendente</td></tr></tbody></table>
      </div>
    </div>
  );
}