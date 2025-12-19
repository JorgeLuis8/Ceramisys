import React from 'react';
import { Repeat } from 'lucide-react';

export function RecurringWithdrawals() {
  return (
    <div className="p-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Saídas Recorrentes</h1>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-gray-500">Lista dos itens que mais saem do estoque mensalmente.</p>
            {/* Tabela simplificada */}
            <div className="mt-4 space-y-2">
                {[1,2,3].map(i => (
                    <div key={i} className="flex justify-between p-3 bg-gray-50 rounded">
                        <span>Luvas de Proteção</span>
                        <span className="font-bold text-orange-600">45 saídas/mês</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
}