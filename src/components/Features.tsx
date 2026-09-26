import React, { useState } from 'react'

interface FeatureCard {
  id: string
  title: string
  subtitle: string
  icon: string
  description: string
  tag: string
}

const features: FeatureCard[] = [
  {
    id: 'hmr',
    title: 'Lightning Fast HMR',
    subtitle: 'Vite 8 Powered Engine',
    icon: '⚡',
    description:
      'Sub-millisecond Hot Module Replacement keeps your edit-test loop seamlessly instant without state loss.',
    tag: '< 10ms Reload',
  },
  {
    id: 'glass',
    title: 'Liquid Glassmorphism',
    subtitle: 'Multi-layer Frosted Optics',
    icon: '🔮',
    description:
      'Engineered with dual backdrop blur filters, specular highlights, and ambient light refraction for depth.',
    tag: '16px Backdrop Blur',
  },
  {
    id: 'react19',
    title: 'React 19 Architecture',
    subtitle: 'Concurrent Rendering',
    icon: '⚛️',
    description:
      'Built upon the modern React 19 component foundation with clean state management and optimal DOM updates.',
    tag: 'Next-Gen Core',
  },
  {
    id: 'theme',
    title: 'Adaptive Color Harmony',
    subtitle: 'Dynamic Dark/Light Physics',
    icon: '🎨',
    description:
      'Harmonious gradients tailored for both dark & light palettes with seamless background transitions.',
    tag: 'Fluid Themes',
  },
]

export const Features: React.FC = () => {
  const [activeCard, setActiveCard] = useState<string | null>(null)

  return (
    <section id="features" className="features-section">
      <div className="section-header">
        <span className="section-tag">ARCHITECTURAL HIGHLIGHTS</span>
        <h2 className="section-title">Designed to Wow at First Glance</h2>
        <p className="section-subtitle">
          Explore the interactive capabilities and tactile glass aesthetics built directly into this stack.
        </p>
      </div>

      <div className="metrics-row">
        <div className="metric-pill">
          <span className="metric-icon">⚡</span>
          <span className="metric-value">0ms</span>
          <span className="metric-label">Cold Start Lag</span>
        </div>
        <div className="metric-pill">
          <span className="metric-icon">💎</span>
          <span className="metric-value">16px</span>
          <span className="metric-label">Blur Diffusion</span>
        </div>
        <div className="metric-pill">
          <span className="metric-icon">🛡️</span>
          <span className="metric-value">100%</span>
          <span className="metric-label">TypeScript Safe</span>
        </div>
        <div className="metric-pill">
          <span className="metric-icon">✨</span>
          <span className="metric-value">60 FPS</span>
          <span className="metric-label">Micro-Animations</span>
        </div>
      </div>

      <div className="features-grid">
        {features.map((feature) => {
          const isSelected = activeCard === feature.id
          return (
            <div
              key={feature.id}
              className={`feature-card ${isSelected ? 'selected' : ''}`}
              onClick={() => setActiveCard(isSelected ? null : feature.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setActiveCard(isSelected ? null : feature.id)
                }
              }}
            >
              <div className="card-top">
                <span className="card-icon">{feature.icon}</span>
                <span className="card-tag">{feature.tag}</span>
              </div>
              <h3 className="card-title">{feature.title}</h3>
              <p className="card-subtitle">{feature.subtitle}</p>
              <p className="card-description">{feature.description}</p>
              <div className="card-footer">
                <span className="card-action">
                  {isSelected ? '✓ Active highlight' : 'Click to inspect'}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
