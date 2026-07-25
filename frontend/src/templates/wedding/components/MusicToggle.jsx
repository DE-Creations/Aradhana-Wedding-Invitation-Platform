import { useEffect, useRef, useState } from 'react'
import { Howl } from 'howler'
import { Music, VolumeX } from 'lucide-react'

/*
  Background music control (Howler.js).
  - loads only when a src is provided (no preloading of audio otherwise)
  - fades in over 2s, loops, subtle volume (0.3)
  - `autoStart` triggers playback once (after the envelope reveal)
*/
export default function MusicToggle({ src, autoStart = false }) {
  const soundRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!src) return

    const sound = new Howl({
      src: [src],
      loop: true,
      volume: 0,
      html5: true,
      onload: () => setReady(true),
    })
    soundRef.current = sound

    return () => {
      sound.unload()
      soundRef.current = null
    }
  }, [src])

  const play = () => {
    const sound = soundRef.current
    if (!sound) return
    sound.play()
    sound.fade(0, 0.3, 2000)
    setPlaying(true)
  }

  const pause = () => {
    const sound = soundRef.current
    if (!sound) return
    sound.fade(sound.volume(), 0, 600)
    setTimeout(() => sound.pause(), 600)
    setPlaying(false)
  }

  // Auto-start once after the envelope reveal.
  useEffect(() => {
    if (autoStart && ready && !playing) {
      play()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart, ready])

  if (!src) return null

  const toggle = () => (playing ? pause() : play())

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={playing ? 'Pause music' : 'Play music'}
      aria-pressed={playing}
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        width: 48,
        height: 48,
        borderRadius: '50%',
        border: '1px solid #C9A96E',
        background: 'rgba(13, 13, 13, 0.7)',
        color: '#C9A96E',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        backdropFilter: 'blur(4px)',
      }}
    >
      {playing ? (
        <span
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 2,
            height: 16,
          }}
        >
          <span className="eq-bar" style={{ animationDelay: '0s' }} />
          <span className="eq-bar" style={{ animationDelay: '0.15s' }} />
          <span className="eq-bar" style={{ animationDelay: '0.3s' }} />
          <span className="eq-bar" style={{ animationDelay: '0.45s' }} />
        </span>
      ) : src && !playing && ready ? (
        <Music size={20} />
      ) : (
        <VolumeX size={20} />
      )}
    </button>
  )
}
