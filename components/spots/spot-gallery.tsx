'use client'

import { useState } from 'react'

interface SpotGalleryProps {
  images: string[]
}

export function SpotGallery({ images }: SpotGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)

  if (!images.length) return null

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div
        className="h-96 rounded-lg bg-zinc-800 bg-cover bg-center"
        style={{ backgroundImage: `url(${images[selectedImage]})` }}
      />

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((image, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(idx)}
              className={`h-24 rounded-lg bg-zinc-800 bg-cover bg-center transition-all ${
                selectedImage === idx ? 'ring-2 ring-primary' : 'opacity-60 hover:opacity-100'
              }`}
              style={{ backgroundImage: `url(${image})` }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
