import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark-dimmed.css';

const TypewriterMarkdown = ({ text }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!text) return;
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, index + 1));
      index += 3;
      if (index >= text.length) {
        setDisplayedText(text);
        clearInterval(interval);
      }
    }, 10);
    return () => clearInterval(interval);
  }, [text]);

  return <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{displayedText}</ReactMarkdown>;
};

const FACTS = [
  "Did you know? The first computer programmer was Ada Lovelace.",
  "AI models are trained on massive amounts of internet text.",
  "The term 'Artificial Intelligence' was coined in 1956.",
  "GPT stands for Generative Pre-trained Transformer.",
  "The first AI program was written in 1951.",
  "Analyzing millions of code snippets...",
  "Consulting the silicon oracles...",
  "Both AIs are thinking hard right now...",
  "The judge is sharpening their pencil...",
];

export default function BattleMessage({ message }) {
  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    if (!message.isLoading) return;
    const interval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % FACTS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [message.isLoading]);

  const model1Label = message.model1_name || "AI Model 1";
  const model2Label = message.model2_name || "AI Model 2";

  if (message.isLoading) {
    return (
      <div className="flex flex-col gap-6 py-8 border-b border-neutral-800/50 last:border-b-0">
        <div className="flex w-full justify-end">
          <div className="max-w-[80%] text-neutral-200 bg-neutral-800/80 px-6 py-4 rounded-2xl rounded-tr-sm shadow-sm backdrop-blur-sm border border-neutral-700/50">
            <p className="text-lg font-medium leading-relaxed">
              {message.problem}
            </p>
          </div>
        </div>
        <div className="flex justify-center items-center py-10">
          <div className="flex flex-col items-center gap-4 text-neutral-400">
            <svg className="animate-spin h-6 w-6 text-neutral-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-sm font-medium animate-pulse">{FACTS[factIndex]}</p>
          </div>
        </div>
      </div>
    );
  }

  const s1 = message.judge?.solution_1_score ?? 0;
  const s2 = message.judge?.solution_2_score ?? 0;
  const winner = s1 > s2 ? 1 : s2 > s1 ? 2 : 0;

  return (
    <div className="flex flex-col gap-6 py-8 border-b border-neutral-800/50 last:border-b-0">
      {/* User Prompt */}
      <div className="flex w-full justify-end">
        <div className="max-w-[80%] text-neutral-200 bg-neutral-800/80 px-6 py-4 rounded-2xl rounded-tr-sm shadow-sm backdrop-blur-sm border border-neutral-700/50">
          <p className="text-lg font-medium leading-relaxed">
            {message.problem}
          </p>
        </div>
      </div>

      {/* Solutions Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        {/* Solution 1 Column */}
        <div className="flex flex-col gap-4">
          <div className={`bg-neutral-900 rounded-2xl shadow-2xl border overflow-hidden flex flex-col h-full transition-colors duration-300 ${
            winner === 1 ? 'border-green-700/50' : 'border-neutral-800 hover:border-neutral-700'
          }`}>
            <div className="px-6 py-4 border-b border-neutral-800 bg-neutral-900/80 flex items-center justify-between">
              <h3 className="font-bold text-neutral-200 tracking-tight">{model1Label}</h3>
              {winner === 1 && <span className="text-xs bg-green-800/50 text-green-300 px-2 py-0.5 rounded-full font-bold">🏆 Winner</span>}
            </div>
            <div className="p-6 flex-grow prose prose-invert prose-sm max-w-none text-neutral-300 overflow-x-auto">
              <TypewriterMarkdown text={message.solution_1} />
            </div>
            
            {message.judge && (
              <div className="p-6 bg-neutral-800/30 border-t border-neutral-800/50 mt-auto">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Judge Verdict</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-black shadow-lg ${
                    winner === 1 ? 'bg-green-700 text-green-100' : 'bg-neutral-700 text-neutral-200'
                  }`}>
                    {s1} / 10
                  </span>
                </div>
                <p className="text-sm text-neutral-400 leading-relaxed font-medium">
                  {message.judge.solution_1_reasoning}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Solution 2 Column */}
        <div className="flex flex-col gap-4">
          <div className={`bg-neutral-900 rounded-2xl shadow-2xl border overflow-hidden flex flex-col h-full transition-colors duration-300 ${
            winner === 2 ? 'border-green-700/50' : 'border-neutral-800 hover:border-neutral-700'
          }`}>
            <div className="px-6 py-4 border-b border-neutral-800 bg-neutral-900/80 flex items-center justify-between">
              <h3 className="font-bold text-neutral-200 tracking-tight">{model2Label}</h3>
              {winner === 2 && <span className="text-xs bg-green-800/50 text-green-300 px-2 py-0.5 rounded-full font-bold">🏆 Winner</span>}
            </div>
            <div className="p-6 flex-grow prose prose-invert prose-sm max-w-none text-neutral-300 overflow-x-auto">
              <TypewriterMarkdown text={message.solution_2} />
            </div>
            
            {message.judge && (
              <div className="p-6 bg-neutral-800/30 border-t border-neutral-800/50 mt-auto">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Judge Verdict</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-black shadow-lg ${
                    winner === 2 ? 'bg-green-700 text-green-100' : 'bg-neutral-700 text-neutral-200'
                  }`}>
                    {s2} / 10
                  </span>
                </div>
                <p className="text-sm text-neutral-400 leading-relaxed font-medium">
                  {message.judge.solution_2_reasoning}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
