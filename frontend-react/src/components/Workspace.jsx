import { useState, useRef, useCallback, useEffect } from 'react'
import DropZone from './DropZone'
import ResultView from './ResultView'
import LoadingOverlay from './LoadingOverlay'

const LOADER_MESSAGES = [
  'Initialising neural network…',
  'Encoding image features…',
  'Processing residual blocks…',
  'Decoding output…',
  'Almost there…',
]

export default function Workspace({ selectedModel, onError }) {
  const [stage, setStage]           = useState('upload')  // 'upload' | 'result'
  const [file, setFile]             = useState(null)
  const [preview, setPreview]       = useState(null)
  const [loading, setLoading]       = useState(false)
  const [loaderPct, setLoaderPct]   = useState(0)
  const [loaderMsg, setLoaderMsg]   = useState(LOADER_MESSAGES[0])
  const [result, setResult]         = useState(null)      // { original, output, model, device }
  const loaderTimer                 = useRef(null)

  // Cleanup blob URLs on unmount
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview) }, [preview])

  const handleFile = useCallback((f) => {
    if (!f || !f.type.startsWith('image/')) {
      onError('Please select a valid image file (PNG, JPG, WEBP).')
      return
    }
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setStage('upload') // stay on upload, show preview strip
  }, [onError])

  const startLoaderAnimation = () => {
    let pct = 0; let msgIdx = 0
    setLoaderPct(0)
    setLoaderMsg(LOADER_MESSAGES[0])
    clearInterval(loaderTimer.current)
    loaderTimer.current = setInterval(() => {
      pct = Math.min(pct + Math.random() * 9, 92)
      setLoaderPct(pct)
      const ni = Math.min(Math.floor(pct / 20), LOADER_MESSAGES.length - 1)
      if (ni !== msgIdx) { msgIdx = ni; setLoaderMsg(LOADER_MESSAGES[msgIdx]) }
    }, 200)
  }

  const runTransform = async () => {
    if (!file) return
    setLoading(true)
    startLoaderAnimation()

    const form = new FormData()
    form.append('image', file)
    form.append('model', selectedModel)

    try {
      const res  = await fetch('/api/transform', { method: 'POST', body: form })
      const data = await res.json()

      if (!res.ok) {
        onError(data.error || 'Transform failed. Check the server.')
        setLoading(false)
        clearInterval(loaderTimer.current)
        return
      }

      clearInterval(loaderTimer.current)
      setLoaderPct(100)
      setTimeout(() => {
        setResult(data)
        setLoading(false)
        setStage('result')
      }, 300)

    } catch {
      clearInterval(loaderTimer.current)
      setLoading(false)
      onError('Cannot reach server. Make sure app.py is running on port 5000.')
    }
  }

  const handleReset = () => {
    setStage('upload')
    setFile(null)
    setPreview(null)
    setResult(null)
  }

  const handleDownload = () => {
    if (!result?.output_image) return
    const a = document.createElement('a')
    a.href     = `data:image/png;base64,${result.output_image}`
    a.download = `styleshift_${result.model}_result.png`
    a.click()
  }

  return (
    <div className="workspace-card">
      {/* Upload stage */}
      {stage === 'upload' && (
        <DropZone
          onFile={handleFile}
          file={file}
          preview={preview}
          onTransform={runTransform}
        />
      )}

      {/* Result stage */}
      {stage === 'result' && result && (
        <ResultView
          result={result}
          onReset={handleReset}
          onDownload={handleDownload}
          onTransformAgain={runTransform}
        />
      )}

      {/* Loading overlay (sits on top of both stages) */}
      {loading && (
        <LoadingOverlay pct={loaderPct} message={loaderMsg} />
      )}
    </div>
  )
}
