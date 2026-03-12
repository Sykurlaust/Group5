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
  const [isLoading, setIsLoading] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  const handleLoadChatbot = () => {
    if (typeof document === "undefined" || hasLoadedRef.current || isLoading) return

    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${JOTFORM_AGENT_SCRIPT_SRC}"]`,
    )
    if (existingScript) {
      hasLoadedRef.current = true
      setIsLoaded(true)
      return
    }

    setIsLoading(true)
    const script = document.createElement("script")
    script.src = JOTFORM_AGENT_SCRIPT_SRC
    script.async = true
    script.defer = true
    script.onload = () => {
      hasLoadedRef.current = true
      setIsLoaded(true)
      setIsLoading(false)
    }
    script.onerror = () => {
      setIsLoading(false)
    }
    document.body.appendChild(script)
  }

  useEffect(() => {
    if (typeof document === "undefined") return
    return () => {
      hasLoadedRef.current = false
      removeJotformAgentNodes()
    }
  }, [])

  if (isLoaded) return null

  return (
    <button
      aria-label="Open support chat"
      className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-transparent shadow-none transition-transform duration-200 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#047857]/30 disabled:cursor-not-allowed"
      disabled={isLoading}
      onClick={handleLoadChatbot}
      type="button"
    >
      <img
        alt="Support"
        className={`h-12 w-12 object-contain drop-shadow-[0_6px_16px_rgba(0,0,0,0.2)] ${isLoading ? "animate-pulse opacity-70" : ""}`}
        src="/assets/support-agent.png"
      />
    </button>
  )
}

export default HomepageSupportChatbot
