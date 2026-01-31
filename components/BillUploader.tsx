
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
            description: result.summary || `Factura de ${result.provider}`
          });
        } catch (err: any) {
          if (err.message === "QUOTA_EXHAUSTED") {
            setError("¡Uff! Billy está agotado por hoy (límite de cuota excedido). Intenta subir los datos manualmente o espera unos minutos.");
          } else {
            setError("No he podido leer la factura correctamente. ¿Puedes intentarlo con otra foto o rellenar los datos?");
          }
        } finally {
          setIsScanning(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setIsScanning(false);
      setError("Error al procesar la imagen.");
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
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 max-w-2xl mx-auto">
        {!scanResult ? (
          <div className="text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Escanear Factura</h2>
              <p className="text-slate-500 mt-2">Sube una foto de tu factura y deja que nuestra IA trabaje.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium animate-fade">
                {error}
              </div>
            )}

            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className="hidden" 
              ref={fileInputRef} 
            />
            
            {!file ? (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-slate-50 hover:bg-slate-100 text-slate-500 border-2 border-dashed border-slate-300 py-16 rounded-2xl transition-all font-bold text-lg"
              >
                Haga clic para seleccionar archivo
              </button>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm font-bold text-emerald-800">{file.name}</span>
                  </div>
                  <button onClick={() => setFile(null)} className="text-slate-400 hover:text-red-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <button 
                  onClick={handleScan}
                  disabled={isScanning}
                  className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isScanning ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Escaneando con IA...
                    </>
                  ) : "Analizar con Gemini"}
                </button>
                {error && (
                   <button 
                    onClick={() => setScanResult({ provider: '', amount: 0, date: new Date().toISOString().split('T')[0], category: Category.OTHER })}
                    className="w-full bg-slate-100 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all"
                  >
                    Introducir datos manualmente
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Confirmar Detalles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Activo</label>
                <select 
                  value={selectedAssetId}
                  onChange={(e) => setSelectedAssetId(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  {assets.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Categoría</label>
                <select 
                  value={scanResult.category}
                  onChange={(e) => setScanResult({...scanResult, category: e.target.value as Category})}
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Proveedor</label>
                <input 
                  value={scanResult.provider}
                  onChange={(e) => setScanResult({...scanResult, provider: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Importe (€)</label>
                <input 
                  type="number"
                  step="0.01"
                  value={scanResult.amount}
                  onChange={(e) => setScanResult({...scanResult, amount: parseFloat(e.target.value)})}
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Fecha</label>
                <input 
                  type="date"
                  value={scanResult.date}
                  onChange={(e) => setScanResult({...scanResult, date: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Renovación</label>
                <input 
                  type="date"
                  value={scanResult.expiryDate || ''}
                  onChange={(e) => setScanResult({...scanResult, expiryDate: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>
            <div className="flex gap-4 pt-6 border-t border-slate-100">
              <button type="button" onClick={() => setScanResult(null)} className="flex-1 bg-slate-100 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors">Volver</button>
              <button type="submit" className="flex-[2] bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all">Guardar</button>
            </div>
          </form>
        )}
    </div>
  );
};

export default BillUploader;
