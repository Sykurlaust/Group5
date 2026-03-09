import logoBlack from "../assets/logos/Gc-renting-logo/gc-logo-black.svg"
import logoIcon from "../assets/logos/Gc-renting-logo/gc-logo-icon.svg"
import logoMain from "../assets/logos/Gc-renting-logo/gc-logo-main.svg"
import logoNavbar from "../assets/logos/Gc-renting-logo/gc-logo-navbar.svg"
import logoWhite from "../assets/logos/Gc-renting-logo/gc-logo-white.svg"

const logoByVariant = {
  main: logoMain,
  navbar: logoNavbar,
  icon: logoIcon,
  white: logoWhite,
  black: logoBlack,
}

const Logo = ({
  variant = "main",
  width = variant === "icon" ? 52 : "clamp(140px, 22vw, 220px)",
  className = "",
}) => {
  const source = logoByVariant[variant] ?? logoByVariant.main
  return (
    <img
      alt="GC Renting logo"
      className={`h-auto w-auto max-w-full object-contain ${className}`}
      loading="eager"
      src={source}
      style={{ width }}
    />
  )
}

export default Logo
