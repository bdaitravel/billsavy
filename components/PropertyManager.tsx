
import React, { useState } from 'react';
import { Asset, AssetType } from '../types';

interface PropertyManagerProps {
  assets: Asset[];
  onAdd: (asset: Asset) => void;
}

const getAssetIcon = (type: AssetType) => {
  switch (type) {
    case AssetType.HOUSE: return <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />;
    case AssetType.COMMERCIAL: return <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1" />;
    case AssetType.STORAGE: return <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />;
    case AssetType.VEHICLE_CAR: return <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 11V7a1 1 0 011-1h6l2 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2h1" />;
    case AssetType.VEHICLE_MOTO: return <path d="M5 16l4-2m4 2l4-2m-2-4a2 2 0 11-4 0 2 2 0 014 0z" />;
    case AssetType.CREDIT_CARD: return <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />;
    case AssetType.INSURANCE_HOME:
    case AssetType.INSURANCE_LIFE:
    case AssetType.INSURANCE_MEDICAL:
    case AssetType.INSURANCE_AUTO: return <path d="M9 12l2 2 4-4m5.618-4.016A3.323 3.323 0 0010.605 8.9c5.135 5.407 8.394 12.23 8.394 12.23s-6.823-3.259-12.23-8.394a3.323 3.323 0 001.284-4.613z" />;
    default: return <path d="M20 12H4" />;
  }
};

const getAssetColor = (type: AssetType) => {
  if (type.includes('INSURANCE')) return 'bg-amber-50 text-amber-600 border-amber-100';
  if (type.includes('VEHICLE')) return 'bg-purple-50 text-purple-600 border-purple-100';
  if (type === AssetType.CREDIT_CARD) return 'bg-rose-50 text-rose-600 border-rose-100';
  return 'bg-blue-50 text-blue-600 border-blue-100';
};

const PropertyManager: React.FC<PropertyManagerProps> = ({ assets, onAdd }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Asset>>({ type: AssetType.HOUSE });

  const categories = [
    { title: 'Inmuebles', types: [AssetType.HOUSE, AssetType.COMMERCIAL, AssetType.STORAGE] },
    { title: 'Movilidad', types: [AssetType.VEHICLE_CAR, AssetType.VEHICLE_MOTO] },
    { title: 'Finanzas', types: [AssetType.CREDIT_CARD, AssetType.LOAN] },
    { title: 'Seguros', types: [AssetType.INSURANCE_HOME, AssetType.INSURANCE_MEDICAL, AssetType.INSURANCE_LIFE, AssetType.INSURANCE_AUTO] },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name || '',
      type: formData.type || AssetType.HOUSE,
      detail: formData.detail,
      limit: formData.limit,
      provider: formData.provider
    });
    setFormData({});
    setStep(1);
    setShowAdd(false);
  };

  return (
    <div className="space-y-10">
      {categories.map(cat => (
        <div key={cat.title} className="space-y-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-1">{cat.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.filter(a => cat.types.includes(a.type)).map(asset => (
              <div key={asset.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all group relative overflow-hidden">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${getAssetColor(asset.type)}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    {getAssetIcon(asset.type)}
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-800">{asset.name}</h3>
                <p className="text-slate-400 text-sm mt-1 truncate">{asset.detail || 'Sin detalles'}</p>
                {asset.provider && <p className="text-[10px] font-bold text-emerald-600 mt-3 uppercase tracking-tighter bg-emerald-50 w-fit px-2 py-0.5 rounded-md">{asset.provider}</p>}
              </div>
            ))}
            
            <button 
              onClick={() => { setShowAdd(true); setStep(1); }}
              className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] p-6 flex flex-col items-center justify-center gap-3 text-slate-400 hover:bg-white hover:border-emerald-400 hover:text-emerald-500 transition-all min-h-[160px]"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              <span className="font-bold text-sm">Añadir a {cat.title}</span>
            </button>
          </div>
        </div>
      ))}

      {showAdd && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[3rem] p-10 max-w-2xl w-full shadow-2xl animate-fade overflow-hidden">
            {step === 1 ? (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl font-extrabold text-slate-900">¿Qué quieres añadir?</h2>
                  <p className="text-slate-500 mt-2">BillSavy te ayudará a optimizar sus costes</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.values(AssetType).map(t => (
                    <button 
                      key={t}
                      onClick={() => { setFormData({ ...formData, type: t }); setStep(2); }}
                      className="p-4 rounded-3xl border-2 border-slate-50 hover:border-emerald-500 hover:bg-emerald-50 transition-all flex flex-col items-center gap-3 group"
                    >
                      <div className="w-10 h-10 flex items-center justify-center text-slate-400 group-hover:text-emerald-600 transition-colors">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>{getAssetIcon(t)}</svg>
                      </div>
                      <span className="text-[10px] font-bold text-slate-600 text-center uppercase leading-tight">{t}</span>
                    </button>
                  ))}
                </div>
                <button onClick={() => setShowAdd(false)} className="w-full py-4 text-slate-400 font-bold hover:text-slate-600">Cancelar</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                   <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">{getAssetIcon(formData.type!)}</svg>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Detalles de {formData.type}</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Nombre Personalizado</label>
                    <input 
                      required
                      placeholder="Ej. Mi Casa, Tarjeta Viajes, Seguro Moto..."
                      value={formData.name || ''}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 focus:ring-4 focus:ring-emerald-100 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">
                      {formData.type?.includes('VEHICLE') ? 'Modelo/Matrícula' : formData.type === AssetType.CREDIT_CARD ? 'Últimos 4 dígitos' : 'Dirección/Detalle'}
                    </label>
                    <input 
                      placeholder="..."
                      value={formData.detail || ''}
                      onChange={e => setFormData({...formData, detail: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 focus:ring-4 focus:ring-emerald-100 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Entidad/Compañía</label>
                    <input 
                      placeholder="Ej. BBVA, Iberdrola, Mapfre..."
                      value={formData.provider || ''}
                      onChange={e => setFormData({...formData, provider: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 focus:ring-4 focus:ring-emerald-100 outline-none"
                    />
                  </div>
                  {formData.type === AssetType.CREDIT_CARD && (
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Límite de la Tarjeta (€)</label>
                      <input 
                        type="number"
                        placeholder="Ej. 3000"
                        value={formData.limit || ''}
                        onChange={e => setFormData({...formData, limit: parseFloat(e.target.value)})}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 focus:ring-4 focus:ring-emerald-100 outline-none"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-4 mt-8">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold">Atrás</button>
                  <button type="submit" className="flex-[2] py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-xl shadow-emerald-200">Añadir a BillSavy</button>
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
