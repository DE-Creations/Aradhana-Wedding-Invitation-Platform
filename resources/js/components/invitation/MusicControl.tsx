import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

interface MusicControlProps {
  src: string;
  label?: string | null;
  /** Start playback as soon as this mounts — used when it's only rendered
   *  after the guest has already tapped the envelope open (a real gesture),
   *  instead of attempting silent/muted autoplay on page load. */
  autoPlay?: boolean;
}

// No page-load autoplay — mobile browsers (Android Chrome in particular) block
// it inconsistently, which left the player stuck needing a mute/unmute dance
// to actually start. Playback starts either from the envelope tap (autoPlay,
// this component only mounts after that tap) or a direct tap on the button.
export function MusicControl({ src, label, autoPlay = false }: MusicControlProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (autoPlay && audio) {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => {
          // Browser still blocked it — user can start it with the button.
        });
    }
    return () => {
      audio?.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  // Pause when the tab is backgrounded/minimized and resume when it comes
  // back — only if it was actually playing (not if the guest had paused it).
  useEffect(() => {
    const wasPlaying = { current: false };
    const handleVisibilityChange = () => {
      const audio = audioRef.current;
      if (!audio) return;
      if (document.hidden) {
        if (!audio.paused) {
          wasPlaying.current = true;
          audio.pause();
          setPlaying(false);
        }
      } else if (wasPlaying.current) {
        wasPlaying.current = false;
        audio
          .play()
          .then(() => setPlaying(true))
          .catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => {});
    }
  };

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={audioRef} src={src} loop preload="auto" playsInline />
      <motion.button
        aria-label={playing ? `Pause music${label ? ` — ${label}` : ""}` : `Play music${label ? ` — ${label}` : ""}`}
        title={playing ? "Pause background music" : "Play background music"}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.3 }}
        onClick={toggle}
        className="fixed bottom-4 right-4 z-50 flex items-center justify-center rounded-full bg-black/60 p-3 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-black/75"
      >
        {playing ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </motion.button>
    </>
  );
}
