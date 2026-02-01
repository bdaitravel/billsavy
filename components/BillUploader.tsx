
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
      
      // Aseguramos que el archivo se lea correctamente en móviles
      const base64Data = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const res = reader.result as string;
          resolve(res.split(',')[1]);
        };
        reader.onerror = () => reject("No se pudo leer el archivo");
        reader.readAsDataURL(selectedFile);
      });

      const data = await analyzeBillImage(base64Data, selectedFile.type);
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Error al leer el archivo. Intenta sacar una foto directamente.");
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

  const saveToHistory = () => {
    if (!result) return;
    onComplete({
      id: Math.random().toString(36).substr(2, 9),
      provider: result.provider,
      amount: result.amount,
      date: result.date,
      category: result.category as Category,
      assetId: assets[0]?.id || '1',
      description: result.billyAdvice,
      isRecurring: true,
      source: 'manual',
      auditStatus: result.priceRating === 'AVISO BILLY' ? 'ABUSIVO' : (result.priceRating === 'PRECIO TOP' ? 'OPTIMIZADO' : 'JUSTO'),
      auditDetail: result.action
    });
  };

  if (isScanning) {
    return (
      <div className="bg-slate-900 border border-teal-500/20 p-10 rounded-[3rem] w-full max-w-sm text-center animate-pop flex flex-col items-center justify-center min-h-[350px]">
        <div className="w-16 h-16 mb-6 relative">
          <div className="absolute inset-0 border-2 border-teal-500/10 rounded-full"></div>
          <div className="absolute inset-0 border-2 border-t-teal-400 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-2xl">🤖</div>
        </div>
        <h3 className="text-lg font-black text-white uppercase tracking-tighter">Billy está leyendo...</h3>
        <p className="text-[8px] text-teal-400 font-black uppercase tracking-widest mt-2 animate-pulse">Analizando precios y fechas</p>
      </div>
    );
  }

  if (result) {
    const isBadPrice = result.priceRating === 'AVISO BILLY';
    return (
      <div className="bg-slate-900 border border-white/10 p-8 rounded-[3rem] w-full max-w-sm animate-pop shadow-2xl max-h-[85vh] overflow-y-auto scrollbar-hide">
        <div className="text-center mb-6">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-xl ${isBadPrice ? 'bg-orange-500/20 text-orange-400' : 'bg-teal-500/20 text-teal-400'}`}>
            {isBadPrice ? '⚠️' : '✨'}
          </div>
          <h2 className={`text-md font-black uppercase tracking-widest ${isBadPrice ? 'text-orange-400' : 'text-teal-400'}`}>
            {result.priceRating}
          </h2>
        </div>

        <div className="space-y-4 mb-8">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[8px] font-black text-slate-500 uppercase">{result.category}</span>
              <span className="text-lg font-black text-white">{result.amount}€</span>
            </div>
            <p className="text-[10px] font-bold text-white uppercase truncate">{result.provider}</p>
          </div>

          <div className="bg-white/5 p-4 rounded-2xl border border-teal-500/10">
            <p className="text-[8px] font-black text-teal-400 uppercase mb-2">Consejo Billy:</p>
            <p className="text-[10px] text-slate-300 leading-relaxed italic mb-4">"{result.billyAdvice}"</p>
            <div className="h-px bg-white/5 w-full my-3"></div>
            <p className="text-[9px] text-white font-bold uppercase">📅 Renovar el: <span className="text-teal-400">{result.renewalDate}</span></p>
          </div>
        </div>

        <div className="space-y-3">
          <button onClick={saveToHistory} className="w-full py-4 bg-teal-500 text-slate-950 rounded-xl font-black text-[9px] uppercase tracking-widest">
            Guardar y Recordar
          </button>
          <button onClick={() => { setResult(null); setFile(null); }} className="w-full py-3 text-[8px] font-black text-slate-500 uppercase">
            Descartar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-white/10 p-8 rounded-[3rem] w-full max-w-sm text-center animate-pop relative shadow-2xl">
      <button onClick={onCancel} className="absolute top-6 left-6 text-slate-500 p-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
      </button>

      <div className="w-14 h-14 bg-teal-500/10 text-teal-400 rounded-full flex items-center justify-center mx-auto mb-6">📄</div>
      <h3 className="text-lg font-black mb-1 uppercase tracking-tighter text-white">Escáner de Gastos</h3>
      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-8 leading-relaxed px-2">
        Saca foto a tus facturas o pólizas. Billy vigila que no te suban el precio sin avisar.
      </p>
      
      <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
      
      <button 
        onClick={() => fileInputRef.current?.click()} 
        className="w-full py-12 border-2 border-dashed border-white/10 rounded-[2rem] text-[9px] font-black uppercase text-slate-500 bg-white/5 hover:border-teal-500/40 active:scale-95 transition-all"
      >
        Toca para sacar foto <br/> o subir PDF
      </button>
    </div>
  );
};

export default BillUploader;
