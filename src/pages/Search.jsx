import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../api/axios";
import TrackCard from "../components/TrackCard";
import TrackListItem from "../components/TrackListItem";
import GenreChip from "../components/GenreChip";
import LoadingSpinner from "../components/LoadingSpinner";

const GENRES = ["Electronic", "Pop", "Hip-Hop", "Rock", "Jazz", "Ambient", "Classical", "R&B", "Indie", "Bollywood", "Chill"];

const Search = () => {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const genreParam = params.get("genre") || "";

  const [localQ, setLocalQ] = useState(q);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // grid | list
  const [genres, setGenres] = useState([]);

  // Fetch genres on mount
  useEffect(() => {
    api.get("/tracks/genres/list").then((r) => setGenres(r.data)).catch(() => {});
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      const qs = {};
      if (localQ.trim()) qs.q = localQ.trim();
      if (genreParam) qs.genre = genreParam;
      setParams(qs, { replace: true });
    }, 350);
    return () => clearTimeout(timer);
  }, [localQ, genreParam]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch tracks on param change
  useEffect(() => {
    setLoading(true);
    const queryStr = new URLSearchParams();
    if (q) queryStr.set("search", q);
    if (genreParam) queryStr.set("genre", genreParam);
    queryStr.set("limit", "50");

    api
      .get(`/tracks?${queryStr.toString()}`)
      .then((res) => setTracks(res.data.tracks))
      .catch(() => setTracks([]))
      .finally(() => setLoading(false));
  }, [q, genreParam]);

  const toggleGenre = (g) => {
    const newParams = {};
    if (q) newParams.q = q;
    newParams.genre = genreParam === g ? "" : g;
    if (!newParams.genre) delete newParams.genre;
    setParams(newParams, { replace: true });
  };

  const allGenres = genres.length > 0 ? genres : GENRES;
  const hasQuery = q || genreParam;

  return (
    <div className="px-6 pt-6 page-enter">
      {/* Search Bar (desktop — mobile uses navbar) */}
      <div className="hidden lg:block mb-6">
        <div className="relative max-w-xl">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-audora-dim" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            id="desktop-search-input"
            type="text"
            value={localQ}
            onChange={(e) => setLocalQ(e.target.value)}
            placeholder="Search songs, artists, albums, movies..."
            className="w-full input-field pl-12 pr-4 py-3.5 text-base rounded-2xl"
            autoFocus
          />
          {localQ && (
            <button
              onClick={() => setLocalQ("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-audora-dim hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Genre Filter Pills */}
      <div className="mb-6">
        <p className="text-xs text-audora-dim uppercase tracking-wider mb-2 font-semibold">Filter by Genre</p>
        <div className="flex gap-2 flex-wrap">
          {allGenres.map((g) => (
            <GenreChip
              key={g}
              genre={g}
              size="sm"
              active={genreParam === g}
              onClick={() => toggleGenre(g)}
            />
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-white">
            {!hasQuery
              ? "All Tracks"
              : q && genreParam
              ? `"${q}" in ${genreParam}`
              : q
              ? `Results for "${q}"`
              : `${genreParam} Music`}
          </h1>
          {!loading && (
            <p className="text-sm text-audora-muted mt-0.5">{tracks.length} tracks found</p>
          )}
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 glass-card rounded-xl p-1">
          <button
            id="view-grid-btn"
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-audora-accent text-white" : "text-audora-dim hover:text-white"}`}
            title="Grid view"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 3h7v7H3zm0 11h7v7H3zm11-11h7v7h-7zm0 11h7v7h-7z"/>
            </svg>
          </button>
          <button
            id="view-list-btn"
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-audora-accent text-white" : "text-audora-dim hover:text-white"}`}
            title="List view"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 4h2v2H3zm4 0h14v2H7zM3 9h2v2H3zm4 0h14v2H7zM3 14h2v2H3zm4 0h14v2H7zM3 19h2v2H3zm4 0h14v2H7z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" text="Searching..." />
        </div>
      ) : tracks.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <p className="text-5xl mb-4">🔍</p>
          <h3 className="text-lg font-semibold text-white mb-2">No tracks found</h3>
          <p className="text-audora-muted text-sm">
            Try a different search term or genre filter.
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 animate-fade-in">
          {tracks.map((t) => (
            <TrackCard key={t._id} track={t} list={tracks} />
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-3 space-y-1 animate-fade-in">
          {tracks.map((t, i) => (
            <TrackListItem key={t._id} track={t} list={tracks} index={i} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
