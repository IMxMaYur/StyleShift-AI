export default function LoadingOverlay({ pct, message }) {
  return (
    <div className="loading-overlay">
      <div className="loader-box">
        <div className="neural-net">
          <div className="n-node n1" />
          <div className="n-node n2" />
          <div className="n-node n3" />
          <div className="n-node n4" />
          <div className="n-node n5" />
          <div className="n-ring" />
        </div>
        <p className="loader-title">Transforming…</p>
        <p className="loader-sub">{message}</p>
        <div className="loader-bar">
          <div className="loader-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  )
}
