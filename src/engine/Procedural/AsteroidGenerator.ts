import * as THREE from 'three'
import { ProceduralNoise } from '../utils/noise'
import { MarchingCubes } from './MarchingCubes'

export interface AsteroidParams {
  seed: number
  radius: number        // Base radius in meters
  noiseScale: number    // Feature size
  detail: number        // LOD level (0-8)
  elongation: number    // How stretched (0-1)
  craters: number       // Number of impact craters
}

export class AsteroidGenerator {
  private params: AsteroidParams
  private noise: ProceduralNoise
  public mesh: THREE.Mesh
  public geometry: THREE.BufferGeometry

  constructor(params: AsteroidParams) {
    this.params = params
    this.noise = new ProceduralNoise(params.seed)
    this.geometry = this.generateGeometry()
    this.mesh = this.createMesh()
  }

  private generateGeometry(): THREE.BufferGeometry {
    const { radius, noiseScale, detail, elongation } = this.params

    // Create sphere base with detail level
    const segments = Math.min(128, 8 * Math.pow(2, detail))
    const geometry = new THREE.SphereGeometry(radius, segments, segments)

    // Displace vertices based on noise
    const positions = geometry.attributes.position
    const normals = geometry.attributes.normal

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i)
      const y = positions.getY(i)
      const z = positions.getZ(i)

      // Normalize to unit sphere for consistent noise application
      const len = Math.sqrt(x*x + y*y + z*z)
      const nx = x / len
      const ny = y / len
      const nz = z / len

      // Apply FBM noise for irregular shape
      let displacement = this.noise.fbm3D(nx, ny, nz, 4) * 0.3

      // Add ridged noise for surface detail
      displacement += this.noise.ridged3D(nx * 3, ny * 3, nz * 3, 3) * 0.15

      // Apply elongation (make it potato-shaped)
      const elong = 1 + elongation * this.noise.get3D(nx * 0.5, ny * 0.5, nz * 0.5)

      // Final radius modification
      const newRadius = radius * (1 + displacement) * elong

      positions.setXYZ(i, nx * newRadius, ny * newRadius, nz * newRadius)
    }

    // Recalculate normals for correct lighting
    geometry.computeVertexNormals()

    return geometry
  }

  private createMesh(): THREE.Mesh {
    // Create realistic asteroid material
    const material = new THREE.MeshStandardMaterial({
      color: 0x8B7355,           // Brownish-gray rock color
      roughness: 0.95,           // Very rough surface
      metalness: 0.05,           // Slightly metallic (contains metals)
      flatShading: false,

      // Add procedural texture
      map: this.generateSurfaceTexture(),
      bumpMap: this.generateBumpMap(),
      bumpScale: 0.02
    })

    const mesh = new THREE.Mesh(this.geometry, material)
    mesh.castShadow = true
    mesh.receiveShadow = true

    // Add metadata for interaction
    mesh.userData = {
      type: 'asteroid',
      params: this.params,
      seed: this.params.seed
    }

    return mesh
  }

  private generateSurfaceTexture(): THREE.Texture {
    const size = 1024
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')!

    // Base color variation
    const imageData = ctx.createImageData(size, size)
    const data = imageData.data

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const idx = (y * size + x) * 4

        // Create varied rock color using noise
        const nx = (x / size) * 2 - 1
        const ny = (y / size) * 2 - 1

        const noiseVal = this.noise.fbm3D(nx * 5, ny * 5, 0.5, 3)
        const variation = (noiseVal + 1) * 0.5 // 0-1

        // Brown-gray color palette
        const baseR = 139 + variation * 40
        const baseG = 115 + variation * 30
        const baseB = 85 + variation * 20

        data[idx] = baseR     // R
        data[idx + 1] = baseG // G
        data[idx + 2] = baseB // B
        data[idx + 3] = 255   // A
      }
    }

    ctx.putImageData(imageData, 0, 0)

    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping

    return texture
  }

  private generateBumpMap(): THREE.Texture {
    const size = 512
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')!

    const imageData = ctx.createImageData(size, size)
    const data = imageData.data

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const idx = (y * size + x) * 4
        const nx = (x / size) * 2 - 1
        const ny = (y / size) * 2 - 1

        // High frequency detail for bumps
        const bump = this.noise.ridged3D(nx * 10, ny * 10, 0, 4)
        const val = ((bump + 1) * 0.5) * 255

        data[idx] = val
        data[idx + 1] = val
        data[idx + 2] = val
        data[idx + 3] = 255
      }
    }

    ctx.putImageData(imageData, 0, 0)
    return new THREE.CanvasTexture(canvas)
  }

  // Update LOD based on camera distance
  updateLOD(cameraDistance: number): void {
    const { radius } = this.params
    const ratio = cameraDistance / radius

    let targetDetail = 0
    if (ratio < 2) targetDetail = 8
    else if (ratio < 4) targetDetail = 6
    else if (ratio < 8) targetDetail = 4
    else if (ratio < 16) targetDetail = 2
    else targetDetail = 1

    if (targetDetail !== this.params.detail) {
      this.params.detail = targetDetail
      // Regenerate geometry with new detail
      this.geometry.dispose()
      this.geometry = this.generateGeometry()
      this.mesh.geometry = this.geometry
    }
  }
}
