import React, { useState, useRef, useEffect } from 'react';
import ChatHistory from './ChatHistory';
import ModelSelector from './ModelSelector';
import axios from "axios";

export default function ChatInterface({ models, selectedModel1, selectedModel2, onModel1Change, onModel2Change, onBattleComplete }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const endOfMessagesRef = useRef(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const currentInput = inputValue;
    const tempId = Date.now();

    const newMessage = {
      id: tempId,
      problem: currentInput,
      isLoading: true,
      model1_name: models.find(m => m.id === selectedModel1)?.name || selectedModel1,
      model2_name: models.find(m => m.id === selectedModel2)?.name || selectedModel2,
    };
    
    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:3000/invoke", {
        input: currentInput,
        model1: selectedModel1,
        model2: selectedModel2,
      });

      const data = response.data;
      console.log(data);

      setMessages((prev) => prev.map(msg => 
        msg.id === tempId ? { ...msg, ...data.data, isLoading: false } : msg
      ));

      if (onBattleComplete) onBattleComplete();
    } catch (error) {
      console.error("Error sending message:", error);
      setError(error.message || "Failed to send message. Make sure the backend is running on port 3000.");
      setMessages((prev) => prev.filter(msg => msg.id !== tempId));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-neutral-950 font-sans">
      {/* Model Selector Bar */}
      <div className="py-3 px-6 border-b border-neutral-800 bg-neutral-900/80 backdrop-blur-sm">
        <ModelSelector
          models={models}
          model1={selectedModel1}
          model2={selectedModel2}
          onModel1Change={onModel1Change}
          onModel2Change={onModel2Change}
          disabled={isLoading}
        />
      </div>

      <main className="flex-1 overflow-y-auto px-4 md:px-8 py-8 w-full max-w-6xl mx-auto flex flex-col">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-neutral-400">
            <div className="text-center">
              <span className="text-5xl block mb-4">⚔️</span>
              <h2 className="text-2xl font-light mb-2 text-neutral-300">
                Welcome to the Arena
              </h2>
              <p className="text-neutral-500">Select your AI fighters above and ask a question to start the battle.</p>
            </div>
          </div>
        ) : (
          <ChatHistory messages={messages} />
        )}
        <div ref={endOfMessagesRef} />
      </main>

      <div className="p-5 bg-neutral-900 border-t border-neutral-800">
        {error && (
          <div className="mb-4 p-3 bg-red-900/50 text-red-200 rounded-lg text-sm border border-red-800/50">
            {error}
          </div>
        )}
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask a coding question..."
              disabled={isLoading}
              className="w-full bg-neutral-800 text-neutral-100 border border-neutral-700 rounded-full py-4 pl-6 pr-16 focus:ring-1 focus:ring-neutral-500 focus:outline-none placeholder-neutral-500 transition-shadow shadow-sm hover:shadow-md text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              className="absolute right-2 bg-neutral-700 hover:bg-neutral-600 text-white p-2.5 rounded-full transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!inputValue.trim() || isLoading}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
                </svg>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
