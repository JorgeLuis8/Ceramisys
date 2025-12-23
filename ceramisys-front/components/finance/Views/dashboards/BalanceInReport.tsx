import React from 'react';
import { ArrowUpCircle, Filter } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function BalanceInReport() {
  return (
    <div className="space-y-8 animate-fade-in p-6 pb-20 bg-slate-50 min-h-screen">
      <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><ArrowUpCircle className="text-emerald-600"/> Balancete de Entradas</h1>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex gap-4 items-end">
          <div className="flex-1"><label className="text-sm font-bold text-slate-500">Mês</label><input type="month" className="w-full px-3 py-2 border border-slate-300 rounded-lg"/></div>
          <Button variant="primary" icon={Filter}>GERAR</Button>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 h-64 flex items-center justify-center text-slate-400">Relatório de Receitas</div>
    </div>
  );
}