import React from 'react';

export default function Sidebar({ activeTab, onTabChange, history, onSelectHistory, isAuthenticated, userEmail, onProtectedTab, onLogin, onRegister, onLogout }) {
  return (
    <div className="w-72 h-screen bg-neutral-950 border-r border-neutral-800 flex flex-col">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-neutral-800">
        <h1 className="text-lg font-bold text-neutral-100 tracking-tight flex items-center gap-2">
          <span className="text-2xl">⚔</span> DuelBench
        </h1>
        <p className="mt-1 pl-9 text-xs text-neutral-500">Head-to-head AI evaluation</p>
      </div>

      {/* Tab Buttons */}
      <div className="flex border-b border-neutral-800">
        <button
          onClick={() => onTabChange('chat')}
          className={`flex-1 py-3 text-sm font-semibold tracking-wide transition-colors ${
            activeTab === 'chat'
              ? 'text-neutral-100 border-b-2 border-neutral-400'
              : 'text-neutral-500 hover:text-neutral-300'
          }`}
        >
          💬 Chat
        </button>
        <button
          onClick={() => onProtectedTab('history')}
          className={`flex-1 py-3 text-sm font-semibold tracking-wide transition-colors ${
            activeTab === 'history'
              ? 'text-neutral-100 border-b-2 border-neutral-400'
              : 'text-neutral-500 hover:text-neutral-300'
          }`}
        >
          📜 History
        </button>
        <button
          onClick={() => onProtectedTab('leaderboard')}
          className={`flex-1 py-3 text-sm font-semibold tracking-wide transition-colors ${
            activeTab === 'leaderboard'
              ? 'text-neutral-100 border-b-2 border-neutral-400'
              : 'text-neutral-500 hover:text-neutral-300'
          }`}
        >
          🏆 Board
        </button>
      </div>

      {/* History List (shown when history tab is active) */}
      {activeTab === 'history' && isAuthenticated && (
        <div className="flex-1 overflow-y-auto">
          {history.length === 0 ? (
            <div className="p-5 text-neutral-500 text-sm text-center mt-8">
              No battles yet. Start a battle to see history here.
            </div>
          ) : (
            <div className="flex flex-col">
              {history.slice().reverse().map((item, i) => (
                <button
                  key={i}
                  onClick={() => onSelectHistory(item)}
                  className="w-full text-left px-5 py-4 border-b border-neutral-800/50 hover:bg-neutral-900 transition-colors"
                >
                  <p className="text-sm text-neutral-300 truncate font-medium">{item.problem}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs text-neutral-500">{item.model1_name?.split("(")[0]}</span>
                    <span className="text-xs text-neutral-600">vs</span>
                    <span className="text-xs text-neutral-500">{item.model2_name?.split("(")[0]}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-neutral-600">
                      Score: {item.judge?.solution_1_score} - {item.judge?.solution_2_score}
                    </span>
                    <span className="text-xs text-neutral-700">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Chat tab placeholder */}
      {activeTab === 'chat' && (
        <div className="flex-1 overflow-y-auto p-5">
          <p className="text-neutral-500 text-sm text-center mt-8">
            Select AI models and start a battle in the main panel.
          </p>
        </div>
      )}

      {/* Leaderboard placeholder when tab active */}
      {activeTab === 'leaderboard' && (
        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-neutral-500 text-sm text-center mt-8">
            View the full leaderboard in the main panel.
          </p>
        </div>
      )}

      <div className="border-t border-neutral-800 p-4">
        {isAuthenticated ? (
          <div className="flex items-center justify-between gap-3">
            <span className="truncate text-xs text-neutral-500">{userEmail}</span>
            <button onClick={onLogout} className="shrink-0 text-xs font-semibold text-neutral-400 hover:text-neutral-100">Log out</button>
          </div>
        ) : (
          <div className="flex gap-2">
            <button onClick={onLogin} className="flex-1 rounded-lg border border-neutral-700 px-3 py-2 text-xs font-semibold text-neutral-300 hover:border-neutral-500 hover:text-white">Sign in</button>
            <button onClick={onRegister} className="flex-1 rounded-lg bg-neutral-100 px-3 py-2 text-xs font-semibold text-neutral-900 hover:bg-white">Register</button>
          </div>
        )}
      </div>
    </div>
  );
}
