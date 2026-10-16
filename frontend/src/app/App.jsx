import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import ChatInterface from '../components/MessageInput';
import Leaderboard from '../components/Leaderboard';
import BattleMessage from '../components/BattleMessage';
import AuthModal from '../components/AuthModal';
import axios from 'axios';
import { API_URL } from '../config/api';

const SESSION_STORAGE_KEY = 'duelbench-auth-session';

export default function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [models, setModels] = useState([]);
  const [selectedModel1, setSelectedModel1] = useState('');
  const [selectedModel2, setSelectedModel2] = useState('');
  const [history, setHistory] = useState([]);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
  const [session, setSession] = useState(() => {
    const saved = localStorage.getItem(SESSION_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  });
  const [authMode, setAuthMode] = useState(null);

  // Fetch available models on mount
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await axios.get(`${API_URL}/models`);
        const m = res.data.models || [];
        setModels(m);
        if (m.length >= 2) {
          setSelectedModel1(m[0].id);
          setSelectedModel2(m[1].id);
        } else if (m.length === 1) {
          setSelectedModel1(m[0].id);
          setSelectedModel2(m[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch models:", err);
      }
    };
    fetchModels();
  }, []);

  // Fetch history
  const fetchHistory = useCallback(async (token = session?.token) => {
    if (!token) return;
    try {
      const res = await axios.get(`${API_URL}/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(res.data.history || []);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  }, [session?.token]);

  useEffect(() => {
    if (session?.token) fetchHistory(session.token);
  }, [fetchHistory, session?.token]);

  const openProtectedTab = (tab) => {
    if (!session) {
      setAuthMode('choice');
      return;
    }
    setActiveTab(tab);
    setSelectedHistoryItem(null);
  };

  const handleAuthenticated = (nextSession) => {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(nextSession));
    setSession(nextSession);
    setAuthMode(null);
    setActiveTab('history');
  };

  const handleLogout = () => {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    setSession(null);
    setHistory([]);
    setSelectedHistoryItem(null);
    setActiveTab('chat');
  };

  const handleSelectHistory = (item) => {
    setSelectedHistoryItem(item);
    setActiveTab('history_detail');
  };

  const handleBattleComplete = () => {
    if (session?.token) fetchHistory(session.token);
  };

  return (
    <div className="flex h-screen bg-neutral-950">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setSelectedHistoryItem(null);
        }}
        history={history}
        onSelectHistory={handleSelectHistory}
        isAuthenticated={Boolean(session)}
        userEmail={session?.user?.email}
        onProtectedTab={openProtectedTab}
        onLogin={() => setAuthMode('login')}
        onRegister={() => setAuthMode('register')}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {activeTab === 'chat' && (
          <ChatInterface
            models={models}
            selectedModel1={selectedModel1}
            selectedModel2={selectedModel2}
            onModel1Change={setSelectedModel1}
            onModel2Change={setSelectedModel2}
            onBattleComplete={handleBattleComplete}
          />
        )}

        {activeTab === 'leaderboard' && (
          <div className="flex-1 flex flex-col bg-neutral-950">
            <Leaderboard token={session?.token} />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="flex-1 flex items-center justify-center bg-neutral-950 text-neutral-500">
            <div className="text-center">
              <span className="text-5xl block mb-4">📜</span>
              <h2 className="text-xl font-medium text-neutral-300">Battle History</h2>
              <p className="text-sm mt-2">Select a battle from the sidebar to view its details.</p>
            </div>
          </div>
        )}

        {activeTab === 'history_detail' && selectedHistoryItem && (
          <div className="flex-1 overflow-y-auto bg-neutral-950 px-4 md:px-8 py-8 max-w-6xl mx-auto w-full">
            <button
              onClick={() => setActiveTab('history')}
              className="mb-6 text-neutral-400 hover:text-neutral-200 text-sm flex items-center gap-2 transition-colors"
            >
              ← Back to History
            </button>
            <BattleMessage message={selectedHistoryItem} />
          </div>
        )}
      </div>

      {authMode && (
        <AuthModal
          mode={authMode}
          onModeChange={setAuthMode}
          onAuthenticated={handleAuthenticated}
          onClose={() => setAuthMode(null)}
        />
      )}
    </div>
  );
}
