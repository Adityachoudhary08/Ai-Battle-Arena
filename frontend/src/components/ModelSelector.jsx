import React from 'react';

export default function ModelSelector({ models, model1, model2, onModel1Change, onModel2Change, disabled }) {
  return (
    <div className="flex items-center gap-3 px-2">
      <div className="flex items-center gap-2 flex-1">
        <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider whitespace-nowrap">AI 1:</label>
        <select
          value={model1}
          onChange={(e) => onModel1Change(e.target.value)}
          disabled={disabled}
          className="flex-1 bg-neutral-800 text-neutral-200 text-sm border border-neutral-700 rounded-lg px-3 py-2 focus:ring-1 focus:ring-neutral-500 focus:outline-none disabled:opacity-50 cursor-pointer hover:bg-neutral-750 transition-colors appearance-none"
        >
          {models.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </div>

      <span className="text-neutral-600 font-bold text-sm">VS</span>

      <div className="flex items-center gap-2 flex-1">
        <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider whitespace-nowrap">AI 2:</label>
        <select
          value={model2}
          onChange={(e) => onModel2Change(e.target.value)}
          disabled={disabled}
          className="flex-1 bg-neutral-800 text-neutral-200 text-sm border border-neutral-700 rounded-lg px-3 py-2 focus:ring-1 focus:ring-neutral-500 focus:outline-none disabled:opacity-50 cursor-pointer hover:bg-neutral-750 transition-colors appearance-none"
        >
          {models.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
