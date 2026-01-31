
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface ConnectCenterProps {
  user: UserProfile;
  onConnect: (type: 'bank' | 'email') => void;
}

const ConnectCenter: React.FC<ConnectCenterProps> = ({ user, onConnect }) => {
  const [connecting, setConnecting] = useState<string | null>(null);

  const handleConnect = (type: 'bank' | 'email') => {
    setConnecting(type);
    // Simulación de flujo de conexión (Stripe/Plaid style)
    setTimeout(() => {
      onConnect(type);
      setConnecting(null);
    }, 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10">
          <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.82v-1.91c-1.64-.32-3.15-1.28-3.15-3.32h1.96c.04 1.15.75 1.58 1.63 1.58.9 0 1.5-.47 1.5-1.12 0-.74-.48-1.1-1.9-1.44-1.93-.47-3.23-1.17-3.23-3.1 0-1.68 1.34-2.81 3.15-3.18V6h2.82v1.84c1.38.27 2.62 1.05 2.62 2.92h-1.96c-.03-.92-.68-1.45-1.45-1.45-.75 0-1.43.34-1.43 1.12 0 .63.4 1.05 1.76 1.4 2.14.53 3.37 1.25 3.37 3.24 0 1.94-1.4 3.06-3.31 3.52z"/></svg>
        </div>
        <div className="relative z-10">
          <h2 className="text-4xl font-black mb-4">Fuentes Inteligentes</h2>
          <p className="text-slate-400 text-lg font-medium max-w-xl">Conecta BillSavy directamente a tus cuentas para que la IA trabaje en tiempo real sin que muevas un dedo.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Bank Connection */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm flex flex-col hover:border-emerald-500 transition-all">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8 border border-blue-100">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v20M16 14v20M3 10h18M3 14h18M4 6h16M4 10h16" /></svg>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-2">Open Banking</h3>
          <p className="text-slate-500 font-medium mb-8">Vincule su cuenta bancaria mediante Plaid para monitorizar pagos recurrentes y detectar subidas de precios ocultas.</p>
          
          <div className="mt-auto">
            {user.isBankConnected ? (
              <div className="flex items-center gap-3 text-emerald-600 font-bold bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"/></svg>
                Banco Vinculado (AES-256)
              </div>
            ) : (
              <button 
                onClick={() => handleConnect('bank')}
                disabled={connecting === 'bank'}
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {connecting === 'bank' ? 'Autenticando...' : 'Vincular Banco vía PSD2'}
              </button>
            )}
          </div>
        </div>

        {/* Email Connection */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm flex flex-col hover:border-emerald-500 transition-all">
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-8 border border-rose-100">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-2">Magic Email Scan</h3>
          <p className="text-slate-500 font-medium mb-8">Permite a Billy leer tus facturas digitales directamente desde tu bandeja de entrada de Gmail o Outlook.</p>
          
          <div className="mt-auto">
            {user.isEmailConnected ? (
              <div className="flex items-center gap-3 text-emerald-600 font-bold bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"/></svg>
                Lectura Automática Activa
              </div>
            ) : (
              <button 
                onClick={() => handleConnect('email')}
                disabled={connecting === 'email'}
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {connecting === 'email' ? 'Configurando...' : 'Vincular Correo'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-emerald-50 rounded-[2.5rem] p-8 border border-emerald-100 flex items-center gap-6">
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div>
          <h4 className="font-black text-emerald-900">Seguridad de Grado Bancario</h4>
          <p className="text-sm text-emerald-700 font-medium">Sus datos están encriptados con AES-256. BillSavy nunca tiene acceso a sus credenciales directas.</p>
        </div>
      </div>
    </div>
  );
};

export default ConnectCenter;
