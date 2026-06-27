'use client';

import { useState, useEffect } from 'react';

interface Playlist {
  id: string;
  name: string;
  description: string;
  duration_minutes: number;
  mood: string;
  tracks: any[];
}

export default function Home() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedMood, setSelectedMood] = useState('focus');
  const [activePlaylist, setActivePlaylist] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);

  const moods = [
    { id: 'focus', name: 'Deep Focus', icon: '🧠', color: 'from-blue-500 to-indigo-500' },
    { id: 'productive', name: 'Productive', icon: '⚡', color: 'from-green-500 to-emerald-500' },
    { id: 'relax', name: 'Relax', icon: '🌊', color: 'from-cyan-500 to-blue-500' },
    { id: 'energize', name: 'Energize', icon: '🔥', color: 'from-orange-500 to-red-500' },
    { id: 'creative', name: 'Creative', icon: '🎨', color: 'from-purple-500 to-pink-500' },
    { id: 'ambient', name: 'Ambient', icon: '🌙', color: 'from-slate-500 to-gray-500' },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [playlistsRes, statsRes] = await Promise.all([
        fetch('http://localhost:3001/api/playlists'),
        fetch('http://localhost:3001/api/stats'),
      ]);
      const playlistsData = await playlistsRes.json();
      const statsData = await statsRes.json();
      if (playlistsData.success) setPlaylists(playlistsData.data);
      if (statsData.success) setStats(statsData.data);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="text-5xl">🎶</span>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Music for Programming
            </h1>
          </div>
          <p className="text-gray-300 text-lg">Curated focus music for developers</p>
        </div>

        {stats && (
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 text-center">
              <p className="text-2xl font-bold text-indigo-400">{stats.total_playlists}</p>
              <p className="text-gray-400 text-sm">Playlists</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 text-center">
              <p className="text-2xl font-bold text-purple-400">{(stats.total_hours / 1000).toFixed(1)}K</p>
              <p className="text-gray-400 text-sm">Hours</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 text-center">
              <p className="text-2xl font-bold text-blue-400">{(stats.active_listeners / 1000).toFixed(1)}K</p>
              <p className="text-gray-400 text-sm">Listeners</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 text-center">
              <p className="text-2xl font-bold text-green-400">{stats.focus_score_avg}/10</p>
              <p className="text-gray-400 text-sm">Focus Score</p>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Select Your Mood</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {moods.map((mood) => (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(mood.id)}
                className={`p-4 rounded-xl transition-all text-center ${
                  selectedMood === mood.id
                    ? `bg-gradient-to-br ${mood.color} shadow-lg scale-105`
                    : 'bg-slate-800/50 border border-slate-700 hover:border-slate-500'
                }`}
              >
                <div className="text-3xl mb-2">{mood.icon}</div>
                <p className="text-sm font-semibold">{mood.name}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              className={`bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border transition-all cursor-pointer ${
                activePlaylist === playlist.id
                  ? 'border-indigo-500 shadow-lg shadow-indigo-500/20'
                  : 'border-slate-700 hover:border-slate-500'
              }`}
              onClick={() => setActivePlaylist(activePlaylist === playlist.id ? null : playlist.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${
                    playlist.mood === 'focus' ? 'from-blue-500 to-indigo-500' :
                    playlist.mood === 'productive' ? 'from-green-500 to-emerald-500' :
                    'from-purple-500 to-pink-500'
                  } flex items-center justify-center`}>
                    {activePlaylist === playlist.id ? (
                      <div className="flex gap-1">
                        <div className="w-1 h-4 bg-white animate-pulse" />
                        <div className="w-1 h-6 bg-white animate-pulse delay-75" />
                        <div className="w-1 h-3 bg-white animate-pulse delay-150" />
                      </div>
                    ) : (
                      <span className="text-2xl">▶️</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{playlist.name}</h3>
                    <p className="text-gray-400">{playlist.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-indigo-400 font-semibold">{playlist.duration_minutes} min</p>
                  <p className="text-sm text-gray-400">{playlist.tracks.length} tracks</p>
                </div>
              </div>

              {activePlaylist === playlist.id && (
                <div className="mt-6 space-y-2 border-t border-slate-700 pt-4">
                  {playlist.tracks.map((track, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500 w-6">{i + 1}</span>
                        <div>
                          <p className="font-medium">{track.title}</p>
                          <p className="text-sm text-gray-400">{track.artist}</p>
                        </div>
                      </div>
                      <span className="text-gray-400 text-sm">{Math.floor(track.duration_seconds / 60)}:{(track.duration_seconds % 60).toString().padStart(2, '0')}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
