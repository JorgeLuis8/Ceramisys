import React from 'react';
import { Save, Search, Filter, Image as ImageIcon, X, Package } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { TableAction } from '@/components/ui/TableAction';

export function ProductList() {
  return (
    <div className="space-y-8 animate-fade-in p-6 pb-20 bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-slate-800">Cadastro de Produtos</h1><p className="text-slate-500">Gerencie o estoque.</p></div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3"><div className="p-2 bg-slate-100 text-slate-600 rounded-lg"><Package size={20} /></div><h2 className="text-lg font-bold text-slate-800">Novo Produto</h2></div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="block text-sm font-semibold text-slate-700 mb-1">Código</label><input type="text" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: MC-001" /></div>
            <div><label className="block text-sm font-semibold text-slate-700 mb-1">Nome</label><input type="text" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nome do Produto" /></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div><label className="block text-sm font-semibold text-slate-700 mb-1">Categoria</label><select className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white outline-none"><option>Selecione...</option></select></div>
             <div><label className="block text-sm font-semibold text-slate-700 mb-1">Preço</label><input type="number" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg outline-none" /></div>
             <div><label className="block text-sm font-semibold text-slate-700 mb-1">Estoque Mín.</label><input type="number" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg outline-none" /></div>
          </div>
        </div>
        {/* PADRONIZADO: Alinhado à direita */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end"><Button variant="primary" icon={Save}>SALVAR PRODUTO</Button></div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200"><h2 className="text-lg font-bold text-slate-800 mb-6">Lista de Produtos</h2><div className="bg-slate-50 p-6 rounded-lg border border-slate-200 space-y-4"><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"><div className="lg:col-span-2"><label className="text-xs font-bold text-slate-500 uppercase">Buscar</label><div className="relative mt-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input type="text" className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg outline-none" placeholder="Buscar..." /></div></div></div><div className="flex gap-2 pt-2"><Button variant="soft" size="sm" icon={Filter}>FILTRAR</Button><Button variant="outline" size="sm" icon={X}>LIMPAR</Button></div></div></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-bold border-b border-slate-200">
              <tr><th className="p-4">Imagem</th><th className="p-4">Código</th><th className="p-4">Nome</th><th className="p-4 text-center">Estoque</th><th className="p-4 text-right">Ações</th></tr>
            </thead>
            <tbody className="text-sm text-slate-600">
              <tr className="hover:bg-slate-50 border-b border-slate-100 last:border-0"><td className="p-4"><div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400"><ImageIcon size={18} /></div></td><td className="p-4 font-medium text-slate-900">MC-001</td><td className="p-4 font-medium">Produto Exemplo</td><td className="p-4 text-center font-bold text-emerald-600">12</td><td className="p-4 text-right"><div className="flex justify-end gap-2"><TableAction variant="edit" /><TableAction variant="delete" /></div></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}