"use client"

import { useEffect, useState } from "react"

interface ConfettiPiece {
  id: number
  x: number
  y: number
  rotation: number
  color: string
  size: number
  velocityX: number
  velocityY: number
  rotationSpeed: number
}

export function ConfettiAnimation({ trigger }: { trigger: boolean }) {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([])

  const colors = ["#06b6d4", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

  useEffect(() => {
    if (!trigger) return

    const pieces: ConfettiPiece[] = []
    for (let i = 0; i < 50; i++) {
      pieces.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -10,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        velocityX: (Math.random() - 0.5) * 4,
        velocityY: Math.random() * 3 + 2,
        rotationSpeed: (Math.random() - 0.5) * 10,
      })
    }
    setConfetti(pieces)

    const animateConfetti = () => {
      setConfetti((prev) =>
        prev
          .map((piece) => ({
            ...piece,
            x: piece.x + piece.velocityX,
            y: piece.y + piece.velocityY,
            rotation: piece.rotation + piece.rotationSpeed,
            velocityY: piece.velocityY + 0.1, // gravity
          }))
          .filter((piece) => piece.y < window.innerHeight + 20),
      )
    }

    const interval = setInterval(animateConfetti, 16)
    const timeout = setTimeout(() => {
      clearInterval(interval)
      setConfetti([])
    }, 3000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [trigger])

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute"
          style={{
            left: piece.x,
            top: piece.y,
            transform: `rotate(${piece.rotation}deg)`,
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            borderRadius: "2px",
          }}
        />
      ))}
    </div>
  )
}
