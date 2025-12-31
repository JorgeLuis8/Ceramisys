import React, { useEffect, useState } from 'react';
import { Package, Layers, DollarSign, AlertTriangle, ArrowDownLeft, Loader2, Users } from 'lucide-react';
import { api } from '@/lib/api'; // Importando sua instância do Axios configurada

// 1. Tipagem dos dados da API
interface DashboardData {
  entradasPorMes: number[];
  produtosNaoDevolvidos: number;
  totalProdutosCadastrados: number;
  porcentagemDevolucaoGeral: number;
  produtosComFuncionario: number;
  totalProdutosEstoque: number;
  gastoTotalComprasMes: number;
  alertasEstoqueMinimo: number;
}

export function DashboardHome() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Buscando os dados na API
  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await api.get('/api/dashboard/primary');
        setData(response.data);
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  // Formatação de Moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  // Nomes dos meses para o gráfico
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  // Estado de Carregamento
  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  // Cálculo para o gráfico (para a barra ficar proporcional)
  const maxValue = Math.max(...data.entradasPorMes, 1); // Evita divisão por zero

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2">
            Dashboard <span className="text-gray-300">/</span> <span className="text-blue-600">Almoxarifado</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">Visão geral do estoque e movimentações.</p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          <button className="whitespace-nowrap px-4 py-2 text-xs font-semibold bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
            Atualizado Agora
          </button>
        </div>
      </div>

      {/* CARDS DE KPI (Mapeados com os dados da API) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        
        {/* Card 1: Produtos Cadastrados */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-between hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600"><Package size={22} /></div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Produtos Cadastrados</p>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mt-1">{data.totalProdutosCadastrados}</h3>
          </div>
        </div>

        {/* Card 2: Volume Total em Estoque */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-between hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-purple-50 text-purple-600"><Layers size={22} /></div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Volume em Estoque</p>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mt-1">{data.totalProdutosEstoque}</h3>
          </div>
        </div>

        {/* Card 3: Gastos/Compras do Mês */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-between hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600"><DollarSign size={22} /></div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Compras do Mês</p>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mt-1">{formatCurrency(data.gastoTotalComprasMes)}</h3>
          </div>
        </div>

        {/* Card 4: Alertas de Estoque Mínimo */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-between hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-red-50 text-red-600"><AlertTriangle size={22} /></div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Alertas de Estoque</p>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mt-1">{data.alertasEstoqueMinimo}</h3>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* GRÁFICO DE BARRAS (Entradas Por Mês) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Entradas Mensais</h2>
          
          <div className="h-64 flex items-end justify-between gap-2 overflow-x-auto pb-2">
            {data.entradasPorMes.map((valor, i) => {
              // Calcula altura percentual baseada no maior valor do array
              const heightPercentage = (valor / maxValue) * 100;
              // Garante que a barra tenha pelo menos 5% de altura pra não sumir se for 0, ou deixa vazia se preferir
              const displayHeight = valor === 0 ? 2 : heightPercentage; 

              return (
                <div key={i} className="flex flex-col items-center w-full min-w-[30px] group relative">
                  {/* Tooltip com valor exato ao passar o mouse */}
                  <div className="absolute -top-8 opacity-0 group-hover:opacity-100 bg-slate-800 text-white text-xs py-1 px-2 rounded transition-opacity pointer-events-none">
                    {valor}
                  </div>
                  
                  {/* Barra */}
                  <div 
                    className={`w-full rounded-t-sm transition-all duration-500 ${valor > 0 ? 'bg-blue-500 group-hover:bg-blue-600' : 'bg-gray-100'}`} 
                    style={{ height: `${displayHeight}%` }}
                  ></div>
                  
                  {/* Mês */}
                  <span className="text-[10px] text-gray-400 mt-2 uppercase">{months[i]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* STATUS ADICIONAL (Produtos com Funcionários) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Em Uso / Empréstimos</h2>
          
          <div className="flex-1 flex flex-col justify-center items-center text-center space-y-4 py-8">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center text-orange-600">
               <Users size={32} />
            </div>
            <div>
              <h3 className="text-4xl font-black text-slate-800">{data.produtosComFuncionario}</h3>
              <p className="text-sm text-gray-500 font-medium">Produtos com Funcionários</p>
            </div>
            <div className="w-full border-t border-gray-100 pt-4 mt-4">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Devolução Geral</span>
                    <span className="font-bold text-green-600">{data.porcentagemDevolucaoGeral}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 mt-2 overflow-hidden">
                    <div className="bg-green-500 h-full rounded-full" style={{ width: `${data.porcentagemDevolucaoGeral}%` }}></div>
                </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}