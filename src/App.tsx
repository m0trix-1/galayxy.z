import { Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Stars, OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { useStore } from './store/useStore'
import Universe from './components/Scene/Universe'
import UIOverlay from './components/UI/UIOverlay'
import CameraController from './engine/Camera/CameraController'

function App() {
  const { cameraPosition, setCameraPosition } = useStore()

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas
        gl={{ 
          antialias: true, 
          logarithmicDepthBuffer: true,
          powerPreference: 'high-performance'
        }}
        camera={{ 
          position: [0, 100, 1000], 
          near: 0.1, 
          far: 10000000000000000,
          fov: 60
        }}
        onCreated={({ gl }) => {
          gl.setClearColor('#000000')
        }}
      >
        <Suspense fallback={null}>
          {/* Ambient lighting */}
          <ambientLight intensity={0.1} />

          {/* Main universe scene */}
          <Universe />

          {/* Camera controls */}
          <CameraController />

          {/* Post-processing effects */}
          <EffectComposer>
            <Bloom 
              intensity={0.5} 
              luminanceThreshold={0.9} 
              luminanceSmoothing={0.9}
              mipmapBlur 
            />
            <Vignette eskil={false} offset={0.1} darkness={0.5} />
          </EffectComposer>
        </Suspense>
      </Canvas>

      {/* UI Overlay */}
      <UIOverlay />
    </div>
  )
}

export default App
