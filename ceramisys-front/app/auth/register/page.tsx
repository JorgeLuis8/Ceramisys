'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ 
    ceramicName: '', 
    whatsapp: '', 
    email: '', 
    password: '' 
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Simulação de cadastro
    setTimeout(() => {
      setLoading(false);
      router.push('/dashboard');
    }, 2000);
  }

  return (
    <>
      <style jsx global>{`
        @keyframes morph {
          0%, 100% {
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
            transform: translate(0, 0) rotate(0deg);
          }
          50% {
            border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
            transform: translate(10px, -10px) rotate(5deg);
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        .animate-morph {
          animation: morph 8s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>

      <div className="min-h-screen grid lg:grid-cols-2 bg-white overflow-hidden font-sans">
        
        {/* ========== LADO ESQUERDO (Igual ao Login) ========== */}
        <div className="hidden lg:flex relative items-center justify-center p-16 bg-[#fff7ed] overflow-hidden border-r border-orange-100">
          
          {/* Blobs de Fundo */}
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <div className="absolute top-[15%] left-[10%] w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-morph"></div>
            <div className="absolute bottom-[15%] right-[10%] w-80 h-80 bg-red-400 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-morph" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-[40%] left-[30%] w-72 h-72 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-morph" style={{ animationDelay: '4s' }}></div>
          </div>

          {/* Conteúdo Central */}
          <div className="relative z-10 text-center animate-float">
            
            {/* LOGO: Apenas a imagem (sem círculo branco) */}
            <div className="w-32 h-32 mx-auto mb-10 relative">
               <Image 
                 src="/icons/logo.png" 
                 alt="Logo CeramiSys" 
                 fill 
                 className="object-contain"
                 priority
               />
            </div>
            
            <h1 className="text-5xl font-black text-gray-900 mb-6 tracking-tight">
              Junte-se à <br />
              Cerami<span className="text-orange-600">Sys</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-md mx-auto leading-relaxed font-medium">
              Comece hoje a transformação digital da sua indústria.
            </p>
            
            <div className="mt-6 flex flex-col gap-3 items-center justify-center opacity-80">
                <div className="flex items-center gap-2 text-gray-500 font-medium">
                    <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                    Controle de Estoque
                </div>
                <div className="flex items-center gap-2 text-gray-500 font-medium">
                    <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                    Gestão Financeira
                </div>
            </div>
          </div>
        </div>

        {/* ========== LADO DIREITO (Formulário de Cadastro) ========== */}
        <div className="flex items-center justify-center p-8 lg:p-16 bg-white">
          <div className="w-full max-w-[480px]"> {/* Ligeiramente mais largo para o form maior */}
            
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">Criar nova conta</h2>
              <p className="text-gray-500 text-lg">Preencha os dados da sua empresa.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Nome da Cerâmica */}
              <div>
                <label htmlFor="ceramicName" className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                  Nome da Cerâmica
                </label>
                <input
                  type="text"
                  id="ceramicName"
                  required
                  placeholder="Ex: Cerâmica Santa Luzia"
                  value={form.ceramicName}
                  onChange={handleChange}
                  className="w-full px-5 py-4 text-base border-2 border-gray-200 rounded-2xl bg-gray-50 focus:bg-white focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all duration-200 placeholder:text-gray-400 text-gray-900"
                />
              </div>

              {/* WhatsApp */}
              <div>
                <label htmlFor="whatsapp" className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                  WhatsApp
                </label>
                <input
                  type="tel"
                  id="whatsapp"
                  required
                  placeholder="(89) 99999-9999"
                  value={form.whatsapp}
                  onChange={handleChange}
                  className="w-full px-5 py-4 text-base border-2 border-gray-200 rounded-2xl bg-gray-50 focus:bg-white focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all duration-200 placeholder:text-gray-400 text-gray-900"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                  E-mail de Acesso
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  placeholder="admin@ceramica.com"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-5 py-4 text-base border-2 border-gray-200 rounded-2xl bg-gray-50 focus:bg-white focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all duration-200 placeholder:text-gray-400 text-gray-900"
                />
              </div>

              {/* Senha */}
              <div>
                <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                  Criar Senha
                </label>
                <input
                  type="password"
                  id="password"
                  required
                  placeholder="Mínimo 6 caracteres"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-5 py-4 text-base border-2 border-gray-200 rounded-2xl bg-gray-50 focus:bg-white focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all duration-200 placeholder:text-gray-400 text-gray-900"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 text-lg font-bold text-white bg-gradient-to-r from-orange-600 to-orange-500 rounded-2xl shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-orange-200 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-6"
              >
                {loading ? 'Criando conta...' : 'Finalizar Cadastro'}
              </button>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 text-sm text-gray-400 bg-white font-medium">Já possui acesso?</span>
                </div>
              </div>

              <p className="text-center text-base text-gray-600">
                <Link href="/auth/login" className="font-bold text-orange-600 hover:text-orange-700 transition-colors">
                  Voltar para o Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}