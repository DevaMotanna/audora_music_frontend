import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const AddToPlaylist = ({ trackId }) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [status, setStatus] = useState("");
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    if (open && user) {
      api.get("/playlists").then((res) => setPlaylists(res.data));
    }
  }, [open, user]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (!e.target.closest("#add-to-playlist-wrapper")) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleAdd = async (playlistId) => {
    try {
      await api.post(`/playlists/${playlistId}/tracks`, { trackId });
      setStatus("✓ Added!");
    } catch (err) {
      setStatus(err.response?.data?.message || "Already in playlist");
    }
    setTimeout(() => setStatus(""), 2000);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      const res = await api.post("/playlists", { name: newName.trim() });
      setPlaylists((prev) => [res.data, ...prev]);
      setNewName("");
      setCreating(false);
      handleAdd(res.data._id);
    } catch {}
  };

  if (!user) return null;

  return (
    <div id="add-to-playlist-wrapper" className="relative inline-block">
      <button
        id={`add-playlist-btn-${trackId}`}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 text-sm font-medium text-white transition-all duration-200 border border-white/10 hover:border-white/20"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add to playlist
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-56 glass-card rounded-xl border border-audora-border shadow-card animate-slide-up overflow-hidden">
          {/* Status banner */}
          {status && (
            <div className={`px-3 py-2 text-xs font-medium ${status.startsWith("✓") ? "bg-audora-green/20 text-audora-green" : "bg-red-500/20 text-red-400"}`}>
              {status}
            </div>
          )}

          <div className="p-2 max-h-52 overflow-y-auto">
            {playlists.length === 0 ? (
              <p className="px-2 py-3 text-xs text-audora-muted text-center">No playlists yet.</p>
            ) : (
              playlists.map((p) => (
                <button
                  key={p._id}
                  onClick={() => handleAdd(p._id)}
                  className="flex items-center gap-2 w-full text-left px-3 py-2.5 text-sm text-white hover:bg-white/8 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-audora-accent/30 to-audora-green/20 flex items-center justify-center text-xs font-bold text-audora-accentLight flex-shrink-0">
                    {p.name[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{p.name}</p>
                    <p className="text-xs text-audora-muted">{p.tracks?.length || 0} tracks</p>
                  </div>
                </button>
              ))
            )}
          </div>

          <div className="border-t border-audora-border p-2">
            {creating ? (
              <form onSubmit={handleCreate} className="flex gap-1.5">
                <input
                  autoFocus
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Playlist name..."
                  className="flex-1 bg-white/10 rounded-lg px-2 py-1.5 text-xs text-white outline-none focus:ring-1 focus:ring-audora-accent"
                />
                <button type="submit" className="text-xs text-audora-accent font-medium px-2">
                  Create
                </button>
              </form>
            ) : (
              <button
                onClick={() => setCreating(true)}
                className="flex items-center gap-2 w-full text-left px-2 py-2 text-sm text-audora-accentLight hover:bg-audora-accent/10 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New playlist
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddToPlaylist;
