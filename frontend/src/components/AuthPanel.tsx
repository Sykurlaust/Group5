interface AuthPanelProps {
  eyebrow: string
  title: string
  description: string
  features: string[]
}

const AuthPanel = ({ eyebrow, title, description, features }: AuthPanelProps) => {
  return (
    <div className="rounded-[40px] bg-[#047857] p-10 text-white shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">{eyebrow}</p>
      <h1 className="mt-4 text-4xl font-semibold leading-tight">{title}</h1>
      <p className="mt-4 text-lg text-white/80">{description}</p>
      <div className="mt-10 grid gap-3 text-sm text-white/90">
        {features.map((feature) => (
          <div key={feature} className="flex items-center gap-3">
            <span className="inline-block h-2 w-2 rounded-full bg-white/90" />
            {feature}
          </div>
        ))}
      </div>
    </div>
  )
}

export default AuthPanel
