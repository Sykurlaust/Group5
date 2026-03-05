import { Swiper, SwiperSlide } from "swiper/react"

const slides = [
  "Keep your profile complete to improve trust and booking speed.",
  "Respond to messages quickly to maintain high dashboard activity.",
  "Review active listings weekly for better conversion.",
]

const AdminHighlights = () => {
  return (
    <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-[#1f1f1f]">Quick Highlights</h2>
      <p className="mt-1 text-sm text-gray-500">Small TailAdmin-style carousel for updates.</p>

      <Swiper className="mt-4" slidesPerView={1} spaceBetween={12}>
        {slides.map((slide) => (
          <SwiperSlide key={slide}>
            <div className="rounded-2xl border border-[#2dbe8b]/30 bg-[#2dbe8b]/10 p-4 text-sm font-medium text-[#1f1f1f]">
              {slide}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}

export default AdminHighlights
