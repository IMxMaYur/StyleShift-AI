export default function Navbar({ status, serverInfo }) {
  const statusLabel =
    status === 'connecting' ? 'Connecting…' :
    status === 'online'
      ? (serverInfo?.cuda_available ? '⚡ GPU Ready' : '💻 CPU Mode')
      : 'Server Offline'

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <span className="nav-logo">⚡</span>
        <span className="nav-title">
          StyleShift<span className="nav-accent">AI</span>
        </span>
      </div>
      <div className="nav-status">
        <span className={`status-dot ${status === 'online' ? 'online' : status === 'offline' ? 'offline' : ''}`} />
        <span>{statusLabel}</span>
      </div>
    </nav>
  )
}
