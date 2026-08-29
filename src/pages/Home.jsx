import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import TrackCard from "../components/TrackCard";
import GenreChip from "../components/GenreChip";
import LoadingSpinner from "../components/LoadingSpinner";
import { usePlayer } from "../context/PlayerContext";
import { useAuth } from "../context/AuthContext";

const GENRES = ["Electronic", "Pop", "Hip-Hop", "Rock", "Jazz", "Ambient", "Classical", "R&B", "Indie", "Bollywood", "Chill"];

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
};

const Home = () => {
  const { user } = useAuth();
  const { recentlyPlayed, playQueue } = usePlayer();
  const [tracks, setTracks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/tracks?limit=24"),
      api.get("/tracks/genres/list"),
    ])
      .then(([tracksRes, genresRes]) => {
        setTracks(tracksRes.data.tracks);
        setGenres(genresRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-enter">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0">
          <div className="absolute top-10 left-1/4 w-64 h-64 bg-audora-accent/20 rounded-full blur-3xl" />
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-audora-green/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-audora-pink/10 rounded-full blur-3xl" />
        </div>

        <div className="relative px-6 pt-12 pb-10">
          <p className="text-audora-muted text-sm font-medium mb-1">
            {getGreeting()}{user ? `, ${user.name?.split(" ")[0]}` : ""}! 👋
          </p>
          <h1 className="font-display text-4xl lg:text-5xl font-black text-white mb-3 leading-tight">
            Your Music,
            <span className="gradient-text"> Your World</span>
          </h1>
          <p className="text-audora-muted text-lg mb-8 max-w-lg">
            Discover, stream, and collect music that moves you.
          </p>

          <div className="flex items-center gap-3">
            {tracks.length > 0 && (
              <button
                id="hero-play-all-btn"
                onClick={() => playQueue(tracks, 0)}
                className="btn-primary flex items-center gap-2 text-base"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Play All
              </button>
            )}
            <Link to="/search" className="btn-secondary flex items-center gap-2 text-base">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Explore
            </Link>
          </div>
        </div>
      </div>

      <div className="px-6 pb-8 space-y-10">
        {/* Genre Chips */}
        <section>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-audora-accent inline-block" />
            Browse Genres
          </h2>
          <div className="flex gap-2 flex-wrap">
            {(genres.length > 0 ? genres : GENRES).map((g) => (
              <GenreChip key={g} genre={g} size="md" />
            ))}
          </div>
        </section>

        {/* Recently Played */}
        {recentlyPlayed.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-5 rounded-full bg-audora-pink inline-block" />
              Recently Played
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {recentlyPlayed.slice(0, 6).map((t) => (
                <TrackCard key={t._id} track={t} list={recentlyPlayed} />
              ))}
            </div>
          </section>
        )}

        {/* Trending / Recommended Tracks */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-1 h-5 rounded-full bg-audora-green inline-block" />
              Trending Now
            </h2>
            <Link
              to="/search"
              className="text-sm text-audora-muted hover:text-audora-accentLight transition-colors"
            >
              See all →
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" text="Loading music..." />
            </div>
          ) : tracks.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 text-center">
              <p className="text-4xl mb-3">🎵</p>
              <p className="text-audora-muted mb-2">No tracks yet</p>
              <p className="text-sm text-audora-dim">
                Run <code className="bg-white/10 px-1.5 py-0.5 rounded text-audora-accentLight">npm run seed</code> in the backend to load sample tracks.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {tracks.map((t) => (
                <TrackCard key={t._id} track={t} list={tracks} />
              ))}
            </div>
          )}
        </section>

        {/* Genre Spotlight — pick a random genre */}
        {genres.length > 0 && tracks.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-5 rounded-full bg-audora-blue inline-block" />
              Featured: {genres[0]}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {tracks
                .filter((t) => t.genre?.toLowerCase() === genres[0]?.toLowerCase())
                .slice(0, 6)
                .map((t) => (
                  <TrackCard key={t._id} track={t} list={tracks} />
                ))}
            </div>
            {tracks.filter((t) => t.genre?.toLowerCase() === genres[0]?.toLowerCase()).length === 0 && (
              <Link to={`/genre/${encodeURIComponent(genres[0])}`} className="text-sm text-audora-accentLight hover:underline">
                Browse {genres[0]} →
              </Link>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default Home;
