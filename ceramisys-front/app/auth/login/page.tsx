'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { z } from 'zod';
import { api } from '@/lib/api';
import Cookies from 'js-cookie';

type FormErrors = {
  [key: string]: string | null | undefined;
};

// Validação usando Username
const loginSchema = z.object({
  username: z.string().min(1, "O usuário é obrigatório"),
  password: z.string().min(1, "A senha é obrigatória")
});

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [generalError, setGeneralError] = useState(""); 
  
  const [form, setForm] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    router.prefetch('/dashboard');
  }, [router]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
    
    if (errors[id]) setErrors((prev) => ({ ...prev, [id]: null }));
    if (generalError) setGeneralError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setGeneralError("");

    const result = loginSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        const fieldName = String(issue.path[0]);
        fieldErrors[fieldName] = issue.message;
      });
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/api/auth', null, {
        params: {
          Username: form.username,
          Password: form.password
        }
      });

      // 1. Pegamos os dados da resposta
      const { accessToken, expirationDate } = response.data;

      if (accessToken) {
        const expires = expirationDate ? new Date(expirationDate) : 1;

        // 2. SALVANDO O COOKIE CORRETAMENTE
        // path: '/' é essencial para o dashboard enxergar o token
        Cookies.set('auth_token', accessToken, { 
            expires: expires, 
            path: '/', 
            secure: window.location.protocol === 'https:', // Só usa Secure se for HTTPS
            sameSite: 'Lax'
        });

        console.log("Login efetuado. Redirecionando...");
        
        // Pequeno delay para garantir que o navegador salvou o cookie
        setTimeout(() => {
            router.push('/dashboard');
        }, 100);
        
      } else {
        setGeneralError("Erro: Credenciais válidas, mas sem token.");
      }

    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 401 || error.response.status === 404) {
            setGeneralError("Usuário ou senha incorretos.");
        } else {
            setGeneralError("Erro ao processar login.");
        }
      } else if (error.request) {
        setGeneralError("Sem conexão com o servidor.");
      } else {
        setGeneralError("Ocorreu um erro inesperado.");
      }
      setLoading(false); // Só tira o loading se der erro
    }
  }

  return (
    <>
      <style jsx global>{`
        @keyframes morph {
          0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; transform: translate(0, 0) rotate(0deg); }
          50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; transform: translate(10px, -10px) rotate(5deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-morph { animation: morph 8s ease-in-out infinite; }
        .animate-float { animation: float 6s ease-in-out infinite; }
      `}</style>

      <div className="min-h-screen grid lg:grid-cols-2 bg-white overflow-hidden font-sans">
        
        {/* LADO ESQUERDO */}
        <div className="hidden lg:flex relative items-center justify-center p-16 bg-[#fff7ed] overflow-hidden border-r border-orange-100">
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <div className="absolute top-[15%] left-[10%] w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-morph"></div>
            <div className="absolute bottom-[15%] right-[10%] w-80 h-80 bg-red-400 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-morph" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-[40%] left-[30%] w-72 h-72 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-morph" style={{ animationDelay: '4s' }}></div>
          </div>

          <div className="relative z-10 text-center animate-float">
            <div className="w-32 h-32 mx-auto mb-10 relative">
               <Image 
                 src="/icons/logo.png" 
                 alt="Logo CeramiSys" 
                 fill 
                 className="object-contain"
                 priority
               />
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

        {/* LADO DIREITO */}
        <div className="flex items-center justify-center p-8 lg:p-16 bg-white">
          <div className="w-full max-w-[420px]">
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">Bem-vindo de volta</h2>
              <p className="text-gray-500 text-lg">Acesse o painel administrativo.</p>
            </div>

            {generalError && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium rounded-r">
                {generalError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div>
                <label htmlFor="username" className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                  Nome de Usuário
                </label>
                <input
                  id="username"
                  type="text"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="admin"
                  className={`w-full px-5 py-4 text-base border-2 rounded-2xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 transition-all duration-200 placeholder:text-gray-400 text-gray-900
                    ${errors.username 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' 
                      : 'border-gray-200 focus:border-orange-500 focus:ring-orange-500/10'}`}
                />
                {errors.username && <p className="mt-1 ml-1 text-sm text-red-500 font-medium">{errors.username}</p>}
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
                
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full px-5 py-4 text-base border-2 rounded-2xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 transition-all duration-200 placeholder:text-gray-400 text-gray-900 pr-12
                      ${errors.password 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' 
                        : 'border-gray-200 focus:border-orange-500 focus:ring-orange-500/10'}`}
                  />
                  
                   <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-1"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && <p className="mt-1 ml-1 text-sm text-red-500 font-medium">{errors.password}</p>}
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