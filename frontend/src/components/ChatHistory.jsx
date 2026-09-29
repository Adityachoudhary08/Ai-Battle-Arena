import React, { useEffect, useRef } from 'react';
import BattleMessage from './BattleMessage';

export default function ChatHistory({ messages }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 w-full">
      <div className="max-w-5xl mx-auto flex flex-col gap-6 py-8">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-neutral-500 mt-20">
            <div className="w-16 h-16 mb-4 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center shadow-inner">
              <span className="text-3xl">⚔️</span>
            </div>
            <p className="text-xl font-medium tracking-wide text-neutral-300">AI Battle Arena</p>
            <p className="text-sm mt-2 text-neutral-500">Enter a coding query below to begin the battle.</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <BattleMessage key={index} message={msg} />
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
