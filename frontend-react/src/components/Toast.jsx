export default function Toast({ message, onClose }) {
  return (
    <div className="toast">
      <span>⚠️</span>
      <span style={{ flex: 1 }}>{message}</span>
      <button className="toast-close" onClick={onClose}>✕</button>
    </div>
  )
}
