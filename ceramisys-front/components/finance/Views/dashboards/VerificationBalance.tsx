import React, { useState, useEffect } from 'react';
import { FileBarChart, Filter, Download, TrendingUp, TrendingDown, Wallet, ArrowRightLeft, Loader2, Search, FileText } from 'lucide-react';
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
interface AccountItem {
  accountName: string;
  totalIncome: number;
}

interface CategoryItem {
  categoryName: string;
  totalExpense: number;
}

interface GroupItem {
  groupName: string;
  groupExpense: number;
  categories: CategoryItem[];
}

interface ExtractItem {
  accountName: string;
  date: string;
  description: string;
  value: number;
  type: string;
}

interface BalanceResponse {
  startDate: string;
  endDate: string;
  totalIncomeOverall: number;
  totalExpenseOverall: number;
  totalExtractOverall: number;
  netBalance: number;
  accounts: AccountItem[];
  groups: GroupItem[];
  extracts: ExtractItem[];
}

export function VerificationBalance() {
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [reportData, setReportData] = useState<BalanceResponse | null>(null);

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

  // --- API: GERAR RELATÓRIO NA TELA ---
  const fetchReport = async () => {
    setLoading(true);
    try {
      const params = {
        StartDate: startDate,
        EndDate: endDate,
        PaymentMethod: paymentMethod !== '' ? Number(paymentMethod) : undefined
      };

      const response = await api.get('/api/financial/dashboard-financial/with-extract', { params });
      setReportData(response.data);

    } catch (error) {
      console.error("Erro ao gerar balancete", error);
    } finally {
      setLoading(false);
    }
  };

  // --- API: GERAR PDF ---
  const handleExportPdf = async () => {
    setPdfLoading(true);
    try {
        const params = { 
            StartDate: startDate, 
            EndDate: endDate, 
            PaymentMethod: paymentMethod !== '' ? Number(paymentMethod) : undefined
        };
        
        const response = await api.get('/api/financial/dashboard-financial/trial-balance/pdf', { 
            params, 
            responseType: 'blob'
        });

        if (response.data.type === 'application/json') {
            const text = await response.data.text();
            const jsonError = JSON.parse(text);
            alert(`Erro ao gerar PDF: ${jsonError.message || 'Erro desconhecido'}`);
            return;
        }

        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `balancete_${startDate}_${endDate}.pdf`);
        document.body.appendChild(link);
        link.click();
        
        link.remove();
        window.URL.revokeObjectURL(url);

    } catch (error: any) {
        console.error("Erro PDF:", error);
        alert("Erro ao tentar baixar o PDF.");
    } finally {
        setPdfLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in p-6 pb-20 bg-slate-50 min-h-screen">
      
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <FileBarChart className="text-blue-600"/> Balancete de Verificação
            </h1>
            <p className="text-slate-500">Conciliação completa de entradas, saídas e extratos.</p>
        </div>
      </div>
      
      {/* --- FILTROS E AÇÕES (BOTÃO PDF AQUI) --- */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
         <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
             <div className="md:col-span-2">
                 <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Conta / Método</label>
                 <select 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none text-sm bg-white text-slate-700"
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
                 <input type="date" className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none text-sm text-slate-700" value={startDate} onChange={e => setStartDate(e.target.value)}/>
             </div>
             <div>
                 <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Fim</label>
                 <input type="date" className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none text-sm text-slate-700" value={endDate} onChange={e => setEndDate(e.target.value)}/>
             </div>
             
             {/* BOTÕES LADO A LADO NA ÚLTIMA COLUNA */}
             <div className="flex gap-2">
                 <Button 
                    className="flex-1"
                    variant="primary" 
                    icon={loading ? Loader2 : Filter} 
                    onClick={fetchReport} 
                    disabled={loading}
                 >
                     {loading ? '...' : 'GERAR'}
                 </Button>
                 
                 <Button 
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white border-red-600"
                    variant="primary" 
                    icon={pdfLoading ? Loader2 : FileText} 
                    onClick={handleExportPdf}
                    disabled={pdfLoading}
                    title="Baixar Balancete em PDF"
                 >
                    {pdfLoading ? '...' : 'PDF'}
                 </Button>
             </div>
         </div>
      </div>

      {/* --- CONTEÚDO DO RELATÓRIO --- */}
      {reportData && (
        <>
            {/* CARDS DE RESUMO (KPIs) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-xl shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider">Entradas Totais</span>
                        <div className="p-1.5 bg-white rounded-full text-emerald-500 shadow-sm"><TrendingUp size={16}/></div>
                    </div>
                    <h3 className="text-2xl font-extrabold text-emerald-800">{formatMoney(reportData.totalIncomeOverall)}</h3>
                </div>

                <div className="bg-red-50 border border-red-100 p-5 rounded-xl shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-red-700 font-bold text-xs uppercase tracking-wider">Saídas Totais</span>
                        <div className="p-1.5 bg-white rounded-full text-red-500 shadow-sm"><TrendingDown size={16}/></div>
                    </div>
                    <h3 className="text-2xl font-extrabold text-red-800">{formatMoney(reportData.totalExpenseOverall)}</h3>
                </div>

                <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-blue-700 font-bold text-xs uppercase tracking-wider">Extratos (Ajustes)</span>
                        <div className="p-1.5 bg-white rounded-full text-blue-500 shadow-sm"><ArrowRightLeft size={16}/></div>
                    </div>
                    <h3 className="text-2xl font-extrabold text-blue-800">{formatMoney(reportData.totalExtractOverall)}</h3>
                </div>

                <div className={`border p-5 rounded-xl shadow-sm ${reportData.netBalance >= 0 ? 'bg-slate-50 border-slate-200' : 'bg-orange-50 border-orange-200'}`}>
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-slate-600 font-bold text-xs uppercase tracking-wider">Saldo Líquido</span>
                        <div className="p-1.5 bg-white rounded-full text-slate-500 shadow-sm"><Wallet size={16}/></div>
                    </div>
                    <h3 className={`text-2xl font-extrabold ${reportData.netBalance >= 0 ? 'text-slate-800' : 'text-orange-700'}`}>
                        {formatMoney(reportData.netBalance)}
                    </h3>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* --- DETALHAMENTO DE ENTRADAS (CONTAS) --- */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-full">
                    <h3 className="font-bold text-slate-800 mb-4 border-b pb-3 flex items-center gap-2">
                        <TrendingUp size={18} className="text-emerald-500"/> Entradas por Conta
                    </h3>
                    <div className="space-y-3 flex-1 overflow-y-auto max-h-96 pr-2">
                        {reportData.accounts.length === 0 ? (
                            <p className="text-sm text-slate-400 italic p-4 text-center">Nenhum registro de entrada.</p>
                        ) : (
                            reportData.accounts.map((acc, idx) => (
                                <div key={idx} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-100 transition-all">
                                    <span className="text-sm text-slate-700 font-medium">{acc.accountName}</span>
                                    <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">{formatMoney(acc.totalIncome)}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* --- DETALHAMENTO DE SAÍDAS (GRUPOS) --- */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-full">
                    <h3 className="font-bold text-slate-800 mb-4 border-b pb-3 flex items-center gap-2">
                        <TrendingDown size={18} className="text-red-500"/> Saídas por Grupo de Categoria
                    </h3>
                    <div className="space-y-4 flex-1 overflow-y-auto max-h-96 pr-2">
                        {reportData.groups.length === 0 ? (
                            <p className="text-sm text-slate-400 italic p-4 text-center">Nenhum registro de saída.</p>
                        ) : (
                            reportData.groups.map((group, idx) => (
                                <div key={idx} className="border border-slate-100 rounded-lg overflow-hidden">
                                    <div className="bg-slate-50 p-3 flex justify-between items-center">
                                        <span className="font-bold text-slate-800 text-sm">{group.groupName}</span>
                                        <span className="font-bold text-red-600 text-sm">{formatMoney(group.groupExpense)}</span>
                                    </div>
                                    <div className="divide-y divide-slate-50">
                                        {group.categories.map((cat, cIdx) => (
                                            <div key={cIdx} className="flex justify-between items-center p-2 pl-4 text-xs hover:bg-white transition-colors">
                                                <span className="text-slate-500 flex items-center gap-2">
                                                    <div className="w-1 h-1 rounded-full bg-slate-300"></div> {cat.categoryName}
                                                </span>
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

            {/* --- EXTRATOS MANUAIS --- */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <ArrowRightLeft size={18} className="text-blue-500"/> Detalhamento de Extratos Manuais
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
                                <tr><td colSpan={5} className="p-8 text-center text-slate-400 italic">Nenhum lançamento manual encontrado.</td></tr>
                            ) : (
                                reportData.extracts.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 text-center font-mono text-slate-600 text-xs">{formatDate(item.date)}</td>
                                        <td className="p-4 font-medium text-slate-700">{item.accountName}</td>
                                        <td className="p-4 text-slate-600 text-xs">{item.description}</td>
                                        <td className="p-4 text-center">
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded border ${item.type === 'Entrada' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
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