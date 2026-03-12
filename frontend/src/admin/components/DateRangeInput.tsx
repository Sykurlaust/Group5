import flatpickr from "flatpickr"
import { useEffect, useRef } from "react"

const DateRangeInput = () => {
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!inputRef.current) {
      return
    }

    const picker = flatpickr(inputRef.current, {
      dateFormat: "Y-m-d",
      mode: "range",
      defaultDate: [new Date(), new Date()],
    })

    return () => picker.destroy()
  }, [])

  return (
    <input
      aria-label="Select date range"
      className="w-full rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-gray-600 outline-none focus:border-[#047857]"
      placeholder="Select date range"
      ref={inputRef}
      type="text"
    />
  )
}

export default DateRangeInput
