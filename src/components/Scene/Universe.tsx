import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Stars, Point, Points } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'
import { AsteroidGenerator } from '../../engine/Procedural/AsteroidGenerator'
import SolarSystem from './SolarSystem'
import Nebula from './Nebula'

export default function Universe() {
  const { camera } = useThree()
  const { selectedObject, setSelectedObject, timeSpeed, isPaused } = useStore()
  const asteroidsRef = useRef<THREE.Group>(null)

  // Generate asteroid belt
  const asteroids = useMemo(() => {
    const belt = []
    const count = 1000

    for (let i = 0; i < count; i++) {
      // Asteroid belt between Mars (1.5 AU) and Jupiter (5.2 AU)
      const distance = 2.2 + Math.random() * 1.8 // AU
      const angle = Math.random() * Math.PI * 2
      const y = (Math.random() - 0.5) * 0.1 // Flattened disk

      const asteroid = new AsteroidGenerator({
        seed: i * 1337,
        radius: 0.5 + Math.random() * 4, // km
        noiseScale: 0.5 + Math.random(),
        detail: 3,
        elongation: Math.random() * 0.3,
        craters: Math.floor(Math.random() * 5)
      })

      // Position in belt
      const x = Math.cos(angle) * distance * 149597870700 // Convert AU to meters
      const z = Math.sin(angle) * distance * 149597870700

      asteroid.mesh.position.set(x, y * 149597870700, z)
      asteroid.mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      )

      // Store orbital data
      asteroid.mesh.userData.orbit = {
        distance,
        angle,
        speed: 0.0001 / Math.sqrt(Math.pow(distance, 3)) // Kepler's third law
      }

      belt.push(asteroid)
    }

    return belt
  }, [])

  // Animation loop
  useFrame((state, delta) => {
    if (isPaused) return

    const time = state.clock.elapsedTime * timeSpeed

    // Update asteroid positions
    asteroidsRef.current?.children.forEach((mesh, i) => {
      const orbit = mesh.userData.orbit
      if (orbit) {
        const newAngle = orbit.angle + orbit.speed * time
        const x = Math.cos(newAngle) * orbit.distance * 149597870700
        const z = Math.sin(newAngle) * orbit.distance * 149597870700
        mesh.position.x = x
        mesh.position.z = z

        // Rotate asteroid
        mesh.rotation.y += delta * 0.1
        mesh.rotation.x += delta * 0.05
      }
    })

    // Update LOD based on camera distance
    asteroids.forEach(asteroid => {
      const distance = camera.position.distanceTo(asteroid.mesh.position)
      asteroid.updateLOD(distance)
    })
  })

  // Handle clicking on objects
  const handleClick = (event: any) => {
    event.stopPropagation()
    setSelectedObject(event.object)
  }

  return (
    <group>
      {/* Background stars */}
      <Stars 
        radius={1000000000000} 
        depth={500000000000} 
        count={50000} 
        factor={4000000000} 
        saturation={0} 
        fade 
        speed={0.5}
      />

      {/* Solar System */}
      <SolarSystem />

      {/* Asteroid Belt */}
      <group ref={asteroidsRef}>
        {asteroids.map((asteroid, i) => (
          <primitive 
            key={i} 
            object={asteroid.mesh} 
            onClick={handleClick}
          />
        ))}
      </group>

      {/* Nebula effects */}
      <Nebula position={[50000, 20000, -100000]} scale={50000} />
      <Nebula position={[-80000, -30000, 50000]} scale={80000} color="#ff6b9d" />

      {/* Ambient particles (cosmic dust) */}
      <CosmicDust count={100000} />
    </group>
  )
}

// Cosmic dust particle system
function CosmicDust({ count = 50000 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null)

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      // Distribute in a large sphere
      const radius = Math.random() * 1000000000000
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = radius * Math.cos(phi)

      // Color based on temperature (blue to red)
      const temp = Math.random()
      col[i * 3] = 0.5 + temp * 0.5     // R
      col[i * 3 + 1] = 0.5 + temp * 0.3 // G
      col[i * 3 + 2] = 1 - temp * 0.5   // B
    }

    return [pos, col]
  }, [count])

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.00001
    }
  })

  return (
    <Points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={100000000}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}
