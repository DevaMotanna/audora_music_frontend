import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import TrackCard from "../components/TrackCard";
import LoadingSpinner from "../components/LoadingSpinner";
import GenreChip, { GENRE_COLORS } from "../components/GenreChip";
import { usePlayer } from "../context/PlayerContext";

const Genre = () => {
  const { genre } = useParams();
  const decodedGenre = decodeURIComponent(genre);
  const { playQueue } = usePlayer();
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/tracks?genre=${encodeURIComponent(decodedGenre)}&limit=50`)
      .then((res) => setTracks(res.data.tracks))
      .catch(() => setTracks([]))
      .finally(() => setLoading(false));
  }, [decodedGenre]);

  const colorClass = GENRE_COLORS[decodedGenre] || "from-audora-accent/30 to-audora-green/20";
  const fromColor = colorClass.split(" ")[0].replace("from-", "").replace("/30", "");

  return (
    <div className="page-enter">
      {/* Genre Hero */}
      <div className="relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${colorClass.split(" ").slice(0, 2).join(" ")} opacity-40`} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-audora-bg" />
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl opacity-30 bg-current" style={{ color: fromColor }} />

        <div className="relative px-6 pt-12 pb-8">
          <Link to="/search" className="text-sm text-audora-muted hover:text-white transition-colors mb-4 inline-flex items-center gap-1.5">
            ← Back to Search
          </Link>

          <div className="flex items-center gap-4 mt-2 mb-4">
            <GenreChip genre={decodedGenre} size="lg" />
          </div>

          <h1 className="font-display text-4xl lg:text-5xl font-black text-white mb-2">
            {decodedGenre}
          </h1>
          <p className="text-audora-muted mb-6">
            {loading ? "Loading..." : `${tracks.length} tracks`}
          </p>

          {tracks.length > 0 && (
            <button
              id={`genre-play-all-btn`}
              onClick={() => playQueue(tracks, 0)}
              className="btn-primary flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              Play All {decodedGenre}
            </button>
          )}
        </div>
      </div>

      {/* Tracks */}
      <div className="px-6 pb-8">
        {loading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner size="lg" text={`Loading ${decodedGenre} tracks...`} />
          </div>
        ) : tracks.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center max-w-md mx-auto">
            <p className="text-5xl mb-4">🎵</p>
            <h3 className="text-lg font-semibold text-white mb-2">No tracks yet</h3>
            <p className="text-audora-muted text-sm mb-4">
              No {decodedGenre} tracks found in the library.
            </p>
            <Link to="/search" className="btn-primary">Browse All Music</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 animate-fade-in">
            {tracks.map((t) => (
              <TrackCard key={t._id} track={t} list={tracks} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Genre;
