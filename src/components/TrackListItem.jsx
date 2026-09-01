import React from "react";
import { Link } from "react-router-dom";
import { usePlayer } from "../context/PlayerContext";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
<<<<<<< HEAD
import { handleImgError } from "../utils/image";
=======
>>>>>>> 570b2c07dec63fb8d4465ce7f8b48bd8b9216b46

const formatDuration = (secs) => {
  if (!secs) return "--:--";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

const TrackListItem = ({ track, list, index, onRemove, showRemove = false }) => {
  const { playTrack, currentTrack, isPlaying } = usePlayer();
  const { user } = useAuth();
  const active = currentTrack?._id === track._id;
  const [liked, setLiked] = React.useState(false);

  React.useEffect(() => {
    if (user && track.likes) {
      setLiked(track.likes.includes(user._id));
    }
  }, [user, track.likes]);

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!user) return;
    try {
      const res = await api.put(`/tracks/${track._id}/like`);
      setLiked(res.data.liked);
    } catch {}
  };

  return (
    <div
      className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 hover:bg-white/5 cursor-pointer ${active ? "bg-audora-accent/10" : ""}`}
      onClick={() => playTrack(track, list)}
    >
      {/* Index / Playing indicator */}
      <div className="w-8 flex-shrink-0 text-center">
        {active && isPlaying ? (
          <div className="flex items-end justify-center gap-0.5 h-5">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="wave-bar" style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        ) : (
          <span className={`text-sm font-mono ${active ? "text-audora-accent" : "text-audora-dim group-hover:hidden"}`}>
            {index !== undefined ? index + 1 : ""}
          </span>
        )}
        {!active && (
          <button className="hidden group-hover:block text-white" onClick={e => { e.stopPropagation(); playTrack(track, list); }}>
            ▶
          </button>
        )}
      </div>

      {/* Cover */}
      <img
        src={track.coverUrl || `https://picsum.photos/seed/${track._id}/100`}
        alt={track.title}
<<<<<<< HEAD
        onError={handleImgError}
=======
>>>>>>> 570b2c07dec63fb8d4465ce7f8b48bd8b9216b46
        className={`w-10 h-10 rounded-lg object-cover flex-shrink-0 ${active ? "ring-2 ring-audora-accent" : ""}`}
      />

      {/* Title + Artist */}
      <div className="flex-1 min-w-0">
        <Link
          to={`/track/${track._id}`}
          onClick={e => e.stopPropagation()}
          className={`block text-sm font-medium truncate hover:underline ${active ? "text-audora-accent" : "text-white"}`}
        >
          {track.title}
        </Link>
        <p className="text-xs text-audora-muted truncate">{track.artist}</p>
      </div>

      {/* Album */}
      <p className="hidden sm:block text-xs text-audora-dim truncate w-32 flex-shrink-0">
        {track.album || "—"}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {user && (
          <button
            onClick={handleLike}
            className={`text-sm transition-colors ${liked ? "text-audora-accent" : "text-audora-dim hover:text-white"}`}
          >
            {liked ? "♥" : "♡"}
          </button>
        )}
        {showRemove && onRemove && (
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(track._id); }}
            className="text-xs text-audora-dim hover:text-red-400 transition-colors px-2 py-1 rounded-lg hover:bg-red-400/10"
          >
            Remove
          </button>
        )}
      </div>

      {/* Duration */}
      <span className="text-xs text-audora-dim flex-shrink-0 w-10 text-right">
        {formatDuration(track.duration)}
      </span>
    </div>
  );
};

export default TrackListItem;
