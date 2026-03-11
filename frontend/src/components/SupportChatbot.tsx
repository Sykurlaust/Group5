import { useEffect } from "react"
import { useLocation } from "react-router-dom"

const JOTFORM_AGENT_SCRIPT_SRC =
  "https://cdn.jotfor.ms/agent/embedjs/019cdc18dbdc751292ad7c9cf298bf4b2fd1/embed.js"
const CHATBOT_HIDE_STYLE_ID = "gc-rentals-support-chatbot-hide-style"

const shouldHideForRoute = (pathname: string) => {
  return pathname.startsWith("/messages") || pathname.startsWith("/dashboard")
}

const SupportChatbot = () => {
  const { pathname } = useLocation()
  const isHiddenRoute = shouldHideForRoute(pathname)

  useEffect(() => {
    if (typeof document === "undefined") return

    const existingHideStyle = document.getElementById(CHATBOT_HIDE_STYLE_ID)

    if (isHiddenRoute) {
      if (!existingHideStyle) {
        const style = document.createElement("style")
        style.id = CHATBOT_HIDE_STYLE_ID
        style.textContent = `
          iframe[src*="jotfor.ms/agent"],
          iframe[src*="jotform.com/agent"],
          [id*="jotform-agent"],
          [class*="jotform-agent"] {
            display: none !important;
          }
        `
        document.head.appendChild(style)
      }
      return
    }

    if (existingHideStyle) {
      existingHideStyle.remove()
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${JOTFORM_AGENT_SCRIPT_SRC}"]`,
    )
    if (existingScript) return

    const script = document.createElement("script")
    script.src = JOTFORM_AGENT_SCRIPT_SRC
    script.async = true
    script.defer = true
    document.body.appendChild(script)
  }, [isHiddenRoute])

  return null
}

export default SupportChatbot
