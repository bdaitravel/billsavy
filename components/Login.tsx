
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (name: string, email: string, birthDate: string, city: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({ name: '', email: '', birthDate: '', city: '' });
  const [terms, setTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && terms) {
      onLogin(formData.name, formData.email, formData.birthDate, formData.city);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col items-center bg-[#020617] text-white p-8">
      
      {/* Centro: Logo Gigante */}
      <div className="flex-1 flex flex-col items-center justify-center animate-pop">
        <div className="logo-seal-hero mb-6">
          <span className="logo-b-hero">B</span>
        </div>
        <div className="text-center">
          <h1 className="text-sm font-black tracking-[0.5em] uppercase opacity-50 mb-1">BILLSAVY</h1>
          <p className="text-[10px] font-bold text-teal-400 uppercase tracking-tight">
            Control Total. Ahorro Real.
          </p>
        </div>
      </div>

      {/* Base: Formulario y Protección de datos */}
      <div className="w-full max-w-[320px] pb-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <input required placeholder="Nombre" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="input-bottom" />
            <input required type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="input-bottom" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input required type="date" value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: e.target.value})} className="input-bottom" />
            <input required placeholder="Ciudad" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="input-bottom" />
          </div>

          <div className="flex items-center gap-3 py-1">
            <input type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)} className="w-4 h-4 rounded text-teal-500 bg-white/5 border-white/10" />
            <label className="text-[8px] text-slate-500 font-bold uppercase">
              Acepto los términos y el uso de mis datos.
            </label>
          </div>

          <button type="submit" disabled={!terms} className="w-full bg-teal-500 text-slate-950 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-teal-400 transition-all disabled:opacity-20 shadow-xl active:scale-95">
            Entrar al Sistema
          </button>
        </form>
        
        <p className="text-[7px] text-slate-700 font-black text-center uppercase tracking-[0.4em]">
          INTELLIGENCE HUB © 2025
        </p>
      </div>
    </div>
  );
};

export default Login;
