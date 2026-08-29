import React from "react";
import { Link } from "react-router-dom";

const GENRE_COLORS = {
  Electronic: "from-blue-600/30 to-cyan-500/20 border-blue-500/30 text-blue-300",
  Pop: "from-pink-600/30 to-rose-500/20 border-pink-500/30 text-pink-300",
  "Hip-Hop": "from-orange-600/30 to-amber-500/20 border-orange-500/30 text-orange-300",
  Rock: "from-red-600/30 to-rose-700/20 border-red-500/30 text-red-300",
  Jazz: "from-yellow-600/30 to-amber-400/20 border-yellow-500/30 text-yellow-300",
  Ambient: "from-teal-600/30 to-emerald-500/20 border-teal-500/30 text-teal-300",
  Classical: "from-purple-600/30 to-violet-500/20 border-purple-500/30 text-purple-300",
  "R&B": "from-fuchsia-600/30 to-purple-500/20 border-fuchsia-500/30 text-fuchsia-300",
  Indie: "from-green-600/30 to-emerald-500/20 border-green-500/30 text-green-300",
  Bollywood: "from-orange-500/30 to-yellow-500/20 border-orange-400/30 text-orange-200",
  Chill: "from-sky-600/30 to-blue-500/20 border-sky-500/30 text-sky-300",
};

const GENRE_ICONS = {
  Electronic: "⚡",
  Pop: "🎵",
  "Hip-Hop": "🎤",
  Rock: "🎸",
  Jazz: "🎷",
  Ambient: "🌊",
  Classical: "🎻",
  "R&B": "💜",
  Indie: "🌿",
  Bollywood: "🪷",
  Chill: "☁️",
};

const GenreChip = ({ genre, size = "md", active = false, onClick }) => {
  const colorClass = GENRE_COLORS[genre] || "from-audora-accent/30 to-audora-accentLight/20 border-audora-accent/30 text-audora-accentLight";
  const icon = GENRE_ICONS[genre] || "🎶";

  const sizeClass = size === "sm"
    ? "px-3 py-1.5 text-xs"
    : size === "lg"
    ? "px-5 py-3 text-base"
    : "px-4 py-2 text-sm";

  const content = (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 ${sizeClass} rounded-full border bg-gradient-to-r font-medium cursor-pointer transition-all duration-200 hover:scale-105 hover:brightness-125 select-none ${colorClass} ${active ? "ring-2 ring-white/30 scale-105" : ""}`}
    >
      <span>{icon}</span>
      <span>{genre}</span>
    </span>
  );

  if (onClick) return content;

  return <Link to={`/genre/${encodeURIComponent(genre)}`}>{content}</Link>;
};

export { GENRE_COLORS, GENRE_ICONS };
export default GenreChip;
