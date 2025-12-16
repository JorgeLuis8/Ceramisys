'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image'; // <--- Importante: Importar o Image

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  useEffect(() => {
    router.prefetch('/dashboard');
  }, [router]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/dashboard');
    }, 1500);
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
        
        {/* ========== LADO ESQUERDO ========== */}
        <div className="hidden lg:flex relative items-center justify-center p-16 bg-[#fff7ed] overflow-hidden border-r border-orange-100">
          
          {/* Blobs de Fundo */}
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <div className="absolute top-[15%] left-[10%] w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-morph"></div>
            <div className="absolute bottom-[15%] right-[10%] w-80 h-80 bg-red-400 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-morph" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-[40%] left-[30%] w-72 h-72 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-morph" style={{ animationDelay: '4s' }}></div>
          </div>

          {/* Conteúdo Central */}
          <div className="relative z-10 text-center animate-float">
            
            {/* LOGO: Agora usando a imagem real */}
            <div className="w-32 h-32 mx-auto mb-10 bg-white rounded-[2rem] shadow-2xl flex items-center justify-center border border-orange-50 relative overflow-hidden p-4">
               <div className="absolute inset-0 bg-gradient-to-br from-white to-orange-50 opacity-50"></div>
               
               {/* AQUI ESTÁ A IMAGEM DA LOGO */}
               <div className="relative z-10 w-full h-full">
                 <Image 
                   src="/icons/logo.png" 
                   alt="Logo CeramiSys" 
                   fill 
                   className="object-contain"
                   priority
                 />
               </div>
            </div>
            
            <h1 className="text-6xl font-black text-gray-900 mb-4 tracking-tight">
              Cerami<span className="text-orange-600">Sys</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-md mx-auto leading-relaxed font-medium">
              Gestão inteligente para indústrias cerâmicas.
            </p>
            <div className="mt-4 inline-block px-4 py-1.5 rounded-full bg-orange-100 border border-orange-200">
              <p className="text-sm text-orange-700 font-bold uppercase tracking-wide">
                Controle total, do barro ao tijolo
              </p>
            </div>
          </div>
        </div>

        {/* ========== LADO DIREITO (Igual ao anterior) ========== */}
        <div className="flex items-center justify-center p-8 lg:p-16 bg-white">
          <div className="w-full max-w-[420px]">
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">Bem-vindo de volta</h2>
              <p className="text-gray-500 text-lg">Acesse o painel administrativo.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                  E-mail Profissional
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="admin@ceramica.com"
                  className="w-full px-5 py-4 text-base border-2 border-gray-200 rounded-2xl bg-gray-50 focus:bg-white focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all duration-200 placeholder:text-gray-400 text-gray-900"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2 ml-1">
                  <label htmlFor="password" className="block text-sm font-bold text-gray-700">
                    Senha
                  </label>
                  <Link href="/auth/recoverpass" className="text-xs font-bold text-orange-600 hover:text-orange-700 uppercase tracking-wide transition-colors">
                    Esqueceu?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-5 py-4 text-base border-2 border-gray-200 rounded-2xl bg-gray-50 focus:bg-white focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all duration-200 placeholder:text-gray-400 text-gray-900"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 text-lg font-bold text-white bg-gradient-to-r from-orange-600 to-orange-500 rounded-2xl shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-orange-200 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-4"
              >
                {loading ? 'Acessando...' : 'Entrar no Sistema'}
              </button>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 text-sm text-gray-400 bg-white font-medium">ou</span>
                </div>
              </div>

              <p className="text-center text-base text-gray-600">
                Não tem uma conta?{' '}
                <Link href="/auth/register" className="font-bold text-orange-600 hover:text-orange-700 transition-colors">
                  Criar conta
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}