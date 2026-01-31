
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
    <div className="h-screen w-full flex flex-col items-center bg-[#020617] text-white p-8 overflow-y-auto">
      
      {/* Centro: Logo Gigante */}
      <div className="flex-1 flex flex-col items-center justify-center animate-pop py-10">
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

      {/* Base: Formulario con Labels para evitar confusión en iPhone */}
      <div className="w-full max-w-[320px] pb-10 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[7px] font-black uppercase text-slate-500 ml-2">Nombre</label>
              <input required placeholder="Tu nombre" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="input-bottom" />
            </div>
            <div className="space-y-1">
              <label className="text-[7px] font-black uppercase text-slate-500 ml-2">Email</label>
              <input required type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="input-bottom" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[7px] font-black uppercase text-slate-500 ml-2">F. Nacimiento</label>
              <div className="relative">
                <input 
                  required 
                  type="date" 
                  value={formData.birthDate} 
                  onChange={e => setFormData({...formData, birthDate: e.target.value})} 
                  className="input-bottom w-full appearance-none" 
                  style={{ minHeight: '42px' }}
                />
                {!formData.birthDate && (
                  <span className="absolute inset-y-0 left-4 flex items-center text-[8px] text-slate-600 pointer-events-none uppercase font-bold">
                    Seleccionar...
                  </span>
                )}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[7px] font-black uppercase text-slate-500 ml-2">Ciudad</label>
              <input required placeholder="Ej: Madrid" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="input-bottom" />
            </div>
          </div>

          <div className="flex items-start gap-3 py-2">
            <input type="checkbox" id="terms" checked={terms} onChange={e => setTerms(e.target.checked)} className="w-4 h-4 mt-0.5 rounded text-teal-500 bg-white/5 border-white/10" />
            <label htmlFor="terms" className="text-[8px] text-slate-500 font-bold uppercase leading-tight">
              Acepto los términos de uso y el tratamiento de mis datos personales para el análisis de mis facturas.
            </label>
          </div>

          <button type="submit" disabled={!terms} className="w-full bg-teal-500 text-slate-950 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-teal-400 transition-all disabled:opacity-20 shadow-[0_10px_20px_rgba(45,212,191,0.2)] active:scale-95 mt-4">
            Entrar al Sistema
          </button>
        </form>
        
        <p className="text-[7px] text-slate-800 font-black text-center uppercase tracking-[0.4em]">
          INTELLIGENCE HUB © 2025
        </p>
      </div>
    </div>
  );
};

export default Login;
