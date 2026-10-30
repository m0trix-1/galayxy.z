export const atmosphereVertexShader = `
  varying vec3 vNormal
  varying vec3 vPosition

  void main() {
    vNormal = normalize(normalMatrix * normal)
    vPosition = position

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0)
  }
`

export const atmosphereFragmentShader = `
  uniform vec3 uColor
  uniform float uIntensity

  varying vec3 vNormal
  varying vec3 vPosition

  void main() {
    // Fresnel effect for atmosphere rim
    vec3 viewDirection = normalize(cameraPosition - vPosition)
    float fresnel = pow(1.0 - dot(viewDirection, vNormal), 3.0)

    gl_FragColor = vec4(uColor, fresnel * uIntensity)
  }
`
