type ApplyCardProps = {
  monthlyRent: string
  availableFrom: string
  rentalPeriod: string
  deposit: string
  totalMoveInCost: string
  onApply: () => void
}

const ApplyCard = ({
  monthlyRent,
  availableFrom,
  rentalPeriod,
  deposit,
  totalMoveInCost,
  onApply,
}: ApplyCardProps) => {
  return (
    <section className="rounded-3xl border border-black/5 bg-white p-7 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Monthly rent</p>
      <p className="mt-2 text-3xl font-bold text-gray-900">{monthlyRent}</p>

      <dl className="mt-6 space-y-4 rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4">
          <dt className="text-sm text-gray-500">Available from</dt>
          <dd className="max-w-[170px] text-right text-sm font-semibold leading-snug text-gray-900">{availableFrom}</dd>
        </div>
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4">
          <dt className="text-sm text-gray-500">Rental period</dt>
          <dd className="max-w-[170px] text-right text-sm font-semibold leading-snug text-gray-900">{rentalPeriod}</dd>
        </div>
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4">
          <dt className="text-sm text-gray-500">Deposit</dt>
          <dd className="max-w-[170px] text-right text-sm font-semibold leading-snug text-gray-900">{deposit}</dd>
        </div>
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 border-t border-gray-200 pt-4">
          <dt className="text-sm font-semibold text-gray-700">Total move-in cost</dt>
          <dd className="max-w-[170px] text-right text-sm font-bold leading-snug text-gray-900">{totalMoveInCost}</dd>
        </div>
      </dl>

      <button
        className="mt-7 inline-flex w-full items-center justify-center rounded-full bg-emerald-700 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700/40"
        onClick={onApply}
        type="button"
      >
        Apply now
      </button>
    </section>
  )
}

export default ApplyCard
