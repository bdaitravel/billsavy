
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

  // Función para convertir ArrayBuffer a Base64 de forma segura en móviles
  const bufferToBase64 = (buffer: ArrayBuffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    try {
      // Usamos arrayBuffer() que es mucho más estable en iOS que readAsDataURL
      const buffer = await file.arrayBuffer();
      const base64Data = bufferToBase64(buffer);
      const mimeType = file.type || 'application/pdf';

      const data = await analyzeBillImage(base64Data, mimeType);
      setResult(data);
    } catch (err) {
      console.error("Error en lectura:", err);
      alert("Billy no ha podido abrir este archivo. Por favor, asegúrate de que no tenga contraseña o prueba a sacarle una foto.");
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
      description: `Renovación: ${result.renewalDate}`,
      isRecurring: true,
      source: 'manual',
      auditStatus: result.priceRating === 'AVISO BILLY' ? 'ABUSIVO' : (result.priceRating === 'PRECIO TOP' ? 'OPTIMIZADO' : 'JUSTO'),
      auditDetail: result.billyAdvice
    });
  };

  if (isScanning) {
    return (
      <div className="bg-slate-900 border border-teal-500/20 p-10 rounded-[3rem] w-full max-w-sm text-center animate-pop flex flex-col items-center justify-center min-h-[350px] shadow-2xl">
        <div className="w-20 h-20 mb-8 relative">
          <div className="absolute inset-0 border-4 border-teal-500/10 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 border-4 border-t-teal-400 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-3xl">📄</div>
        </div>
        <h3 className="text-xl font-black text-white uppercase tracking-tighter">Billy analizando...</h3>
        <p className="text-[10px] text-teal-400 font-bold uppercase tracking-widest mt-2 animate-pulse">Procesando factura digital</p>
      </div>
    );
  }

  if (result) {
    return (
      <div className="bg-slate-900 border border-white/10 p-8 rounded-[3rem] w-full max-w-sm animate-pop shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-teal-500/10 text-teal-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner">✨</div>
          <h2 className="text-[10px] font-black uppercase text-slate-500 tracking-widest">LECTURA COMPLETADA:</h2>
        </div>

        <div className="space-y-4 mb-8">
          <div className="bg-white/5 p-5 rounded-3xl border border-white/5">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[9px] font-black text-teal-400 uppercase">{result.category}</span>
              <span className="text-xl font-black text-white">{result.amount}€</span>
            </div>
            <p className="text-[11px] font-bold text-white uppercase truncate">{result.provider}</p>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-3xl border border-teal-500/10 shadow-lg">
            <p className="text-[8px] font-black text-slate-500 uppercase mb-2 tracking-widest text-center">Próxima Renovación:</p>
            <p className="text-center text-md font-black text-white mb-4">{result.renewalDate}</p>
            <div className="h-px bg-white/5 w-full my-4"></div>
            <p className="text-[10px] text-slate-300 italic text-center leading-relaxed">"💡 {result.billyAdvice}"</p>
          </div>
        </div>

        <div className="space-y-3">
          <button onClick={saveToHistory} className="w-full py-5 bg-teal-500 text-slate-950 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">
            Confirmar y Guardar
          </button>
          <button onClick={() => setResult(null)} className="w-full py-3 text-[9px] font-black text-slate-500 uppercase">
            Repetir Escaneo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-white/10 p-8 rounded-[3rem] w-full max-w-sm text-center animate-pop relative shadow-2xl">
      <button onClick={onCancel} className="absolute top-6 left-6 text-slate-500 p-2">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
      </button>

      <div className="w-16 h-16 bg-teal-500/10 text-teal-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">📸</div>
      <h3 className="text-xl font-black mb-2 uppercase tracking-tighter text-white">Escáner Billy</h3>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-10 leading-relaxed px-6">
        Sube tus PDFs de luz o saca una foto a tus pólizas de coche y moto.
      </p>
      
      <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
      
      <button 
        onClick={() => fileInputRef.current?.click()} 
        className="w-full py-16 border-2 border-dashed border-white/10 rounded-[2.5rem] text-[10px] font-black uppercase text-slate-500 bg-white/5 active:scale-95 transition-all hover:border-teal-500/40"
      >
        Toca para abrir <br/> PDF o Cámara
      </button>
    </div>
  );
};

export default BillUploader;
