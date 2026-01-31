
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

  return (
    <div className="space-y-16 animate-hero pb-24">
      <div className="flex justify-between items-end border-b border-slate-100 pb-12">
        <div>
          <h2 className="text-5xl font-extrabold tracking-tight text-slate-900">Cartera</h2>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mt-3">Tus activos bajo vigilancia</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl"
        >
          Añadir Activo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {/* Placeholder: Luz */}
        <div className="bg-white border border-slate-100 p-10 rounded-[3rem] shadow-soft flex flex-col items-center text-center justify-between h-[360px] group transition-all hover:border-emerald-300">
           <div className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center text-3xl group-hover:scale-110 transition-all">⚡</div>
           <div>
             <h4 className="text-lg font-black text-slate-900 mb-2">Contrato Eléctrico</h4>
             <p className="text-xs text-slate-400 font-medium">No se ha detectado ninguna comercializadora aún.</p>
           </div>
           <button className="small-caps text-emerald-500 font-black hover:underline">Vincular Factura</button>
        </div>

        {/* Placeholder: Vivienda */}
        <div className="bg-white border border-slate-100 p-10 rounded-[3rem] shadow-soft flex flex-col items-center text-center justify-between h-[360px] group transition-all hover:border-blue-300">
           <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center text-3xl group-hover:scale-110 transition-all">🏠</div>
           <div>
             <h4 className="text-lg font-black text-slate-900 mb-2">Seguro de Hogar</h4>
             <p className="text-xs text-slate-400 font-medium">Protección de daños y responsabilidad civil.</p>
           </div>
           <button className="small-caps text-blue-600 font-black hover:underline">Subir Póliza</button>
        </div>

        {/* Placeholder: Vehículo */}
        <div className="bg-white border border-slate-100 p-10 rounded-[3rem] shadow-soft flex flex-col items-center text-center justify-between h-[360px] group transition-all hover:border-slate-300">
           <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-3xl group-hover:scale-110 transition-all">🏎️</div>
           <div>
             <h4 className="text-lg font-black text-slate-900 mb-2">Seguro de Auto</h4>
             <p className="text-xs text-slate-400 font-medium">Vigilancia de renovación automática activa.</p>
           </div>
           <button className="small-caps text-slate-900 font-black hover:underline">Gestionar Activo</button>
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-6">
          <form onSubmit={handleSubmit} className="bg-white w-full max-w-sm p-12 rounded-[3rem] shadow-3xl animate-hero">
            <h2 className="text-2xl font-black mb-8 text-center uppercase tracking-tighter">Nuevo Activo</h2>
            <div className="space-y-6">
              <input 
                required
                placeholder="Nombre descriptivo"
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="input-minimal w-full"
              />
              <select 
                onChange={e => setFormData({...formData, type: e.target.value as AssetType})}
                className="input-minimal w-full appearance-none"
              >
                {Object.values(AssetType).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Cerrar</button>
                <button type="submit" className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">Añadir</button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default PropertyManager;
