"use client";

import { useChat } from "ai/react";
import { useEffect, useState, useRef } from "react";
import { Mic, MicOff, Settings, Code, Terminal } from "lucide-react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Web Speech API
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          handleInputChange({ target: { value: finalTranscript } } as any);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };
    }
  }, [handleInputChange]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      // Auto submit when stopping voice
      if (input.trim()) {
        handleSubmit(new Event('submit') as any);
      }
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#0d0d0d] overflow-hidden">
      {/* Sidebar - Manus Style */}
      <aside className="w-16 md:w-64 border-r border-white/5 bg-black/20 flex flex-col items-center md:items-start p-4 space-y-8 glass z-10">
        <div className="w-full flex justify-center md:justify-start items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/50 flex items-center justify-center">
            <span className="text-accent font-bold text-xs">PF</span>
          </div>
          <span className="hidden md:block font-semibold tracking-wide text-sm">Pauli Factory</span>
        </div>
        
        <nav className="w-full space-y-4">
          <button className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors text-white/70 hover:text-white">
            <Terminal size={18} />
            <span className="hidden md:block text-sm">Terminal</span>
          </button>
          <button className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors text-white/70 hover:text-white">
            <Code size={18} />
            <span className="hidden md:block text-sm">Codebase</span>
          </button>
          <button className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors text-white/70 hover:text-white">
            <Settings size={18} />
            <span className="hidden md:block text-sm">Settings</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative h-full">
        {/* Background ambient light */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-8 z-10 space-y-6 flex flex-col pb-40">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-white/40">
              <p className="text-lg">Voice-First Agentic Software Factory</p>
              <p className="text-sm">Initiate sequence to begin</p>
            </div>
          ) : (
            messages.map((m) => (
              <div key={m.id} className={`flex w-full ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl p-4 ${m.role === 'user' ? 'bg-white/10 text-white' : 'glass text-white/90'}`}>
                  {m.content}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex w-full justify-start">
              <div className="glass max-w-[80%] rounded-2xl p-4 text-white/90 flex items-center space-x-2">
                <div className="w-2 h-2 bg-accent rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          )}
        </div>

        {/* Voice Input / Avatar Area */}
        <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col items-center z-20">
          
          {/* Input field (hidden by default, shown for debugging/fallback) */}
          <form onSubmit={handleSubmit} className="w-full max-w-2xl mb-8 opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity absolute bottom-32">
            <input
              className="w-full glass rounded-full px-6 py-4 text-white placeholder-white/30 outline-none focus:border-accent/50"
              value={input}
              onChange={handleInputChange}
              placeholder="Or type here..."
            />
          </form>

          {/* Pauli Voice Avatar (Central Orb) */}
          <button 
            onClick={toggleListening}
            className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
              isListening ? 'bg-accent orb-pulse' : 'glass hover:bg-white/10'
            }`}
          >
            {isListening ? (
              <Mic size={32} className="text-black" />
            ) : (
              <MicOff size={32} className="text-white/50" />
            )}
            
            {/* Visualizer rings when listening */}
            {isListening && (
              <>
                <div className="absolute inset-0 border border-accent rounded-full animate-ping opacity-20" />
                <div className="absolute -inset-4 border border-accent/30 rounded-full animate-pulse" />
              </>
            )}
          </button>
          
          <p className="mt-4 text-xs text-white/30 uppercase tracking-widest">
            {isListening ? "Listening..." : "Tap to Speak"}
          </p>
        </div>
      </main>
    </div>
  );
}
