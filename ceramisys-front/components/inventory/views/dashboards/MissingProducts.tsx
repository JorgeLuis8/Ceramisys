import React from 'react';
import { AlertTriangle, ShoppingCart } from 'lucide-react';

export function MissingProducts() {
  return (
    <div className="space-y-6 animate-fade-in p-6">
      <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <AlertTriangle className="text-red-500" /> Produtos em Falta (Estoque Crítico)
      </h1>
      <div className="bg-white rounded-xl shadow-sm border border-red-100 overflow-hidden">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-red-50 text-red-700 font-bold">
            <tr>
              <th className="p-4">Produto</th>
              <th className="p-4">Categoria</th>
              <th className="p-4">Estoque Atual</th>
              <th className="p-4">Estoque Mínimo</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[1, 2].map((_, i) => (
              <tr key={i} className="hover:bg-red-50/30">
                <td className="p-4 font-bold text-gray-800">Produto Crítico {i+1}</td>
                <td className="p-4">Consumo</td>
                <td className="p-4 font-bold text-red-600">2 un</td>
                <td className="p-4">10 un</td>
                <td className="p-4"><span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">COMPRAR</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}