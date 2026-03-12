import { MessageCircleMore } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const JOTFORM_AGENT_SCRIPT_SRC =
  "https://cdn.jotfor.ms/agent/embedjs/019cdc18dbdc751292ad7c9cf298bf4b2fd1/embed.js"

const removeJotformAgentNodes = () => {
  const selectors = [
    `script[src="${JOTFORM_AGENT_SCRIPT_SRC}"]`,
    `iframe[src*="jotfor.ms/agent"]`,
    `iframe[src*="jotform.com/agent"]`,
    `[id*="jotform-agent"]`,
    `[class*="jotform-agent"]`,
  ]

  for (const selector of selectors) {
    document.querySelectorAll(selector).forEach((node) => node.remove())
  }
}

const HomepageSupportChatbot = () => {
  const hasLoadedRef = useRef(false)
  const [isActivated, setIsActivated] = useState(false)
  const [isScriptLoading, setIsScriptLoading] = useState(false)

  useEffect(() => {
    if (!isActivated || typeof document === "undefined") return

    const loadScript = () => {
      if (hasLoadedRef.current) return

      const existingScript = document.querySelector<HTMLScriptElement>(
        `script[src="${JOTFORM_AGENT_SCRIPT_SRC}"]`,
      )
      if (existingScript) {
        hasLoadedRef.current = true
        setIsScriptLoading(false)
        return
      }

      const script = document.createElement("script")
      script.src = JOTFORM_AGENT_SCRIPT_SRC
      script.async = true
      script.defer = true
      script.onload = () => setIsScriptLoading(false)
      script.onerror = () => {
        setIsScriptLoading(false)
        hasLoadedRef.current = false
        console.warn("Failed to load support chatbot script.")
      }
      document.body.appendChild(script)
      hasLoadedRef.current = true
      setIsScriptLoading(true)
    }

    loadScript()

    return () => {
      hasLoadedRef.current = false
      setIsScriptLoading(false)
      removeJotformAgentNodes()
    }
  }, [isActivated])

  if (!isActivated) {
    return (
      <button
        aria-label="Open support chatbot"
        className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full border border-[#047857]/20 bg-white px-4 py-2 text-sm font-semibold text-[#047857] shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition hover:bg-[#f4faf7]"
        onClick={() => setIsActivated(true)}
        type="button"
      >
        <MessageCircleMore className="h-4 w-4" />
        <span>Support</span>
      </button>
    )
  }

  if (isScriptLoading) {
    return (
      <div className="fixed bottom-6 right-6 z-40 rounded-full border border-[#047857]/20 bg-white px-4 py-2 text-sm font-medium text-[#047857] shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
        Loading support...
      </div>
    )
  }

  return null
}

export default HomepageSupportChatbot
