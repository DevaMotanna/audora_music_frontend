import React, { useState } from "react";
import { Link } from "react-router-dom";
import { usePlayer } from "../context/PlayerContext";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import GenreChip from "./GenreChip";
import { handleImgError } from "../utils/image";

const formatDuration = (secs) => {
  if (!secs) return "";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

const TrackCard = ({ track, list }) => {
  const { playTrack, currentTrack, isPlaying } = usePlayer();
  const { user } = useAuth();
  const active = currentTrack?._id === track._id;

  const [liked, setLiked] = useState(() => {
    if (user && track.likes) return track.likes.includes(user._id);
    return false;
  });
  const [likesCount, setLikesCount] = useState(track.likes?.length || 0);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    try {
      const res = await api.put(`/tracks/${track._id}/like`);
      setLiked(res.data.liked);
      setLikesCount(res.data.likesCount);
    } catch {}
  };

  const handlePlay = (e) => {
    e.preventDefault();
    e.stopPropagation();
    playTrack(track, list);
  };

  return (
    <div className={`group glass-card rounded-2xl p-3 transition-all duration-300 hover:scale-[1.03] hover:shadow-glow hover:border-audora-accent/20 relative ${active ? "border-audora-accent/30 bg-audora-accent/5" : ""}`}>
      {/* Cover image */}
      <div className="relative mb-3 overflow-hidden rounded-xl aspect-square">
        <img
          src={track.coverUrl || `https://picsum.photos/seed/${track._id}/400`}
          alt={track.title}
          onError={handleImgError}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${active && isPlaying ? "" : ""}`}
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

        {/* Play button */}
        <button
          id={`play-btn-${track._id}`}
          onClick={handlePlay}
          aria-label={active && isPlaying ? "Pause" : "Play"}
          className={`absolute bottom-3 right-3 w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
            active
              ? "bg-audora-accent opacity-100 scale-100"
              : "bg-white opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-90"
          }`}
        >
          {active && isPlaying ? (
            <svg className={`w-5 h-5 ${active ? "text-white" : "text-black"}`} fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          ) : (
            <svg className="w-5 h-5 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>

        {/* Active wave indicator */}
        {active && isPlaying && (
          <div className="absolute top-2 left-2 flex items-end gap-0.5 bg-black/60 rounded-lg px-2 py-1">
            {[1,2,3].map(i => (
              <div key={i} className="wave-bar" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <Link
        to={`/track/${track._id}`}
        className={`block text-sm font-semibold truncate mb-0.5 hover:text-audora-accentLight transition-colors ${active ? "text-audora-accent" : "text-white"}`}
      >
        {track.title}
      </Link>
      <p className="text-xs text-audora-muted truncate mb-2">{track.artist}</p>

      {/* Footer row */}
      <div className="flex items-center justify-between">
        {track.genre && (
          <GenreChip genre={track.genre} size="sm" />
        )}
        <div className="flex items-center gap-2 ml-auto">
          {track.duration && (
            <span className="text-xs text-audora-dim">{formatDuration(track.duration)}</span>
          )}
          {user && (
            <button
              id={`like-btn-${track._id}`}
              onClick={handleLike}
              className={`text-sm transition-all duration-200 hover:scale-125 ${liked ? "text-audora-accent" : "text-audora-dim hover:text-white"}`}
              aria-label={liked ? "Unlike" : "Like"}
            >
              {liked ? "♥" : "♡"}
              {likesCount > 0 && <span className="text-xs ml-0.5">{likesCount}</span>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackCard;
