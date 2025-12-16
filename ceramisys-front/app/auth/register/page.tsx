'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { z } from 'zod';

// 1. Tipagem para os erros (Crucial para o TypeScript parar de reclamar)
type FormErrors = {
  [key: string]: string | null | undefined;
};

// Schema de validação
const registerSchema = z.object({
  ceramicName: z.string().min(3, "O nome da cerâmica deve ter no mínimo 3 letras"),
  whatsapp: z.string().min(1, "O WhatsApp é obrigatório"),
  email: z.string().email("Digite um e-mail válido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres")
});

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [form, setForm] = useState({ 
    ceramicName: '', 
    whatsapp: '', 
    email: '', 
    password: '' 
  });

  // 2. Aplicando a tipagem no useState
  const [errors, setErrors] = useState<FormErrors>({});

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
    
    // Agora o TypeScript aceita a indexação dinâmica [id]
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: null }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrors({}); 

    const result = registerSchema.safeParse(form);

    if (!result.success) {
      // 3. Tipando o objeto temporário de erros
      const fieldErrors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        const fieldName = String(issue.path[0]);
        fieldErrors[fieldName] = issue.message;
      });
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

    setTimeout(() => {
      setLoading(false);
      router.push('/dashboard');
    }, 2000);
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

        {/* LADO DIREITO */}
        <div className="flex items-center justify-center p-8 lg:p-16 bg-white">
          <div className="w-full max-w-[480px]">
            
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
                  value={form.ceramicName}
                  onChange={handleChange}
                  placeholder="Ex: Cerâmica Santa Luzia"
                  className={`w-full px-5 py-4 text-base border-2 rounded-2xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 transition-all duration-200 placeholder:text-gray-400 text-gray-900 
                    ${errors.ceramicName 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' 
                      : 'border-gray-200 focus:border-orange-500 focus:ring-orange-500/10'}`}
                />
                {errors.ceramicName && <p className="mt-1 ml-1 text-sm text-red-500 font-medium">{errors.ceramicName}</p>}
              </div>

              {/* WhatsApp */}
              <div>
                <label htmlFor="whatsapp" className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                  WhatsApp
                </label>
                <input
                  type="tel"
                  id="whatsapp"
                  value={form.whatsapp}
                  onChange={handleChange}
                  placeholder="(89) 99999-9999"
                  className={`w-full px-5 py-4 text-base border-2 rounded-2xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 transition-all duration-200 placeholder:text-gray-400 text-gray-900
                    ${errors.whatsapp 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' 
                      : 'border-gray-200 focus:border-orange-500 focus:ring-orange-500/10'}`}
                />
                 {errors.whatsapp && <p className="mt-1 ml-1 text-sm text-red-500 font-medium">{errors.whatsapp}</p>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                  E-mail de Acesso
                </label>
                <input
                  type="email"
                  id="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="admin@ceramica.com"
                  className={`w-full px-5 py-4 text-base border-2 rounded-2xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 transition-all duration-200 placeholder:text-gray-400 text-gray-900
                    ${errors.email 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' 
                      : 'border-gray-200 focus:border-orange-500 focus:ring-orange-500/10'}`}
                />
                {errors.email && <p className="mt-1 ml-1 text-sm text-red-500 font-medium">{errors.email}</p>}
              </div>

              {/* Senha com Toggle */}
              <div>
                <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                  Criar Senha
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Mínimo 6 caracteres"
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
                className="w-full py-4 px-6 text-lg font-bold text-white bg-gradient-to-r from-orange-600 to-orange-500 rounded-2xl shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-orange-200 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-6"
              >
                {loading ? 'Validando e Criando...' : 'Finalizar Cadastro'}
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