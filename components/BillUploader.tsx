
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
  const [errorType, setErrorType] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [selectedAssetId, setSelectedAssetId] = useState(assets[0]?.id || '1');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleActivateKey = async () => {
    try {
      if (window.aistudio) {
        await window.aistudio.openSelectKey();
        setStatus('IDLE');
        setErrorType(null);
      }
    } catch (e) {
      console.error("Error al abrir selector de claves", e);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus('READING');
    setErrorType(null);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Data = (reader.result as string).split(',')[1];
        setStatus('ANALYZING');
        
        const data = await analyzeBillImage(base64Data, file.type);
        setResult(data);
        setStatus('IDLE');
      } catch (err: any) {
        console.error("Fallo en proceso:", err);
        setErrorType(err.message);
        setStatus('ERROR');
      }
    };

    reader.onerror = () => {
      setErrorType("FILE_READ_ERROR");
      setStatus('ERROR');
    };

    reader.readAsDataURL(file);
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
      description: result.renewalDate ? `Vence: ${result.renewalDate}` : "Auditado por Billy",
      isRecurring: true,
      source: 'manual',
      auditStatus: result.priceRating === 'AVISO BILLY' ? 'ABUSIVO' : 'OPTIMIZADO',
      auditDetail: result.billyAdvice || "Auditoría completada."
    });
  };

  if (status === 'READING' || status === 'ANALYZING') {
    return (
      <div className="bg-slate-900 border border-teal-500/30 p-12 rounded-[4rem] w-full max-w-sm text-center animate-pop flex flex-col items-center justify-center min-h-[520px] shadow-3xl">
        <div className="relative w-32 h-32 mb-12">
          <div className="absolute inset-0 border-[8px] border-teal-500/5 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 border-[8px] border-t-teal-400 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-6xl">🔍</div>
        </div>
        <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Analizando...</h3>
        <p className="text-[10px] text-teal-400 font-black uppercase tracking-[0.4em] animate-pulse">
          {status === 'READING' ? 'Cargando archivo' : 'Billy está auditando'}
        </p>
      </div>
    );
  }

  if (status === 'ERROR') {
    const isKeyError = errorType === 'API_KEY_MISSING' || errorType === 'API_KEY_INVALID';
    return (
      <div className="bg-slate-900 border border-red-500/30 p-10 rounded-[4rem] w-full max-w-sm text-center animate-pop shadow-3xl">
        <div className="text-6xl mb-8">{isKeyError ? '🔑' : '⚠️'}</div>
        <h3 className="text-xl font-black text-white uppercase mb-4">
          {isKeyError ? 'Falta Conexión IA' : '¡Billy se ha liado!'}
        </h3>
        <p className="text-[12px] text-slate-400 mb-10 px-6 leading-relaxed font-bold uppercase tracking-wider">
          {isKeyError 
            ? "Para que Billy pueda auditar tus facturas, necesitas activar la conexión con el servidor de inteligencia." 
            : "No he podido leer ese archivo. Prueba a subir uno más claro o un PDF."}
        </p>
        
        {isKeyError ? (
          <div className="space-y-4">
            <button 
              onClick={handleActivateKey} 
              className="w-full py-6 bg-teal-500 text-slate-950 rounded-3xl font-black text-[11px] uppercase tracking-widest shadow-xl active:scale-95"
            >
              Activar Billy AI
            </button>
            <p className="text-[8px] text-slate-600 font-bold uppercase tracking-widest underline decoration-slate-800">
              Requiere cuenta en ai.google.dev
            </p>
          </div>
        ) : (
          <button 
            onClick={() => setStatus('IDLE')} 
            className="w-full py-6 bg-white/10 text-white rounded-3xl font-black text-[11px] uppercase tracking-widest active:scale-95"
          >
            Reintentar Subida
          </button>
        )}
        <button onClick={onCancel} className="mt-8 text-[9px] text-slate-600 font-black uppercase tracking-widest">Cerrar</button>
      </div>
    );
  }

  if (result) {
    return (
      <div className="bg-slate-900 border border-white/10 p-8 rounded-[4rem] w-full max-w-sm animate-pop shadow-3xl">
        <div className="text-center mb-10">
          <div className="w-24 h-24 bg-teal-500/10 text-teal-400 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 text-5xl border border-teal-500/20 shadow-2xl">✨</div>
          <h2 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.5em]">AUDITORÍA LISTA</h2>
        </div>

        <div className="space-y-4 mb-10">
          <div className="bg-white/5 p-6 rounded-[2.5rem] border border-white/5 shadow-inner">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest">{result.category}</span>
              <span className="text-4xl font-black text-white">{result.amount}€</span>
            </div>
            <p className="text-[18px] font-black text-white uppercase truncate">{result.provider}</p>
          </div>

          <div className="bg-slate-800/50 p-6 rounded-[2.5rem] border border-teal-500/10">
            <p className="text-[9px] text-slate-500 uppercase font-black text-center mb-3 tracking-widest">Vincular a:</p>
            <select 
              value={selectedAssetId}
              onChange={(e) => setSelectedAssetId(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-[12px] text-white font-bold uppercase appearance-none text-center outline-none focus:border-teal-500/40"
            >
              {assets.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>

          <div className="bg-orange-500/5 p-6 rounded-[2.5rem] border border-orange-500/20">
             <p className="text-[12px] text-white italic text-center font-bold leading-relaxed">
               Billy dice: "{result.billyAdvice}"
             </p>
          </div>
        </div>

        <div className="space-y-4">
          <button onClick={saveToHistory} className="w-full py-7 bg-teal-500 text-slate-950 rounded-[2.5rem] font-black text-[13px] uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all">
            Guardar Auditoría
          </button>
          <button onClick={() => setResult(null)} className="w-full py-2 text-[10px] font-black text-slate-600 uppercase tracking-widest">
            Descartar Datos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-white/10 p-12 rounded-[5rem] w-full max-w-sm text-center animate-pop relative shadow-3xl">
      <button onClick={onCancel} className="absolute top-12 left-12 text-slate-500 p-2 active:scale-90 transition-all">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
      </button>

      <div className="w-28 h-28 bg-teal-500/10 text-teal-400 rounded-[3rem] flex items-center justify-center mx-auto mb-10 shadow-2xl border border-teal-500/10">
        <span className="text-6xl">📑</span>
      </div>
      
      <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter text-white">Billy Escáner</h3>
      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-12 leading-relaxed px-4">
        Sube el PDF de tu contrato<br/>o haz una foto a la factura.
      </p>
      
      {/* CORRECCIÓN: accept sin capture para permitir navegar por archivos/nube */}
      <input 
        type="file" 
        accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" 
        onChange={handleFileChange} 
        ref={fileInputRef} 
        className="hidden" 
      />
      
      <button 
        onClick={() => fileInputRef.current?.click()} 
        className="w-full py-20 border-2 border-dashed border-teal-500/20 rounded-[4rem] text-[12px] font-black uppercase text-teal-400 bg-teal-500/5 active:scale-95 transition-all flex flex-col items-center gap-6 group hover:border-teal-500/50 hover:bg-teal-500/10"
      >
        <span className="text-6xl group-hover:scale-110 transition-transform">📂</span>
        <span className="tracking-[0.3em]">Abrir Archivos<br/>o Galería</span>
      </button>

      <div className="mt-12 flex flex-col gap-2">
        <p className="text-[8px] text-slate-600 font-black uppercase tracking-[0.5em]">Soporta PDF, JPG, PNG</p>
        {!process.env.API_KEY && (
          <button 
            onClick={handleActivateKey}
            className="text-[8px] text-teal-500 font-black uppercase tracking-widest border border-teal-500/20 px-4 py-2 rounded-full inline-block mx-auto mt-4"
          >
            Activar Conexión IA ⚡
          </button>
        )}
      </div>
    </div>
  );
};

export default BillUploader;
