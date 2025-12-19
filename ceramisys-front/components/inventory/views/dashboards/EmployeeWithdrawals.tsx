import React from 'react';
import { UserMinus } from 'lucide-react';

export function EmployeeWithdrawals() {
  return (
    <div className="p-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Retiradas por Funcionário</h1>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-gray-500">Histórico de tudo que cada funcionário retirou.</p>
        </div>
    </div>
  );
}