import React from 'react';
import { BarChart3 } from 'lucide-react';

export function ExpensesByCategory() {
  return (
    <div className="p-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Gastos por Categoria</h1>
        <div className="bg-white p-10 rounded-xl border border-gray-200 flex flex-col items-center justify-center text-gray-400 h-96">
            <BarChart3 size={48} className="mb-4 text-orange-200" />
            <p>Gráficos de gastos serão implementados aqui.</p>
        </div>
    </div>
  );
}