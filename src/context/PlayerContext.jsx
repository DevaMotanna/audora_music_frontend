<<<<<<< HEAD
import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";
import { Howl } from "howler";
=======
import React, { createContext, useContext, useState, useRef, useEffect } from "react";
>>>>>>> 570b2c07dec63fb8d4465ce7f8b48bd8b9216b46

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

<<<<<<< HEAD
// Available playback speeds — the "customizable playback settings" Howler enables.
export const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 2];

export const PlayerProvider = ({ children }) => {
  const howlRef = useRef(null);
  const rafRef = useRef(null);

=======
export const PlayerProvider = ({ children }) => {
  const audioRef = useRef(new Audio());
>>>>>>> 570b2c07dec63fb8d4465ce7f8b48bd8b9216b46
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(() => {
    try { return Number(localStorage.getItem("audora_volume") ?? 1); } catch { return 1; }
  });
<<<<<<< HEAD
  const [playbackRate, setPlaybackRate] = useState(() => {
    try { return Number(localStorage.getItem("audora_rate") ?? 1); } catch { return 1; }
  });
=======
>>>>>>> 570b2c07dec63fb8d4465ce7f8b48bd8b9216b46
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [recentlyPlayed, setRecentlyPlayed] = useState(loadRecentFromStorage);

  const currentTrack = currentIndex >= 0 ? queue[currentIndex] : null;

<<<<<<< HEAD
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
=======
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
>>>>>>> 570b2c07dec63fb8d4465ce7f8b48bd8b9216b46

  const addToRecent = (track) => {
    setRecentlyPlayed((prev) => {
      const filtered = prev.filter((t) => t._id !== track._id);
      const updated = [track, ...filtered].slice(0, MAX_RECENT);
      saveRecentToStorage(updated);
      return updated;
    });
  };

<<<<<<< HEAD
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
=======
  const playTrackAt = (list, index) => {
    setQueue(list);
    setCurrentIndex(index);
    setIsPlaying(true);
>>>>>>> 570b2c07dec63fb8d4465ce7f8b48bd8b9216b46
  };

  const playTrack = (track, contextList = null) => {
    const list = contextList || [track];
    const idx = list.findIndex((t) => t._id === track._id);
    playTrackAt(list, idx === -1 ? 0 : idx);
  };

  const togglePlay = () => {
<<<<<<< HEAD
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
=======
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
>>>>>>> 570b2c07dec63fb8d4465ce7f8b48bd8b9216b46
    setProgress(time);
  };

  const playQueue = (list, startIndex = 0) => {
    setQueue(list);
    setCurrentIndex(startIndex);
<<<<<<< HEAD
=======
    setIsPlaying(true);
>>>>>>> 570b2c07dec63fb8d4465ce7f8b48bd8b9216b46
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        progress,
        duration,
        volume,
<<<<<<< HEAD
        playbackRate,
=======
>>>>>>> 570b2c07dec63fb8d4465ce7f8b48bd8b9216b46
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
<<<<<<< HEAD
        setPlaybackRate,
=======
>>>>>>> 570b2c07dec63fb8d4465ce7f8b48bd8b9216b46
        setShuffle,
        setRepeat,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
