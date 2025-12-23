import React from 'react';
import { Save, Search, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { TableAction } from '@/components/ui/TableAction';

export function Customers() {
  return (
    <div className="space-y-8 animate-fade-in p-6 pb-20 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center"><h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Users className="text-blue-600"/> Cadastro de Clientes</h1></div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
        <h2 className="font-bold text-slate-800 border-b border-slate-100 pb-2">Novo Cliente</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div><label className="text-sm font-semibold text-slate-700">Nome</label><input className="w-full px-4 py-2 border border-slate-300 rounded-lg" type="text" /></div>
           <div><label className="text-sm font-semibold text-slate-700">CPF/CNPJ</label><input className="w-full px-4 py-2 border border-slate-300 rounded-lg" type="text" /></div>
           <div><label className="text-sm font-semibold text-slate-700">Telefone</label><input className="w-full px-4 py-2 border border-slate-300 rounded-lg" type="text" /></div>
           <div><label className="text-sm font-semibold text-slate-700">Cidade</label><input className="w-full px-4 py-2 border border-slate-300 rounded-lg" type="text" /></div>
        </div>
        <div className="flex justify-end"><Button variant="primary" icon={Save}>SALVAR</Button></div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
         <table className="w-full text-left text-sm"><thead className="bg-slate-100 text-slate-600 font-bold uppercase"><tr><th className="p-4">Cliente</th><th className="p-4">CPF/CNPJ</th><th className="p-4 text-right">Ações</th></tr></thead><tbody><tr><td className="p-4">João Silva</td><td className="p-4">000.000.000-00</td><td className="p-4 text-right"><TableAction variant="edit" /></td></tr></tbody></table>
      </div>
    </div>
  );
}