import { getMeta } from '../constants'

export default function Hero({ models, selectedModel, onSelectModel }) {
  return (
    <header className="hero">
      <div className="hero-badge">
        <span>🧠</span> Powered by CycleGAN · PyTorch
      </div>

      <h1 className="hero-title">
        Transform Any Image<br />
        <span className="gradient-text">With AI Magic</span>
      </h1>

      <p className="hero-sub">
        Upload a photo and watch our neural network reimagine it in a completely
        different style — no paired training data needed.
      </p>

      <div className="model-selector">
        <p className="selector-label">Choose transformation style:</p>
        <div className="pills">
          {models.length === 0
            ? [1, 2, 3].map(i => <div key={i} className="pill-skeleton" />)
            : models.map(m => {
                const meta = getMeta(m.name)
                return (
                  <button
                    key={m.name}
                    className={`pill ${m.name === selectedModel ? 'active' : ''}`}
                    onClick={() => onSelectModel(m.name)}
                  >
                    <span>{meta.emoji}</span>
                    {meta.label}
                  </button>
                )
              })
          }
        </div>
      </div>
    </header>
  )
}
