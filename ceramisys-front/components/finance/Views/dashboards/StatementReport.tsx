import React, { useState, useEffect } from 'react';
import { ScrollText, Filter, Download, Loader2, TrendingUp, TrendingDown, Wallet, ArrowRightLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';

// --- HELPERS ---
const PaymentMethodDescriptions: Record<number, string> = {
  0: "Dinheiro", 1: "CXPJ", 2: "BBJ", 3: "BBJN", 4: "CHEQUE", 5: "BradescoPJ", 6: "CXJ", 7: "Débito Automático"
};

const formatMoney = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
const formatDate = (dateStr: string) => dateStr ? new Date(dateStr).toLocaleDateString('pt-BR') : '-';

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
interface AccountSummary {
  accountName: string;
  totalIncome: number;
}

interface CategorySummary {
  categoryName: string;
  totalExpense: number;
}

interface GroupSummary {
  groupName: string;
  groupExpense: number;
  categories: CategorySummary[];
}

interface ExtractEntry {
  accountName: string;
  date: string;
  description: string;
  value: number;
  type: string; // "Entrada" ou "Saída"
}

interface StatementResponse {
  startDate: string;
  endDate: string;
  totalIncomeOverall: number;
  totalExpenseOverall: number;
  totalExtractOverall: number;
  netBalance: number;
  accounts: AccountSummary[];
  groups: GroupSummary[];
  extracts: ExtractEntry[];
}

export function StatementReport() {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<StatementResponse | null>(null);

  // Filtros
  const { start, end } = getCurrentMonthDates();
  const [startDate, setStartDate] = useState(start);
  const [endDate, setEndDate] = useState(end);
  const [paymentMethod, setPaymentMethod] = useState('');

  // --- EFEITO INICIAL ---
  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- API ---
  const fetchReport = async () => {
    setLoading(true);
    try {
      const params = {
        StartDate: startDate,
        EndDate: endDate,
        PaymentMethod: paymentMethod ? Number(paymentMethod) : undefined
        // GroupId e CategoryId podem ser adicionados aqui se precisar filtrar mais
      };

      const response = await api.get('/api/financial/dashboard-financial/with-extract', { params });
      setReportData(response.data);

    } catch (error) {
      console.error("Erro ao gerar relatório de extratos", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPdf = async () => {
    try {
        const params = { StartDate: startDate, EndDate: endDate, PaymentMethod: paymentMethod };
        const response = await api.get('/api/financial/dashboard-financial/with-extract/pdf', { 
            params, responseType: 'blob' 
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `relatorio_extratos_${startDate}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        alert("Erro ao exportar PDF.");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in p-6 pb-20 bg-slate-50 min-h-screen">
      
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <ScrollText className="text-blue-600"/> Relatório de Extratos e Conciliação
            </h1>
            <p className="text-slate-500">Visão consolidada de Lançamentos do Sistema e Extratos Manuais.</p>
        </div>
        <Button variant="outline" icon={Download} onClick={handleExportPdf}>EXPORTAR PDF</Button>
      </div>
      
      {/* --- FILTROS --- */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
             <div>
                 <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Conta / Método</label>
                 <select 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none text-sm bg-white"
                    value={paymentMethod} 
                    onChange={e => setPaymentMethod(e.target.value)}
                 >
                     <option value="">Todas as Contas</option>
                     {Object.entries(PaymentMethodDescriptions).map(([id, label]) => (
                         <option key={id} value={id}>{label}</option>
                     ))}
                 </select>
             </div>
             <div>
                 <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Início</label>
                 <input type="date" className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none text-sm" value={startDate} onChange={e => setStartDate(e.target.value)}/>
             </div>
             <div>
                 <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Fim</label>
                 <input type="date" className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none text-sm" value={endDate} onChange={e => setEndDate(e.target.value)}/>
             </div>
             <Button variant="primary" icon={loading ? Loader2 : Filter} onClick={fetchReport} disabled={loading}>
                 {loading ? 'GERANDO...' : 'GERAR'}
             </Button>
         </div>
      </div>

      {reportData && (
        <>
            {/* --- CARDS DE TOTALIZADORES --- */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-emerald-700 font-bold text-xs uppercase">Entradas (Sistema)</span>
                        <TrendingUp size={16} className="text-emerald-500"/>
                    </div>
                    <h3 className="text-2xl font-bold text-emerald-800">{formatMoney(reportData.totalIncomeOverall)}</h3>
                </div>

                <div className="bg-red-50 border border-red-100 p-4 rounded-xl">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-red-700 font-bold text-xs uppercase">Saídas (Sistema)</span>
                        <TrendingDown size={16} className="text-red-500"/>
                    </div>
                    <h3 className="text-2xl font-bold text-red-800">{formatMoney(reportData.totalExpenseOverall)}</h3>
                </div>

                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-blue-700 font-bold text-xs uppercase">Extratos (Manual)</span>
                        <ArrowRightLeft size={16} className="text-blue-500"/>
                    </div>
                    <h3 className="text-2xl font-bold text-blue-800">{formatMoney(reportData.totalExtractOverall)}</h3>
                    <p className="text-[10px] text-blue-400 mt-1">Ajustes manuais e tarifas</p>
                </div>

                <div className={`border p-4 rounded-xl ${reportData.netBalance >= 0 ? 'bg-slate-50 border-slate-200' : 'bg-orange-50 border-orange-200'}`}>
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-slate-600 font-bold text-xs uppercase">Saldo Líquido</span>
                        <Wallet size={16} className="text-slate-500"/>
                    </div>
                    <h3 className={`text-2xl font-bold ${reportData.netBalance >= 0 ? 'text-slate-800' : 'text-orange-700'}`}>
                        {formatMoney(reportData.netBalance)}
                    </h3>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* --- DETALHAMENTO DE ENTRADAS (CONTAS) --- */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="font-bold text-slate-700 mb-4 border-b pb-2 flex items-center gap-2">
                        <TrendingUp size={18} className="text-emerald-500"/> Entradas por Conta
                    </h3>
                    <div className="space-y-3">
                        {reportData.accounts.length === 0 ? (
                            <p className="text-sm text-slate-400 italic">Sem registros de entrada.</p>
                        ) : (
                            reportData.accounts.map((acc, idx) => (
                                <div key={idx} className="flex justify-between items-center p-2 hover:bg-slate-50 rounded">
                                    <span className="text-sm text-slate-700 font-medium">{acc.accountName}</span>
                                    <span className="text-sm font-bold text-emerald-600">{formatMoney(acc.totalIncome)}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* --- DETALHAMENTO DE SAÍDAS (GRUPOS E CATEGORIAS) --- */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="font-bold text-slate-700 mb-4 border-b pb-2 flex items-center gap-2">
                        <TrendingDown size={18} className="text-red-500"/> Saídas por Grupo
                    </h3>
                    <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                        {reportData.groups.length === 0 ? (
                            <p className="text-sm text-slate-400 italic">Sem registros de saída.</p>
                        ) : (
                            reportData.groups.map((group, idx) => (
                                <div key={idx} className="border border-slate-100 rounded-lg overflow-hidden">
                                    <div className="bg-slate-50 p-3 flex justify-between items-center">
                                        <span className="font-bold text-slate-800 text-sm">{group.groupName}</span>
                                        <span className="font-bold text-red-600 text-sm">{formatMoney(group.groupExpense)}</span>
                                    </div>
                                    <div className="divide-y divide-slate-50">
                                        {group.categories.map((cat, cIdx) => (
                                            <div key={cIdx} className="flex justify-between items-center p-2 pl-4 text-xs">
                                                <span className="text-slate-500">{cat.categoryName}</span>
                                                <span className="text-slate-600 font-medium">{formatMoney(cat.totalExpense)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* --- LISTAGEM DE EXTRATOS MANUAIS --- */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50">
                    <h3 className="font-bold text-slate-700 flex items-center gap-2">
                        <ScrollText size={18} className="text-blue-500"/> Detalhamento de Extratos
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-xs">
                            <tr>
                                <th className="p-4 text-center">Data</th>
                                <th className="p-4">Conta</th>
                                <th className="p-4">Descrição</th>
                                <th className="p-4 text-center">Tipo</th>
                                <th className="p-4 text-right">Valor</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {reportData.extracts.length === 0 ? (
                                <tr><td colSpan={5} className="p-8 text-center text-slate-400 italic">Nenhum lançamento de extrato encontrado.</td></tr>
                            ) : (
                                reportData.extracts.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50">
                                        <td className="p-4 text-center font-mono text-slate-600">{formatDate(item.date)}</td>
                                        <td className="p-4 font-medium text-slate-700">{item.accountName}</td>
                                        <td className="p-4 text-slate-600">{item.description}</td>
                                        <td className="p-4 text-center">
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded ${item.type === 'Entrada' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                                {item.type}
                                            </span>
                                        </td>
                                        <td className={`p-4 text-right font-bold ${item.value >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                                            {formatMoney(item.value)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
      )}

    </div>
  );
}