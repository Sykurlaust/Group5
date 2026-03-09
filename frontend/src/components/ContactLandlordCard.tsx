type ContactLandlordCardProps = {
  landlordName: string
  landlordImage?: string
  phone?: string
  onMessage: () => void
}

const ContactLandlordCard = ({
  landlordName,
  landlordImage,
  phone,
  onMessage,
}: ContactLandlordCardProps) => {
  const initial = landlordName.trim().charAt(0).toUpperCase() || "L"

  return (
    <section className="rounded-3xl border border-black/5 bg-white p-7 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Listing owner</p>

      <div className="mt-5 flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
        {landlordImage ? (
          <img
            alt={landlordName}
            className="h-12 w-12 rounded-full object-cover"
            src={landlordImage}
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-lg font-semibold text-emerald-700">
            {initial}
          </div>
        )}

        <div className="min-w-0">
          <p className="truncate text-base font-semibold text-gray-900">{landlordName}</p>
          <p className="mt-0.5 text-sm text-gray-500">{phone || "Contact available after login"}</p>
        </div>
      </div>

      <button
        className="mt-7 inline-flex w-full items-center justify-center rounded-full border border-emerald-700 bg-white px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-700 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700/40"
        onClick={onMessage}
        type="button"
      >
        Message landlord
      </button>
    </section>
  )
}

export default ContactLandlordCard
