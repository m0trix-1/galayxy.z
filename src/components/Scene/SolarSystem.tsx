import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'

interface PlanetData {
  name: string
  distance: number      // AU
  radius: number        // km
  color: string
  orbitalPeriod: number // days
  rotationPeriod: number // hours
  hasRings?: boolean
  moons?: number
}

const PLANETS: PlanetData[] = [
  { name: 'Mercury', distance: 0.387, radius: 2440, color: '#8c7851', orbitalPeriod: 88, rotationPeriod: 1407.6 },
  { name: 'Venus', distance: 0.723, radius: 6052, color: '#e6c87f', orbitalPeriod: 224.7, rotationPeriod: 5832.5 },
  { name: 'Earth', distance: 1.0, radius: 6371, color: '#4f8ef7', orbitalPeriod: 365.25, rotationPeriod: 23.9 },
  { name: 'Mars', distance: 1.524, radius: 3390, color: '#c1440e', orbitalPeriod: 687, rotationPeriod: 24.6 },
  { name: 'Jupiter', distance: 5.203, radius: 69911, color: '#d8ca9d', orbitalPeriod: 4331, rotationPeriod: 9.9 },
  { name: 'Saturn', distance: 9.537, radius: 58232, color: '#e3d9b0', orbitalPeriod: 10747, rotationPeriod: 10.7, hasRings: true },
  { name: 'Uranus', distance: 19.19, radius: 25362, color: '#7fdbff', orbitalPeriod: 30589, rotationPeriod: 17.2 },
  { name: 'Neptune', distance: 30.07, radius: 24622, color: '#4b70dd', orbitalPeriod: 59800, rotationPeriod: 16.1 }
]

export default function SolarSystem() {
  const { timeSpeed, isPaused, setSelectedObject } = useStore()
  const planetsRef = useRef<THREE.Group>(null)

  // Scale factors for visualization (not to scale)
  const DISTANCE_SCALE = 50      // 1 AU = 50 units
  const SIZE_SCALE = 0.001       // Shrink planets so they're visible

  useFrame((state, delta) => {
    if (isPaused || !planetsRef.current) return

    const time = state.clock.elapsedTime * timeSpeed * 0.01 // Slow down for visibility

    planetsRef.current.children.forEach((planetGroup, i) => {
      const planet = PLANETS[i]
      if (!planet) return

      // Calculate orbital position
      const angle = (time / planet.orbitalPeriod) * Math.PI * 2
      const distance = planet.distance * DISTANCE_SCALE

      planetGroup.position.x = Math.cos(angle) * distance
      planetGroup.position.z = Math.sin(angle) * distance

      // Rotate planet
      const mesh = planetGroup.children[0] as THREE.Mesh
      if (mesh) {
        mesh.rotation.y += (delta * timeSpeed * 24) / planet.rotationPeriod
      }
    })
  })

  const handlePlanetClick = (planet: PlanetData) => (event: any) => {
    event.stopPropagation()
    setSelectedObject({
      type: 'planet',
      name: planet.name,
      data: planet
    })
  }

  return (
    <group ref={planetsRef}>
      {/* Sun */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[5, 64, 64]} />
        <meshBasicMaterial color="#FDB813" />
        <pointLight intensity={2} distance={10000} decay={0} />
      </mesh>

      {/* Planets */}
      {PLANETS.map((planet, i) => (
        <group key={planet.name}>
          <mesh 
            onClick={handlePlanetClick(planet)}
            userData={{ type: 'planet', name: planet.name }}
          >
            <sphereGeometry args={[planet.radius * SIZE_SCALE * 100, 32, 32]} />
            <meshStandardMaterial 
              color={planet.color}
              roughness={0.7}
              metalness={0.1}
            />
          </mesh>

          {/* Saturn's rings */}
          {planet.hasRings && (
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[planet.radius * SIZE_SCALE * 120, planet.radius * SIZE_SCALE * 200, 64]} />
              <meshBasicMaterial 
                color="#C4B9A0" 
                transparent 
                opacity={0.6} 
                side={THREE.DoubleSide}
              />
            </mesh>
          )}

          {/* Orbit line */}
          <OrbitLine radius={planet.distance * DISTANCE_SCALE} />
        </group>
      ))}
    </group>
  )
}

function OrbitLine({ radius }: { radius: number }) {
  const points = useMemo(() => {
    const pts = []
    for (let i = 0; i <= 128; i++) {
      const angle = (i / 128) * Math.PI * 2
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius))
    }
    return pts
  }, [radius])

  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [points])

  return (
    <primitive object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0x444444, transparent: true, opacity: 0.3 }))} />
  )
}
