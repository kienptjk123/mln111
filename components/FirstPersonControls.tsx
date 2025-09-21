"use client"

import { useRef, useEffect } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Vector3, Raycaster, Vector2 } from "three"

export default function FirstPersonControls({ onPaintingClick }: { onPaintingClick: (paintingData: any) => void }) {
  const { camera, scene } = useThree()
  const moveState = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
  })

  const velocity = useRef(new Vector3())
  const direction = useRef(new Vector3())
  const rotation = useRef({ x: 0, y: 0 })
  const isPointerLocked = useRef(false)
  const raycaster = useRef(new Raycaster())

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case "KeyW":
        case "ArrowUp":
          moveState.current.forward = true
          break
        case "KeyS":
        case "ArrowDown":
          moveState.current.backward = true
          break
        case "KeyA":
        case "ArrowLeft":
          moveState.current.left = true
          break
        case "KeyD":
        case "ArrowRight":
          moveState.current.right = true
          break
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case "KeyW":
        case "ArrowUp":
          moveState.current.forward = false
          break
        case "KeyS":
        case "ArrowDown":
          moveState.current.backward = false
          break
        case "KeyA":
        case "ArrowLeft":
          moveState.current.left = false
          break
        case "KeyD":
        case "ArrowRight":
          moveState.current.right = false
          break
      }
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (!isPointerLocked.current) return

      const sensitivity = 0.002
      rotation.current.y -= event.movementX * sensitivity
      rotation.current.x -= event.movementY * sensitivity

      // Limit vertical rotation
      rotation.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotation.current.x))
    }

    const handleClick = (event: MouseEvent) => {
      if (!isPointerLocked.current) {
        document.body.requestPointerLock()
        return
      }

      // Raycast from center of screen
      const centerPoint = new Vector2(0, 0) // Center of normalized device coordinates
      raycaster.current.setFromCamera(centerPoint, camera)

      const intersects = raycaster.current.intersectObjects(scene.children, true)

      for (const intersect of intersects) {
        const object = intersect.object
        // Check if clicked object has painting data
        if (object.userData && object.userData.paintingData) {
          onPaintingClick(object.userData.paintingData)
          break
        }
      }
    }

    const handlePointerLockChange = () => {
      isPointerLocked.current = document.pointerLockElement === document.body
      if (isPointerLocked.current) {
        document.body.style.cursor = "none"
      } else {
        document.body.style.cursor = "default"
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("keyup", handleKeyUp)
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("click", handleClick)
    document.addEventListener("pointerlockchange", handlePointerLockChange)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("keyup", handleKeyUp)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("click", handleClick)
      document.removeEventListener("pointerlockchange", handlePointerLockChange)
    }
  }, [camera, scene, onPaintingClick])

  useFrame((state, delta) => {
    const speed = 5

    // Reset velocity
    velocity.current.set(0, 0, 0)

    // Calculate movement direction
    direction.current.set(0, 0, 0)

    if (moveState.current.forward) direction.current.z -= 1
    if (moveState.current.backward) direction.current.z += 1
    if (moveState.current.left) direction.current.x -= 1
    if (moveState.current.right) direction.current.x += 1

    // Normalize direction
    direction.current.normalize()

    // Apply rotation to movement direction
    direction.current.applyAxisAngle(new Vector3(0, 1, 0), rotation.current.y)

    // Update velocity
    velocity.current.copy(direction.current).multiplyScalar(speed * delta)

    // Update camera position
    camera.position.add(velocity.current)

    // Keep camera at eye level
    camera.position.y = 1.6

    // Boundary constraints to keep player inside gallery
    camera.position.x = Math.max(-7, Math.min(7, camera.position.x))
    camera.position.z = Math.max(-5, Math.min(5, camera.position.z))

    camera.rotation.order = "YXZ"
    camera.rotation.set(rotation.current.x, rotation.current.y, 0)
  })

  return null
}
