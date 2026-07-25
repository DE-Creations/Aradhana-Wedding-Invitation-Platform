import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom'
import WeddingInvitation from './templates/wedding/WeddingInvitation'

function WeddingRoute() {
  const { slug, token } = useParams()
  return <WeddingInvitation slug={slug} token={token} />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Local preview using bundled mock data */}
        <Route path="/" element={<Navigate to="/wedding/demo" replace />} />

        {/* Public invitation + personalized (guest-token) variant */}
        <Route path="/wedding/:slug" element={<WeddingRoute />} />
        <Route path="/wedding/:slug/guest/:token" element={<WeddingRoute />} />

        <Route path="*" element={<Navigate to="/wedding/demo" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
