import React, { useState, useEffect } from 'react';
import { BarChart3, Filter, Search, Calendar, Download, Loader2, ArrowUpCircle, ArrowDownCircle, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';

// --- ENUMS E HELPERS ---
const PaymentMethodDescriptions: Record<number, string> = {
  0: "Dinheiro", 1: "CXPJ", 2: "BBJ", 3: "BBJN", 4: "CHEQUE", 5: "BradescoPJ", 6: "CXJ", 7: "Débito Automático"
};

const formatMoney = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
const formatDate = (dateStr: string) => dateStr ? new Date(dateStr).toLocaleDateString('pt-BR') : '-';

// Helper para pegar datas do mês atual
const getCurrentMonthDates = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return {
        start: firstDay.toISOString().split('T')[0],
        end: lastDay.toISOString().split('T')[0]
    };
};

// --- INTERFACES ---
interface CashFlowItem {
  launchDate: string;
  description: string;
  amount: number;
  type: number;
  categoryName: string;
  customerName: string;
  paymentMethod: string;
}

interface CashFlowResponse {
  totalEntradas: number;
  totalSaidas: number;
  saldo: number;
  items: CashFlowItem[];
  totalItems: number;
  page: number;
  totalPages: number;
}

export function CashFlowReport() {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<CashFlowResponse | null>(null);

  // Define o estado inicial com o MÊS ATUAL
  const { start, end } = getCurrentMonthDates();
  const [startDate, setStartDate] = useState(start); 
  const [endDate, setEndDate] = useState(end);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  
  // Paginação
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // --- EFEITO: CARREGA AUTOMATICAMENTE AO INICIAR ---
  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]); // Carrega na montagem (page=1) e quando mudar a página

  // --- API ---
  const fetchReport = async () => {
    setLoading(true);
    try {
      const params = {
        Page: page,
        PageSize: pageSize,
        StartDate: startDate,
        EndDate: endDate,
        Search: searchTerm || undefined,
        PaymentMethod: paymentMethod ? Number(paymentMethod) : undefined
      };

      // Endpoint correto
      const response = await api.get('/api/financial/dashboard-financial/flow-report', { params });
      setReportData(response.data);

    } catch (error) {
      console.error("Erro ao gerar relatório", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = () => {
    setPage(1); // Reseta para primeira página
    fetchReport(); // Força nova busca
  };

  // --- EXPORTAR PDF ---
  const handleExportPdf = async () => {
    try {
        const params = { StartDate: startDate, EndDate: endDate, Search: searchTerm };
        const response = await api.get('/api/financial/dashboard-financial/flow-report/pdf', { 
            params, responseType: 'blob' 
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `caixa_${startDate}_${endDate}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error(error);
        alert("Erro ao exportar PDF.");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in p-6 pb-20 bg-slate-50 min-h-screen">
      
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <BarChart3 className="text-blue-600"/> Movimento de Caixa
            </h1>
            <p className="text-slate-500">Relatório detalhado de entradas e saídas.</p>
        </div>
        <Button variant="outline" icon={Download} onClick={handleExportPdf}>EXPORTAR PDF</Button>
      </div>
      
      {/* --- FILTROS --- */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
         <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Buscar</label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                        type="text" 
                        className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg outline-none text-sm" 
                        placeholder="Descrição, Cliente, Categoria..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleGenerate()} // Busca ao dar Enter
                    />
                </div>
            </div>
            <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Início</label>
                <input type="date" className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none text-sm" value={startDate} onChange={e => setStartDate(e.target.value)}/>
            </div>
            <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Fim</label>
                <input type="date" className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none text-sm" value={endDate} onChange={e => setEndDate(e.target.value)}/>
            </div>
            <Button variant="primary" icon={loading ? Loader2 : Filter} onClick={handleGenerate} disabled={loading}>
                {loading ? 'ATUALIZANDO...' : 'ATUALIZAR'}
            </Button>
         </div>
         
         <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-4">
             <div>
                 <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Método Pagamento</label>
                 <select className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none text-sm bg-white" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                     <option value="">Todos</option>
                     {Object.entries(PaymentMethodDescriptions).map(([id, label]) => (
                         <option key={id} value={id}>{label}</option>
                     ))}
                 </select>
             </div>
         </div>
      </div>

      {/* --- CARDS DE RESUMO --- */}
      {reportData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
              <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-xl flex items-center justify-between">
                  <div>
                      <p className="text-sm font-bold text-emerald-700 uppercase">Total Entradas</p>
                      <h3 className="text-2xl font-bold text-emerald-800 mt-1">{formatMoney(reportData.totalEntradas)}</h3>
                  </div>
                  <div className="p-3 bg-white rounded-full text-emerald-500 shadow-sm"><ArrowUpCircle size={24}/></div>
              </div>

              <div className="bg-red-50 border border-red-100 p-6 rounded-xl flex items-center justify-between">
                  <div>
                      <p className="text-sm font-bold text-red-700 uppercase">Total Saídas</p>
                      <h3 className="text-2xl font-bold text-red-800 mt-1">{formatMoney(reportData.totalSaidas)}</h3>
                  </div>
                  <div className="p-3 bg-white rounded-full text-red-500 shadow-sm"><ArrowDownCircle size={24}/></div>
              </div>

              <div className={`border p-6 rounded-xl flex items-center justify-between ${reportData.saldo >= 0 ? 'bg-blue-50 border-blue-100' : 'bg-orange-50 border-orange-100'}`}>
                  <div>
                      <p className={`text-sm font-bold uppercase ${reportData.saldo >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>Saldo do Período</p>
                      <h3 className={`text-2xl font-bold mt-1 ${reportData.saldo >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>{formatMoney(reportData.saldo)}</h3>
                  </div>
                  <div className={`p-3 bg-white rounded-full shadow-sm ${reportData.saldo >= 0 ? 'text-blue-500' : 'text-orange-500'}`}><Wallet size={24}/></div>
              </div>
          </div>
      )}

      {/* --- TABELA DE RESULTADOS --- */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
         <div className="overflow-x-auto">
             <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-xs">
                    <tr>
                        <th className="p-4 text-center">Data</th>
                        <th className="p-4">Descrição</th>
                        <th className="p-4">Categoria / Cliente</th>
                        <th className="p-4 text-center">Pagamento</th>
                        <th className="p-4 text-right">Valor</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {loading ? (
                        <tr><td colSpan={5} className="p-8 text-center"><Loader2 className="animate-spin inline text-blue-500"/> Carregando...</td></tr>
                    ) : !reportData || reportData.items.length === 0 ? (
                        <tr><td colSpan={5} className="p-8 text-center text-slate-400 italic">Nenhum movimento encontrado neste período.</td></tr>
                    ) : (
                        reportData.items.map((item, idx) => (
                            <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4 text-center text-slate-600 font-mono">
                                    {formatDate(item.launchDate)}
                                </td>
                                <td className="p-4 font-medium text-slate-800">
                                    {item.description}
                                </td>
                                <td className="p-4 text-slate-600">
                                    <div className="flex flex-col text-xs">
                                        <span className="font-bold">{item.categoryName || '-'}</span>
                                        <span className="text-slate-400">{item.customerName || '-'}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-center text-slate-500 text-xs">
                                    {item.paymentMethod}
                                </td>
                                <td className={`p-4 text-right font-bold ${item.type === 1 ? 'text-emerald-600' : 'text-red-600'}`}>
                                    {item.type === 1 ? '+' : '-'} {formatMoney(item.amount)}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
             </table>
         </div>

         {/* Paginação */}
         {reportData && (
             <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                <span className="text-sm text-slate-500">Total: <strong>{reportData.totalItems}</strong> lançamentos</span>
                <div className="flex items-center gap-2">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1 || loading} className="px-3 py-1 border border-slate-300 rounded hover:bg-white disabled:opacity-50 text-sm">Anterior</button>
                    <span className="text-sm px-2 text-slate-700">{page} de {reportData.totalPages || 1}</span>
                    <button onClick={() => setPage(p => (p < reportData.totalPages ? p + 1 : p))} disabled={page >= reportData.totalPages || loading} className="px-3 py-1 border border-slate-300 rounded hover:bg-white disabled:opacity-50 text-sm">Próximo</button>
                </div>
             </div>
         )}
      </div>

    </div>
  );
}