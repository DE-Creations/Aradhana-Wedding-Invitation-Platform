import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

interface MusicControlProps {
  src: string;
  label?: string | null;
}

export function MusicControl({ src, label }: MusicControlProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(false);
  const unmutedOnGestureRef = useRef(false);

  // Attempt unmuted autoplay on mount. If the browser blocks it, fall back to
  // muted autoplay and silently unmute on the first user gesture.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = false;
    audio
      .play()
      .then(() => {
        setMuted(false);
      })
      .catch(() => {
        // Browser blocked unmuted autoplay — switch to muted and arm a one-shot
        // unmute on the first pointer/keyboard interaction.
        audio.muted = true;
        setMuted(true);
        audio.play().catch(() => {
          // Muted autoplay also blocked (very rare). User must tap the button.
        });

        const unmuteOnGesture = () => {
          if (unmutedOnGestureRef.current) return;
          unmutedOnGestureRef.current = true;
          audio.muted = false;
          setMuted(false);
          audio.play().catch(() => {});
        };

        window.addEventListener("pointerdown", unmuteOnGesture, { once: true });
        window.addEventListener("keydown", unmuteOnGesture, { once: true });
      });

    return () => {
      audio.pause();
    };
  }, [src]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const next = !muted;
    audio.muted = next;
    setMuted(next);
    if (!next) {
      audio.play().catch(() => {});
    }
  };

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={audioRef} src={src} loop preload="auto" playsInline />
      <motion.button
        aria-label={muted ? `Unmute music${label ? ` — ${label}` : ""}` : `Mute music`}
        title={muted ? "Unmute background music" : "Mute background music"}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.3 }}
        onClick={toggle}
        className="fixed bottom-4 right-4 z-50 flex items-center justify-center rounded-full bg-black/60 p-3 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-black/75"
      >
        {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </motion.button>
    </>
  );
}
