
import React, { useState, useRef } from 'react';
import { Asset, Category, Expense } from '../types';
import { analyzeBillImage } from '../services/geminiService';

interface BillUploaderProps {
  assets: Asset[];
  onComplete: (expense: Expense) => void;
}

const BillUploader: React.FC<BillUploaderProps> = ({ assets, onComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleScan = async () => {
    if (!file) return;
    setIsScanning(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64String = (reader.result as string).split(',')[1];
        const result = await analyzeBillImage(base64String);
        onComplete({
          id: Math.random().toString(),
          provider: result.provider,
          amount: result.amount,
          date: result.date,
          category: result.category as Category,
          assetId: assets[0]?.id,
          description: result.summary,
          isRecurring: true,
          source: 'manual'
        });
      } catch (err) {
        alert("Error analizando factura.");
      } finally {
        setIsScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] w-full max-w-md text-center animate-pop">
      <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">📸</div>
      <h3 className="text-xl font-black mb-2 uppercase">Subir Documento</h3>
      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-8 leading-relaxed">Saca una foto o sube un PDF para que Billy lo analice.</p>
      
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} ref={fileInputRef} className="hidden" />
      
      {!file ? (
        <button onClick={() => fileInputRef.current?.click()} className="w-full py-10 border-2 border-dashed border-white/10 rounded-3xl text-[10px] font-black uppercase text-slate-400 hover:border-emerald-500 transition-all">
          Seleccionar Archivo
        </button>
      ) : (
        <button 
          onClick={handleScan}
          disabled={isScanning}
          className="w-full py-4 bg-emerald-600 rounded-2xl font-black text-xs uppercase tracking-widest disabled:opacity-50"
        >
          {isScanning ? 'Procesando...' : 'Iniciar Análisis IA'}
        </button>
      )}
    </div>
  );
};

export default BillUploader;
