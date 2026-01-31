
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Expense, Asset } from '../types';

interface BillyChatProps {
  expenses: Expense[];
  assets: Asset[];
}

const BillyChat: React.FC<BillyChatProps> = ({ expenses, assets }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'billy', text: string}[]>([
    {role: 'billy', text: '¡Hola! Soy Billy. 🤖 Estoy listo para analizar tus facturas de casa o coche. ¿Qué duda tienes?'}
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, {role: 'user', text: userMsg}]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const context = `Usuario: ${expenses.length} facturas, ${assets.length} activos. 
      Activos: ${assets.map(a => a.name).join(', ')}. 
      Gastos: ${expenses.map(e => `${e.category}: ${e.amount}€`).join(', ')}.
      Eres Billy de BillSavy. Sé breve, usa emojis y habla de tú. Si el usuario pregunta por ahorros, usa los datos proporcionados.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `${context}\nPregunta: ${userMsg}`,
      });

      setMessages(prev => [...prev, {role: 'billy', text: response.text || 'Me he despistado un segundo... ¿puedes repetirlo?'}]);
    } catch (err: any) {
      let errorMsg = '¡Vaya! Algo ha fallado en mis circuitos. Inténtalo de nuevo.';
      if (err?.message?.includes('429') || err?.status === 429) {
        errorMsg = '¡Uff! He trabajado tanto hoy que me he quedado sin pilas (límite de cuota superado). ¡Dame un respiro y vuelve a preguntarme en un ratito! 🔋😴';
      }
      setMessages(prev => [...prev, {role: 'billy', text: errorMsg}]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="bg-white w-[350px] h-[480px] rounded-[2rem] shadow-2xl border border-emerald-100 flex flex-col overflow-hidden animate-fade mb-4">
          <div className="bg-slate-900 p-5 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-500 rounded-full flex items-center justify-center font-black text-sm">B</div>
              <div>
                <h4 className="font-bold text-sm">Billy</h4>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Listo para ahorrar</p>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user' ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-tl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex gap-1">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-75"></div>
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-slate-100">
            <div className="flex gap-2">
              <input 
                onKeyPress={e => e.key === 'Enter' && handleSend()}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Pregunta a Billy..."
                className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
              />
              <button onClick={handleSend} className="bg-emerald-600 text-white p-3 rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>
        </div>
      )}
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 ${isOpen ? 'bg-slate-900' : 'bg-emerald-600'}`}
      >
        <span className="text-white font-black text-xl">B</span>
        {!isOpen && <div className="absolute top-0 right-0 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white animate-ping"></div>}
      </button>
    </div>
  );
};

export default BillyChat;
