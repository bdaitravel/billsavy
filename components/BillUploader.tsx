
import React, { useState, useRef } from 'react';
import { Asset, Category, Expense, AuditStatus } from '../types';
import { analyzeBillImage } from '../services/geminiService';

interface BillUploaderProps {
  assets: Asset[];
  onComplete: (expense: Expense) => void;
  onCancel: () => void;
}

const BillUploader: React.FC<BillUploaderProps> = ({ assets, onComplete, onCancel }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [auditResult, setAuditResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleScan = async () => {
    if (!file) return;
    setIsScanning(true);
    
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const resultBase64 = reader.result as string;
        const base64Data = resultBase64.split(',')[1];
        const result = await analyzeBillImage(base64Data, file.type);
        setAuditResult(result);
      } catch (err) {
        console.error("Error analizando:", err);
        alert("Billy no pudo procesar este documento. Inténtalo con otra foto más clara.");
      } finally {
        setIsScanning(false);
      }
    };
    reader.onerror = () => {
      alert("Error al leer el archivo.");
      setIsScanning(false);
    };
    reader.readAsDataURL(file);
  };

  const confirmAndSave = () => {
    if (!auditResult) return;
    onComplete({
      id: Math.random().toString(36).substr(2, 9),
      provider: auditResult.provider,
      amount: auditResult.amount,
      date: auditResult.date,
      category: auditResult.category as Category,
      assetId: assets[0]?.id || '1',
      description: auditResult.summary || '',
      isRecurring: true,
      source: 'manual',
      auditStatus: auditResult.auditStatus as AuditStatus,
      auditDetail: auditResult.auditDetail
    });
  };

  if (auditResult) {
    const isAbusive = auditResult.auditStatus === 'ABUSIVO';
    return (
      <div className="bg-slate-900 border border-white/10 p-8 rounded-[3rem] w-full max-w-md animate-pop shadow-2xl max-h-[85vh] overflow-y-auto">
        <div className="text-center mb-6">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-2xl ${isAbusive ? 'bg-red-500/20 text-red-500 shadow-red-500/20' : 'bg-teal-500/20 text-teal-500 shadow-teal-500/20'}`}>
            {isAbusive ? '⚖️' : '🛡️'}
          </div>
          <h2 className={`text-xl font-black uppercase tracking-tighter ${isAbusive ? 'text-red-500' : 'text-teal-400'}`}>
            DICTAMEN: {auditResult.auditStatus}
          </h2>
        </div>

        <div className="space-y-4 mb-8">
          <div className="bg-white/5 p-5 rounded-3xl border border-white/5">
            <div className="flex justify-between items-center mb-2">
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{auditResult.category}</span>
               <span className="text-xl font-black text-white">{auditResult.amount}€</span>
            </div>
            <p className="text-[11px] font-bold text-white uppercase truncate">{auditResult.provider}</p>
            <p className="text-[8px] text-slate-500 font-bold uppercase mt-1">{auditResult.date}</p>
          </div>

          <div className="bg-slate-800/50 p-6 rounded-3xl border border-white/5">
            <span className="text-[8px] font-black text-teal-400 uppercase block mb-2 tracking-widest">Análisis del Abogado IA:</span>
            <p className="text-[11px] text-slate-300 leading-relaxed mb-4">"{auditResult.auditDetail}"</p>
            <div className="h-px bg-white/5 w-full my-4"></div>
            <span className="text-[8px] font-black text-orange-400 uppercase block mb-2 tracking-widest">Plan de Acción:</span>
            <p className="text-[11px] text-white font-bold italic leading-relaxed">"💡 {auditResult.actionPlan}"</p>
          </div>
        </div>

        <div className="space-y-3">
          <button onClick={confirmAndSave} className="w-full py-5 bg-teal-500 text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all">
            Validar y Guardar
          </button>
          <button onClick={() => { setAuditResult(null); setFile(null); }} className="w-full py-3 text-[9px] font-black text-slate-500 uppercase tracking-widest">
            Descartar Auditoría
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-white/10 p-8 rounded-[3rem] w-full max-w-md text-center animate-pop relative shadow-2xl">
      <button onClick={onCancel} className="absolute top-6 left-6 text-slate-500 p-2">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
      </button>

      <div className="w-16 h-16 bg-teal-500/10 text-teal-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(45,212,191,0.2)]">📸</div>
      <h3 className="text-xl font-black mb-2 uppercase tracking-tighter text-white">Auditoría Billy IA</h3>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-8 leading-relaxed px-4">
        Analizamos tus contratos buscando cláusulas abusivas y precios fuera de mercado.
      </p>
      
      <input 
        type="file" 
        accept="image/*,application/pdf" 
        onChange={handleFileChange} 
        ref={fileInputRef} 
        className="hidden" 
      />
      
      {!file ? (
        <button 
          onClick={() => fileInputRef.current?.click()} 
          className="w-full py-16 border-2 border-dashed border-white/10 rounded-[2.5rem] text-[10px] font-black uppercase text-slate-500 bg-white/5 active:scale-95 transition-all hover:border-teal-500/30 hover:bg-teal-500/5"
        >
          Toca para sacar foto <br/> o subir documento
        </button>
      ) : (
        <div className="space-y-4">
          <div className="p-5 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between">
            <span className="text-[10px] text-teal-400 font-bold uppercase truncate max-w-[200px]">{file.name}</span>
            <button onClick={() => setFile(null)} className="text-red-500 font-black text-xs">ELIMINAR</button>
          </div>
          <button 
            onClick={handleScan} 
            disabled={isScanning} 
            className="w-full py-5 bg-teal-500 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 disabled:opacity-50"
          >
            {isScanning ? 'Billy analizando leyes...' : 'Iniciar Auditoría Senior'}
          </button>
        </div>
      )}
    </div>
  );
};

export default BillUploader;
