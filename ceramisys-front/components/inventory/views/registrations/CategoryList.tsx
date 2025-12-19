import React from 'react';
import { Save, Search, Tags, Layers, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { TableAction } from '@/components/ui/TableAction';

export function CategoryList() {
  return (
    <div className="space-y-8 animate-fade-in p-6 pb-20 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center"><div><h1 className="text-2xl font-bold text-slate-800">Categorias</h1><p className="text-slate-500">Organize os produtos.</p></div></div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"><div className="p-6 border-b border-slate-100 flex items-center gap-3"><div className="p-2 bg-slate-100 text-slate-600 rounded-lg"><Tags size={20} /></div><h2 className="text-lg font-bold text-slate-800">Nova Categoria</h2></div><div className="p-6 space-y-6"><div><label className="block text-sm font-semibold text-slate-700 mb-1">Nome</label><input type="text" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" /></div></div>
      {/* PADRONIZADO: Alinhado à direita */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end"><Button variant="primary" icon={Save}>SALVAR</Button></div></div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"><div className="p-6 border-b border-slate-200"><div className="flex gap-4"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input type="text" className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg outline-none" /></div><Button variant="soft" icon={Filter}>FILTRAR</Button></div></div>
      <div className="overflow-x-auto"><table className="w-full text-left border-collapse min-w-[600px]"><thead className="bg-slate-50 text-slate-600 text-xs uppercase font-bold border-b border-slate-200"><tr><th className="p-4">Nome</th><th className="p-4 text-center">Qtd.</th><th className="p-4 text-right">Ações</th></tr></thead><tbody className="text-sm text-slate-600"><tr className="hover:bg-slate-50"><td className="p-4 font-bold text-slate-800 flex items-center gap-2"><Layers size={16} className="text-blue-500" /> Matéria Prima</td><td className="p-4 text-center"><span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold">24</span></td><td className="p-4 text-right"><div className="flex justify-end gap-2"><TableAction variant="edit" /><TableAction variant="delete" /></div></td></tr></tbody></table></div></div>
    </div>
  );
}