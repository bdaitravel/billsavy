
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

    // Feedback inmediato de que algo está pasando
    console.log("[Billy UI] Procesando:", file.name);
    setStatus('READING');
    setErrorMsg(null);

    const reader = new FileReader();
    
    reader.onload = async () => {
      try {
        const base64Raw = reader.result as string;
        const base64Data = base64Raw.split(',')[1];
        const mimeType = file.type || 'image/jpeg';

        console.log("[Billy UI] Enviando a IA...");
        setStatus('ANALYZING');
        
        const data = await analyzeBillImage(base64Data, mimeType);
        
        if (data && data.provider) {
          setResult(data);
          setStatus('IDLE');
        } else {
          throw new Error("No he podido extraer datos. Prueba con una imagen más clara.");
        }
      } catch (err: any) {
        console.error("[Billy UI] Error:", err);
        setErrorMsg(err.message || "Error al procesar el documento");
        setStatus('ERROR');
      }
    };

    reader.onerror = () => {
      setErrorMsg("Error al leer el archivo del dispositivo");
      setStatus('ERROR');
    };

    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const saveToHistory = () => {
    if (!result) return;
    onComplete({
      id: Math.random().toString(36).substr(2, 9),
      provider: result.provider || "Proveedor",
      amount: result.amount || 0,
      date: result.date || new Date().toLocaleDateString(),
      category: (result.category || "Otros") as Category,
      assetId: selectedAssetId,
      description: result.renewalDate ? `Vence: ${result.renewalDate}` : "Auditado por Billy",
      isRecurring: true,
      source: 'manual',
      auditStatus: result.priceRating === 'AVISO BILLY' ? 'ABUSIVO' : 'OPTIMIZADO',
      auditDetail: result.billyAdvice || "Auditoría completada satisfactoriamente."
    });
  };

  if (status === 'READING' || status === 'ANALYZING') {
    return (
      <div className="bg-slate-900 border border-teal-500/30 p-12 rounded-[4rem] w-full max-w-sm text-center animate-pop flex flex-col items-center justify-center min-h-[500px] shadow-3xl">
        <div className="w-28 h-28 mb-12 relative">
          <div className="absolute inset-0 border-[6px] border-teal-500/10 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 border-[6px] border-t-teal-400 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-5xl">🤖</div>
        </div>
        <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">
          Billy está leyendo...
        </h3>
        <p className="text-[10px] text-teal-400 font-black uppercase tracking-[0.3em] animate-pulse">
          Analizando cada cláusula e importe
        </p>
      </div>
    );
  }

  if (status === 'ERROR') {
    return (
      <div className="bg-slate-900 border border-red-500/30 p-10 rounded-[4rem] w-full max-w-sm text-center animate-pop shadow-3xl">
        <div className="text-6xl mb-8">⚠️</div>
        <h3 className="text-xl font-black text-white uppercase mb-4">¡Billy se ha liado!</h3>
        <p className="text-[12px] text-slate-400 mb-8 px-6 leading-relaxed font-medium">{errorMsg}</p>
        <button onClick={() => setStatus('IDLE')} className="w-full py-6 bg-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95">Reintentar</button>
        <button onClick={onCancel} className="mt-6 text-[9px] text-slate-600 font-black uppercase tracking-widest">Cancelar</button>
      </div>
    );
  }

  if (result) {
    return (
      <div className="bg-slate-900 border border-white/10 p-8 rounded-[4rem] w-full max-w-sm animate-pop shadow-3xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-teal-500/10 text-teal-400 rounded-3xl flex items-center justify-center mx-auto mb-4 text-4xl border border-teal-500/20">✨</div>
          <h2 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em]">FACTURA ANALIZADA</h2>
        </div>

        <div className="space-y-4 mb-10">
          <div className="bg-white/5 p-6 rounded-[2.5rem] border border-white/5 shadow-inner">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[9px] font-black text-teal-400 uppercase tracking-widest">{result.category}</span>
              <span className="text-3xl font-black text-white">{result.amount}€</span>
            </div>
            <p className="text-[16px] font-black text-white uppercase truncate">{result.provider}</p>
          </div>

          <div className="bg-slate-800/50 p-6 rounded-[2.5rem] border border-teal-500/10">
            <p className="text-[9px] text-slate-500 uppercase font-black text-center mb-3 tracking-widest">Vincular a propiedad:</p>
            <select 
              value={selectedAssetId}
              onChange={(e) => setSelectedAssetId(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-[11px] text-white outline-none font-bold uppercase appearance-none text-center"
            >
              {assets.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>

          <div className="bg-orange-500/5 p-6 rounded-[2.5rem] border border-orange-500/20">
             <p className="text-[9px] text-orange-400 uppercase font-black text-center mb-1">Billy Tip</p>
             <p className="text-[12px] text-white italic text-center font-medium leading-relaxed">"{result.billyAdvice}"</p>
          </div>
        </div>

        <div className="space-y-4">
          <button onClick={saveToHistory} className="w-full py-7 bg-teal-500 text-slate-950 rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all">
            Confirmar Registro
          </button>
          <button onClick={() => setResult(null)} className="w-full py-2 text-[9px] font-black text-slate-600 uppercase tracking-widest">
            Descartar
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

      <div className="w-24 h-24 bg-teal-500/10 text-teal-400 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl border border-teal-500/10">
        <span className="text-5xl">📂</span>
      </div>
      
      <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter text-white leading-none">Subir Factura</h3>
      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.1em] mb-12 leading-relaxed px-6">
        Admite Fotos de cámara,<br/>Galeria o documentos PDF.
      </p>
      
      {/* ELIMINADO capture="environment" para permitir selección de archivos */}
      <input 
        type="file" 
        accept="image/*,application/pdf" 
        onChange={handleFileChange} 
        ref={fileInputRef} 
        className="hidden" 
      />
      
      <button 
        onClick={() => fileInputRef.current?.click()} 
        className="w-full py-24 border-2 border-dashed border-teal-500/20 rounded-[3.5rem] text-[11px] font-black uppercase text-teal-400 bg-teal-500/5 active:scale-95 transition-all flex flex-col items-center gap-6 group hover:border-teal-500/50"
      >
        <span className="text-6xl group-hover:scale-110 transition-transform">📄</span>
        <span className="tracking-[0.2em]">Seleccionar Archivo<br/>o Hacer Foto</span>
      </button>

      <p className="text-[8px] text-slate-600 font-black uppercase tracking-[0.5em] mt-12">Soporte total: PDF, JPG, PNG</p>
    </div>
  );
};

export default BillUploader;
