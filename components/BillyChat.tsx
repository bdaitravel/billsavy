
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Expense, Asset } from '../types';

interface BillyChatProps {
  expenses: Expense[];
  assets: Asset[];
}

const BillyChat: React.FC<BillyChatProps> = ({ expenses, assets }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'billy', text: string}[]>([
    {role: 'billy', text: '¡Hola! Soy Billy. ¿Qué factura analizamos hoy?'}
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll al final del chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, {role: 'user', text: userMsg}]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const context = `Contexto: La app BILLSAVY tiene ${expenses.length} gastos y ${assets.length} activos. Eres Billy, el asistente inteligente. Responde con emojis, sé breve y profesional. Tu personalidad es audaz y ahorradora.`;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `${context}\nPregunta: ${userMsg}`,
      });
      setMessages(prev => [...prev, {role: 'billy', text: response.text || 'He tenido un problema analizando eso.'}]);
    } catch (err) {
      setMessages(prev => [...prev, {role: 'billy', text: 'Lo siento, mi conexión ha fallado.'}]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="relative">
      {isOpen && (
        <div className="fixed bottom-28 right-4 left-4 md:left-auto md:w-80 h-[450px] max-h-[70vh] bg-slate-950/95 border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-pop z-[100] backdrop-blur-2xl">
          <div className="p-5 bg-white/5 border-b border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center">
                <span className="text-teal-400 font-black text-xs">B</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-white">Billy AI Agent</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white text-xl">×</button>
          </div>
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 text-[10px] scroll-smooth">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-3xl ${m.role === 'user' ? 'bg-teal-600 text-white rounded-tr-none shadow-lg' : 'bg-white/5 text-slate-200 rounded-tl-none border border-white/5'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/5 p-4 rounded-3xl rounded-tl-none border border-white/5 flex gap-1">
                  <div className="w-1 h-1 bg-teal-400 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-teal-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1 h-1 bg-teal-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-white/5 bg-black/20 flex gap-2">
            <input 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              onKeyPress={e => e.key === 'Enter' && handleSend()} 
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-[10px] outline-none text-white placeholder-slate-600 focus:border-teal-500/50" 
              placeholder="Pregunta a Billy..." 
            />
            <button onClick={handleSend} className="bg-teal-500 text-slate-950 w-10 h-10 rounded-2xl flex items-center justify-center font-bold hover:bg-teal-400 transition-all shadow-lg">
              <span className="text-lg">→</span>
            </button>
          </div>
        </div>
      )}

      {/* Botón Flotante: Icono de bocadillo latente, difuminado y pequeño */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-10 h-10 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-90 z-[100] border border-white/10 animate-latent backdrop-blur-md ${isOpen ? 'bg-slate-800' : 'bg-slate-800/80 hover:bg-teal-600/90'}`}
      >
        {isOpen ? (
          <span className="text-white text-lg font-light">×</span>
        ) : (
          <svg className="w-5 h-5 text-teal-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default BillyChat;
