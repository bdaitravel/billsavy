
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
  const [error, setError] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<Partial<Expense> | null>(null);
  const [selectedAssetId, setSelectedAssetId] = useState<string>(assets[0]?.id || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleScan = async () => {
    if (!file) return;
    setIsScanning(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64String = (reader.result as string).split(',')[1];
          const result = await analyzeBillImage(base64String);
          setScanResult({
            provider: result.provider,
            amount: result.amount,
            date: result.date,
            category: result.category as Category,
            expiryDate: result.expiryDate,
            description: result.summary || `Factura analizada de ${result.provider}`,
            source: 'manual'
          });
        } catch (err: any) {
          setError(err.message === "QUOTA_EXHAUSTED" 
            ? "Límite de cuota excedido. Billy está descansando." 
            : "No he podido procesar el documento. Asegúrate de que la foto sea clara o el PDF sea legible.");
        } finally {
          setIsScanning(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setIsScanning(false);
      setError("Error crítico en el motor de procesamiento.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanResult || !selectedAssetId) return;

    onComplete({
      ...scanResult as Expense,
      assetId: selectedAssetId,
      isRecurring: !!scanResult.expiryDate
    });
  };

  return (
    <div className="bg-white rounded-[3rem] border border-slate-200 shadow-xl p-10 max-w-2xl mx-auto">
        {!scanResult ? (
          <div className="text-center">
            <div className="mb-10">
              <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner border border-emerald-100">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-3xl font-black text-slate-900">Nueva Captura</h2>
              <p className="text-slate-500 mt-2 font-medium">Sube facturas en PDF, PNG o JPG. Billy extraerá los metadatos financieros automáticamente.</p>
            </div>

            {error && (
              <div className="mb-8 p-5 bg-rose-50 border border-rose-100 rounded-3xl text-rose-700 text-sm font-bold animate-fintech">
                {error}
              </div>
            )}

            <input 
              type="file" 
              accept="image/*,application/pdf" 
              onChange={handleFileChange} 
              className="hidden" 
              ref={fileInputRef} 
            />
            
            {!file ? (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-slate-50/50 hover:bg-white hover:shadow-2xl hover:border-emerald-500 border-2 border-dashed border-slate-200 py-20 rounded-[2.5rem] transition-all group"
              >
                <span className="text-slate-400 group-hover:text-emerald-600 font-black uppercase text-xs tracking-widest">Seleccionar Archivo</span>
              </button>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-6 bg-slate-900 text-white rounded-[2rem] shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center font-black">AI</div>
                    <span className="text-sm font-bold truncate max-w-[200px]">{file.name}</span>
                  </div>
                  <button onClick={() => setFile(null)} className="text-slate-400 hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                <button 
                  onClick={handleScan}
                  disabled={isScanning}
                  className="w-full bg-emerald-600 text-white py-6 rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-2xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isScanning ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Analizando con GPT-Engine...
                    </>
                  ) : "Iniciar Procesamiento IA"}
                </button>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8 animate-fintech">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-900">Validación de Datos</h2>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-lg">CONFIANZA 98%</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Vincular a Activo</label>
                <select 
                  value={selectedAssetId}
                  onChange={(e) => setSelectedAssetId(e.target.value)}
                  className="w-full border border-slate-200 bg-slate-50 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 outline-none"
                >
                  {assets.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Categoría Fiscal</label>
                <select 
                  value={scanResult.category}
                  onChange={(e) => setScanResult({...scanResult, category: e.target.value as Category})}
                  className="w-full border border-slate-200 bg-slate-50 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 outline-none"
                >
                  {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Proveedor del Servicio</label>
                <input 
                  value={scanResult.provider}
                  onChange={(e) => setScanResult({...scanResult, provider: e.target.value})}
                  className="w-full border border-slate-200 bg-slate-50 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Importe Neto (€)</label>
                <input 
                  type="number"
                  step="0.01"
                  value={scanResult.amount}
                  onChange={(e) => setScanResult({...scanResult, amount: parseFloat(e.target.value)})}
                  className="w-full border border-slate-200 bg-slate-50 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 outline-none"
                />
              </div>
            </div>
            <div className="flex gap-4 pt-8 border-t border-slate-100">
              <button type="button" onClick={() => setScanResult(null)} className="flex-1 py-4 bg-slate-100 text-slate-600 font-black uppercase text-xs tracking-widest rounded-2xl">Cancelar</button>
              <button type="submit" className="flex-[2] py-4 bg-emerald-600 text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl shadow-emerald-200 hover:bg-emerald-700">Confirmar e Incorporar</button>
            </div>
          </form>
        )}
    </div>
  );
};

export default BillUploader;
