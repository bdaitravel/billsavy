
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (name: string, email: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) onLogin(name, email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-emerald-50">
      <div className="bg-white rounded-[2rem] p-10 max-w-md w-full shadow-2xl shadow-emerald-200/50 animate-fade">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4 shadow-lg shadow-emerald-200">B</div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">BillSavy</h1>
          <p className="text-slate-500 font-medium">Toma el control inteligente de tus facturas</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Nombre Completo</label>
            <input 
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ej. Juan Pérez"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Correo Electrónico</label>
            <input 
              required
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 mt-4"
          >
            Entrar en BillSavy
          </button>
        </form>
        <p className="text-center text-xs text-slate-400 mt-8">Al entrar, aceptas nuestra política de privacidad y ahorro inteligente.</p>
      </div>
    </div>
  );
};

export default Login;
