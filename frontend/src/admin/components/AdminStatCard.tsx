type AdminStatCardProps = {
  helper: string
  label: string
  value: string
}

const AdminStatCard = ({ helper, label, value }: AdminStatCardProps) => {
  return (
    <article className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#047857]">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-[#1f1f1f]">{value}</p>
      <p className="mt-2 text-sm text-gray-500">{helper}</p>
    </article>
  )
}

export default AdminStatCard
