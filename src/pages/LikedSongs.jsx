import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import TrackListItem from "../components/TrackListItem";
import LoadingSpinner from "../components/LoadingSpinner";
import { usePlayer } from "../context/PlayerContext";
import { useAuth } from "../context/AuthContext";

const LikedSongs = () => {
  const { user } = useAuth();
  const { playQueue } = usePlayer();
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => {
        // likedTracks populated from /auth/me
        setTracks(res.data.likedTracks || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const totalDuration = tracks.reduce((s, t) => s + (t.duration || 0), 0);
  const formatTotal = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    if (h > 0) return `${h} hr ${m} min`;
    return `${m} min`;
  };

  return (
    <div className="page-enter">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-audora-accent/30 via-audora-bg to-audora-bg" />
        <div className="absolute top-0 left-0 w-80 h-80 bg-audora-accent/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

        <div className="relative px-6 pt-10 pb-8 flex gap-6 items-end max-w-4xl">
          {/* Liked Songs Art */}
          <div className="w-40 h-40 lg:w-52 lg:h-52 rounded-2xl flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-audora-accent to-audora-pink shadow-glow">
            <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
            </svg>
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase text-audora-muted tracking-widest font-semibold mb-2">Playlist</p>
            <h1 className="font-display text-3xl lg:text-4xl font-black text-white mb-2">Liked Songs</h1>
            <p className="text-sm text-audora-dim mb-5">
              {user?.name} • {tracks.length} songs
              {totalDuration > 0 && ` • ${formatTotal(totalDuration)}`}
            </p>

            {tracks.length > 0 && (
              <button
                id="liked-play-all-btn"
                onClick={() => playQueue(tracks, 0)}
                className="btn-primary flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                Play All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Track List */}
      <div className="px-6 pb-8">
        {loading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner size="lg" text="Loading liked songs..." />
          </div>
        ) : tracks.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center max-w-md mx-auto mt-4">
            <svg className="w-16 h-16 text-audora-dim mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
            </svg>
            <h3 className="text-lg font-semibold text-white mb-2">No liked songs yet</h3>
            <p className="text-audora-muted text-sm mb-6">
              Like tracks while browsing to save them here.
            </p>
            <Link to="/" className="btn-primary">Browse Music</Link>
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-2">
            <div className="flex items-center gap-3 px-3 py-2 border-b border-audora-border mb-1">
              <span className="w-8 text-xs text-audora-dim text-center">#</span>
              <span className="w-10 flex-shrink-0" />
              <span className="flex-1 text-xs text-audora-dim font-semibold uppercase tracking-wider">Title</span>
              <span className="hidden sm:block text-xs text-audora-dim font-semibold uppercase tracking-wider w-32">Album</span>
              <span className="w-12 text-xs text-audora-dim text-right font-semibold uppercase tracking-wider">Duration</span>
            </div>
            {tracks.map((t, i) => (
              <TrackListItem key={t._id} track={t} list={tracks} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LikedSongs;
