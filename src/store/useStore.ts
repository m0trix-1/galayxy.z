import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

interface CameraState {
  position: [number, number, number]
  target: [number, number, number]
  zoom: number
}

interface UniverseState {
  // Camera
  cameraPosition: [number, number, number]
  cameraTarget: [number, number, number]
  cameraZoom: number
  setCameraPosition: (pos: [number, number, number]) => void
  setCameraTarget: (target: [number, number, number]) => void
  setCameraZoom: (zoom: number) => void

  // Selected object
  selectedObject: any | null
  setSelectedObject: (obj: any | null) => void

  // Time control
  timeSpeed: number
  setTimeSpeed: (speed: number) => void
  isPaused: boolean
  togglePause: () => void

  // UI State
  showUI: boolean
  toggleUI: () => void

  // Simulation data
  celestialBodies: any[]
  setCelestialBodies: (bodies: any[]) => void

  // LOD System
  currentLOD: number
  setCurrentLOD: (lod: number) => void
}

export const useStore = create<UniverseState>()(
  subscribeWithSelector((set) => ({
    // Camera initial state - start with a view of the solar system
    cameraPosition: [0, 500, 2000],
    cameraTarget: [0, 0, 0],
    cameraZoom: 1,
    setCameraPosition: (position) => set({ cameraPosition: position }),
    setCameraTarget: (target) => set({ cameraTarget: target }),
    setCameraZoom: (zoom) => set({ cameraZoom: zoom }),

    // Selection
    selectedObject: null,
    setSelectedObject: (obj) => set({ selectedObject: obj }),

    // Time control
    timeSpeed: 1,
    setTimeSpeed: (speed) => set({ timeSpeed: speed }),
    isPaused: false,
    togglePause: () => set((state) => ({ isPaused: !state.isPaused })),

    // UI
    showUI: true,
    toggleUI: () => set((state) => ({ showUI: !state.showUI })),

    // Celestial bodies
    celestialBodies: [],
    setCelestialBodies: (bodies) => set({ celestialBodies: bodies }),

    // LOD
    currentLOD: 0,
    setCurrentLOD: (lod) => set({ currentLOD: lod })
  }))
)
