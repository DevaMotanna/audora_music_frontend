import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";
import { Howl } from "howler";

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

// Available playback speeds — the "customizable playback settings" Howler enables.
export const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 2];

export const PlayerProvider = ({ children }) => {
  const howlRef = useRef(null);
  const rafRef = useRef(null);

  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(() => {
    try { return Number(localStorage.getItem("audora_volume") ?? 1); } catch { return 1; }
  });
  const [playbackRate, setPlaybackRate] = useState(() => {
    try { return Number(localStorage.getItem("audora_rate") ?? 1); } catch { return 1; }
  });
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [recentlyPlayed, setRecentlyPlayed] = useState(loadRecentFromStorage);

  const currentTrack = currentIndex >= 0 ? queue[currentIndex] : null;

  // Refs mirror state so Howler's callbacks (registered once per track) always
  // see fresh values instead of the values captured when the Howl was created.
  const repeatRef = useRef(repeat);
  useEffect(() => { repeatRef.current = repeat; }, [repeat]);
  const shuffleRef = useRef(shuffle);
  useEffect(() => { shuffleRef.current = shuffle; }, [shuffle]);
  const queueRef = useRef(queue);
  useEffect(() => { queueRef.current = queue; }, [queue]);
  const currentIndexRef = useRef(currentIndex);
  useEffect(() => { currentIndexRef.current = currentIndex; }, [currentIndex]);

  const stopProgressLoop = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  };

  const startProgressLoop = () => {
    stopProgressLoop();
    const tick = () => {
      const howl = howlRef.current;
      if (howl && howl.playing()) {
        setProgress(howl.seek() || 0);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const addToRecent = (track) => {
    setRecentlyPlayed((prev) => {
      const filtered = prev.filter((t) => t._id !== track._id);
      const updated = [track, ...filtered].slice(0, MAX_RECENT);
      saveRecentToStorage(updated);
      return updated;
    });
  };

  const playNext = useCallback(() => {
    const q = queueRef.current;
    if (q.length === 0) return;
    let nextIndex;
    if (shuffleRef.current) {
      const remaining = q.map((_, i) => i).filter((i) => i !== currentIndexRef.current);
      nextIndex = remaining.length > 0
        ? remaining[Math.floor(Math.random() * remaining.length)]
        : currentIndexRef.current;
    } else {
      nextIndex = (currentIndexRef.current + 1) % q.length;
    }
    setCurrentIndex(nextIndex);
  }, []);

  const playNextRef = useRef(playNext);
  useEffect(() => { playNextRef.current = playNext; }, [playNext]);

  // Create (and tear down) a Howl instance whenever the current track changes.
  useEffect(() => {
    stopProgressLoop();
    if (howlRef.current) {
      howlRef.current.unload();
      howlRef.current = null;
    }
    setProgress(0);
    setDuration(0);

    if (!currentTrack) return;

    const howl = new Howl({
      src: [currentTrack.audioUrl],
      html5: true, // stream instead of buffering the whole file — needed for seeking large files and for rate/volume control via the underlying <audio> element
      volume,
      rate: playbackRate,
      onload: () => setDuration(howl.duration() || 0),
      onplay: () => { setIsPlaying(true); startProgressLoop(); },
      onpause: () => { setIsPlaying(false); stopProgressLoop(); },
      onstop: () => { setIsPlaying(false); stopProgressLoop(); },
      onend: () => {
        if (repeatRef.current) {
          howl.seek(0);
          howl.play();
          return;
        }
        playNextRef.current();
      },
      onplayerror: () => {
        // Autoplay can be blocked until a user gesture unlocks audio — retry once it does.
        howl.once("unlock", () => howl.play());
      },
    });

    howlRef.current = howl;
    howl.play();
    addToRecent(currentTrack);

    return () => {
      stopProgressLoop();
      howl.unload();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack?._id]);

  // Volume: persist + apply live to whatever's currently loaded
  useEffect(() => {
    if (howlRef.current) howlRef.current.volume(volume);
    try { localStorage.setItem("audora_volume", String(volume)); } catch {}
  }, [volume]);

  // Playback rate: persist + apply live — this is the "customizable playback settings" control
  useEffect(() => {
    if (howlRef.current) howlRef.current.rate(playbackRate);
    try { localStorage.setItem("audora_rate", String(playbackRate)); } catch {}
  }, [playbackRate]);

  // Unload on unmount
  useEffect(() => {
    return () => {
      stopProgressLoop();
      if (howlRef.current) howlRef.current.unload();
    };
  }, []);

  const playTrackAt = (list, index) => {
    setQueue(list);
    setCurrentIndex(index);
  };

  const playTrack = (track, contextList = null) => {
    const list = contextList || [track];
    const idx = list.findIndex((t) => t._id === track._id);
    playTrackAt(list, idx === -1 ? 0 : idx);
  };

  const togglePlay = () => {
    const howl = howlRef.current;
    if (!howl) return;
    if (howl.playing()) {
      howl.pause();
    } else {
      howl.play();
    }
  };

  const playPrev = () => {
    const q = queueRef.current;
    if (q.length === 0) return;
    const howl = howlRef.current;
    // If more than 3 seconds in, restart current track instead of going back
    if (howl && howl.seek() > 3) {
      howl.seek(0);
      setProgress(0);
      return;
    }
    const prevIndex = (currentIndexRef.current - 1 + q.length) % q.length;
    setCurrentIndex(prevIndex);
  };

  const seek = (time) => {
    const howl = howlRef.current;
    if (howl) howl.seek(time);
    setProgress(time);
  };

  const playQueue = (list, startIndex = 0) => {
    setQueue(list);
    setCurrentIndex(startIndex);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        progress,
        duration,
        volume,
        playbackRate,
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
        setPlaybackRate,
        setShuffle,
        setRepeat,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
