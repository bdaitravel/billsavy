
import React, { useState } from 'react';
import { Asset, AssetType } from '../types';

interface PropertyManagerProps {
  assets: Asset[];
  onAdd: (asset: Asset) => void;
}

const PropertyManager: React.FC<PropertyManagerProps> = ({ assets, onAdd }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState<Partial<Asset>>({ type: AssetType.HOUSE });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name || 'Nuevo Activo',
      type: formData.type || AssetType.HOUSE,
      status: 'active'
    });
    setShowAdd(false);
  };

  const getTypeIcon = (type: AssetType) => {
    switch (type) {
      case AssetType.HOUSE: return '🏠';
      case AssetType.VEHICLE: return '🏎️';
      case AssetType.FINANCE: return '💰';
      case AssetType.INSURANCE: return '🛡️';
      default: return '📁';
    }
  };

  return (
    <div className="space-y-10 animate-pop pb-24">
      <div className="flex justify-between items-end px-1">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Mi Cartera</h2>
          <p className="text-[10px] text-teal-400 font-black uppercase tracking-[0.3em] mt-3">Gestionando {assets.length} Activos</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="w-14 h-14 bg-teal-500 text-slate-950 rounded-2xl flex items-center justify-center text-2xl shadow-xl active:scale-90 transition-all"
        >
          +
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {assets.map((asset) => (
          <div key={asset.id} className="bg-slate-900 p-8 rounded-[3rem] border border-white/5 shadow-2xl flex items-center justify-between group hover:border-teal-500/20 transition-all">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-4xl shadow-inner group-hover:bg-teal-500/10 transition-colors">
                {getTypeIcon(asset.type)}
              </div>
              <div>
                <h4 className="text-lg font-black text-white uppercase tracking-tight leading-none">{asset.name}</h4>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">{asset.type}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[9px] font-black px-3 py-1 bg-teal-500/10 text-teal-400 rounded-lg uppercase border border-teal-500/10">Vigilado</span>
              <p className="text-[8px] text-slate-600 font-black uppercase mt-2">Auditando Costes</p>
            </div>
          </div>
        ))}

        {assets.length === 0 && (
          <div className="bg-white/2 border-2 border-dashed border-white/5 p-20 rounded-[4rem] text-center">
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">No hay activos registrados</p>
          </div>
        )}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setShowAdd(false)}></div>
          <form onSubmit={handleSubmit} className="relative bg-slate-900 w-full max-w-sm p-10 rounded-[4rem] border border-white/10 shadow-3xl animate-pop">
            <h2 className="text-xl font-black mb-8 text-white uppercase tracking-tighter text-center">Nuevo Registro</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[8px] font-black text-slate-500 uppercase ml-4">Nombre (Ej: Moto 3 o Casa Playa)</label>
                <input 
                  required
                  placeholder="Nombre del activo"
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-teal-400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[8px] font-black text-slate-500 uppercase ml-4">Tipo de Activo</label>
                <select 
                  onChange={e => setFormData({...formData, type: e.target.value as AssetType})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-teal-400 appearance-none"
                >
                  {Object.values(AssetType).map(t => <option key={t} value={t} className="bg-slate-900">{t}</option>)}
                </select>
              </div>
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-4 text-[10px] font-black uppercase text-slate-500 tracking-widest">Cancelar</button>
                <button type="submit" className="flex-1 py-4 bg-teal-500 text-slate-950 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95">Añadir</button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default PropertyManager;
