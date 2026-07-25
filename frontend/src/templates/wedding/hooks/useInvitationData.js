import { useEffect, useState } from 'react'
import api, { mediaUrl } from '@/lib/api'
import { mockInvitation } from '@/data/mockData'

/**
 * Normalise the raw API payload into a stable shape for the UI.
 * - unwraps the JsonResource `data` envelope
 * - resolves media paths to absolute URLs
 * - coerces gallery photos to `{ photo_path, caption }[]`
 */
function normalize(raw) {
  if (!raw) return null
  const data = raw.data ?? raw

  const gallery = (data.gallery_photos || []).map((item) =>
    typeof item === 'string'
      ? { photo_path: mediaUrl(item), caption: '' }
      : { photo_path: mediaUrl(item.photo_path), caption: item.caption || '' },
  )

  return {
    ...data,
    groom_photo: mediaUrl(data.groom_photo),
    bride_photo: mediaUrl(data.bride_photo),
    couple_photo: mediaUrl(data.couple_photo),
    music_url: mediaUrl(data.music_url),
    gallery_photos: gallery,
    colors: data.colors || {
      primary: '#0D0D0D',
      accent: '#C9A96E',
      rose: '#8B3A4A',
    },
  }
}

/**
 * Fetch invitation data for a slug (and optional guest token).
 * Falls back to bundled mock data when the API is unreachable so the
 * experience can be previewed without the backend.
 *
 * @param {string} slug
 * @param {string} [token]
 */
export function useInvitationData(slug, token) {
  const [invitation, setInvitation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [usedMock, setUsedMock] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      // "demo" slug (or none) previews the bundled mock data directly.
      if (!slug || slug === 'demo') {
        if (!cancelled) {
          setInvitation(normalize(mockInvitation))
          setUsedMock(true)
          setLoading(false)
        }
        return
      }

      const url = token
        ? `/api/invitations/${slug}/guest/${token}`
        : `/api/invitations/${slug}`

      try {
        const { data } = await api.get(url)
        if (!cancelled) {
          setInvitation(normalize(data))
          setUsedMock(false)
        }
      } catch (err) {
        // Graceful fallback to mock data (useful for local UI work).
        if (!cancelled) {
          if (import.meta.env.DEV) {
            setInvitation(normalize(mockInvitation))
            setUsedMock(true)
          } else {
            setError(err)
          }
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [slug, token])

  return {
    invitation,
    guest: invitation?.guest ?? null,
    loading,
    error,
    usedMock,
  }
}
