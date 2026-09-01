import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import { usePlayer } from "../context/PlayerContext";
import { useAuth } from "../context/AuthContext";
import CommentSection from "../components/CommentSection";
import AddToPlaylist from "../components/AddToPlaylist";
import ShareButtons from "../components/ShareButtons";
import TrackCard from "../components/TrackCard";
import LoadingSpinner from "../components/LoadingSpinner";
import GenreChip from "../components/GenreChip";
<<<<<<< HEAD
import { downloadTrackFile } from "../utils/download";
import { handleImgError } from "../utils/image";
=======
>>>>>>> 570b2c07dec63fb8d4465ce7f8b48bd8b9216b46

const formatDuration = (secs) => {
  if (!secs) return "";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

const TrackDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { playTrack, currentTrack, isPlaying, togglePlay } = usePlayer();
  const [track, setTrack] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [related, setRelated] = useState([]);
  const [shareOpen, setShareOpen] = useState(false);
<<<<<<< HEAD
  const [downloading, setDownloading] = useState(false);
=======
>>>>>>> 570b2c07dec63fb8d4465ce7f8b48bd8b9216b46

  useEffect(() => {
    setTrack(null);
    api.get(`/tracks/${id}`).then((res) => {
      setTrack(res.data);
      setLikesCount(res.data.likes.length);
      if (user) setLiked(res.data.likes.includes(user._id));
      // Fetch related by same genre
      if (res.data.genre) {
        api
          .get(`/tracks?genre=${encodeURIComponent(res.data.genre)}&limit=6`)
          .then((r) => setRelated(r.data.tracks.filter((t) => t._id !== res.data._id)));
      }
    });
  }, [id, user]);

  const handleLike = async () => {
    if (!user) return alert("Log in to like tracks");
    const res = await api.put(`/tracks/${id}/like`);
    setLiked(res.data.liked);
    setLikesCount(res.data.likesCount);
  };

  const handleCommentAdded = (comment) => {
    setTrack((prev) => ({ ...prev, comments: [...prev.comments, comment] }));
  };

<<<<<<< HEAD
  const handleDownload = async () => {
    if (!user) return alert("Log in to download");
    if (downloading) return;
    setDownloading(true);
    try {
      await downloadTrackFile(track);
    } catch {
      alert("Download failed. Please try again.");
    } finally {
      setDownloading(false);
    }
=======
  const handleDownload = () => {
    if (!user) return alert("Log in to download");
    const token = localStorage.getItem("audora_token");
    window.open(
      `${import.meta.env.VITE_API_URL || "http://localhost:5004/api"}/tracks/${id}/download`,
      "_blank"
    );
>>>>>>> 570b2c07dec63fb8d4465ce7f8b48bd8b9216b46
  };

  if (!track) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" text="Loading track..." />
      </div>
    );
  }

  const active = currentTrack?._id === track._id;

  return (
    <div className="page-enter">
      {/* Hero Section with blurred background */}
      <div className="relative overflow-hidden">
        {/* Blurred background cover */}
        <div
          className="absolute inset-0 scale-110"
          style={{
            backgroundImage: `url(${track.coverUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(40px) brightness(0.3) saturate(1.5)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-audora-bg/60 to-audora-bg" />

        <div className="relative px-6 pt-10 pb-8">
          <div className="flex gap-6 items-end max-w-4xl">
            {/* Album Art */}
            <div className={`relative flex-shrink-0 ${active && isPlaying ? "animate-pulse-glow" : ""}`}>
              <img
                src={track.coverUrl}
                alt={track.title}
<<<<<<< HEAD
                onError={handleImgError}
=======
>>>>>>> 570b2c07dec63fb8d4465ce7f8b48bd8b9216b46
                className="w-36 h-36 lg:w-48 lg:h-48 rounded-2xl object-cover shadow-card"
                style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.6)" }}
              />
              {active && isPlaying && (
                <div className="absolute -inset-1 rounded-2xl ring-2 ring-audora-accent/50 animate-pulse" />
              )}
            </div>

            {/* Track Info */}
            <div className="min-w-0 flex-1">
              <p className="text-xs uppercase text-audora-muted font-semibold tracking-widest mb-1">
                {track.movie ? "Soundtrack" : "Track"}
              </p>
              <h1 className="font-display text-3xl lg:text-4xl font-black text-white mb-2 leading-tight">
                {track.title}
              </h1>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-audora-muted font-medium">{track.artist}</span>
                {track.album && (
                  <>
                    <span className="text-audora-dim">•</span>
                    <span className="text-audora-muted">{track.album}</span>
                  </>
                )}
                {track.movie && (
                  <>
                    <span className="text-audora-dim">•</span>
                    <span className="text-audora-pink text-sm">🎬 {track.movie}</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap text-sm text-audora-dim mb-4">
                {track.genre && <GenreChip genre={track.genre} size="sm" />}
                {track.duration && <span>{formatDuration(track.duration)}</span>}
                <span>• {likesCount} likes</span>
                <span>• {track.comments?.length || 0} comments</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 flex-wrap">
                {/* Play / Pause */}
                <button
                  id="track-play-btn"
                  onClick={() => active ? togglePlay() : playTrack(track, [track])}
                  className="btn-primary flex items-center gap-2 text-base px-6 py-3"
                >
                  {active && isPlaying ? (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                      </svg>
                      Pause
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                      Play
                    </>
                  )}
                </button>

                {/* Like */}
                <button
                  id="track-like-btn"
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all duration-200 font-medium hover:scale-105 ${
                    liked
                      ? "bg-audora-accent/20 border-audora-accent text-audora-accent"
                      : "border-white/20 text-audora-muted hover:border-white/40 hover:text-white"
                  }`}
                >
                  {liked ? "♥" : "♡"} {likesCount}
                </button>

                {/* Add to Playlist */}
                <AddToPlaylist trackId={track._id} />

                {/* Download */}
                <button
                  id="track-download-btn"
                  onClick={handleDownload}
<<<<<<< HEAD
                  disabled={downloading}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-white/20 text-audora-muted hover:border-audora-green hover:text-audora-green transition-all duration-200 font-medium hover:scale-105 disabled:opacity-50"
                  title="Download"
                >
                  {downloading ? (
                    <span className="w-4 h-4 border border-audora-muted border-t-audora-green rounded-full animate-spin" />
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  )}
                  {downloading ? "Downloading..." : "Download"}
=======
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-white/20 text-audora-muted hover:border-audora-green hover:text-audora-green transition-all duration-200 font-medium hover:scale-105"
                  title="Download"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
>>>>>>> 570b2c07dec63fb8d4465ce7f8b48bd8b9216b46
                </button>

                {/* Share toggle */}
                <button
                  id="track-share-toggle-btn"
                  onClick={() => setShareOpen((o) => !o)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-white/20 text-audora-muted hover:border-white/40 hover:text-white transition-all duration-200 font-medium"
                >
                  ↗ Share
                </button>
              </div>

              {/* Share buttons (expandable) */}
              {shareOpen && (
                <div className="mt-4 animate-slide-up">
                  <ShareButtons track={track} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="px-6 pb-8 max-w-4xl space-y-8">
        {/* Comments */}
        <CommentSection
<<<<<<< HEAD
          targetId={id}
          type="track"
=======
          trackId={id}
>>>>>>> 570b2c07dec63fb8d4465ce7f8b48bd8b9216b46
          comments={track.comments}
          onCommentAdded={handleCommentAdded}
        />

        {/* Related Tracks */}
        {related.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-5 rounded-full bg-audora-blue inline-block" />
              More {track.genre} Tracks
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {related.map((t) => (
                <TrackCard key={t._id} track={t} list={related} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default TrackDetail;
