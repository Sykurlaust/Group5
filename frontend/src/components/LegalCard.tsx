interface LegalCardProps {
  label: string
  title: string
  children: React.ReactNode
}

const LegalCard = ({ label, title, children }: LegalCardProps) => {
  return (
    <main className="px-6 py-16">
      <section className="mx-auto max-w-3xl rounded-[32px] border border-black/5 bg-white p-10 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#047857]">{label}</p>
        <h1 className="mt-4 text-4xl font-semibold">{title}</h1>
        <div className="mt-6 space-y-6 text-base leading-8 text-gray-600">{children}</div>
      </section>
    </main>
  )
}

export default LegalCard
