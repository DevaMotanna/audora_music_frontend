import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import LoadingSpinner from "../components/LoadingSpinner";

const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);

  const load = () => {
    api
      .get("/playlists")
      .then((res) => setPlaylists(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    try {
      await api.post("/playlists", { name: name.trim(), description: description.trim() });
      setName("");
      setDescription("");
      setShowModal(false);
      load();
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.preventDefault();
    if (!confirm("Delete this playlist? This cannot be undone.")) return;
    await api.delete(`/playlists/${id}`);
    setPlaylists((prev) => prev.filter((p) => p._id !== id));
  };

  const formatDuration = (tracks) => {
    const total = tracks.reduce((s, t) => s + (t.duration || 0), 0);
    if (!total) return "";
    const m = Math.floor(total / 60);
    return `${m} min`;
  };

  return (
    <div className="px-6 pt-6 pb-8 page-enter">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-white mb-1">Your Library</h1>
          <p className="text-audora-muted text-sm">{playlists.length} playlists</p>
        </div>
        <button
          id="create-playlist-btn"
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Playlist
        </button>
      </div>

      {/* Playlists Grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" text="Loading playlists..." />
        </div>
      ) : playlists.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center max-w-md mx-auto">
          <p className="text-5xl mb-4">🎵</p>
          <h3 className="text-lg font-semibold text-white mb-2">No playlists yet</h3>
          <p className="text-audora-muted text-sm mb-6">Create your first playlist to organize your music.</p>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary"
          >
            Create Playlist
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {playlists.map((p) => (
            <Link
              key={p._id}
              to={`/playlists/${p._id}`}
              className="group glass-card rounded-2xl p-4 transition-all duration-300 hover:scale-[1.03] hover:shadow-glow hover:border-audora-accent/20 block"
            >
              {/* Playlist Cover: mosaic of track covers or gradient */}
              <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-gradient-to-br from-audora-accent/30 to-audora-green/20">
                {p.tracks.length > 0 ? (
                  <div className="grid grid-cols-2 h-full">
                    {p.tracks.slice(0, 4).map((t, i) => (
                      <img
                        key={i}
                        src={t.coverUrl || `https://picsum.photos/seed/${t._id}/200`}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ))}
                    {p.tracks.length === 1 && (
                      <>
                        <div className="bg-audora-surfaceHigh" />
                        <div className="bg-audora-surface" />
                        <div className="bg-audora-surface" />
                      </>
                    )}
                    {p.tracks.length === 2 && (
                      <>
                        <div className="bg-audora-surfaceHigh" />
                        <div className="bg-audora-surface" />
                      </>
                    )}
                    {p.tracks.length === 3 && <div className="bg-audora-surfaceHigh" />}
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl opacity-50">🎵</span>
                  </div>
                )}

                {/* Hover play button */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-audora-accent flex items-center justify-center shadow-glow">
                    <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </div>

              <p className="font-semibold text-white truncate group-hover:text-audora-accentLight transition-colors">
                {p.name}
              </p>
              <p className="text-xs text-audora-muted mt-0.5">
                {p.tracks.length} tracks{formatDuration(p.tracks) && ` • ${formatDuration(p.tracks)}`}
              </p>

              {/* Delete button */}
              <button
                onClick={(e) => handleDelete(p._id, e)}
                className="mt-2 text-xs text-audora-dim hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
              >
                Delete playlist
              </button>
            </Link>
          ))}
        </div>
      )}

      {/* Create Playlist Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div className="glass-card rounded-2xl p-6 w-full max-w-md border border-audora-border animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Create Playlist</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-audora-dim hover:text-white transition-colors text-xl leading-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-sm text-audora-muted font-medium block mb-1.5">
                  Playlist Name <span className="text-red-400">*</span>
                </label>
                <input
                  id="playlist-name-input"
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My awesome playlist"
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label className="text-sm text-audora-muted font-medium block mb-1.5">
                  Description <span className="text-audora-dim">(optional)</span>
                </label>
                <textarea
                  id="playlist-desc-input"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add an optional description..."
                  rows={2}
                  className="input-field resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  id="playlist-create-submit"
                  type="submit"
                  disabled={creating || !name.trim()}
                  className="btn-primary flex-1 disabled:opacity-40"
                >
                  {creating ? "Creating..." : "Create Playlist"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Playlists;
