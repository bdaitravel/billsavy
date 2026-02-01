
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
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (selectedFile: File) => {
    setIsScanning(true);
    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const res = reader.result as string;
          resolve(res.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(selectedFile);
      });

      const base64Data = await base64Promise;
      const data = await analyzeBillImage(base64Data, selectedFile.type);
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Billy no pudo leer el documento. Intenta con una foto más nítida.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      processFile(selectedFile);
    }
  };

  const saveExpense = () => {
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
      auditStatus: result.status.includes('AVISO') ? 'ABUSIVO' : (result.status === 'OPTIMIZADO' ? 'OPTIMIZADO' : 'JUSTO'),
      auditDetail: result.billyTip
    });
  };

  if (isScanning) {
    return (
      <div className="bg-slate-900 border border-teal-500/20 p-10 rounded-[3rem] w-full max-w-md text-center animate-pop flex flex-col items-center justify-center min-h-[400px] shadow-2xl">
        <div className="w-20 h-20 mb-8 relative">
          <div className="absolute inset-0 border-4 border-teal-500/10 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-teal-400 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-3xl">🤖</div>
        </div>
        <h3 className="text-xl font-black text-white uppercase tracking-tighter">Billy está analizando...</h3>
        <p className="text-[10px] text-teal-400 font-bold uppercase tracking-widest mt-2 animate-pulse">Organizando tus recordatorios</p>
      </div>
    );
  }

  if (result) {
    const isAlert = result.status.includes('AVISO');
    return (
      <div className="bg-slate-900 border border-white/10 p-8 rounded-[3rem] w-full max-w-md animate-pop shadow-2xl max-h-[80vh] overflow-y-auto scrollbar-hide">
        <div className="text-center mb-6">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl shadow-xl ${isAlert ? 'bg-orange-500/20 text-orange-500' : 'bg-teal-500/20 text-teal-500'}`}>
            {isAlert ? '⚠️' : '✅'}
          </div>
          <h2 className={`text-lg font-black uppercase tracking-tighter ${isAlert ? 'text-orange-400' : 'text-teal-400'}`}>
            {result.status}
          </h2>
        </div>

        <div className="space-y-4 mb-8">
          <div className="bg-white/5 p-5 rounded-3xl border border-white/5">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{result.category}</span>
              <span className="text-xl font-black text-white">{result.amount}€</span>
            </div>
            <p className="text-[11px] font-bold text-white uppercase truncate mb-3">{result.provider}</p>
            <div className="flex items-center gap-2 bg-slate-800/80 p-3 rounded-2xl border border-white/5">
              <span className="text-lg">📅</span>
              <div>
                <p className="text-[8px] font-black text-slate-500 uppercase">Próxima Renovación</p>
                <p className="text-[10px] font-bold text-teal-400 uppercase">{result.renewalDate}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 p-6 rounded-3xl border border-white/5">
            <span className="text-[8px] font-black text-teal-400 uppercase block mb-2 tracking-widest">Consejo de Billy:</span>
            <p className="text-[11px] text-slate-300 leading-relaxed mb-4 italic">"{result.billyTip}"</p>
            <div className="h-px bg-white/5 w-full my-4"></div>
            <p className="text-[10px] text-white font-bold uppercase tracking-widest">💡 {result.action}</p>
          </div>
        </div>

        <div className="space-y-3">
          <button onClick={saveExpense} className="w-full py-5 bg-teal-500 text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all">
            Guardar Recordatorio
          </button>
          <button onClick={() => { setResult(null); setFile(null); }} className="w-full py-3 text-[9px] font-black text-slate-500 uppercase tracking-widest">
            Cancelar
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

      <div className="w-16 h-16 bg-teal-500/10 text-teal-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">📄</div>
      <h3 className="text-xl font-black mb-2 uppercase tracking-tighter text-white">Gestor de Gastos</h3>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-8 leading-relaxed px-4">
        Sube tus contratos de Hogar, Coche o Moto. Billy se encarga de que no pagues de más.
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
        className="w-full py-16 border-2 border-dashed border-white/10 rounded-[2.5rem] text-[10px] font-black uppercase text-slate-500 bg-white/5 active:scale-95 transition-all hover:border-teal-500/40"
      >
        Haz una foto o sube un PDF
      </button>
    </div>
  );
};

export default BillUploader;
