import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_URL } from '../config/api';

export default function Leaderboard({ token }) {
  const [data, setData] = useState([]);
  const [expandedModel, setExpandedModel] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/leaderboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data.leaderboard || []);
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 10000);
    return () => clearInterval(interval);
  }, [fetchLeaderboard]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-neutral-500">
        <p className="text-lg">Loading leaderboard...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-neutral-500">
        <span className="text-5xl mb-4">🏆</span>
        <h2 className="text-xl font-medium text-neutral-300">Leaderboard</h2>
        <p className="text-sm mt-2">No battles have been fought yet. Start battling to populate the leaderboard!</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-8 w-full max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-neutral-100 tracking-tight flex items-center justify-center gap-2">
          🏆 AI Leaderboard
        </h2>
        <p className="text-neutral-500 text-sm mt-1">Rankings based on battle wins and average scores</p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-800">
              <th className="px-6 py-4 text-left text-xs font-bold text-neutral-400 uppercase tracking-widest">#</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-neutral-400 uppercase tracking-widest">Model</th>
              <th className="px-6 py-4 text-center text-xs font-bold text-neutral-400 uppercase tracking-widest">Wins</th>
              <th className="px-6 py-4 text-center text-xs font-bold text-neutral-400 uppercase tracking-widest">Losses</th>
              <th className="px-6 py-4 text-center text-xs font-bold text-neutral-400 uppercase tracking-widest">Draws</th>
              <th className="px-6 py-4 text-center text-xs font-bold text-neutral-400 uppercase tracking-widest">Avg Score</th>
              <th className="px-6 py-4 text-center text-xs font-bold text-neutral-400 uppercase tracking-widest">Battles</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, i) => (
              <React.Fragment key={entry.modelId}>
              <tr className={`border-b border-neutral-800/50 hover:bg-neutral-800/30 transition-colors ${
                i === 0 ? 'bg-yellow-900/10' : i === 1 ? 'bg-neutral-800/10' : ''
              }`}>
                <td className="px-6 py-4 text-neutral-300 font-bold">
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                </td>
                <td className="px-6 py-4 text-neutral-200 font-semibold">
                  <button
                    type="button"
                    onClick={() => setExpandedModel(expandedModel === entry.modelId ? null : entry.modelId)}
                    className="text-left hover:text-white"
                  >
                    {entry.modelName} <span className="ml-1 text-xs text-neutral-500">{expandedModel === entry.modelId ? '▲' : '▼'}</span>
                  </button>
                </td>
                <td className="px-6 py-4 text-center text-green-400 font-bold">{entry.wins}</td>
                <td className="px-6 py-4 text-center text-red-400 font-bold">{entry.losses}</td>
                <td className="px-6 py-4 text-center text-neutral-400 font-medium">{entry.draws}</td>
                <td className="px-6 py-4 text-center text-neutral-200 font-semibold">{entry.avgScore}</td>
                <td className="px-6 py-4 text-center text-neutral-500">{entry.battles}</td>
              </tr>
              {expandedModel === entry.modelId && (
                <tr className="border-b border-neutral-800 bg-neutral-950/80">
                  <td colSpan="7" className="px-6 py-4">
                    <p className="mb-3 text-xs font-bold uppercase tracking-widest text-neutral-500">Battle record for {entry.modelName}</p>
                    <div className="space-y-2">
                      {entry.matches.map((match) => (
                        <div key={`${match.timestamp}-${match.opponent}`} className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg border border-neutral-800 px-4 py-3 text-sm">
                          <span className={`min-w-14 font-bold uppercase text-xs ${match.outcome === 'win' ? 'text-green-400' : match.outcome === 'loss' ? 'text-red-400' : 'text-neutral-400'}`}>{match.outcome}</span>
                          <span className="min-w-0 flex-1 text-neutral-200">{match.problem}</span>
                          <span className="text-neutral-500">vs {match.opponent}</span>
                          <span className="text-neutral-300">{match.modelScore} - {match.opponentScore}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
