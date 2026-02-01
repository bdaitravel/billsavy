
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

  // Método robusto para convertir ArrayBuffer a Base64 sin colapsar el navegador móvil
  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // El formato es "data:application/pdf;base64,XXXXX..." o "data:image/jpeg;base64,XXXXX..."
        const base64 = result.split(',')[1];
        if (base64) resolve(base64);
        else reject(new Error("No se pudo extraer el contenido base64"));
      };
      reader.onerror = () => reject(new Error("Error de lectura del sistema de archivos"));
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Log para depuración interna (visible en consola de desarrollador)
    console.log(`Procesando archivo: ${file.name} (${file.type}) - Tamaño: ${file.size} bytes`);

    setIsScanning(true);
    try {
      const base64Data = await readFileAsBase64(file);
      const mimeType = file.type || (file.name.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'image/jpeg');

      const data = await analyzeBillImage(base64Data, mimeType);
      setResult(data);
    } catch (err) {
      console.error("Error crítico de lectura:", err);
      alert("Billy no pudo procesar este archivo. Asegúrate de que el PDF no esté protegido con contraseña.");
    } finally {
      setIsScanning(false);
      // Reset del input para permitir subir el mismo archivo si falla
      if (fileInputRef.current) fileInputRef.current.value = '';
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
      description: `Renovación: ${result.renewalDate}`,
      isRecurring: true,
      source: 'manual',
      auditStatus: result.priceRating === 'AVISO BILLY' ? 'ABUSIVO' : (result.priceRating === 'PRECIO TOP' ? 'OPTIMIZADO' : 'JUSTO'),
      auditDetail: result.billyAdvice
    });
  };

  if (isScanning) {
    return (
      <div className="bg-slate-900 border border-teal-500/20 p-10 rounded-[3.5rem] w-full max-w-sm text-center animate-pop flex flex-col items-center justify-center min-h-[400px] shadow-2xl">
        <div className="w-24 h-24 mb-10 relative">
          <div className="absolute inset-0 border-[6px] border-teal-500/10 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 border-[6px] border-t-teal-400 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-4xl">🤖</div>
        </div>
        <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Analizando...</h3>
        <p className="text-[11px] text-teal-400 font-bold uppercase tracking-[0.2em] mt-3 animate-pulse">Billy está leyendo el PDF</p>
      </div>
    );
  }

  if (result) {
    return (
      <div className="bg-slate-900 border border-white/10 p-8 rounded-[3.5rem] w-full max-w-sm animate-pop shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-teal-500/10 text-teal-400 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-inner border border-teal-500/20">✨</div>
          <h2 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em]">RESUMEN DE LECTURA</h2>
        </div>

        <div className="space-y-5 mb-10">
          <div className="bg-white/5 p-6 rounded-[2.5rem] border border-white/5 shadow-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest">{result.category}</span>
              <span className="text-2xl font-black text-white">{result.amount}€</span>
            </div>
            <p className="text-[12px] font-black text-white uppercase truncate">{result.provider}</p>
          </div>

          <div className="bg-slate-800/80 p-6 rounded-[2.5rem] border border-teal-500/10 shadow-xl">
            <p className="text-[9px] font-black text-slate-500 uppercase mb-3 tracking-widest text-center">Calendario de Ahorro:</p>
            <div className="text-center">
              <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Próxima Renovación</p>
              <p className="text-lg font-black text-white">{result.renewalDate}</p>
            </div>
            <div className="h-px bg-white/5 w-full my-5"></div>
            <p className="text-[11px] text-slate-200 italic text-center leading-relaxed font-medium">
              "{result.billyAdvice}"
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <button onClick={saveToHistory} className="w-full py-6 bg-teal-500 text-slate-950 rounded-3xl font-black text-[11px] uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(45,212,191,0.3)] active:scale-95 transition-all">
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
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
      </button>

      <div className="w-20 h-20 bg-teal-500/10 text-teal-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl border border-teal-500/10">
        <span className="text-3xl">📄</span>
      </div>
      
      <h3 className="text-2xl font-black mb-3 uppercase tracking-tighter text-white">Escáner Billy</h3>
      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.15em] mb-12 leading-relaxed px-4">
        Sube el PDF de tu factura de luz o saca una foto a tu seguro. Billy se encarga del resto.
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
        className="w-full py-20 border-2 border-dashed border-white/10 rounded-[3rem] text-[11px] font-black uppercase text-slate-500 bg-white/5 active:scale-95 transition-all hover:border-teal-500/40 group"
      >
        <div className="flex flex-col items-center gap-4">
          <span className="text-3xl group-hover:scale-125 transition-transform duration-300">📁</span>
          <span>Toca para subir <br/> PDF o Foto</span>
        </div>
      </button>

      <p className="text-[8px] text-slate-600 font-black uppercase tracking-[0.3em] mt-10">Procesado seguro • AES-256</p>
    </div>
  );
};

export default BillUploader;
