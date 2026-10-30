import * as THREE from 'three'

export interface OrbitalElements {
  semiMajorAxis: number      // a (meters)
  eccentricity: number       // e (0-1)
  inclination: number        // i (radians)
  longitudeOfAscendingNode: number  // Ω (radians)
  argumentOfPeriapsis: number       // ω (radians)
  trueAnomaly: number        // ν (radians)
}

export class OrbitalMechanics {
  private static G = 6.67430e-11  // Gravitational constant
  private static M_sun = 1.989e30 // Solar mass in kg

  // Calculate position from orbital elements (simplified two-body)
  static calculatePosition(elements: OrbitalElements, time: number): THREE.Vector3 {
    const { semiMajorAxis, eccentricity, inclination, longitudeOfAscendingNode, argumentOfPeriapsis, trueAnomaly } = elements

    // Solve Kepler's equation (simplified - would use Newton-Raphson in production)
    const meanMotion = Math.sqrt(this.G * this.M_sun / Math.pow(semiMajorAxis, 3))
    const M = meanMotion * time + trueAnomaly  // Mean anomaly

    // Eccentric anomaly (approximation for small e)
    const E = M + eccentricity * Math.sin(M)

    // True anomaly
    const nu = 2 * Math.atan2(
      Math.sqrt(1 + eccentricity) * Math.sin(E / 2),
      Math.sqrt(1 - eccentricity) * Math.cos(E / 2)
    )

    // Distance from focus
    const r = semiMajorAxis * (1 - eccentricity * Math.cos(E))

    // Position in orbital plane
    const xOrbital = r * Math.cos(nu)
    const yOrbital = r * Math.sin(nu)

    // Transform to 3D space
    const x = xOrbital * (Math.cos(argumentOfPeriapsis) * Math.cos(longitudeOfAscendingNode) - 
                          Math.sin(argumentOfPeriapsis) * Math.cos(inclination) * Math.sin(longitudeOfAscendingNode)) -
              yOrbital * (Math.sin(argumentOfPeriapsis) * Math.cos(longitudeOfAscendingNode) + 
                          Math.cos(argumentOfPeriapsis) * Math.cos(inclination) * Math.sin(longitudeOfAscendingNode))

    const y = xOrbital * (Math.cos(argumentOfPeriapsis) * Math.sin(longitudeOfAscendingNode) + 
                          Math.sin(argumentOfPeriapsis) * Math.cos(inclination) * Math.cos(longitudeOfAscendingNode)) +
              yOrbital * (Math.cos(argumentOfPeriapsis) * Math.sin(longitudeOfAscendingNode) - 
                          Math.sin(argumentOfPeriapsis) * Math.cos(inclination) * Math.cos(longitudeOfAscendingNode))

    const z = xOrbital * (Math.sin(argumentOfPeriapsis) * Math.sin(inclination)) +
              yOrbital * (Math.cos(argumentOfPeriapsis) * Math.sin(inclination))

    return new THREE.Vector3(x, y, z)
  }

  // Simplified N-body simulation
  static calculateGravitationalForce(
    mass1: number, 
    mass2: number, 
    position1: THREE.Vector3, 
    position2: THREE.Vector3
  ): THREE.Vector3 {
    const direction = position2.clone().sub(position1)
    const distance = direction.length()
    const forceMagnitude = this.G * mass1 * mass2 / (distance * distance)
    return direction.normalize().multiplyScalar(forceMagnitude)
  }
}
