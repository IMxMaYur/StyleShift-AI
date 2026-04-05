import { useRef, useState, useEffect } from 'react'
import { getMeta } from '../constants'

export default function ResultView({ result, onReset, onDownload, onTransformAgain }) {
  const containerRef  = useRef(null)
  const afterRef      = useRef(null)
  const dividerRef    = useRef(null)
  const dragging      = useRef(false)
  const [sliderPct, setSliderPct] = useState(50)

  const meta   = getMeta(result.model)
  const isGpu  = result.device?.includes('cuda')

  // Apply clip-path when sliderPct changes
  useEffect(() => {
    if (afterRef.current)   afterRef.current.style.clipPath   = `inset(0 0 0 ${sliderPct}%)`
    if (dividerRef.current) dividerRef.current.style.left     = `${sliderPct}%`
  }, [sliderPct])

  const move = (clientX) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const pct  = Math.max(2, Math.min(98, ((clientX - rect.left) / rect.width) * 100))
    setSliderPct(pct)
  }

  return (
    <div className="result-section">
      {/* ── Compare Slider ── */}
      <div className="compare-wrap">
        <div className="compare-label label-left">
          <span className="label-dot dot-orig" /> Original
        </div>
        <div className="compare-label label-right">
          <span className="label-dot dot-new" /> Transformed
        </div>

        <div
          ref={containerRef}
          className="compare-container"
          onMouseDown={(e) => { dragging.current = true; move(e.clientX) }}
          onMouseMove={(e) => { if (dragging.current) move(e.clientX) }}
          onMouseUp={()   => { dragging.current = false }}
          onMouseLeave={() => { dragging.current = false }}
          onTouchStart={(e) => { dragging.current = true; move(e.touches[0].clientX) }}
          onTouchMove={(e)  => { if (dragging.current) move(e.touches[0].clientX) }}
          onTouchEnd={()   => { dragging.current = false }}
        >
          {/* Before */}
          <div className="compare-side">
            <img src={`data:image/png;base64,${result.original_image}`} alt="Original" draggable={false} />
          </div>

          {/* After */}
          <div ref={afterRef} className="compare-side compare-after">
            <img src={`data:image/png;base64,${result.output_image}`} alt="Transformed" draggable={false} />
          </div>

          {/* Divider handle */}
          <div ref={dividerRef} className="divider">
            <div className="divider-line" />
            <div className="divider-handle">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7 5l-5 5 5 5M13 5l5 5-5 5" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ── Info chips ── */}
      <div className="info-bar">
        <div className="info-chip">
          <span>🎨</span>
          <span>{meta.label}</span>
        </div>
        <div className="info-chip">
          <span>{isGpu ? '⚡' : '💻'}</span>
          <span>{isGpu ? 'GPU' : 'CPU'}</span>
        </div>
        <div className="info-chip">
          <span>✅</span>
          <span>256 × 256</span>
        </div>
        <div className="info-chip">
          <span>🖱️</span>
          <span>Drag slider to compare</span>
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="action-row">
        <button className="btn-secondary" onClick={onReset}>
          ↩ Upload New
        </button>
        <button className="btn-primary" onClick={onDownload}>
          ⬇ Download Result
        </button>
        <button className="btn-accent" onClick={onTransformAgain}>
          🔄 Run Again
        </button>
      </div>
    </div>
  )
}
