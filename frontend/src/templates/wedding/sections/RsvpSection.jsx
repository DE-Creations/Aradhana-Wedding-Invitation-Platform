import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart, X } from 'lucide-react'
import api from '@/lib/api'

export default function RsvpSection({ invitation, guest }) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('')
  const [form, setForm] = useState({
    guest_name: guest?.name || '',
    attendance: 'accepted',
    number_of_guests: 1,
    dietary_requirements: '',
    message: '',
  })

  const update = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    try {
      await api.post('/api/rsvp', {
        invitation_id: invitation.id,
        guest_token: guest?.token || undefined,
        guest_name: form.guest_name,
        attendance: form.attendance,
        number_of_guests: Number(form.number_of_guests),
        dietary_requirements: form.dietary_requirements || undefined,
        message: form.message || undefined,
      })
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMsg(
        err?.response?.data?.message ||
          'Something went wrong. Please try again.',
      )
    }
  }

  return (
    <section
      className="section-pad bg-charcoal"
      style={{ textAlign: 'center', paddingTop: 100, paddingBottom: 100 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: [0.96, 1.02, 1] }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <span className="heartbeat" style={{ color: '#8B3A4A' }}>
          <Heart size={44} fill="#8B3A4A" strokeWidth={0} />
        </span>

        <h2
          className="font-script"
          style={{ color: '#FAF7F2', fontSize: 'clamp(2.5rem, 8vw, 3rem)', margin: '1rem 0 0.5rem' }}
        >
          Will You Attend?
        </h2>
        <p className="font-body" style={{ color: '#E8D5A3', fontSize: '1.1rem', maxWidth: 480 }}>
          We would be truly honored by your presence
        </p>

        <span style={{ color: '#8B3A4A', fontSize: '1.5rem', margin: '1rem 0' }}>&#10084;</span>

        <button type="button" className="btn-rsvp" onClick={() => setOpen(true)}>
          RSVP Now
        </button>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 80,
              background: 'rgba(0,0,0,0.7)',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
            }}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 260 }}
              className="bg-wine"
              style={{
                width: '100%',
                maxWidth: 480,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                border: '1px solid rgba(201,169,110,0.4)',
                padding: '2rem 1.5rem',
                maxHeight: '90vh',
                overflowY: 'auto',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className="font-serif-display" style={{ color: '#C9A96E', fontStyle: 'italic', margin: 0 }}>
                  Kindly Respond
                </h3>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  style={{ background: 'none', border: 'none', color: '#C9A96E' }}
                >
                  <X size={22} />
                </button>
              </div>

              {status === 'success' ? (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <Heart size={40} fill="#C9A96E" strokeWidth={0} />
                  <p className="font-script" style={{ color: '#FAF7F2', fontSize: '2rem', margin: '1rem 0 0.5rem' }}>
                    Thank You
                  </p>
                  <p className="font-body" style={{ color: '#E8D5A3' }}>
                    Your response has been received with love.
                  </p>
                </div>
              ) : (
                <form onSubmit={submit} style={{ marginTop: '1.5rem', display: 'grid', gap: '1.1rem' }}>
                  <label className="rsvp-field">
                    <span>Your Name</span>
                    <input
                      type="text"
                      required
                      value={form.guest_name}
                      onChange={update('guest_name')}
                      placeholder="Mr. & Mrs. Fernando"
                    />
                  </label>

                  <div>
                    <span className="rsvp-label">Will you attend?</span>
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                      {[
                        ['accepted', 'Joyfully Accept'],
                        ['declined', 'Respectfully Decline'],
                      ].map(([value, text]) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, attendance: value }))}
                          className="rsvp-toggle"
                          data-active={form.attendance === value}
                        >
                          {text}
                        </button>
                      ))}
                    </div>
                  </div>

                  {form.attendance === 'accepted' && (
                    <label className="rsvp-field">
                      <span>Number of Guests</span>
                      <select value={form.number_of_guests} onChange={update('number_of_guests')}>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}

                  <label className="rsvp-field">
                    <span>Dietary Requirements (optional)</span>
                    <input
                      type="text"
                      value={form.dietary_requirements}
                      onChange={update('dietary_requirements')}
                      placeholder="Vegetarian, allergies, etc."
                    />
                  </label>

                  <label className="rsvp-field">
                    <span>A Message to the Couple (optional)</span>
                    <textarea
                      rows={3}
                      value={form.message}
                      onChange={update('message')}
                      placeholder="Your warm wishes..."
                    />
                  </label>

                  {status === 'error' && (
                    <p style={{ color: '#e07a7a', fontSize: '0.9rem' }}>{errorMsg}</p>
                  )}

                  <button type="submit" className="btn-rsvp" disabled={status === 'loading'} style={{ width: '100%' }}>
                    {status === 'loading' ? 'Sending…' : 'Send Response'}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
