
import React, { useState, useRef } from 'react';
import { Asset, Category, Expense, AuditStatus } from '../types';
import { analyzeBillImage } from '../services/geminiService';

interface BillUploaderProps {
  assets: Asset[];
  onComplete: (expense: Expense) => void;
  onCancel: () => void;
}

const BillUploader: React.FC<BillUploaderProps> = ({ assets, onComplete, onCancel }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const convertFileToBase64 = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    try {
      const base64Data = await convertFileToBase64(file);
      const mimeType = file.type || (file.name.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'image/jpeg');

      const data = await analyzeBillImage(base64Data, mimeType);
      setResult(data);
    } catch (err) {
      console.error("Error cargando archivo:", err);
      alert("Billy no ha podido leer este archivo. Prueba a sacar una foto más clara o subir un PDF que no esté protegido.");
    } finally {
      setIsScanning(false);
    }
  };

  const saveToHistory = () => {
    if (!result) return;
    onComplete({
      id: Math.random().toString(36).substr(2, 9),
      provider: result.provider,
      amount: result.amount,
      date: result.date,
      category: result.category as Category,
      assetId: assets[0]?.id || '1',
      description: `Vence el: ${result.renewalDate}`,
      isRecurring: true,
      source: 'manual',
      auditStatus: result.priceRating === 'AVISO BILLY' ? 'ABUSIVO' : (result.priceRating === 'PRECIO TOP' ? 'OPTIMIZADO' : 'JUSTO'),
      auditDetail: result.billyAdvice
    });
  };

  if (isScanning) {
    return (
      <div className="bg-slate-900 border border-teal-500/20 p-12 rounded-[4rem] w-full max-w-sm text-center animate-pop flex flex-col items-center justify-center min-h-[450px] shadow-2xl">
        <div className="w-24 h-24 mb-10 relative">
          <div className="absolute inset-0 border-[6px] border-teal-500/10 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 border-[6px] border-t-teal-400 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-5xl">🧠</div>
        </div>
        <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Procesando...</h3>
        <p className="text-[11px] text-teal-400 font-black uppercase tracking-widest mt-4 animate-pulse">Auditando mercado español</p>
      </div>
    );
  }

  if (result) {
    return (
      <div className="bg-slate-900 border border-white/10 p-8 rounded-[3.5rem] w-full max-w-sm animate-pop shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-teal-500/10 text-teal-400 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl border border-teal-500/20">✨</div>
          <h2 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em]">ANÁLISIS COMPLETADO</h2>
        </div>

        <div className="space-y-5 mb-10">
          <div className="bg-white/5 p-6 rounded-[2.5rem] border border-white/5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest">{result.category}</span>
              <span className="text-2xl font-black text-white">{result.amount}€</span>
            </div>
            <p className="text-[14px] font-black text-white uppercase truncate">{result.provider}</p>
          </div>

          <div className="bg-slate-800 p-6 rounded-[2.5rem] border border-teal-500/10">
            <p className="text-[10px] text-slate-400 uppercase font-black text-center mb-2">Aviso de Renovación</p>
            <p className="text-xl font-black text-white text-center mb-4">{result.renewalDate}</p>
            <div className="h-px bg-white/5 w-full my-4"></div>
            <p className="text-[11px] text-slate-200 italic text-center font-medium">"{result.billyAdvice}"</p>
          </div>
        </div>

        <div className="space-y-4">
          <button onClick={saveToHistory} className="w-full py-6 bg-teal-500 text-slate-950 rounded-3xl font-black text-[12px] uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(45,212,191,0.3)] active:scale-95 transition-all">
            Confirmar y Guardar
          </button>
          <button onClick={() => setResult(null)} className="w-full py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
            Subir Otro
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-white/10 p-10 rounded-[4rem] w-full max-w-sm text-center animate-pop relative shadow-2xl">
      <button onClick={onCancel} className="absolute top-8 left-8 text-slate-500 p-2 active:scale-90 transition-all">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
      </button>

      <div className="w-20 h-20 bg-teal-500/10 text-teal-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl border border-teal-500/10">
        <span className="text-4xl">📄</span>
      </div>
      
      <h3 className="text-2xl font-black mb-3 uppercase tracking-tighter text-white">Billy Escáner</h3>
      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.15em] mb-12 leading-relaxed px-6">
        Saca una foto o sube el PDF de tu factura. Billy buscará errores y mejores precios.
      </p>
      
      <input 
        type="file" 
        accept="image/*,application/pdf" 
        onChange={handleFileChange} 
        ref={fileInputRef} 
        className="hidden" 
      />
      
      <button 
        onClick={() => fileInputRef.current?.click()} 
        className="w-full py-24 border-2 border-dashed border-white/10 rounded-[3rem] text-[11px] font-black uppercase text-slate-500 bg-white/5 active:scale-95 transition-all flex flex-col items-center gap-4 hover:border-teal-500/40"
      >
        <span className="text-4xl">📁</span>
        <span>Pulsa para elegir <br/> PDF o Foto</span>
      </button>

      <p className="text-[8px] text-slate-600 font-black uppercase tracking-[0.4em] mt-12">Auditoría IA • 100% Privado</p>
    </div>
  );
};

export default BillUploader;
