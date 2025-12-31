import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle, Filter, X, Search, Calendar, User, Package, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';

// Interface baseada no seu JSON
interface UnreturnedItem {
  id: string;
  productName: string;
  employeeName: string;
  quantityRetirada: number;
  quantityDevolvida: number;
  quantityPendente: number;
  dataRetirada: string;
}

export function NotReturnedProducts() {
  // --- ESTADOS ---
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<UnreturnedItem[]>([]);
  
  // Paginação
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10;

  // Filtros
  const [employeeFilter, setEmployeeFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // --- EFEITOS ---
  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // --- API ---
  const fetchReport = async (isReset = false) => {
    setLoading(true);
    try {
      const params = {
        Page: isReset ? 1 : page,
        PageSize: pageSize,
        // Envia filtros apenas se estiverem preenchidos
        EmployeeName: (isReset ? '' : employeeFilter) || undefined,
        StartDate: (isReset ? '' : startDate) || undefined,
        EndDate: (isReset ? '' : endDate) || undefined,
      };

      const response = await api.get('/api/dashboard/reports/products/unreturned-products', { params });
      const data = response.data;

      if (data.items) {
        setItems(data.items);
        setTotalItems(data.totalItems || 0);
      } else {
        setItems([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Erro ao buscar relatório", error);
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLERS ---
  const handleFilter = () => {
    setPage(1);
    fetchReport();
  };

  const handleClearFilters = () => {
    setEmployeeFilter('');
    setStartDate('');
    setEndDate('');
    setPage(1);
    fetchReport(true);
  };

  // --- HELPERS ---
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const getDaysAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays;
  };

  const totalPages = Math.ceil(totalItems / pageSize);
  const inputClass = "w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 text-sm";

  return (
    <div className="space-y-6 animate-fade-in p-6 pb-20 bg-slate-50 min-h-screen">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <AlertCircle className="text-orange-600" /> Produtos Não Devolvidos
          </h1>
          <p className="text-slate-500">Relatório de itens pendentes com colaboradores.</p>
        </div>
      </div>

      {/* --- BARRA DE FILTROS --- */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome do Funcionário</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                className={`${inputClass} pl-10`} 
                placeholder="Ex: Jorge..." 
                value={employeeFilter}
                onChange={e => setEmployeeFilter(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleFilter()}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Data Início (Retirada)</label>
            <input 
              type="datetime-local" 
              className={inputClass} 
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Data Fim</label>
            <input 
              type="datetime-local" 
              className={inputClass} 
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" icon={X} onClick={handleClearFilters}>LIMPAR</Button>
          <Button variant="soft" size="sm" icon={Filter} onClick={handleFilter}>FILTRAR RELATÓRIO</Button>
        </div>
      </div>

      {/* --- LISTAGEM --- */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead className="bg-orange-50 text-orange-900 text-xs uppercase font-bold border-b border-orange-100">
              <tr>
                <th className="p-4">Produto</th>
                <th className="p-4">Funcionário</th>
                <th className="p-4 text-center">Data Retirada</th>
                <th className="p-4 text-center">Tempo</th>
                <th className="p-4 text-center">Retirado</th>
                <th className="p-4 text-center">Devolvido</th>
                <th className="p-4 text-center">Pendente</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-600">
              {loading ? (
                <tr><td colSpan={7} className="p-8 text-center"><div className="flex justify-center gap-2 text-slate-500"><Loader2 className="animate-spin"/> Carregando...</div></td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-slate-500">Nenhum registro encontrado.</td></tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 border-b border-slate-100 last:border-0 group">
                    <td className="p-4 font-bold text-slate-800 flex items-center gap-2">
                      <Package size={16} className="text-slate-400 group-hover:text-orange-500 transition-colors" />
                      {item.productName}
                    </td>
                    <td className="p-4 font-medium">{item.employeeName}</td>
                    <td className="p-4 text-center text-slate-500">{formatDate(item.dataRetirada)}</td>
                    <td className="p-4 text-center">
                       <span className="flex items-center justify-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-full border border-orange-100">
                         <Clock size={12} /> {getDaysAgo(item.dataRetirada)} dias
                       </span>
                    </td>
                    <td className="p-4 text-center font-medium text-slate-900">{item.quantityRetirada}</td>
                    <td className="p-4 text-center text-slate-500">{item.quantityDevolvida}</td>
                    <td className="p-4 text-center">
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-bold shadow-sm">
                        {item.quantityPendente}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Rodapé Paginação */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-sm text-slate-500">Total: <strong>{totalItems}</strong> pendências</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1 || loading} className="p-2 border border-slate-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed bg-white"><ChevronLeft size={16} /></button>
            <span className="text-sm font-medium text-slate-700 px-2">Pág. {page} de {totalPages || 1}</span>
            <button onClick={() => setPage(p => (totalPages && p < totalPages ? p + 1 : p))} disabled={page >= totalPages || loading} className="p-2 border border-slate-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed bg-white"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}