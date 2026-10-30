import * as THREE from 'three'
import { ASTRONOMICAL_CONSTANTS } from '../data/astronomicalData'

// Convert astronomical coordinates to 3D position
export function equatorialToCartesian(
  ra: number,    // Right Ascension in hours
  dec: number,   // Declination in degrees
  distance: number // Parsecs
): THREE.Vector3 {
  const raRad = (ra * 15 * Math.PI) / 180  // Convert hours to degrees to radians
  const decRad = (dec * Math.PI) / 180

  const x = distance * Math.cos(decRad) * Math.cos(raRad)
  const y = distance * Math.cos(decRad) * Math.sin(raRad)
  const z = distance * Math.sin(decRad)

  return new THREE.Vector3(x, y, z)
}

// Calculate apparent magnitude to brightness
export function magnitudeToBrightness(magnitude: number): number {
  return Math.pow(10, -0.4 * magnitude)
}

// Linear interpolation
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

// Smooth step function
export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

// Format large numbers with appropriate units
export function formatDistance(meters: number): string {
  if (meters < 1000) return `${meters.toFixed(1)} m`
  if (meters < 1000000) return `${(meters / 1000).toFixed(2)} km`
  if (meters < ASTRONOMICAL_CONSTANTS.AU * 0.1) return `${(meters / 1000000).toFixed(2)} Mm`
  if (meters < ASTRONOMICAL_CONSTANTS.LIGHT_YEAR * 0.1) return `${(meters / ASTRONOMICAL_CONSTANTS.AU).toFixed(2)} AU`
  return `${(meters / ASTRONOMICAL_CONSTANTS.LIGHT_YEAR).toFixed(2)} ly`
}
