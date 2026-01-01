import React, { useState, useEffect, useRef } from 'react';
import { Save, Search, Tags, Loader2, Edit, Trash2, Plus, FolderInput, X, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';

// --- INTERFACES ---

interface CategoryGroup {
  id: string;
  name: string;
}

interface LaunchCategory {
  id: string;
  name: string;
  nameGroupCategory: string | null; 
  idGroupCategory: string | null;   
}

export function FinancialCategories() {
  // --- ESTADOS GERAIS ---
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  
  // --- ESTADOS DO FORMULÁRIO ---
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<CategoryGroup | null>(null);

  // --- ESTADOS DA LISTA (Categorias) ---
  const [categories, setCategories] = useState<LaunchCategory[]>([]);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10;
  const [searchTerm, setSearchTerm] = useState('');

  // --- ESTADOS DO MODAL (Seleção de Grupo) ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groups, setGroups] = useState<CategoryGroup[]>([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalSearch, setModalSearch] = useState('');

  // Carregar lista principal ao iniciar
  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // --- API: LISTAR CATEGORIAS ---
  const fetchCategories = async (isReset = false) => {
    setListLoading(true);
    try {
      const params = {
        Page: isReset ? 1 : page,
        PageSize: pageSize,
        Search: isReset ? '' : searchTerm
      };
      
      const response = await api.get('/api/financial/launch-categories/paged', { params });
      
      if (response.data.items) {
        setCategories(response.data.items);
        setTotalItems(response.data.totalItems || 0);
      } else {
        setCategories([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Erro ao buscar categorias", error);
    } finally {
      setListLoading(false);
    }
  };

  // --- API: BUSCAR GRUPOS (PARA O MODAL) ---
  const fetchGroupsForModal = async () => {
    setModalLoading(true);
    try {
      const params = { Page: 1, PageSize: 50, Search: modalSearch }; 
      const response = await api.get('/api/financial/launch-category-groups/paged', { params });
      
      if (response.data.items) {
        setGroups(response.data.items);
      }
    } catch (error) {
      console.error("Erro ao buscar grupos", error);
    } finally {
      setModalLoading(false);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      fetchGroupsForModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen, modalSearch]);

  // --- HANDLERS DE AÇÃO ---

  const handleSave = async () => {
    if (!name.trim()) { alert("Informe o nome da categoria."); return; }
    if (!selectedGroup) { alert("Selecione um Grupo Principal."); return; }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('Name', name);
      formData.append('GroupId', selectedGroup.id);

      if (editingId) {
        // PUT
        formData.append('Id', editingId);
        await api.put('/api/financial/launch-categories', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert("Categoria atualizada!");
        handleCancelEdit();
      } else {
        // POST
        await api.post('/api/financial/launch-categories', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert("Categoria criada!");
        setName('');
        // setSelectedGroup(null); 
      }
      
      fetchCategories();
    } catch (error) {
      console.error("Erro ao salvar", error);
      alert("Erro ao salvar categoria.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cat: LaunchCategory) => {
    setEditingId(cat.id);
    setName(cat.name);
    
    if (cat.idGroupCategory && cat.nameGroupCategory) {
        setSelectedGroup({ 
            id: cat.idGroupCategory, 
            name: cat.nameGroupCategory 
        });
    } else {
        setSelectedGroup(null); 
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- DELETE (ATUALIZADO PARA URL PATH) ---
  const handleDelete = async (id: string) => {
    if (!confirm("Deseja excluir esta categoria?")) return;
    try {
        // Agora passa o ID na URL
        await api.delete(`/api/financial/launch-categories/${id}`);
        fetchCategories();
        
        // Se estiver editando o item excluído, cancela a edição
        if (editingId === id) handleCancelEdit();
    } catch (error) {
        console.error("Erro ao excluir", error);
        alert("Erro ao excluir categoria.");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    setSelectedGroup(null);
  };

  // Handlers UI
  const handleSearchMain = () => { setPage(1); fetchCategories(); };
  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <div className="space-y-8 animate-fade-in p-6 pb-20 bg-slate-50 min-h-screen">
      
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <Tags className="text-blue-600"/> Categorias Financeiras
            </h1>
            <p className="text-slate-500">Subcategorias vinculadas aos Grupos Principais.</p>
        </div>
      </div>
      
      {/* FORMULÁRIO */}
      <div className={`bg-white rounded-xl shadow-sm border p-6 space-y-6 transition-all ${editingId ? 'border-orange-200 ring-1 ring-orange-100' : 'border-slate-200'}`}>
        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
                {editingId ? <Edit size={18} className="text-orange-500"/> : <Plus size={18} className="text-blue-500"/>}
                {editingId ? 'Editar Categoria' : 'Nova Categoria'}
            </h2>
            {editingId && <button onClick={handleCancelEdit} className="text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1">CANCELAR <X size={14}/></button>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nome */}
            <div>
                <label className="text-sm font-semibold text-slate-700 mb-1 block">Nome da Categoria</label>
                <input 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                    type="text" 
                    placeholder="Ex: Gasolina, Aluguel..."
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
            </div>

            {/* Grupo Principal (Abre Modal) */}
            <div>
                <label className="text-sm font-semibold text-slate-700 mb-1 block">Grupo Principal</label>
                <div 
                    onClick={() => setIsModalOpen(true)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 cursor-pointer hover:bg-slate-100 flex justify-between items-center transition-colors group"
                >
                    <span className={selectedGroup ? "text-slate-800 font-medium" : "text-slate-400"}>
                        {selectedGroup ? selectedGroup.name : "Selecione o grupo..."}
                    </span>
                    <FolderInput size={18} className="text-slate-400 group-hover:text-blue-500"/>
                </div>
            </div>
        </div>
        
        <div className="flex justify-end">
            <Button 
                variant="primary" 
                icon={loading ? Loader2 : Save} 
                onClick={handleSave}
                disabled={loading}
            >
                {loading ? 'SALVANDO...' : (editingId ? 'ATUALIZAR' : 'SALVAR')}
            </Button>
        </div>
      </div>

      {/* LISTAGEM */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="font-bold text-slate-700">Categorias Cadastradas</h2>
            <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-2 text-slate-400" size={18}/>
                <input 
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500" 
                    placeholder="Buscar..." 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearchMain()}
                />
            </div>
        </div>
        
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-xs">
                    <tr>
                        <th className="p-4">Nome</th>
                        <th className="p-4">Grupo Principal</th>
                        <th className="p-4 text-right">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {listLoading ? (
                        <tr><td colSpan={3} className="p-8 text-center"><div className="flex justify-center gap-2"><Loader2 className="animate-spin"/> Carregando...</div></td></tr>
                    ) : categories.length === 0 ? (
                        <tr><td colSpan={3} className="p-8 text-center text-slate-500 italic">Nenhuma categoria encontrada.</td></tr>
                    ) : (
                        categories.map((cat) => (
                            <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4 font-bold text-slate-800">{cat.name}</td>
                                <td className="p-4">
                                    {cat.nameGroupCategory ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                                            <FolderInput size={12}/> 
                                            {cat.nameGroupCategory}
                                        </span>
                                    ) : (
                                        <span className="text-slate-400 text-xs italic">Sem categoria principal</span>
                                    )}
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => handleEdit(cat)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={16}/></button>
                                        <button onClick={() => handleDelete(cat.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
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
                <span className="text-sm px-2">Pág. {page} de {totalPages || 1}</span>
                <button onClick={() => setPage(p => (totalPages && p < totalPages ? p + 1 : p))} disabled={page >= totalPages || listLoading} className="p-2 border border-slate-300 rounded bg-white hover:bg-slate-50 disabled:opacity-50"><ChevronRight size={16}/></button>
            </div>
        </div>
      </div>

      {/* --- MODAL DE SELEÇÃO DE GRUPO --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <FolderInput className="text-blue-600" size={20}/> Selecionar Grupo
                    </h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500"><X size={20}/></button>
                </div>
                
                {/* Busca no Modal */}
                <div className="p-4 border-b border-slate-100">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500 text-sm"
                            placeholder="Buscar grupo principal..."
                            value={modalSearch}
                            onChange={e => setModalSearch(e.target.value)}
                            autoFocus
                        />
                    </div>
                </div>

                {/* Lista do Modal */}
                <div className="overflow-y-auto p-2 space-y-1 flex-1">
                    {modalLoading ? (
                        <div className="flex justify-center p-4"><Loader2 className="animate-spin text-blue-500"/></div>
                    ) : groups.length === 0 ? (
                        <p className="text-center text-sm text-slate-400 p-4">Nenhum grupo encontrado.</p>
                    ) : (
                        groups.map(group => (
                            <button
                                key={group.id}
                                onClick={() => {
                                    setSelectedGroup(group);
                                    setIsModalOpen(false);
                                }}
                                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium flex justify-between items-center transition-colors ${selectedGroup?.id === group.id ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'hover:bg-slate-50 text-slate-700 border border-transparent'}`}
                            >
                                {group.name}
                                {selectedGroup?.id === group.id && <Check size={16} className="text-blue-600"/>}
                            </button>
                        ))
                    )}
                </div>
                
                <div className="p-3 bg-slate-50 border-t text-xs text-center text-slate-400">
                    Mostrando os primeiros resultados.
                </div>
            </div>
        </div>
      )}

    </div>
  );
}