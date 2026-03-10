type LogoProps = {
  variant?: "main" | "navbar" | "icon" | "white" | "black"
  width?: number | string
  className?: string
}

declare const Logo: (props: LogoProps) => JSX.Element
export default Logo
