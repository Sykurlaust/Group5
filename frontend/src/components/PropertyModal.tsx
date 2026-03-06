import { useState } from "react"

type Property = {
  id: number
  title: string
  type: string
  municipality: string
  location: string
  price: number
  images?: string[]
}

export default function PropertyModal({
  property,
  onClose,
}: {
  property: Property
  onClose: () => void
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const images = property.images || [
    "https://via.placeholder.com/600x400?text=Property+Image+1",
    "https://via.placeholder.com/600x400?text=Property+Image+2",
    "https://via.placeholder.com/600x400?text=Property+Image+3",
  ]

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToImage = (index: number) => {
    setCurrentImageIndex(index)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="max-w-2xl w-full rounded-2xl bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 z-10 rounded-full bg-white/90 p-2 text-gray-700 hover:bg-white shadow-md transition"
          onClick={onClose}
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image Carousel */}
        <div className="relative bg-gray-900 overflow-hidden">
          <div className="aspect-video w-full">
            <img
              src={images[currentImageIndex]}
              alt={`${property.title} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition z-10"
                aria-label="Previous image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition z-10"
                aria-label="Next image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Image Indicators */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`w-2 h-2 rounded-full transition ${
                    index === currentImageIndex ? "bg-white w-6" : "bg-white/50 hover:bg-white/75"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Image Counter */}
          <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
            {currentImageIndex + 1} / {images.length}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900">{property.title}</h2>

          {/* Location & Municipality */}
          <div className="mt-2 flex items-center gap-2 text-gray-600">
            <svg className="w-5 h-5 text-[#047857]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{property.location}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-500">{property.municipality}</span>
          </div>

          {/* Price & Type */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-[#047857]/10 to-[#047857]/5 rounded-xl p-4 border border-[#047857]/20">
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Price</div>
              <div className="mt-2 text-3xl font-bold text-gray-900">€{property.price.toLocaleString()}/mo</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-5 rounded-xl p-4 border border-blue-200">
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Type</div>
              <div className="mt-2 text-xl font-bold text-gray-900 capitalize">{property.type}</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <button
            className="w-full bg-[#047857] text-white font-semibold py-3 rounded-lg hover:bg-[#3a8a7a] transition shadow-md"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
