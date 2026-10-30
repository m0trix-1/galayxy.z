import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'

export default function CameraController() {
  const { camera, gl } = useThree()
  const controlsRef = useRef<any>(null)
  const { cameraPosition, cameraTarget, setCameraPosition, setCameraTarget } = useStore()

  // Smooth camera movement
  const targetPosition = useRef(new THREE.Vector3(...cameraPosition))
  const currentTarget = useRef(new THREE.Vector3(...cameraTarget))

  useEffect(() => {
    targetPosition.current.set(...cameraPosition)
  }, [cameraPosition])

  useEffect(() => {
    currentTarget.current.set(...cameraTarget)
  }, [cameraTarget])

  useFrame((state, delta) => {
    if (!controlsRef.current) return

    // Smooth interpolation
    const lerpFactor = 1 - Math.pow(0.001, delta) // Frame-rate independent lerp

    camera.position.lerp(targetPosition.current, lerpFactor)
    controlsRef.current.target.lerp(currentTarget.current, lerpFactor)
    controlsRef.current.update()

    // Update store with current camera position
    setCameraPosition([camera.position.x, camera.position.y, camera.position.z])
  })

  // Handle zoom limits for cosmic scale
  const handleChange = () => {
    if (!controlsRef.current) return

    const distance = camera.position.distanceTo(controlsRef.current.target)

    // Logarithmic zoom for cosmic scales
    const minDistance = 0.1      // 10cm - surface detail
    const maxDistance = 1e15     // ~100 light years

    if (distance < minDistance) {
      const direction = camera.position.clone().sub(controlsRef.current.target).normalize()
      camera.position.copy(controlsRef.current.target).add(direction.multiplyScalar(minDistance))
    } else if (distance > maxDistance) {
      const direction = camera.position.clone().sub(controlsRef.current.target).normalize()
      camera.position.copy(controlsRef.current.target).add(direction.multiplyScalar(maxDistance))
    }
  }

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      zoomSpeed={1.5}
      panSpeed={0.8}
      rotateSpeed={0.5}
      enableDamping={true}
      dampingFactor={0.05}
      onChange={handleChange}
      makeDefault
    />
  )
}
