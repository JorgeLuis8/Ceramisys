import React, { useState, useEffect } from 'react';
import { Search, Filter, X, Calendar, CheckCircle2, FileText, Loader2, ChevronLeft, ChevronRight, Eye, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { TableAction } from '@/components/ui/TableAction';
import { api } from '@/lib/api';

// --- ENUMS E HELPERS ---
const SaleStatusDescriptions: Record<number, string> = {
  0: "Pendente",
  1: "Parcial",
  2: "Confirmado",
  3: "Cancelado",
  4: "Doação"
};

const PaymentMethodDescriptions: Record<number, string> = {
  0: "Dinheiro", 1: "CXPJ", 2: "BBJ", 3: "BBJN", 4: "CHEQUE", 5: "BradescoPJ", 6: "CXJ", 7: "Débito Automático"
};

const formatMoney = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
const formatDate = (dateStr: string) => dateStr ? new Date(dateStr).toLocaleDateString('pt-BR') : '-';

// --- INTERFACES ---
interface SaleItem {
    id: string;
    noteNumber: number;
    saleDate: string;
    city: string;
    state: string;
    customerName: string;
    totalNet: number;
    remainingBalance: number;
    itemsCount: number;
    status: number; 
}

interface SalesHistoryProps {
    filter?: 'pending' | 'all';
}

export function SalesHistory({ filter = 'all' }: SalesHistoryProps) {
  const title = filter === 'pending' ? 'Vendas Pendentes' : 'Histórico de Vendas';
  
  // Estados de Dados e Loading
  const [sales, setSales] = useState<SaleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  // Paginação
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10;

  // Filtros
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState(filter === 'pending' ? '0' : ''); // Se for tela de pendentes, inicia filtrando
  const [paymentMethod, setPaymentMethod] = useState('');

  // --- EFEITOS ---
  useEffect(() => {
    fetchSales();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // --- API: LISTAGEM ---
  const fetchSales = async (isReset = false) => {
    setLoading(true);
    try {
        const params = {
            Page: isReset ? 1 : page,
            PageSize: pageSize,
            Search: (isReset ? '' : search) || undefined,
            StartDate: (isReset ? '' : startDate) || undefined,
            EndDate: (isReset ? '' : endDate) || undefined,
            Status: (isReset ? undefined : (status !== '' ? Number(status) : undefined)),
            PaymentMethod: (isReset ? undefined : (paymentMethod !== '' ? Number(paymentMethod) : undefined))
        };

        const response = await api.get('/api/sales/paged', { params });
        const data = response.data;

        if (data.items) {
            setSales(data.items);
            setTotalItems(data.totalItems || 0);
        } else {
            setSales([]);
            setTotalItems(0);
        }
    } catch (error) {
        console.error("Erro ao buscar vendas", error);
    } finally {
        setLoading(false);
    }
  };

  // --- API: GERAR PDF (RELATÓRIO) ---
  const handleGeneratePdf = async () => {
    setPdfLoading(true);
    try {
        // Usa os mesmos estados dos filtros para gerar o relatório
        const params = {
            StartDate: startDate || undefined,
            EndDate: endDate || undefined,
            Status: status !== '' ? Number(status) : undefined,
            PaymentMethod: paymentMethod !== '' ? Number(paymentMethod) : undefined,
            City: undefined, // Adicione inputs para cidade/estado se necessário
            State: undefined
        };

        const response = await api.get('/api/sales/items/pdf', { 
            params, 
            responseType: 'blob' // Essencial para download
        });

        // Cria o link de download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `relatorio_vendas_${new Date().toISOString().split('T')[0]}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error("Erro ao gerar PDF", error);
        alert("Erro ao gerar relatório PDF.");
    } finally {
        setPdfLoading(false);
    }
  };

  // --- HANDLERS UI ---
  const handleFilter = () => { setPage(1); fetchSales(); };
  const handleClear = () => {
      setSearch(''); setStartDate(''); setEndDate(''); 
      setStatus(filter === 'pending' ? '0' : ''); 
      setPaymentMethod('');
      setPage(1); fetchSales(true);
  };

  const totalPages = Math.ceil(totalItems / pageSize);
  const inputClass = "w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-slate-700 text-sm focus:ring-2 focus:ring-blue-500";

  return (
    <div className="space-y-8 animate-fade-in p-6 pb-20 bg-slate-50 min-h-screen">
      
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
            <p className="text-slate-500">Visualize e filtre o histórico completo.</p>
        </div>
      </div>
      
      {/* --- ÁREA DE FILTROS --- */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
         <div className="p-6 border-b border-slate-200">
            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 space-y-4">
                
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {/* Busca Textual */}
                    <div className="md:col-span-2">
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Buscar</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="text" 
                                className={`${inputClass} pl-10`} 
                                placeholder="Cliente ou Nº Nota..." 
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleFilter()}
                            />
                        </div>
                    </div>

                    {/* Datas */}
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Início</label>
                        <input type="date" className={inputClass} value={startDate} onChange={e => setStartDate(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Fim</label>
                        <input type="date" className={inputClass} value={endDate} onChange={e => setEndDate(e.target.value)} />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Status</label>
                        <select className={inputClass} value={status} onChange={e => setStatus(e.target.value)}>
                            <option value="">Todos</option>
                            {Object.entries(SaleStatusDescriptions).map(([id, label]) => (
                                <option key={id} value={id}>{label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Linha 2 de Filtros (Pagamento) + Botões */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                    <div className="w-full md:w-1/5">
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Pagamento</label>
                        <select className={inputClass} value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                            <option value="">Todos</option>
                            {Object.entries(PaymentMethodDescriptions).map(([id, label]) => (
                                <option key={id} value={id}>{label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                        <Button 
                            variant="secondary" 
                            size="sm" 
                            icon={pdfLoading ? Loader2 : FileText} 
                            onClick={handleGeneratePdf}
                            disabled={pdfLoading}
                        >
                            {pdfLoading ? 'GERANDO...' : 'RELATÓRIO PDF'}
                        </Button>
                        <div className="h-8 w-px bg-slate-300 mx-2 hidden md:block"></div>
                        <Button variant="outline" size="sm" icon={X} onClick={handleClear}>LIMPAR</Button>
                        <Button variant="soft" size="sm" icon={Filter} onClick={handleFilter}>FILTRAR</Button>
                    </div>
                </div>

            </div>
         </div>

         {/* --- TABELA DE RESULTADOS --- */}
         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-600 font-bold text-xs uppercase border-b border-slate-200">
                <tr>
                    <th className="p-4">Nº Nota</th>
                    <th className="p-4">Cliente</th>
                    <th className="p-4">Cidade</th>
                    <th className="p-4 text-center">Data</th>
                    <th className="p-4 text-center">Itens</th>
                    <th className="p-4 text-center">Total</th>
                    <th className="p-4 text-center">Saldo</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-right">Ações</th>
                </tr>
                </thead>
                <tbody className="text-slate-600 divide-y divide-slate-100">
                    {loading ? (
                        <tr><td colSpan={9} className="p-8 text-center"><div className="flex justify-center gap-2"><Loader2 className="animate-spin"/> Carregando...</div></td></tr>
                    ) : sales.length === 0 ? (
                        <tr><td colSpan={9} className="p-8 text-center text-slate-500">Nenhum registro encontrado.</td></tr>
                    ) : (
                        sales.map((sale) => (
                            <tr key={sale.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4 font-mono text-xs text-slate-500">#{sale.noteNumber}</td>
                                <td className="p-4 font-bold text-slate-800">{sale.customerName}</td>
                                <td className="p-4 text-xs">{sale.city} - {sale.state}</td>
                                <td className="p-4 text-center text-xs">{formatDate(sale.saleDate)}</td>
                                <td className="p-4 text-center">{sale.itemsCount}</td>
                                <td className="p-4 text-center font-bold text-slate-800">{formatMoney(sale.totalNet)}</td>
                                <td className={`p-4 text-center font-bold ${sale.remainingBalance > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                                    {formatMoney(sale.remainingBalance)}
                                </td>
                                <td className="p-4 text-center">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold flex items-center justify-center gap-1 w-fit mx-auto 
                                        ${sale.status === 2 ? 'bg-emerald-100 text-emerald-700' : 
                                          sale.status === 3 ? 'bg-red-100 text-red-700' : 
                                          'bg-orange-100 text-orange-700'}`}>
                                        {SaleStatusDescriptions[sale.status]}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <TableAction variant="view" onClick={() => {/* Lógica de ver detalhes */}} />
                                        {/* Você pode adicionar edição ou exclusão aqui se desejar */}
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
         </div>

         {/* --- PAGINAÇÃO --- */}
         <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <span className="text-sm text-slate-500">Total: <strong>{totalItems}</strong> registros</span>
            <div className="flex items-center gap-2">
                <button 
                    onClick={() => setPage(p => Math.max(1, p - 1))} 
                    disabled={page === 1 || loading} 
                    className="p-2 border border-slate-300 rounded-lg hover:bg-white disabled:opacity-50"
                >
                    <ChevronLeft size={16} />
                </button>
                <span className="text-sm font-medium text-slate-700 px-2">
                    {page} de {totalPages || 1}
                </span>
                <button 
                    onClick={() => setPage(p => (totalPages && p < totalPages ? p + 1 : p))} 
                    disabled={page >= totalPages || loading} 
                    className="p-2 border border-slate-300 rounded-lg hover:bg-white disabled:opacity-50"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
         </div>

      </div>
    </div>
  );
}