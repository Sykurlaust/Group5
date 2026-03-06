import { Link } from "react-router-dom"

type ButtonVariant = "primary" | "secondary" | "outline"

interface ButtonProps {
  children: React.ReactNode
  variant?: ButtonVariant
  type?: "button" | "submit" | "reset"
  onClick?: () => void
  fullWidth?: boolean
  to?: string
  disabled?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-[#047857] text-white hover:opacity-90",
  secondary: "bg-white text-[#047857] border border-[#047857] hover:bg-[#047857] hover:text-white",
  outline: "border border-black/10 text-gray-700 hover:bg-gray-50",
}

const Button = ({
  children,
  variant = "primary",
  type = "button",
  onClick,
  fullWidth = false,
  to,
  disabled = false,
}: ButtonProps) => {
  const base =
    "rounded-full px-5 py-3 text-sm font-semibold transition focus:outline-none disabled:opacity-50"
  const width = fullWidth ? "w-full" : ""
  const classes = `${base} ${variantClasses[variant]} ${width}`.trim()

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  )
}

export default Button
