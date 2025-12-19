import React from 'react';
import { Search, Filter, X, Calendar, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { TableAction } from '@/components/ui/TableAction';

interface SalesHistoryProps {
    filter?: 'pending' | 'all';
}

export function SalesHistory({ filter = 'all' }: SalesHistoryProps) {
  const title = filter === 'pending' ? 'Vendas Pendentes' : 'Vendas Realizadas';

  return (
    <div className="space-y-8 animate-fade-in p-6 pb-20 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center"><div><h1 className="text-2xl font-bold text-slate-800">{title}</h1></div></div>
      
      {/* FILTROS PADRONIZADOS */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
         <div className="p-6 border-b border-slate-200">
            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-1"><label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Buscar</label><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input type="text" className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg outline-none bg-white" placeholder="Cliente ou Nota..." /></div></div>
                    <div className="md:col-span-1"><label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Status</label><select className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white outline-none"><option>Todos</option><option>Pendente</option><option>Pago</option></select></div>
                    <div className="md:col-span-1"><label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Início</label><input type="date" className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-slate-600" /></div>
                    <div className="md:col-span-1"><label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Fim</label><input type="date" className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-slate-600" /></div>
                </div>
                {/* PADRONIZADO: Soft + Outline */}
                <div className="flex gap-2 pt-2">
                    <Button variant="soft" size="sm" icon={Filter}>FILTRAR</Button>
                    <Button variant="outline" size="sm" icon={X}>LIMPAR</Button>
                </div>
            </div>
         </div>

         {/* TABELA */}
         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-600 font-bold text-xs uppercase border-b border-slate-200">
                <tr>
                    <th className="p-4">Nº Nota</th>
                    <th className="p-4">Cliente</th>
                    <th className="p-4">Cidade</th>
                    <th className="p-4">Data</th>
                    <th className="p-4 text-center">Itens</th>
                    <th className="p-4 text-center">Total</th>
                    <th className="p-4 text-center">Saldo</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-right">Ações</th>
                </tr>
                </thead>
                <tbody className="text-slate-600 divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-mono text-xs">#00452</td>
                        <td className="p-4 font-bold text-slate-800">Maria Souza</td>
                        <td className="p-4">Picos - PI</td>
                        <td className="p-4">15/12/2025</td>
                        <td className="p-4 text-center">150</td>
                        <td className="p-4 text-center font-bold text-slate-800">R$ 5.800,00</td>
                        <td className="p-4 text-center text-red-500 font-bold">R$ 0,00</td>
                        <td className="p-4 text-center"><span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-bold flex items-center justify-center gap-1 w-fit mx-auto"><CheckCircle2 size={12}/> Pago</span></td>
                        <td className="p-4 text-right"><div className="flex justify-end gap-2"><TableAction variant="view" /><TableAction variant="edit" /></div></td>
                    </tr>
                </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}