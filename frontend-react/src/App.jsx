import { useState, useEffect } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Workspace from './components/Workspace'
import HowItWorks from './components/HowItWorks'
import ModelsSection from './components/ModelsSection'
import Toast from './components/Toast'

export default function App() {
  const [serverStatus, setServerStatus] = useState('connecting') // 'online'|'offline'|'connecting'
  const [serverInfo, setServerInfo]     = useState(null)
  const [models, setModels]             = useState([])
  const [selectedModel, setSelectedModel] = useState('horse2zebra')
  const [toast, setToast]               = useState(null)

  // Check server health on mount
  useEffect(() => {
    const check = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || '/api'
        const res  = await fetch(`${baseUrl}/health`, { signal: AbortSignal.timeout(4000) })
        const data = await res.json()
        setServerStatus('online')
        setServerInfo(data)
      } catch {
        setServerStatus('offline')
      }
    }
    check()
  }, [])

  // Load available models
  useEffect(() => {
    const load = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || '/api'
        const res  = await fetch(`${baseUrl}/models`)
        const data = await res.json()
        setModels(data.models || [])
      } catch {
        // silently fail; models will be empty
      }
    }
    load()
  }, [])

  const showError = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 6000)
  }

  return (
    <>
      {/* Animated background */}
      <div className="bg-wrap">
        <div className="bg-grid" />
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <div className="page">
        <Navbar status={serverStatus} serverInfo={serverInfo} />

        <Hero
          models={models}
          selectedModel={selectedModel}
          onSelectModel={setSelectedModel}
        />

        <div className="workspace-wrap">
          <Workspace
            selectedModel={selectedModel}
            onError={showError}
          />
          <HowItWorks />
          <ModelsSection
            models={models}
            selectedModel={selectedModel}
            onSelectModel={setSelectedModel}
          />
        </div>


      </div>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </>
  )
}
