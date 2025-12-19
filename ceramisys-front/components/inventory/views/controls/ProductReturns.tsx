import React from 'react';
import { Filter, X, Undo2, Package, CheckCircle2, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function ProductReturns() {
  return (
    <div className="space-y-8 animate-fade-in p-6 pb-20 bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4"><div><h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Undo2 className="text-orange-600" /> Devolução</h1><p className="text-slate-500">Baixa de itens pendentes.</p></div></div>
      
      {/* BARRA DE FILTRO PADRÃO */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
         <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
               <div className="lg:col-span-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Buscar Produto</label>
                  <div className="relative mt-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="text" className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                  </div>
               </div>
               <div className="lg:col-span-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Colaborador</label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="text" className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                  </div>
               </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="soft" size="sm" icon={Filter}>FILTRAR</Button>
              <Button variant="outline" size="sm" icon={X}>LIMPAR</Button>
            </div>
         </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"><div className="p-6 border-b border-slate-200 flex justify-between items-center"><h2 className="text-lg font-bold text-slate-800">Itens Pendentes</h2><span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">1 Pendente</span></div><div className="overflow-x-auto"><table className="w-full text-left border-collapse min-w-[700px]"><thead className="bg-slate-50 text-slate-600 text-xs uppercase font-bold border-b border-slate-200"><tr><th className="p-4">Produto</th><th className="p-4">Funcionário</th><th className="p-4 text-center">Qtd.</th><th className="p-4 text-center">Data</th><th className="p-4 text-right">Ação</th></tr></thead><tbody className="text-sm text-slate-600"><tr className="hover:bg-slate-50 border-b border-slate-100 last:border-0"><td className="p-4 font-bold text-slate-800 flex items-center gap-2"><Package size={16} className="text-orange-600" /> Saca-Polias</td><td className="p-4 font-medium">FRANCISCO JUNIOR</td><td className="p-4 text-center font-bold text-red-500">1</td><td className="p-4 text-center">17/12/2025</td><td className="p-4 text-right"><Button variant="primary" size="sm" icon={CheckCircle2}>DEVOLVER</Button></td></tr></tbody></table></div></div>
    </div>
  );
}