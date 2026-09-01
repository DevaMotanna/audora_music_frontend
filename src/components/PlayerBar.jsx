import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { usePlayer, PLAYBACK_RATES } from "../context/PlayerContext";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { downloadTrackFile } from "../utils/download";
import { handleImgError } from "../utils/image";

const formatTime = (secs) => {
  if (!secs || Number.isNaN(secs)) return "0:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

const PlayerBar = () => {
  const {
    currentTrack, isPlaying, progress, duration, volume, playbackRate, shuffle, repeat,
    togglePlay, playNext, playPrev, seek, setVolume, setPlaybackRate, setShuffle, setRepeat,
  } = usePlayer();
  const { user } = useAuth();

  const progressRef = useRef(null);
  const progressPercent = duration ? (progress / duration) * 100 : 0;

  // CSS variable for custom range fill
  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.style.setProperty("--progress", `${progressPercent}%`);
    }
  }, [progressPercent]);

  const volumeRef = useRef(null);
  useEffect(() => {
    if (volumeRef.current) {
      volumeRef.current.style.setProperty("--progress", `${volume * 100}%`);
    }
  }, [volume]);

  const [downloading, setDownloading] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  const handleDownload = async () => {
    if (!user) return alert("Log in to download tracks");
    if (downloading) return;
    setDownloading(true);
    try {
      await downloadTrackFile(currentTrack);
    } catch {
      alert("Download failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-audora-border">
      {/* Progress bar at very top */}
      <div className="relative w-full h-1 bg-white/10 group cursor-pointer"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const pct = (e.clientX - rect.left) / rect.width;
          seek(pct * duration);
        }}
      >
        <div
          className="h-full bg-gradient-to-r from-audora-accent to-audora-green transition-all duration-100"
          style={{ width: `${progressPercent}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-glow opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `calc(${progressPercent}% - 6px)` }}
        />
      </div>

      <div className="px-4 py-2 lg:py-3 flex items-center gap-3 lg:gap-6">
        {/* Track Info */}
        <div className="flex items-center gap-3 w-48 lg:w-64 min-w-0 flex-shrink-0">
          <div className="relative flex-shrink-0">
            <img
              src={currentTrack.coverUrl || "https://picsum.photos/seed/default/100"}
              alt={currentTrack.title}
              onError={handleImgError}
              className={`w-11 h-11 lg:w-13 lg:h-13 rounded-xl object-cover ${isPlaying ? "vinyl-playing" : ""}`}
              style={{ borderRadius: "50%" }}
            />
            {isPlaying && (
              <div className="absolute inset-0 rounded-full ring-2 ring-audora-accent/50 animate-pulse" />
            )}
          </div>
          <div className="min-w-0">
            <Link
              to={`/track/${currentTrack._id}`}
              className="block text-sm font-semibold text-white truncate hover:text-audora-accentLight transition-colors"
            >
              {currentTrack.title}
            </Link>
            <p className="text-xs text-audora-muted truncate">{currentTrack.artist}</p>
          </div>
        </div>

        {/* Center Controls */}
        <div className="flex-1 flex flex-col items-center gap-1.5 min-w-0">
          {/* Buttons */}
          <div className="flex items-center gap-3 lg:gap-5">
            {/* Shuffle */}
            <button
              id="player-shuffle-btn"
              onClick={() => setShuffle(!shuffle)}
              title="Shuffle"
              className={`transition-all duration-200 hover:scale-110 ${shuffle ? "text-audora-accent" : "text-audora-dim hover:text-white"}`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
              </svg>
            </button>

            {/* Prev */}
            <button
              id="player-prev-btn"
              onClick={playPrev}
              title="Previous"
              className="text-audora-muted hover:text-white transition-all duration-200 hover:scale-110"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
              </svg>
            </button>

            {/* Play/Pause */}
            <button
              id="player-playpause-btn"
              onClick={togglePlay}
              title={isPlaying ? "Pause" : "Play"}
              className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-all duration-200 shadow-glow flex-shrink-0"
            >
              {isPlaying ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
              ) : (
                <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </button>

            {/* Next */}
            <button
              id="player-next-btn"
              onClick={playNext}
              title="Next"
              className="text-audora-muted hover:text-white transition-all duration-200 hover:scale-110"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zm2-8.14L11.03 12 8 14.14V9.86zM16 6h2v12h-2z"/>
              </svg>
            </button>

            {/* Repeat */}
            <button
              id="player-repeat-btn"
              onClick={() => setRepeat(!repeat)}
              title="Repeat"
              className={`transition-all duration-200 hover:scale-110 ${repeat ? "text-audora-accent" : "text-audora-dim hover:text-white"}`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
              </svg>
            </button>
          </div>

          {/* Time + Seek bar */}
          <div className="hidden sm:flex items-center gap-2 w-full max-w-md text-xs text-audora-muted">
            <span className="w-8 text-right tabular-nums">{formatTime(progress)}</span>
            <input
              ref={progressRef}
              type="range"
              min={0}
              max={duration || 0}
              value={progress}
              onChange={(e) => seek(Number(e.target.value))}
              className="flex-1 progress-bar"
              id="player-progress-slider"
            />
            <span className="w-8 tabular-nums">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
          {/* Wave animation when playing */}
          {isPlaying && (
            <div className="hidden lg:flex items-end gap-0.5 h-5">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="wave-bar" style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          )}

          {/* Playback speed */}
          <div className="relative hidden md:block">
            <button
              id="player-speed-btn"
              onClick={() => setShowSpeedMenu((o) => !o)}
              title="Playback speed"
              className={`text-xs font-semibold px-2 py-1 rounded-md border transition-all duration-200 ${
                playbackRate !== 1
                  ? "border-audora-accent/50 text-audora-accent"
                  : "border-white/10 text-audora-dim hover:text-white hover:border-white/30"
              }`}
            >
              {playbackRate}x
            </button>
            {showSpeedMenu && (
              <div className="absolute bottom-full mb-2 right-0 glass-strong rounded-lg border border-audora-border py-1 min-w-[64px] shadow-card z-10">
                {PLAYBACK_RATES.map((rate) => (
                  <button
                    key={rate}
                    onClick={() => { setPlaybackRate(rate); setShowSpeedMenu(false); }}
                    className={`block w-full text-left px-3 py-1.5 text-xs transition-colors ${
                      rate === playbackRate ? "text-audora-accent font-semibold" : "text-audora-muted hover:text-white"
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Download */}
          {user && (
            <button
              id="player-download-btn"
              onClick={handleDownload}
              disabled={downloading}
              title="Download"
              className="text-audora-dim hover:text-audora-green transition-all duration-200 hover:scale-110 disabled:opacity-40"
            >
              {downloading ? (
                <span className="block w-4 h-4 border border-audora-dim border-t-audora-green rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              )}
            </button>
          )}

          {/* Volume */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setVolume(volume === 0 ? 0.7 : 0)}
              className="text-audora-dim hover:text-white transition-colors"
            >
              {volume === 0 ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16.5 12A4.5 4.5 0 0014 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0021 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06A8.99 8.99 0 0016 18.73L19.73 22 21 20.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 7.97v8.05A4.497 4.497 0 0016.5 12z"/>
                </svg>
              )}
            </button>
            <input
              ref={volumeRef}
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-20 lg:w-24 progress-bar"
              id="player-volume-slider"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerBar;
