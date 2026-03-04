import React from "react"

type Property = {
  id: number
  title: string
  type: string
  municipality: string
  location: string
  price: number
}

export default function PropertyModal({
  property,
  onClose,
}: {
  property: Property
  onClose: () => void
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="max-w-lg w-full rounded-2xl bg-white p-6 shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold">{property.title}</h3>
            <p className="text-sm text-gray-500">{property.municipality} — {property.location}</p>
          </div>
          <button
            className="ml-auto rounded-full bg-gray-100 p-2 text-gray-700 hover:bg-gray-200"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-gray-100 p-3">
            <div className="text-xs text-gray-500">Type</div>
            <div className="mt-1 font-medium">{property.type}</div>
          </div>
          <div className="rounded-lg bg-gray-100 p-3">
            <div className="text-xs text-gray-500">Price</div>
            <div className="mt-1 font-medium">€{property.price}</div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            className="rounded-full bg-[#46a796] px-4 py-2 text-sm font-semibold text-white hover:opacity-95 transition"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
