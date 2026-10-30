import { useStore } from '../../store/useStore'

export default function UIOverlay() {
  const { 
    selectedObject, 
    setSelectedObject, 
    timeSpeed, 
    setTimeSpeed, 
    isPaused, 
    togglePause,
    showUI,
    toggleUI
  } = useStore()

  if (!showUI) return null

  return (
    <div className="ui-overlay">
      {/* Top-left: Logo & Title */}
      <div className="glass" style={{
        position: 'absolute',
        top: 20,
        left: 20,
        padding: '15px 20px',
        color: 'white'
      }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>🌌 Cosmic Explorer</h1>
        <p style={{ margin: '5px 0 0 0', fontSize: 12, opacity: 0.7 }}>
          Interactive Universe Simulation
        </p>
      </div>

      {/* Top-right: Controls */}
      <div className="glass controls-hint">
        <div><span className="key">Left Click</span> Select object</div>
        <div><span className="key">Right Drag</span> Rotate view</div>
        <div><span className="key">Wheel</span> Zoom in/out</div>
        <div><span className="key">Middle Drag</span> Pan</div>
      </div>

      {/* Bottom-left: Selected object info */}
      {selectedObject && (
        <div className="glass info-panel">
          <button 
            onClick={() => setSelectedObject(null)}
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: 18
            }}
          >
            ×
          </button>

          <h3>
            {selectedObject.name || selectedObject.type || 'Unknown Object'}
          </h3>

          {selectedObject.data && (
            <>
              <p><strong>Type:</strong> {selectedObject.type}</p>
              {selectedObject.data.radius && (
                <p><strong>Radius:</strong> {selectedObject.data.radius.toLocaleString()} km</p>
              )}
              {selectedObject.data.orbitalPeriod && (
                <p><strong>Orbital Period:</strong> {selectedObject.data.orbitalPeriod} days</p>
              )}
            </>
          )}

          {selectedObject.userData?.params && (
            <>
              <p><strong>Type:</strong> Asteroid</p>
              <p><strong>Seed:</strong> {selectedObject.userData.seed}</p>
              <p><strong>Radius:</strong> {selectedObject.userData.params.radius} km</p>
            </>
          )}
        </div>
      )}

      {/* Bottom-right: Time controls */}
      <div className="glass" style={{
        position: 'absolute',
        bottom: 20,
        right: 20,
        padding: 15,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        color: 'white'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="btn-primary" onClick={togglePause}>
            {isPaused ? '▶ Play' : '⏸ Pause'}
          </button>
          <select 
            value={timeSpeed} 
            onChange={(e) => setTimeSpeed(Number(e.target.value))}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white',
              padding: '8px 12px',
              borderRadius: 6
            }}
          >
            <option value={0.1}>0.1x</option>
            <option value={1}>1x</option>
            <option value={10}>10x</option>
            <option value={100}>100x</option>
            <option value={1000}>1000x</option>
          </select>
        </div>

        <button 
          onClick={toggleUI}
          style={{
            background: 'none',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'white',
            padding: '5px',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 12
          }}
        >
          Hide UI (H)
        </button>
      </div>

      {/* Bottom-center: Zoom level indicator */}
      <ZoomIndicator />
    </div>
  )
}

function ZoomIndicator() {
  const { cameraZoom } = useStore()

  // Calculate scale description
  const getScaleDescription = (zoom: number) => {
    if (zoom < 0.001) return 'Surface Detail'
    if (zoom < 0.01) return 'Asteroid Scale'
    if (zoom < 0.1) return 'Planetary Scale'
    if (zoom < 1) return 'Solar System'
    if (zoom < 100) return 'Interstellar'
    return 'Galactic Scale'
  }

  return (
    <div className="glass" style={{
      position: 'absolute',
      bottom: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      padding: '10px 20px',
      color: 'white',
      fontSize: 14,
      textAlign: 'center'
    }}>
      <div style={{ fontWeight: 600 }}>{getScaleDescription(cameraZoom)}</div>
      <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>
        Zoom: {cameraZoom.toExponential(2)}
      </div>
    </div>
  )
}
