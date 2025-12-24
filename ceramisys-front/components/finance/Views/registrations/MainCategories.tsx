import React from 'react';
import { Layers, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function MainCategories() {
  return (
    <div className="space-y-8 animate-fade-in p-6 pb-20 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center"><h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Layers className="text-blue-600"/> Categorias Principais</h1></div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
        <h2 className="font-bold text-slate-800 border-b border-slate-100 pb-2">Nova Categoria Principal</h2>
        <div className="flex gap-4 items-end">
           <div className="flex-1"><label className="text-sm font-semibold text-slate-700">Nome do Grupo</label><input className="w-full px-4 py-2 border border-slate-300 rounded-lg" type="text" /></div>
           <Button variant="primary" icon={Save}>SALVAR</Button>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"><p className="text-slate-500">Listagem de grupos principais.</p></div>
    </div>
  );
}