import { useRef, useState } from 'react'

export default function DropZone({ onFile, file, preview, onTransform }) {
  const fileInput   = useRef(null)
  const [drag, setDrag] = useState(false)

  const handleDrop = (e) => {
    e.preventDefault()
    setDrag(false)
    const f = e.dataTransfer.files[0]
    if (f) onFile(f)
  }

  return (
    <div className="upload-section">
      {/* Drop target */}
      <div
        className={`drop-zone ${drag ? 'drag-over' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={handleDrop}
        onClick={() => !file && fileInput.current?.click()}
      >
        <div className="drop-inner">
          <div className="drop-icon-wrap">
            <div className="drop-icon">🖼️</div>
            <div className="rings">
              <span /><span /><span />
            </div>
          </div>
          <p className="drop-title">Drop your image here</p>
          <p className="drop-sub">or click to browse · PNG, JPG, WEBP</p>
          <button
            className="btn-browse"
            onClick={(e) => { e.stopPropagation(); fileInput.current?.click() }}
          >
            Choose Image
          </button>
        </div>

        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => { if (e.target.files[0]) onFile(e.target.files[0]) }}
        />
      </div>

      {/* Preview strip — shown after file picked */}
      {file && preview && (
        <div className="preview-strip">
          <img className="preview-thumb" src={preview} alt="preview" />
          <div className="preview-info">
            <div className="preview-name">{file.name}</div>
            <div className="preview-size">
              {(file.size / 1024).toFixed(1)} KB · {file.type.split('/')[1].toUpperCase()}
            </div>
          </div>
          <button className="btn-transform" onClick={onTransform}>
            Transform ⚡
          </button>
        </div>
      )}
    </div>
  )
}
