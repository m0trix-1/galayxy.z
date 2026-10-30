# 🌌 Cosmic Explorer

**Interactive Universe Simulation with Cinematic Zoom & Procedural Detail**

Explore the cosmos from galactic scales down to individual asteroid surfaces with photorealistic detail. Built with React Three Fiber, WebGL, and advanced procedural generation techniques.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Three.js](https://img.shields.io/badge/Three.js-r160-black.svg)

## ✨ Features

### 🔭 **Cinematic Camera System**
- **Logarithmic Zoom**: Smooth transitions from 10¹⁶m (galaxies) to 10⁰m (rock surfaces)
- **Auto-Orientation**: Camera automatically aligns with orbital tangent
- **Bookmark System**: Save and return to specific coordinates
- **Cinematic Mode**: Pre-programmed flight paths for presentations

### 🪨 **Procedural Celestial Bodies**
- **Asteroid Generation**: 4D Perlin noise + Marching Cubes for realistic irregular shapes
- **Planetary Surfaces**: Biome-based procedural texturing with displacement mapping
- **Level of Detail (LOD)**: Dynamic mesh resolution based on camera distance
- **PBR Materials**: Physically-based rendering for realistic lighting

### ⭐ **Cosmic Scale Rendering**
- **GPU Particles**: Millions of stars and dust particles rendered efficiently
- **Nebula Volumes**: Volumetric rendering for gas clouds
- **Star Fields**: Gaia archive data integration ready
- **Orbital Mechanics**: Real physics simulation for celestial bodies

### 🎮 **Interactive Features**
- **Real-time Selection**: Click any object for detailed information
- **Time Control**: Accelerate/pause cosmic evolution
- **Measurement Tools**: Distance and size comparisons
- **Data Overlay**: Astronomical data visualization

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/cosmic-explorer.git
cd cosmic-explorer

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser at http://localhost:3000
```

### Build for Production

```bash
npm run build
npm run preview
```

## 🏗️ Architecture

```
src/
├── components/          # React components
│   ├── UI/             # User interface elements
│   ├── Scene/          # 3D scene components
│   └── Effects/        # Post-processing effects
├── engine/             # Core simulation engine
│   ├── Camera/         # Cinematic camera system
│   ├── Physics/        # N-body simulation
│   ├── Procedural/     # Noise & mesh generation
│   └── LOD/            # Level of detail management
├── shaders/            # GLSL shaders
│   ├── stars/          # Star rendering
│   ├── planets/        # Planetary surfaces
│   └── nebula/         # Volumetric clouds
├── data/               # Astronomical data
│   ├── ephemeris/      # Orbital data
│   └── textures/       # Procedural textures
└── utils/              # Helper functions
    ├── math/           # Vector calculations
    └── constants/      # Physical constants
```

## 🎯 Key Technologies

- **React Three Fiber**: React renderer for Three.js
- **Zustand**: State management for simulation data
- **Simplex Noise**: Procedural generation algorithms
- **WebGL 2**: Hardware-accelerated graphics
- **TypeScript**: Type-safe development

## 🌟 Usage Examples

### Basic Navigation
```typescript
// Zoom to specific coordinates
cameraControls.zoomTo({
  position: [1000, 500, 2000],
  target: [0, 0, 0],
  duration: 2 // seconds
})
```

### Generate Custom Asteroid
```typescript
import { AsteroidGenerator } from './engine/Procedural'

const asteroid = new AsteroidGenerator({
  seed: 1337,
  radius: 500, // meters
  noiseScale: 0.1,
  detail: 6    // LOD level
})

scene.add(asteroid.mesh)
```

### Add Custom Star System
```typescript
import { StarSystem } from './engine/Physics'

const system = new StarSystem({
  stars: [{ mass: 1.989e30, position: [0,0,0] }], // Solar mass
  planets: [
    { mass: 5.972e24, distance: 1.496e11, period: 365.25 }
  ]
})

system.simulate(timeStep)
```

## 🔧 Configuration

### Camera Settings (`src/engine/Camera/config.ts`)
```typescript
export const CAMERA_CONFIG = {
  minDistance: 1,        // meters
  maxDistance: 1e16,     // light years
  zoomSpeed: 1.5,
  rotateSpeed: 0.5,
  enableDamping: true,
  dampingFactor: 0.05
}
```

### Performance Settings (`src/engine/config.ts`)
```typescript
export const PERFORMANCE_CONFIG = {
  maxParticles: 1000000,
  lodDistance: [100, 1000, 10000, 100000],
  textureSize: 4096,
  shadowMapSize: 2048
}
```

## 🌌 Data Sources

The simulation supports real astronomical data:

- **NASA JPL Horizons**: Planetary ephemeris
- **Gaia Archive**: Stellar positions (1.8 billion stars)
- **Minor Planet Center**: Asteroid orbital elements
- **SDSS**: Galaxy catalogs

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- NASA for astronomical data
- Three.js community for rendering tools
- React Three Fiber maintainers

---

**Built with ❤️ for space enthusiasts everywhere**
