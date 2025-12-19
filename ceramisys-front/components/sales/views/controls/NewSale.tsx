import React, { useState } from 'react';
import { 
  Save, Search, User, Package, Plus, Trash2, ShoppingCart, Calendar, 
  CheckCircle2, PlusCircle, MinusCircle, Printer, Filter, X 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { TableAction } from '@/components/ui/TableAction';

// Tipagem para os dados da tabela (Mock)
interface SaleItem {
  id: number;
  produto: string;
  qtd: number;
  preco: number;
  quebra: number;
  subtotal: number;
}

interface Sale {
  id: number;
  nota: string;
  cliente: string;
  telefone: string;
  cidade: string;
  estado: string;
  data: string;
  itensCount: number;
  totalQuebra: number;
  desconto: number;
  total: number;
  saldoDevedor: number;
  status: 'Pendente' | 'Pago';
  itens: SaleItem[];
  pagamentos: any[];
}

export function NewSale() {
  // Estado para controlar a expansão da tabela de histórico
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const toggleRow = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  // Dados Mockados (Simulando uma venda recém-criada)
  const recentSales: Sale[] = [
    {
      id: 1,
      nota: "001",
      cliente: "Construtora Silva",
      telefone: "(89) 9999-9999",
      cidade: "Picos",
      estado: "PI",
      data: "19/12/2025",
      itensCount: 1,
      totalQuebra: 0,
      desconto: 0,
      total: 1300.00,
      saldoDevedor: 1300.00,
      status: "Pendente",
      itens: [
        { id: 101, produto: "Tijolos de 1ª 06 Furos", qtd: 1000, preco: 1.30, quebra: 0, subtotal: 1300.00 }
      ],
      pagamentos: [] 
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in p-6 pb-20 bg-slate-50 min-h-screen">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <ShoppingCart className="text-blue-600"/> Registrar Nova Venda
            </h1>
            <p className="text-slate-500">Preencha os dados do cliente e itens.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* === COLUNA ESQUERDA: DADOS E ITENS === */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* 1. DADOS DO CLIENTE */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
                    <User className="text-slate-400" size={20}/> <h2 className="font-bold text-slate-800">Dados do Cliente</h2>
                </div>
                <div className="p-6 space-y-6">
                    <div className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Cliente</label>
                            <input type="text" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="Buscar cliente..." />
                        </div>
                        <Button variant="soft" icon={Search}>BUSCAR</Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Endereço</label>
                            <input type="text" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" readOnly />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Telefone</label>
                            <input type="text" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" readOnly />
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. ADICIONAR ITENS */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
                    <Package className="text-slate-400" size={20}/> <h2 className="font-bold text-slate-800">Adicionar Produtos</h2>
                </div>
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="md:col-span-4">
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Produto</label>
                            <select className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500">
                                <option>Selecione...</option>
                                <option>Tijolo 8 Furos</option>
                            </select>
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Qtd.</label>
                            <input type="number" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Preço (R$)</label>
                            <input type="number" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Quebra</label>
                            <input type="number" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        
                        <div className="md:col-span-1 flex items-end">
                             <Button variant="soft" icon={Plus} className="w-full">ADICIONAR</Button>
                        </div>
                    </div>
                </div>
                
                {/* 3. LISTA DE ITENS (CARRINHO ATUAL) */}
                <div className="border-t border-slate-200">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-xs font-bold uppercase border-b border-slate-200">
                            <tr>
                                <th className="p-4">Produto</th>
                                <th className="p-4 text-center">Qtd</th>
                                <th className="p-4 text-center">Unit.</th>
                                <th className="p-4 text-center">Total</th>
                                <th className="p-4 text-right">#</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-slate-100 hover:bg-slate-50">
                                <td className="p-4 font-medium text-slate-800">Tijolo 8 Furos (Milheiro)</td>
                                <td className="p-4 text-center">2</td>
                                <td className="p-4 text-center">R$ 800,00</td>
                                <td className="p-4 text-center font-bold">R$ 1.600,00</td>
                                <td className="p-4 text-right"><button className="text-red-500 hover:text-red-700 p-1"><Trash2 size={16}/></button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        {/* === COLUNA DIREITA: RESUMO E PAGAMENTO === */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden sticky top-6">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="font-bold text-slate-800">Resumo Financeiro</h2>
                </div>
                
                <div className="p-6 space-y-6">
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between text-slate-500"><span>Subtotal</span><span>R$ 1.600,00</span></div>
                        <div className="flex justify-between items-center text-slate-500">
                            <span>Desconto (R$)</span>
                            <input type="number" className="w-24 px-2 py-1 text-right border border-slate-300 rounded outline-none focus:border-blue-500" placeholder="0,00" />
                        </div>
                        <div className="flex justify-between font-bold text-xl text-slate-800 pt-4 border-t border-slate-100">
                            <span>Total</span><span>R$ 1.600,00</span>
                        </div>
                    </div>

                    <div className="space-y-4 pt-2">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Pagamento</label>
                            <select className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white outline-none"><option>Dinheiro</option><option>PIX</option><option>A Prazo</option></select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Data Venda</label>
                            <input type="date" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg outline-none text-slate-600" />
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-200">
                    <Button variant="primary" icon={Save} className="w-full justify-center">FINALIZAR VENDA</Button>
                </div>
            </div>
        </div>

      </div>

      {/* 5. VENDAS REALIZADAS (EXPANSÍVEL) */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-8">
        <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
           <h2 className="text-lg font-bold text-slate-800">Vendas Realizadas (Recentes)</h2>
           
           {/* Filtro Rápido */}
           <div className="flex gap-2">
              <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                 <input type="text" className="pl-9 pr-4 py-1.5 text-sm border border-slate-300 rounded-lg outline-none" placeholder="Buscar nota..." />
              </div>
              <Button variant="soft" size="sm" icon={Filter}>FILTRAR</Button>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            {/* Cabeçalho Laranja (Opção visual) ou Padrão Slate */}
            <thead className="bg-slate-50 text-slate-600 font-bold text-xs uppercase border-b border-slate-200">
              <tr>
                <th className="p-4 w-10"></th>
                <th className="p-4">Nº Nota</th>
                <th className="p-4">Cliente</th>
                <th className="p-4">Telefone</th>
                <th className="p-4">Cidade</th>
                <th className="p-4">UF</th>
                <th className="p-4 text-center">Data</th>
                <th className="p-4 text-center">Itens</th>
                <th className="p-4 text-center">Total Quebra</th>
                <th className="p-4 text-center">Desc.</th>
                <th className="p-4 text-center">Total</th>
                <th className="p-4 text-center">Saldo Dev.</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 divide-y divide-slate-100">
                {recentSales.map((sale) => (
                    <React.Fragment key={sale.id}>
                        {/* Linha Principal */}
                        <tr className={`transition-colors ${expandedRow === sale.id ? 'bg-slate-50' : 'hover:bg-slate-50'}`}>
                            <td className="p-4 text-center">
                                <button onClick={() => toggleRow(sale.id)} className="text-emerald-500 hover:text-emerald-600 transition-colors">
                                    {expandedRow === sale.id ? <MinusCircle size={20} fill="#ecfdf5" /> : <PlusCircle size={20} />}
                                </button>
                            </td>
                            <td className="p-4 font-mono text-xs">{sale.nota}</td>
                            <td className="p-4 font-bold text-slate-800">{sale.cliente}</td>
                            <td className="p-4 text-xs">{sale.telefone}</td>
                            <td className="p-4 text-xs">{sale.cidade}</td>
                            <td className="p-4 text-xs">{sale.estado}</td>
                            <td className="p-4 text-center text-xs">{sale.data}</td>
                            <td className="p-4 text-center">{sale.itensCount}</td>
                            <td className="p-4 text-center">{sale.totalQuebra.toFixed(2)}</td>
                            <td className="p-4 text-center">R$ {sale.desconto.toFixed(2)}</td>
                            <td className="p-4 text-center font-bold text-slate-800">R$ {sale.total.toFixed(2)}</td>
                            <td className="p-4 text-center font-bold text-red-600">R$ {sale.saldoDevedor.toFixed(2)}</td>
                            <td className="p-4 text-center">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${sale.status === 'Pago' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                                    {sale.status}
                                </span>
                            </td>
                            <td className="p-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <button title="Recibo" className="p-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors"><Printer size={16}/></button>
                                    <TableAction variant="edit" />
                                </div>
                            </td>
                        </tr>

                        {/* Detalhes Expansíveis */}
                        {expandedRow === sale.id && (
                            <tr className="bg-slate-50/50">
                                <td colSpan={14} className="p-4">
                                    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-inner">
                                        
                                        {/* Sub-tabela: Itens */}
                                        <div className="p-4 border-b border-slate-100">
                                            <h4 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">Itens da Venda</h4>
                                            <table className="w-full text-sm text-left">
                                                <thead className="bg-slate-100 text-xs font-bold text-slate-500 uppercase">
                                                    <tr>
                                                        <th className="p-3">Produto</th>
                                                        <th className="p-3 text-center">Quantidade</th>
                                                        <th className="p-3 text-center">Preço Unit.</th>
                                                        <th className="p-3 text-center">Quebra (Qtd)</th>
                                                        <th className="p-3 text-right">Subtotal</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {sale.itens.map(item => (
                                                        <tr key={item.id}>
                                                            <td className="p-3 font-medium">{item.produto}</td>
                                                            <td className="p-3 text-center">{item.qtd.toFixed(2)}</td>
                                                            <td className="p-3 text-center">R$ {item.preco.toFixed(2)}</td>
                                                            <td className="p-3 text-center">{item.quebra.toFixed(2)}</td>
                                                            <td className="p-3 text-right font-bold">R$ {item.subtotal.toFixed(2)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Sub-tabela: Pagamentos */}
                                        <div className="p-4 bg-slate-50/50">
                                            <h4 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">Pagamentos</h4>
                                            <div className="p-4 text-center text-slate-400 italic text-sm border border-dashed border-slate-300 rounded">
                                                Nenhum pagamento registrado para esta venda pendente.
                                            </div>
                                        </div>

                                    </div>
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}