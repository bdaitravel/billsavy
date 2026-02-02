
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
  const [selectedAssetId, setSelectedAssetId] = useState(assets[0]?.id || '1');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const convertFileToBase64 = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    try {
      const base64Data = await convertFileToBase64(file);
      const mimeType = file.type || 'image/jpeg';

      const data = await analyzeBillImage(base64Data, mimeType);
      setResult(data);
    } catch (err) {
      console.error("Error en el escáner:", err);
      alert("Billy no ha podido procesar este archivo. Asegúrate de que el PDF no tiene contraseña o que la foto se ve clara.");
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
      assetId: selectedAssetId,
      description: `Renovación: ${result.renewalDate}`,
      isRecurring: true,
      source: 'manual',
      auditStatus: result.priceRating === 'AVISO BILLY' ? 'ABUSIVO' : (result.priceRating === 'PRECIO TOP' ? 'OPTIMIZADO' : 'JUSTO'),
      auditDetail: result.billyAdvice
    });
  };

  if (isScanning) {
    return (
      <div className="bg-slate-900 border border-teal-500/30 p-12 rounded-[4rem] w-full max-w-sm text-center animate-pop flex flex-col items-center justify-center min-h-[500px] shadow-3xl">
        <div className="w-28 h-28 mb-12 relative">
          <div className="absolute inset-0 border-[6px] border-teal-500/10 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 border-[6px] border-t-teal-400 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-6xl">🤖</div>
        </div>
        <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Leyendo Documento</h3>
        <p className="text-[10px] text-teal-400 font-black uppercase tracking-[0.3em] mt-5 animate-pulse">Auditoría en Tiempo Real</p>
      </div>
    );
  }

  if (result) {
    return (
      <div className="bg-slate-900 border border-white/10 p-8 rounded-[4rem] w-full max-w-sm animate-pop shadow-3xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-teal-500/10 text-teal-400 rounded-3xl flex items-center justify-center mx-auto mb-4 text-4xl border border-teal-500/20">✨</div>
          <h2 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em]">ANÁLISIS COMPLETADO</h2>
        </div>

        <div className="space-y-4 mb-10">
          <div className="bg-white/5 p-6 rounded-[2.5rem] border border-white/5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[9px] font-black text-teal-400 uppercase tracking-widest">{result.category}</span>
              <span className="text-2xl font-black text-white">{result.amount}€</span>
            </div>
            <p className="text-[15px] font-black text-white uppercase truncate">{result.provider}</p>
          </div>

          <div className="bg-slate-800/50 p-6 rounded-[2.5rem] border border-teal-500/10">
            <p className="text-[9px] text-slate-500 uppercase font-black text-center mb-2 tracking-widest">¿A qué activo pertenece?</p>
            <select 
              value={selectedAssetId}
              onChange={(e) => setSelectedAssetId(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[11px] text-white outline-none font-bold uppercase"
            >
              {assets.map(a => <option key={a.id} value={a.id} className="bg-slate-900">{a.name}</option>)}
            </select>
          </div>

          <div className="bg-orange-500/5 p-6 rounded-[2.5rem] border border-orange-500/20">
             <p className="text-[9px] text-orange-400 uppercase font-black text-center mb-1">Billy Tip</p>
             <p className="text-[12px] text-white italic text-center font-medium leading-relaxed">"{result.billyAdvice}"</p>
          </div>
        </div>

        <div className="space-y-4">
          <button onClick={saveToHistory} className="w-full py-7 bg-teal-500 text-slate-950 rounded-[2rem] font-black text-[12px] uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all">
            Confirmar Registro
          </button>
          <button onClick={() => setResult(null)} className="w-full py-3 text-[9px] font-black text-slate-500 uppercase tracking-widest">
            Subir Otro
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-white/10 p-10 rounded-[4.5rem] w-full max-w-sm text-center animate-pop relative shadow-3xl">
      <button onClick={onCancel} className="absolute top-10 left-10 text-slate-500 p-2 active:scale-90 transition-all">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
      </button>

      <div className="w-24 h-24 bg-teal-500/10 text-teal-400 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-2xl border border-teal-500/10">
        <span className="text-5xl">📄</span>
      </div>
      
      <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter text-white">Billy Escáner</h3>
      <p className="text-[12px] text-slate-400 font-bold uppercase tracking-[0.1em] mb-12 leading-relaxed px-4">
        Sube un PDF o saca una foto a tu factura. Billy la auditará al instante.
      </p>
      
      <input 
        type="file" 
        accept="image/*,application/pdf" 
        capture="environment"
        onChange={handleFileChange} 
        ref={fileInputRef} 
        className="hidden" 
      />
      
      <button 
        onClick={() => fileInputRef.current?.click()} 
        className="w-full py-24 border-2 border-dashed border-white/10 rounded-[3.5rem] text-[11px] font-black uppercase text-slate-500 bg-white/5 active:scale-95 transition-all flex flex-col items-center gap-6 hover:border-teal-500/40"
      >
        <span className="text-5xl bg-teal-500/10 w-20 h-20 flex items-center justify-center rounded-full">📸</span>
        <span>Pulsa para abrir<br/>Cámara o Archivos</span>
      </button>

      <p className="text-[8px] text-slate-600 font-black uppercase tracking-[0.5em] mt-12">Seguridad AES-256 • 100% Privado</p>
    </div>
  );
};

export default BillUploader;
