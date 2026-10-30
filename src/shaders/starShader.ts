// Vertex shader for realistic star rendering
export const starVertexShader = `
  attribute float size
  attribute vec3 customColor
  attribute float brightness

  varying vec3 vColor
  varying float vBrightness

  void main() {
    vColor = customColor
    vBrightness = brightness

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0)
    gl_PointSize = size * (300.0 / -mvPosition.z)
    gl_Position = projectionMatrix * mvPosition
  }
`

export const starFragmentShader = `
  varying vec3 vColor
  varying float vBrightness

  void main() {
    // Calculate distance from center for round points
    vec2 center = gl_PointCoord - 0.5
    float dist = length(center)

    // Discard fragments outside circle
    if (dist > 0.5) discard

    // Soft edge glow
    float alpha = smoothstep(0.5, 0.0, dist)
    alpha = pow(alpha, 2.0) * vBrightness

    // Add corona effect
    float corona = smoothstep(0.5, 0.2, dist) * 0.5

    gl_FragColor = vec4(vColor * (1.0 + corona), alpha)
  }
`
