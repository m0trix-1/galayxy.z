import { createNoise4D } from 'simplex-noise'
import alea from 'alea'

export class ProceduralNoise {
  private noise4D: (x: number, y: number, z: number, w: number) => number

  constructor(seed: number = 1337) {
    const rng = alea(seed.toString())
    this.noise4D = createNoise4D(rng)
  }

  // Get 3D noise value at position with time as 4th dimension
  get3D(x: number, y: number, z: number, scale: number = 1): number {
    return this.noise4D(x * scale, y * scale, z * scale, 0)
  }

  // Fractal Brownian Motion for more natural-looking terrain
  fbm3D(x: number, y: number, z: number, octaves: number = 4, lacunarity: number = 2, gain: number = 0.5): number {
    let amplitude = 1
    let frequency = 1
    let sum = 0
    let maxValue = 0

    for (let i = 0; i < octaves; i++) {
      sum += this.get3D(x * frequency, y * frequency, z * frequency) * amplitude
      maxValue += amplitude
      amplitude *= gain
      frequency *= lacunarity
    }

    return sum / maxValue
  }

  // Ridged noise for sharp features like mountains
  ridged3D(x: number, y: number, z: number, octaves: number = 4): number {
    let sum = 0
    let amplitude = 0.5
    let frequency = 1
    let prev = 1

    for (let i = 0; i < octaves; i++) {
      let n = this.get3D(x * frequency, y * frequency, z * frequency)
      n = 1 - Math.abs(n)
      n = n * n
      sum += n * amplitude * prev
      prev = n
      frequency *= 2
      amplitude *= 0.5
    }

    return sum
  }
}
