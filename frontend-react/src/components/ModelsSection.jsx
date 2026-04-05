import { getMeta } from '../constants'

export default function ModelsSection({ models, selectedModel, onSelectModel }) {
  if (models.length === 0) return null

  return (
    <section className="section">
      <h2 className="section-title">Available Transformations</h2>
      <div className="models-grid">
        {models.map((m) => {
          const meta = getMeta(m.name)
          return (
            <div
              key={m.name}
              className={`model-card ${m.name === selectedModel ? 'active' : ''}`}
              onClick={() => onSelectModel(m.name)}
            >
              <div className="mc-icon">{meta.emoji}</div>
              <div className="mc-name">{meta.label}</div>
              <div className="mc-size">{m.size_mb} MB</div>
              <span className="mc-badge">Pretrained</span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
