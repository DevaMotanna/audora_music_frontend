import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import TrackListItem from "../components/TrackListItem";
import LoadingSpinner from "../components/LoadingSpinner";
<<<<<<< HEAD
import CommentSection from "../components/CommentSection";
import ShareButtons from "../components/ShareButtons";
import { usePlayer } from "../context/PlayerContext";
import { useAuth } from "../context/AuthContext";
import { handleImgError } from "../utils/image";
=======
import { usePlayer } from "../context/PlayerContext";
>>>>>>> 570b2c07dec63fb8d4465ce7f8b48bd8b9216b46

const formatTotalDuration = (tracks) => {
  const total = tracks.reduce((s, t) => s + (t.duration || 0), 0);
  if (!total) return "";
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  if (h > 0) return `${h} hr ${m} min`;
  return `${m} min`;
};

const PlaylistDetail = () => {
  const { id } = useParams();
<<<<<<< HEAD
  const { user } = useAuth();
=======
>>>>>>> 570b2c07dec63fb8d4465ce7f8b48bd8b9216b46
  const { playQueue } = usePlayer();
  const [playlist, setPlaylist] = useState(null);
  const [editingName, setEditingName] = useState(false);
  const [nameVal, setNameVal] = useState("");
  const [saving, setSaving] = useState(false);
<<<<<<< HEAD
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [togglingVisibility, setTogglingVisibility] = useState(false);
=======
>>>>>>> 570b2c07dec63fb8d4465ce7f8b48bd8b9216b46

  const load = () => {
    api.get(`/playlists/${id}`).then((res) => {
      setPlaylist(res.data);
      setNameVal(res.data.name);
<<<<<<< HEAD
      setLikesCount(res.data.likes?.length || 0);
      if (user) setLiked((res.data.likes || []).includes(user._id));
    });
  };

  useEffect(() => { load(); }, [id, user]); // eslint-disable-line

  const isOwner = user && playlist && playlist.owner?._id === user._id;
=======
    });
  };

  useEffect(() => { load(); }, [id]); // eslint-disable-line
>>>>>>> 570b2c07dec63fb8d4465ce7f8b48bd8b9216b46

  const handleRemove = async (trackId) => {
    await api.delete(`/playlists/${id}/tracks/${trackId}`);
    load();
  };

  const handleRename = async (e) => {
    e.preventDefault();
    if (!nameVal.trim()) return;
    setSaving(true);
    try {
      await api.put(`/playlists/${id}`, { name: nameVal.trim() });
      setPlaylist((p) => ({ ...p, name: nameVal.trim() }));
      setEditingName(false);
    } finally {
      setSaving(false);
    }
  };

<<<<<<< HEAD
  const handleLike = async () => {
    if (!user) return alert("Log in to like playlists");
    const res = await api.put(`/playlists/${id}/like`);
    setLiked(res.data.liked);
    setLikesCount(res.data.likesCount);
  };

  const handleCommentAdded = (comment) => {
    setPlaylist((prev) => ({ ...prev, comments: [...(prev.comments || []), comment] }));
  };

  const handleToggleVisibility = async () => {
    if (!isOwner || togglingVisibility) return;
    setTogglingVisibility(true);
    try {
      const res = await api.put(`/playlists/${id}`, { isPublic: !playlist.isPublic });
      setPlaylist((p) => ({ ...p, isPublic: res.data.isPublic }));
    } finally {
      setTogglingVisibility(false);
    }
  };

=======
>>>>>>> 570b2c07dec63fb8d4465ce7f8b48bd8b9216b46
  if (!playlist) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" text="Loading playlist..." />
      </div>
    );
  }

  const tracks = playlist.tracks;
  const coverTrack = tracks[0];

  return (
    <div className="page-enter">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Blurred background */}
        {coverTrack?.coverUrl && (
          <div
            className="absolute inset-0 scale-110"
            style={{
              backgroundImage: `url(${coverTrack.coverUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(50px) brightness(0.25) saturate(1.3)",
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-audora-bg/30 via-audora-bg/70 to-audora-bg" />

        <div className="relative px-6 pt-10 pb-8">
          <div className="flex gap-6 items-end max-w-4xl">
            {/* Playlist Cover */}
            <div className="w-40 h-40 lg:w-52 lg:h-52 rounded-2xl overflow-hidden flex-shrink-0 shadow-card bg-gradient-to-br from-audora-accent/30 to-audora-green/20">
              {tracks.length > 0 ? (
                <div className="grid grid-cols-2 h-full">
                  {tracks.slice(0, 4).map((t, i) => (
<<<<<<< HEAD
                    <img key={i} src={t.coverUrl} alt="" onError={handleImgError} className="w-full h-full object-cover" />
=======
                    <img key={i} src={t.coverUrl} alt="" className="w-full h-full object-cover" />
>>>>>>> 570b2c07dec63fb8d4465ce7f8b48bd8b9216b46
                  ))}
                  {tracks.length < 4 && [...Array(4 - tracks.length)].map((_, i) => (
                    <div key={i} className="bg-audora-surfaceHigh" />
                  ))}
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-5xl opacity-40">🎵</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <p className="text-xs uppercase text-audora-muted tracking-widest font-semibold mb-2">Playlist</p>

              {editingName ? (
                <form onSubmit={handleRename} className="flex gap-2 mb-2">
                  <input
                    autoFocus
                    value={nameVal}
                    onChange={(e) => setNameVal(e.target.value)}
                    className="flex-1 input-field text-2xl font-bold py-2"
                    id="rename-playlist-input"
                  />
                  <button type="submit" disabled={saving} className="btn-primary text-sm px-4">
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button type="button" onClick={() => setEditingName(false)} className="btn-secondary text-sm px-3">
                    Cancel
                  </button>
                </form>
              ) : (
                <h1
                  className="font-display text-3xl lg:text-4xl font-black text-white mb-2 cursor-pointer hover:text-audora-accentLight transition-colors group flex items-center gap-2"
                  onClick={() => setEditingName(true)}
                  title="Click to rename"
                >
                  {playlist.name}
                  <svg className="w-5 h-5 text-audora-dim opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </h1>
              )}

              {playlist.description && (
                <p className="text-audora-muted text-sm mb-2">{playlist.description}</p>
              )}
<<<<<<< HEAD
              <div className="flex items-center gap-2 text-sm text-audora-dim mb-5 flex-wrap">
                <span>
                  {tracks.length} tracks
                  {formatTotalDuration(tracks) && ` • ${formatTotalDuration(tracks)}`}
                </span>
                <span>• {likesCount} likes</span>
                <span>• {playlist.comments?.length || 0} comments</span>
                {playlist.owner?.name && <span>• by {playlist.owner.name}</span>}
                {isOwner && (
                  <button
                    id="playlist-visibility-toggle"
                    onClick={handleToggleVisibility}
                    disabled={togglingVisibility}
                    className={`px-2 py-0.5 rounded-full text-xs font-medium border transition-colors ${
                      playlist.isPublic
                        ? "border-audora-green/40 text-audora-green"
                        : "border-white/20 text-audora-muted"
                    }`}
                    title="Toggle whether others can view, like, and comment on this playlist"
                  >
                    {playlist.isPublic ? "🌐 Public" : "🔒 Private"}
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                {tracks.length > 0 && (
=======
              <p className="text-sm text-audora-dim mb-5">
                {tracks.length} tracks
                {formatTotalDuration(tracks) && ` • ${formatTotalDuration(tracks)}`}
              </p>

              {tracks.length > 0 && (
                <div className="flex items-center gap-3">
>>>>>>> 570b2c07dec63fb8d4465ce7f8b48bd8b9216b46
                  <button
                    id="playlist-play-all-btn"
                    onClick={() => playQueue(tracks, 0)}
                    className="btn-primary flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    Play All
                  </button>
<<<<<<< HEAD
                )}

                {/* Like */}
                <button
                  id="playlist-like-btn"
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all duration-200 font-medium hover:scale-105 ${
                    liked
                      ? "bg-audora-accent/20 border-audora-accent text-audora-accent"
                      : "border-white/20 text-audora-muted hover:border-white/40 hover:text-white"
                  }`}
                >
                  {liked ? "♥" : "♡"} {likesCount}
                </button>

                <Link to="/playlists" className="btn-secondary text-sm">
                  ← Back to Library
                </Link>
              </div>

              <div className="mt-4">
                <ShareButtons playlist={playlist} />
              </div>
=======
                  <Link to="/playlists" className="btn-secondary text-sm">
                    ← Back to Library
                  </Link>
                </div>
              )}
>>>>>>> 570b2c07dec63fb8d4465ce7f8b48bd8b9216b46
            </div>
          </div>
        </div>
      </div>

      {/* Track List */}
      <div className="px-6 pb-8">
        {tracks.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center max-w-md mx-auto mt-4">
            <p className="text-5xl mb-4">🎵</p>
            <h3 className="text-lg font-semibold text-white mb-2">Empty Playlist</h3>
            <p className="text-audora-muted text-sm mb-6">
              Browse tracks and add them to this playlist using the + button.
            </p>
            <Link to="/search" className="btn-primary">
              Browse Music
            </Link>
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-2">
            {/* Table Header */}
            <div className="flex items-center gap-3 px-3 py-2 border-b border-audora-border mb-1">
              <span className="w-8 text-xs text-audora-dim text-center">#</span>
              <span className="w-10 flex-shrink-0" />
              <span className="flex-1 text-xs text-audora-dim font-semibold uppercase tracking-wider">Title</span>
              <span className="hidden sm:block text-xs text-audora-dim font-semibold uppercase tracking-wider w-32">Album</span>
              <span className="w-12 text-xs text-audora-dim text-right font-semibold uppercase tracking-wider">Duration</span>
            </div>

            {tracks.map((t, i) => (
              <TrackListItem
                key={t._id}
                track={t}
                list={tracks}
                index={i}
                showRemove={true}
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}
<<<<<<< HEAD

        {/* Comments */}
        <CommentSection
          targetId={id}
          type="playlist"
          comments={playlist.comments || []}
          onCommentAdded={handleCommentAdded}
        />
=======
>>>>>>> 570b2c07dec63fb8d4465ce7f8b48bd8b9216b46
      </div>
    </div>
  );
};

export default PlaylistDetail;
