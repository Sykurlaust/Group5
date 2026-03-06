const highlights = [
  "Keep your profile complete to improve trust and booking speed.",
  "Respond to messages quickly to maintain high dashboard activity.",
  "Review active listings weekly for better conversion.",
]

const AdminHighlights = () => {
  return (
    <section className="rounded-[28px] border border-black/5 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
      <h2 className="text-lg font-semibold text-[#1f1f1f]">Quick Highlights</h2>
      <p className="mt-1 text-sm text-gray-500">Status notes for today.</p>

      <ul className="mt-4 space-y-3">
        {highlights.map((highlight) => (
          <li
            className="rounded-2xl border border-[#047857]/20 bg-[#047857]/10 px-4 py-3 text-sm font-medium text-[#1f1f1f]"
            key={highlight}
          >
            {highlight}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default AdminHighlights
