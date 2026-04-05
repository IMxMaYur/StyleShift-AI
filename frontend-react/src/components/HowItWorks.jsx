export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      icon: '📤',
      title: 'Upload',
      desc: 'Drop any photo into the upload zone. The model accepts PNG, JPG, or WEBP images up to any size.',
    },
    {
      num: '02',
      icon: '🧠',
      title: 'AI Inference',
      desc: 'A ResNet-9 CycleGAN generator processes your image through 9 residual blocks on your GPU.',
    },
    {
      num: '03',
      icon: '✨',
      title: 'Compare & Download',
      desc: 'Drag the slider to compare before and after, then download the transformed result as PNG.',
    },
  ]

  return (
    <section className="section">
      <h2 className="section-title">How It Works</h2>
      <div className="steps-grid">
        {steps.map((s) => (
          <div className="step-card" key={s.num}>
            <div className="step-num">{s.num}</div>
            <div className="step-icon">{s.icon}</div>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
