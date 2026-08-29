import React, { createContext, useContext, useState, useRef, useEffect } from "react";

const PlayerContext = createContext(null);

const MAX_RECENT = 20;

const loadRecentFromStorage = () => {
  try {
    return JSON.parse(localStorage.getItem("audora_recent") || "[]");
  } catch {
    return [];
  }
};

const saveRecentToStorage = (tracks) => {
  try {
    localStorage.setItem("audora_recent", JSON.stringify(tracks.slice(0, MAX_RECENT)));
  } catch {}
};

export const PlayerProvider = ({ children }) => {
  const audioRef = useRef(new Audio());
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(() => {
    try { return Number(localStorage.getItem("audora_volume") ?? 1); } catch { return 1; }
  });
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [recentlyPlayed, setRecentlyPlayed] = useState(loadRecentFromStorage);

  const currentTrack = currentIndex >= 0 ? queue[currentIndex] : null;

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    const onTimeUpdate = () => setProgress(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onEnded = () => handleEnded();

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue, currentIndex, repeat, shuffle]);

  // Load and play when track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!currentTrack) return;
    if (audio.src !== currentTrack.audioUrl) {
      audio.src = currentTrack.audioUrl;
      setProgress(0);
    }
    if (isPlaying) {
      audio.play().catch(() => {});
    }
    // Track recently played
    addToRecent(currentTrack);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack]);

  // Volume persistence
  useEffect(() => {
    audioRef.current.volume = volume;
    try { localStorage.setItem("audora_volume", String(volume)); } catch {}
  }, [volume]);

  const addToRecent = (track) => {
    setRecentlyPlayed((prev) => {
      const filtered = prev.filter((t) => t._id !== track._id);
      const updated = [track, ...filtered].slice(0, MAX_RECENT);
      saveRecentToStorage(updated);
      return updated;
    });
  };

  const playTrackAt = (list, index) => {
    setQueue(list);
    setCurrentIndex(index);
    setIsPlaying(true);
  };

  const playTrack = (track, contextList = null) => {
    const list = contextList || [track];
    const idx = list.findIndex((t) => t._id === track._id);
    playTrackAt(list, idx === -1 ? 0 : idx);
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!currentTrack) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleEnded = () => {
    if (repeat) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
      return;
    }
    playNext();
  };

  const playNext = () => {
    if (queue.length === 0) return;
    let nextIndex;
    if (shuffle) {
      const remaining = queue.map((_, i) => i).filter((i) => i !== currentIndex);
      nextIndex = remaining.length > 0
        ? remaining[Math.floor(Math.random() * remaining.length)]
        : currentIndex;
    } else {
      nextIndex = (currentIndex + 1) % queue.length;
    }
    setCurrentIndex(nextIndex);
    setIsPlaying(true);
  };

  const playPrev = () => {
    if (queue.length === 0) return;
    // If more than 3 seconds in, restart current track
    if (audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    setCurrentIndex(prevIndex);
    setIsPlaying(true);
  };

  const seek = (time) => {
    audioRef.current.currentTime = time;
    setProgress(time);
  };

  const playQueue = (list, startIndex = 0) => {
    setQueue(list);
    setCurrentIndex(startIndex);
    setIsPlaying(true);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        progress,
        duration,
        volume,
        shuffle,
        repeat,
        queue,
        recentlyPlayed,
        playTrack,
        playQueue,
        togglePlay,
        playNext,
        playPrev,
        seek,
        setVolume,
        setShuffle,
        setRepeat,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
