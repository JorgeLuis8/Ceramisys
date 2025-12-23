import React from 'react';
import { FileText, Upload } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function RegisterStatement() {
  return (
    <div className="space-y-8 animate-fade-in p-6 pb-20 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center"><h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><FileText className="text-blue-600"/> Cadastrar Extrato</h1></div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-4"><Upload size={48}/></div>
          <div><h2 className="text-xl font-bold text-slate-800">Importar OFX</h2><p className="text-slate-500 mt-2">Arraste seu arquivo bancário aqui.</p></div>
          <Button variant="primary" icon={Upload}>SELECIONAR ARQUIVO</Button>
      </div>
    </div>
  );
}