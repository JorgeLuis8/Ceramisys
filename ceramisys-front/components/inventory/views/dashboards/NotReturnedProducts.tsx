import React from 'react';
import { Clock, AlertCircle } from 'lucide-react';

export function NotReturnedProducts() {
  return (
    <div className="space-y-6 animate-fade-in p-6">
      <h1 className="text-2xl font-bold text-gray-800">Produtos Não Devolvidos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((_, i) => (
          <div key={i} className="bg-white p-5 border border-orange-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
                <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                    <Clock size={12} /> Atrasado 2 dias
                </span>
                <AlertCircle size={18} className="text-orange-500" />
            </div>
            <h3 className="font-bold text-gray-800">Furadeira Bosh</h3>
            <p className="text-sm text-gray-500">Retirado por: <strong>João da Silva</strong></p>
            <p className="text-xs text-gray-400 mt-2">Data prevista: 12/12/2024</p>
          </div>
        ))}
      </div>
    </div>
  );
}