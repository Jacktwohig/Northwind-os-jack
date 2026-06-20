import { Routes, Route, Navigate } from 'react-router-dom'
import { TriageProvider } from './store/TriageContext'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Triage from './pages/Triage'

export default function App() {
  return (
    <TriageProvider>
      <div className="flex h-screen bg-slate-50 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/triage" element={<Triage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </TriageProvider>
  )
}
