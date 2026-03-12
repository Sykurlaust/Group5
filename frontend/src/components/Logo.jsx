const Logo = ({ width = 52, className = "" }) => {
  return (
    <img
      alt="GC Renting logo"
      className={`h-auto w-auto max-w-full object-contain ${className}`}
      loading="eager"
      src="/gc-renting-logo.svg"
      style={{ width }}
    />
  )
}

export default Logo
