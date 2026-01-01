import React, { useState, useEffect, useRef } from 'react';
import { 
  Save, Search, Banknote, ArrowUpCircle, ArrowDownCircle, 
  Loader2, Paperclip, User, Tag, X, Check, FileText, 
  Filter, AlertCircle, ChevronLeft, ChevronRight, Edit, Trash2, Image as ImageIcon 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { TableAction } from '@/components/ui/TableAction';
import { api } from '@/lib/api';

// --- ENUMS ---
enum LaunchType {
  Income = 1,
  Expense = 2
}

enum PaymentStatus {
  Pending = 0,
  Paid = 1
}

const PaymentStatusDescriptions: Record<number, string> = {
    0: "Pendente",
    1: "Pago"
};

const PaymentMethodDescriptions: Record<number, string> = {
  0: "Dinheiro", 1: "CXPJ", 2: "BBJ", 3: "BBJN", 4: "CHEQUE", 5: "BradescoPJ", 6: "CXJ", 7: "Débito Automático"
};

// --- INTERFACES ---
interface CategoryItem { id: string; name: string; }
interface CustomerItem { id: string; name: string; }

interface Launch {
  id: string;
  description: string;
  amount: number;
  type: number;
  launchDate: string;
  dueDate?: string;
  status: number;
  
  categoryId?: string;
  categoryName?: string;
  
  customerId?: string;
  customerName?: string;
  
  operatorName?: string;
  paymentMethod: number;
  imageProofsUrls: string[]; // URLs das imagens existentes
}

export function Transactions() {
  const [listLoading, setListLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const formTopRef = useRef<HTMLDivElement>(null);

  // --- ESTADOS DO FORMULÁRIO ---
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formType, setFormType] = useState<number>(LaunchType.Expense);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [launchDate, setLaunchDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [formStatus, setFormStatus] = useState(PaymentStatus.Pending.toString());
  const [formPaymentMethod, setFormPaymentMethod] = useState('0');
  
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerItem | null>(null);
  
  // Arquivos
  const [files, setFiles] = useState<FileList | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]); // URLs para exibir
  const [proofsToDelete, setProofsToDelete] = useState<string[]>([]); // URLs para deletar no backend

  // --- ESTADOS DE LISTAGEM ---
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10;

  // Filtros
  const [search, setSearch] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');

  // --- MODAIS ---
  const [modalOpen, setModalOpen] = useState<'category' | 'customer' | null>(null);
  const [modalList, setModalList] = useState<any[]>([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalSearch, setModalSearch] = useState('');

  useEffect(() => {
    fetchLaunches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    if (modalOpen === 'category') fetchCategories();
    if (modalOpen === 'customer') fetchCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalOpen, modalSearch]);

  // --- API CALLS ---
  const fetchLaunches = async (isReset = false) => {
    setListLoading(true);
    try {
        const params = {
            Page: isReset ? 1 : page,
            PageSize: pageSize,
            Search: (isReset ? '' : search) || undefined,
            StartDate: (isReset ? '' : filterStartDate) || undefined,
            EndDate: (isReset ? '' : filterEndDate) || undefined,
            Status: (isReset ? '' : filterStatus) || undefined,
            Type: (isReset ? '' : filterType) || undefined,
        };
        const response = await api.get('/api/financial/launch/paged', { params });
        if (response.data.items) {
            setLaunches(response.data.items);
            setTotalItems(response.data.totalItems || 0);
        } else {
            setLaunches([]);
            setTotalItems(0);
        }
    } catch (error) { console.error(error); } finally { setListLoading(false); }
  };

  const fetchCategories = async () => {
    setModalLoading(true);
    try {
        const res = await api.get('/api/financial/launch-categories/paged', { params: { Page: 1, PageSize: 20, Search: modalSearch } });
        setModalList(res.data.items || []);
    } catch (e) { console.error(e); } finally { setModalLoading(false); }
  };

  const fetchCustomers = async () => {
    setModalLoading(true);
    try {
        const res = await api.get('/api/financial/customer/paged', { params: { Page: 1, PageSize: 20, Search: modalSearch } });
        setModalList(res.data.items || []);
    } catch (e) { console.error(e); } finally { setModalLoading(false); }
  };

  // --- DELETE ---
  const handleDelete = async (id: string) => {
    if (!confirm("Deseja excluir permanentemente este lançamento?")) return;
    try {
        await api.delete(`/api/financial/launch/${id}`);
        alert("Lançamento excluído!");
        if (editingId === id) handleCancelEdit();
        fetchLaunches();
    } catch (error) {
        console.error("Erro delete", error);
        alert("Erro ao excluir lançamento.");
    }
  };

  // --- EDITAR ---
  const handleEdit = (item: Launch) => {
    setEditingId(item.id);
    
    // Popula campos básicos
    setFormType(item.type);
    setDescription(item.description);
    setAmount(item.amount.toString());
    setLaunchDate(item.launchDate ? item.launchDate.split('T')[0] : '');
    setDueDate(item.dueDate ? item.dueDate.split('T')[0] : '');
    setFormStatus(item.status.toString());
    setFormPaymentMethod(item.paymentMethod.toString());

    // Popula Vínculos (Simulando objetos para não precisar buscar na API agora)
    if (item.categoryId && item.categoryName) {
        setSelectedCategory({ id: item.categoryId, name: item.categoryName });
    } else {
        setSelectedCategory(null);
    }

    if (item.customerId && item.customerName) {
        setSelectedCustomer({ id: item.customerId, name: item.customerName });
    } else {
        setSelectedCustomer(null);
    }

    // Imagens
    setExistingImages(item.imageProofsUrls || []);
    setProofsToDelete([]); // Reseta lista de exclusão
    setFiles(null);

    // Scroll para o topo
    if (formTopRef.current) formTopRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setDescription(''); setAmount(''); setSelectedCategory(null); setSelectedCustomer(null); 
    setFiles(null); setExistingImages([]); setProofsToDelete([]);
    setFormType(LaunchType.Expense); // Reset pro padrão
  };

  const handleMarkImageForDeletion = (url: string) => {
    setProofsToDelete([...proofsToDelete, url]); // Adiciona à lista para backend
    setExistingImages(existingImages.filter(img => img !== url)); // Remove da visualização
  };

  // --- SALVAR (POST / PUT) ---
  const handleSave = async () => {
    if (!description || !amount) {
        alert("Preencha Descrição e Valor.");
        return;
    }
    if (formType === LaunchType.Expense && !selectedCategory) {
        alert("Selecione a Categoria para a despesa.");
        return;
    }
    if (formType === LaunchType.Income && !selectedCustomer) {
        alert("Selecione o Cliente para a receita.");
        return;
    }

    setLoading(true);
    try {
        const formData = new FormData();
        formData.append('Description', description);
        formData.append('Amount', amount.replace(',', '.'));
        formData.append('LaunchDate', launchDate);
        formData.append('DueDate', dueDate);
        formData.append('Type', formType.toString());
        formData.append('PaymentMethod', formPaymentMethod);
        formData.append('Status', formStatus);

        if (formType === LaunchType.Expense && selectedCategory) {
            formData.append('CategoryId', selectedCategory.id);
        }
        if (formType === LaunchType.Income && selectedCustomer) {
            formData.append('CustomerId', selectedCustomer.id);
        }

        // Novos Arquivos
        if (files) {
            for (let i = 0; i < files.length; i++) {
                formData.append('ImageProofs', files[i]);
            }
        }

        if (editingId) {
            // --- PUT ---
            formData.append('Id', editingId);
            
            // Imagens para deletar
            proofsToDelete.forEach(url => {
                formData.append('ProofsToDelete', url);
            });

            await api.put('/api/financial/launch', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("Lançamento atualizado!");
            handleCancelEdit();
        } else {
            // --- POST ---
            await api.post('/api/financial/launch', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("Lançamento salvo!");
            handleCancelEdit(); // Limpa o form
        }
        
        fetchLaunches();

    } catch (error) {
        console.error("Erro save", error);
        alert("Erro ao salvar lançamento.");
    } finally {
        setLoading(false);
    }
  };

  // --- HELPERS ---
  const handleFilter = () => { setPage(1); fetchLaunches(); };
  const handleClearFilters = () => { setSearch(''); setFilterStartDate(''); setFilterEndDate(''); setFilterStatus(''); setFilterType(''); setPage(1); fetchLaunches(true); };
  const formatMoney = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  const formatDate = (dateStr?: string) => dateStr ? new Date(dateStr).toLocaleDateString('pt-BR') : '-';
  const totalPages = Math.ceil(totalItems / pageSize);
  const inputClass = "w-full px-4 py-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white text-slate-700";

  return (
    <div className="space-y-8 animate-fade-in p-6 pb-20 bg-slate-50 min-h-screen">
      
      <div className="flex justify-between items-center" ref={formTopRef}>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Banknote className="text-blue-600"/> Lançamentos Financeiros
        </h1>
      </div>
      
      {/* --- FORMULÁRIO --- */}
      <div className={`bg-white rounded-xl shadow-sm border p-6 space-y-6 transition-all ${editingId ? 'border-orange-300 ring-2 ring-orange-100' : 'border-slate-200'}`}>
        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <h2 className="font-bold text-slate-700 flex items-center gap-2">
                {editingId ? <Edit className="text-orange-500" size={20}/> : <Banknote className="text-blue-500" size={20}/>}
                {editingId ? 'Editar Lançamento' : 'Novo Lançamento'}
            </h2>
            {editingId && (
                <Button variant="outline" size="sm" icon={X} onClick={handleCancelEdit}>Cancelar Edição</Button>
            )}
        </div>
        
        {/* SELETOR DE TIPO */}
        <div className="flex gap-4 border-b border-slate-100 pb-6">
            <button 
                onClick={() => { setFormType(LaunchType.Income); setSelectedCategory(null); }}
                className={`flex-1 py-3 rounded-xl font-bold flex justify-center items-center gap-2 border-2 transition-all ${formType === LaunchType.Income ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm' : 'border-slate-100 text-slate-400 hover:border-emerald-200'}`}
            >
                <ArrowUpCircle size={20}/> ENTRADA
            </button>
            <button 
                onClick={() => { setFormType(LaunchType.Expense); setSelectedCustomer(null); }}
                className={`flex-1 py-3 rounded-xl font-bold flex justify-center items-center gap-2 border-2 transition-all ${formType === LaunchType.Expense ? 'border-red-500 bg-red-50 text-red-700 shadow-sm' : 'border-slate-100 text-slate-400 hover:border-red-200'}`}
            >
                <ArrowDownCircle size={20}/> SAÍDA
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-3">
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Descrição</label>
                <input type="text" className={inputClass} value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            <div className="md:col-span-1">
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Valor (R$)</label>
                <input type="number" className={`${inputClass} font-bold text-lg ${formType === LaunchType.Income ? 'text-emerald-600' : 'text-red-600'}`} placeholder="0,00" value={amount} onChange={e => setAmount(e.target.value)} />
            </div>
            
            {formType === LaunchType.Expense && (
                <div className="md:col-span-4 animate-fade-in">
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Categoria da Despesa</label>
                    <div onClick={() => { setModalOpen('category'); setModalSearch(''); }} className="cursor-pointer relative group">
                        <div className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-slate-50 flex items-center justify-between group-hover:border-blue-400 transition-colors">
                            <span className={selectedCategory ? "text-slate-800 font-medium" : "text-slate-400 italic"}>
                                {selectedCategory ? selectedCategory.name : "Selecione a categoria..."}
                            </span>
                            <Tag className="text-slate-400" size={18}/>
                        </div>
                    </div>
                </div>
            )}

            {formType === LaunchType.Income && (
                <div className="md:col-span-4 animate-fade-in">
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Cliente (Pagador)</label>
                    <div onClick={() => { setModalOpen('customer'); setModalSearch(''); }} className="cursor-pointer relative group">
                        <div className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-slate-50 flex items-center justify-between group-hover:border-blue-400 transition-colors">
                            <span className={selectedCustomer ? "text-slate-800 font-medium" : "text-slate-400 italic"}>
                                {selectedCustomer ? selectedCustomer.name : "Selecione o cliente..."}
                            </span>
                            <User className="text-slate-400" size={18}/>
                        </div>
                    </div>
                </div>
            )}

            <div><label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Data Lançamento</label><input type="date" className={inputClass} value={launchDate} onChange={e => setLaunchDate(e.target.value)} /></div>
            <div><label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Data Vencimento</label><input type="date" className={inputClass} value={dueDate} onChange={e => setDueDate(e.target.value)} /></div>
            <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Pagamento</label>
                <select className={inputClass} value={formPaymentMethod} onChange={e => setFormPaymentMethod(e.target.value)}>
                    {Object.entries(PaymentMethodDescriptions).map(([id, label]) => (<option key={id} value={id}>{label}</option>))}
                </select>
            </div>
            <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Status</label>
                <select className={inputClass} value={formStatus} onChange={e => setFormStatus(e.target.value)}>
                    <option value={PaymentStatus.Pending}>Pendente</option>
                    <option value={PaymentStatus.Paid}>Pago</option>
                </select>
            </div>

            <div className="md:col-span-4">
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Comprovantes</label>
                
                {/* Exibição de Imagens Existentes na Edição */}
                {existingImages.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                        {existingImages.map((url, idx) => (
                            <div key={idx} className="relative group border border-slate-200 rounded-lg overflow-hidden w-20 h-20">
                                <img src={url} alt="Comprovante" className="w-full h-full object-cover"/>
                                <button 
                                    onClick={() => handleMarkImageForDeletion(url)}
                                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Remover imagem"
                                >
                                    <X size={12}/>
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 bg-slate-50 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-100 transition-all relative cursor-pointer">
                    <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setFiles(e.target.files)} />
                    <Paperclip className="mb-1 text-blue-400"/>
                    <span className="text-xs">{files && files.length > 0 ? `${files.length} arquivo(s) novo(s) selecionado(s)` : 'Anexar Novos Arquivos'}</span>
                </div>
            </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
            <Button variant="primary" icon={loading ? Loader2 : Save} onClick={handleSave} disabled={loading} className="w-full md:w-auto">
                {loading ? 'SALVANDO...' : (editingId ? 'ATUALIZAR LANÇAMENTO' : 'SALVAR LANÇAMENTO')}
            </Button>
        </div>
      </div>
      
      {/* --- LISTAGEM --- */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
         {/* Filtros ... (Igual ao anterior) */}
         <div className="p-4 border-b border-slate-200 bg-slate-50">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-3">
                <div className="md:col-span-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Buscar</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input type="text" className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded text-sm outline-none" placeholder="Descrição..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                </div>
                <div><label className="text-[10px] font-bold text-slate-500 uppercase">Tipo</label><select className="w-full px-3 py-2 border border-slate-300 rounded text-sm outline-none" value={filterType} onChange={e => setFilterType(e.target.value)}><option value="">Todos</option><option value="1">Entrada</option><option value="2">Saída</option></select></div>
                <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Status</label>
                    <select className="w-full px-3 py-2 border border-slate-300 rounded text-sm outline-none" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                        <option value="">Todos</option>
                        <option value="0">Pendente</option>
                        <option value="1">Pago</option>
                    </select>
                </div>
                <div><label className="text-[10px] font-bold text-slate-500 uppercase">De</label><input type="date" className="w-full px-3 py-2 border border-slate-300 rounded text-sm outline-none" value={filterStartDate} onChange={e => setFilterStartDate(e.target.value)} /></div>
                <div><label className="text-[10px] font-bold text-slate-500 uppercase">Até</label><input type="date" className="w-full px-3 py-2 border border-slate-300 rounded text-sm outline-none" value={filterEndDate} onChange={e => setFilterEndDate(e.target.value)} /></div>
            </div>
            <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" icon={X} onClick={handleClearFilters}>Limpar</Button>
                <Button variant="soft" size="sm" icon={Filter} onClick={handleFilter}>Filtrar</Button>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-100 text-xs font-bold uppercase text-slate-500">
                    <tr>
                        <th className="p-4 text-center">Tipo</th>
                        <th className="p-4">Descrição / Origem</th>
                        <th className="p-4">Categoria / Pagamento</th>
                        <th className="p-4 text-center">Datas</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 text-right">Valor</th>
                        <th className="p-4 text-right">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {listLoading ? (
                        <tr><td colSpan={7} className="p-8 text-center"><Loader2 className="animate-spin inline text-blue-500"/></td></tr>
                    ) : launches.length === 0 ? (
                        <tr><td colSpan={7} className="p-8 text-center text-slate-400 italic">Nenhum lançamento encontrado.</td></tr>
                    ) : (
                        launches.map(item => (
                            <tr key={item.id} className={`transition-colors ${editingId === item.id ? 'bg-orange-50' : 'hover:bg-slate-50'}`}>
                                <td className="p-4 text-center">
                                    {item.type === LaunchType.Income ? (
                                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-bold border border-emerald-200">
                                            <ArrowUpCircle size={12} /> Entrada
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold border border-red-200">
                                            <ArrowDownCircle size={12} /> Saída
                                        </span>
                                    )}
                                </td>

                                <td className="p-4">
                                    <div className="font-bold text-slate-800 flex items-center gap-2">
                                        {item.description}
                                        {item.imageProofsUrls && item.imageProofsUrls.length > 0 && <Paperclip size={14} className="text-blue-500" />}
                                    </div>
                                    <div className="text-xs text-slate-500 mt-1 flex flex-col">
                                        {item.type === LaunchType.Income && item.customerName && (
                                            <span className="flex items-center gap-1 text-emerald-600"><User size={10}/> {item.customerName}</span>
                                        )}
                                        {item.type === LaunchType.Expense && item.categoryName && (
                                            <span className="flex items-center gap-1 text-red-600"><Tag size={10}/> {item.categoryName}</span>
                                        )}
                                        {item.operatorName && <span className="text-slate-400 mt-0.5">Op: {item.operatorName}</span>}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="bg-slate-100 px-2 py-0.5 rounded text-xs w-fit text-slate-600 border border-slate-200">{item.categoryName || '-'}</span>
                                        <span className="text-xs text-slate-400">{PaymentMethodDescriptions[item.paymentMethod]}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-center text-xs">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-slate-600">Lanç: {formatDate(item.launchDate)}</span>
                                        {item.dueDate && <span className="text-orange-600 font-medium">Venc: {formatDate(item.dueDate)}</span>}
                                    </div>
                                </td>
                                <td className="p-4 text-center">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold border ${
                                        item.status === PaymentStatus.Paid ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 
                                        'bg-orange-100 text-orange-700 border-orange-200'
                                    }`}>
                                        {PaymentStatusDescriptions[item.status]}
                                    </span>
                                </td>
                                <td className={`p-4 text-right font-bold text-base ${item.type === LaunchType.Income ? 'text-emerald-600' : 'text-red-600'}`}>
                                    {item.type === LaunchType.Expense ? '-' : '+'} {formatMoney(item.amount)}
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        {/* Botão EDITAR */}
                                        <TableAction variant="edit" onClick={() => handleEdit(item)} />
                                        {/* Botão DELETAR */}
                                        <TableAction variant="delete" onClick={() => handleDelete(item.id)} />
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
         </div>

         {/* Paginação */}
         <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <span className="text-sm text-slate-500">Total: <strong>{totalItems}</strong></span>
            <div className="flex items-center gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1 || listLoading} className="p-2 border border-slate-300 rounded bg-white hover:bg-slate-50 disabled:opacity-50"><ChevronLeft size={16}/></button>
                <span className="text-sm px-2">{page} de {totalPages || 1}</span>
                <button onClick={() => setPage(p => (totalPages && p < totalPages ? p + 1 : p))} disabled={page >= totalPages || listLoading} className="p-2 border border-slate-300 rounded bg-white hover:bg-slate-50 disabled:opacity-50"><ChevronRight size={16}/></button>
            </div>
         </div>
      </div>

      {/* --- MODAL GENÉRICO --- */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        {modalOpen === 'category' ? <Tag className="text-blue-600" size={20}/> : <User className="text-blue-600" size={20}/>}
                        {modalOpen === 'category' ? 'Selecionar Categoria' : 'Selecionar Cliente'}
                    </h3>
                    <button onClick={() => { setModalOpen(null); setModalSearch(''); }} className="text-slate-400 hover:text-red-500"><X size={20}/></button>
                </div>
                <div className="p-4 border-b border-slate-100">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded text-sm outline-none" placeholder="Buscar..." value={modalSearch} onChange={e => setModalSearch(e.target.value)} autoFocus />
                    </div>
                </div>
                <div className="overflow-y-auto p-2 space-y-1 flex-1">
                    {modalLoading ? <div className="flex justify-center p-4"><Loader2 className="animate-spin text-blue-500"/></div> : modalList.length === 0 ? <p className="text-center text-sm text-slate-400 p-4">Nenhum resultado.</p> : (
                        modalList.map(item => (
                            <button key={item.id} onClick={() => { if(modalOpen === 'category') setSelectedCategory(item); if(modalOpen === 'customer') setSelectedCustomer(item); setModalOpen(null); setModalSearch(''); }} className="w-full text-left px-4 py-3 rounded text-sm hover:bg-slate-50 text-slate-700">{item.name}</button>
                        ))
                    )}
                </div>
            </div>
        </div>
      )}

    </div>
  );
}