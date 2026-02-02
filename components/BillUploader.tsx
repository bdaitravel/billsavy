
import React, { useState, useRef } from 'react';
import { Asset, Category, Expense } from '../types';
import { analyzeBillImage } from '../services/geminiService';

interface BillUploaderProps {
  assets: Asset[];
  onComplete: (expense: Expense) => void;
  onCancel: () => void;
}

type ScanStatus = 'IDLE' | 'READING' | 'ANALYZING' | 'ERROR';

const BillUploader: React.FC<BillUploaderProps> = ({ assets, onComplete, onCancel }) => {
  const [status, setStatus] = useState<ScanStatus>('IDLE');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [selectedAssetId, setSelectedAssetId] = useState(assets[0]?.id || '1');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("[Billy UI] Archivo seleccionado:", file.name, file.type, file.size);
    setStatus('READING');
    setErrorMsg(null);

    const reader = new FileReader();
    
    reader.onload = async () => {
      try {
        const base64Raw = reader.result as string;
        const base64Data = base64Raw.split(',')[1];
        const mimeType = file.type || 'image/jpeg';

        console.log("[Billy UI] Archivo leído. Enviando a análisis...");
        setStatus('ANALYZING');
        
        const data = await analyzeBillImage(base64Data, mimeType);
        
        if (data) {
          setResult(data);
          setStatus('IDLE');
        } else {
          throw new Error("No se recibieron datos de la IA");
        }
      } catch (err: any) {
        console.error("[Billy UI] Fallo en el flujo:", err);
        setErrorMsg(err.message || "Error al procesar el documento");
        setStatus('ERROR');
      }
    };

    reader.onerror = () => {
      setErrorMsg("Error al leer el archivo desde el dispositivo");
      setStatus('ERROR');
    };

    reader.readAsDataURL(file);
    
    // Limpiamos el input para permitir re-selección
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const saveToHistory = () => {
    if (!result) return;
    onComplete({
      id: Math.random().toString(36).substr(2, 9),
      provider: result.provider || "Desconocido",
      amount: result.amount || 0,
      date: result.date || new Date().toLocaleDateString(),
      category: (result.category || "Otros") as Category,
      assetId: selectedAssetId,
      description: result.renewalDate ? `Renovación: ${result.renewalDate}` : "Sin fecha de renovación",
      isRecurring: true,
      source: 'manual',
      auditStatus: result.priceRating === 'AVISO BILLY' ? 'ABUSIVO' : 'OPTIMIZADO',
      auditDetail: result.billyAdvice || "Auditoría completada."
    });
  };

  if (status === 'READING' || status === 'ANALYZING') {
    return (
      <div className="bg-slate-900 border border-teal-500/30 p-12 rounded-[4rem] w-full max-w-sm text-center animate-pop flex flex-col items-center justify-center min-h-[480px] shadow-3xl">
        <div className="w-24 h-24 mb-10 relative">
          <div className="absolute inset-0 border-[4px] border-teal-500/10 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 border-[4px] border-t-teal-400 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-5xl">
            {status === 'READING' ? '📂' : '🤖'}
          </div>
        </div>
        <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">
          {status === 'READING' ? 'Leyendo...' : 'Billy Analizando'}
        </h3>
        <p className="text-[10px] text-teal-400 font-black uppercase tracking-[0.2em] animate-pulse">
          {status === 'READING' ? 'Preparando archivo' : 'Buscando datos clave'}
        </p>
      </div>
    );
  }

  if (status === 'ERROR') {
    return (
      <div className="bg-slate-900 border border-red-500/30 p-10 rounded-[4rem] w-full max-w-sm text-center animate-pop shadow-3xl">
        <div className="text-5xl mb-6">❌</div>
        <h3 className="text-lg font-black text-white uppercase mb-2">Error de lectura</h3>
        <p className="text-[11px] text-slate-400 mb-8 px-4 leading-relaxed">{errorMsg}</p>
        <button onClick={() => setStatus('IDLE')} className="w-full py-5 bg-white/5 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95">Reintentar</button>
        <button onClick={onCancel} className="mt-4 text-[8px] text-slate-600 font-black uppercase">Cerrar</button>
      </div>
    );
  }

  if (result) {
    return (
      <div className="bg-slate-900 border border-white/10 p-8 rounded-[4rem] w-full max-w-sm animate-pop shadow-3xl">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-teal-500/10 text-teal-400 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl border border-teal-500/20">✅</div>
          <h2 className="text-[9px] font-black uppercase text-slate-500 tracking-[0.4em]">DATOS EXTRAÍDOS</h2>
        </div>

        <div className="space-y-3 mb-8">
          <div className="bg-white/5 p-5 rounded-[2rem] border border-white/5">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[8px] font-black text-teal-400 uppercase">{result.category}</span>
              <span className="text-xl font-black text-white">{result.amount}€</span>
            </div>
            <p className="text-[14px] font-black text-white uppercase truncate">{result.provider}</p>
          </div>

          <div className="bg-slate-800/50 p-5 rounded-[2rem] border border-teal-500/10">
            <p className="text-[8px] text-slate-500 uppercase font-black mb-2">Vincular a:</p>
            <select 
              value={selectedAssetId}
              onChange={(e) => setSelectedAssetId(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-[10px] text-white font-bold uppercase"
            >
              {assets.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-3">
          <button onClick={saveToHistory} className="w-full py-6 bg-teal-500 text-slate-950 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-xl active:scale-95">Guardar en Auditoría</button>
          <button onClick={() => setResult(null)} className="w-full py-2 text-[8px] font-black text-slate-600 uppercase">Descartar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-white/10 p-10 rounded-[4.5rem] w-full max-w-sm text-center animate-pop relative shadow-3xl">
      <button onClick={onCancel} className="absolute top-10 left-10 text-slate-500 p-2 active:scale-90"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg></button>
      <div className="w-20 h-20 bg-teal-500/10 text-teal-400 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-teal-500/10"><span className="text-4xl">📄</span></div>
      <h3 className="text-2xl font-black mb-2 uppercase tracking-tighter text-white">Billy Escáner</h3>
      <p className="text-[10px] text-slate-400 font-bold uppercase mb-10 leading-relaxed px-4">Detectaremos proveedor, fecha e importe automáticamente.</p>
      <input type="file" accept="image/*,application/pdf" capture="environment" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
      <button onClick={() => fileInputRef.current?.click()} className="w-full py-16 border-2 border-dashed border-white/10 rounded-[3rem] text-[10px] font-black uppercase text-slate-500 bg-white/5 active:scale-95 flex flex-col items-center gap-4 hover:border-teal-500/40">
        <span className="text-4xl">📸</span>
        <span>Abrir Cámara o Archivo</span>
      </button>
    </div>
  );
};

export default BillUploader;
