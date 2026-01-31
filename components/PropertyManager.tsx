
import React, { useState } from 'react';
import { Asset, AssetType } from '../types';

interface PropertyManagerProps {
  assets: Asset[];
  onAdd: (asset: Asset) => void;
}

const getAssetIcon = (type: AssetType) => {
  switch (type) {
    case AssetType.HOUSE: return <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />;
    case AssetType.VEHICLE_CAR: return <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 11V7a1 1 0 011-1h6l2 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2h1" />;
    case AssetType.INSURANCE_HOME:
    case AssetType.INSURANCE_AUTO: return <path d="M9 12l2 2 4-4m5.618-4.016A3.323 3.323 0 0010.605 8.9c5.135 5.407 8.394 12.23 8.394 12.23s-6.823-3.259-12.23-8.394a3.323 3.323 0 001.284-4.613z" />;
    default: return <path d="M20 12H4" />;
  }
};

const PropertyManager: React.FC<PropertyManagerProps> = ({ assets, onAdd }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Asset>>({ type: AssetType.HOUSE });

  const categories = [
    { title: 'Propiedades e Inmuebles', types: [AssetType.HOUSE, AssetType.COMMERCIAL, AssetType.STORAGE] },
    { title: 'Movilidad y Vehículos', types: [AssetType.VEHICLE_CAR, AssetType.VEHICLE_MOTO] },
    { title: 'Finanzas y Pasivos', types: [AssetType.CREDIT_CARD, AssetType.LOAN] },
    { title: 'Protección y Seguros', types: [AssetType.INSURANCE_HOME, AssetType.INSURANCE_MEDICAL, AssetType.INSURANCE_LIFE, AssetType.INSURANCE_AUTO] },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name || '',
      type: formData.type || AssetType.HOUSE,
      detail: formData.detail,
      provider: formData.provider,
      status: 'active'
    });
    setFormData({ type: AssetType.HOUSE });
    setStep(1);
    setShowAdd(false);
  };

  return (
    <div className="space-y-12">
      {categories.map(cat => (
        <div key={cat.title} className="space-y-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">{cat.title}</h2>
            <div className="h-px flex-1 bg-slate-100"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.filter(a => cat.types.includes(a.type)).map(asset => (
              <div key={asset.id} className="bg-white p-7 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group flex flex-col h-full ring-1 ring-slate-900/5">
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-slate-50 text-slate-700 border border-slate-100 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300`}>
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      {getAssetIcon(asset.type)}
                    </svg>
                  </div>
                  {asset.status === 'warning' && (
                    <span className="flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-emerald-700 transition-colors">{asset.name}</h3>
                  <p className="text-slate-400 text-sm font-medium mt-1 truncate">{asset.detail || 'Localización no definida'}</p>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{asset.type}</span>
                  {asset.provider && <span className="text-[10px] font-black text-emerald-600 uppercase px-2 py-1 bg-emerald-50 rounded-lg">{asset.provider}</span>}
                </div>
              </div>
            ))}
            
            <button 
              onClick={() => { setShowAdd(true); setStep(1); }}
              className="bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[2rem] p-7 flex flex-col items-center justify-center gap-4 text-slate-400 hover:bg-white hover:border-emerald-400 hover:text-emerald-600 hover:shadow-lg transition-all min-h-[220px]"
            >
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              </div>
              <span className="font-black text-sm uppercase tracking-wide">Vincular nuevo activo</span>
            </button>
          </div>
        </div>
      ))}

      {showAdd && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[3rem] p-10 max-w-2xl w-full shadow-2xl animate-fintech overflow-hidden">
            {step === 1 ? (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl font-black text-slate-900">¿Qué desea monitorizar?</h2>
                  <p className="text-slate-500 mt-2 font-medium">Categorizar correctamente tus activos permite a Billy detectar ahorros fiscales y de mercado.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.values(AssetType).map(t => (
                    <button 
                      key={t}
                      onClick={() => { setFormData({ ...formData, type: t }); setStep(2); }}
                      className="p-5 rounded-3xl border border-slate-100 bg-slate-50/50 hover:border-emerald-500 hover:bg-emerald-50 transition-all flex flex-col items-center gap-4 group"
                    >
                      <div className="w-12 h-12 flex items-center justify-center text-slate-400 group-hover:text-emerald-600 transition-colors">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>{getAssetIcon(t)}</svg>
                      </div>
                      <span className="text-[10px] font-black text-slate-600 text-center uppercase leading-tight group-hover:text-emerald-700">{t}</span>
                    </button>
                  ))}
                </div>
                <button onClick={() => setShowAdd(false)} className="w-full py-4 text-slate-400 font-bold hover:text-slate-900 transition-colors uppercase text-xs tracking-widest">Cerrar</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center gap-5 mb-8">
                   <div className="w-16 h-16 bg-slate-900 text-white rounded-3xl flex items-center justify-center">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">{getAssetIcon(formData.type!)}</svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">Configurar {formData.type}</h2>
                    <p className="text-sm text-slate-400 font-medium italic">Paso 2 de 2: Información técnica</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Alias del Activo</label>
                    <input 
                      required
                      placeholder="Ej. Piso Turístico, Mercedes Clase A..."
                      value={formData.name || ''}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-bold placeholder:font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Identificador / Dirección</label>
                    <input 
                      placeholder="Referencia o localización"
                      value={formData.detail || ''}
                      onChange={e => setFormData({...formData, detail: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Compañía Actual</label>
                    <input 
                      placeholder="Ej. Iberdrola, Línea Directa..."
                      value={formData.provider || ''}
                      onChange={e => setFormData({...formData, provider: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-bold"
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-10">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-200">Atrás</button>
                  <button type="submit" className="flex-[2] py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-emerald-200 hover:bg-emerald-700">Finalizar vinculación</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyManager;
