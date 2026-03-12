import { useEffect, useRef } from "react"

const JOTFORM_AGENT_SCRIPT_SRC =
  "https://cdn.jotfor.ms/agent/embedjs/019cdc18dbdc751292ad7c9cf298bf4b2fd1/embed.js"

type IdleCallbackHandle = number
type IdleCallbackFn = (deadline: { didTimeout: boolean; timeRemaining: () => number }) => void
type IdleCallbackOptions = { timeout?: number }

const getRequestIdleCallback = () => {
  const maybeWindow = window as Window & {
    requestIdleCallback?: (callback: IdleCallbackFn, options?: IdleCallbackOptions) => IdleCallbackHandle
  }
  return maybeWindow.requestIdleCallback
}

const getCancelIdleCallback = () => {
  const maybeWindow = window as Window & {
    cancelIdleCallback?: (handle: IdleCallbackHandle) => void
  }
  return maybeWindow.cancelIdleCallback
}

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

  useEffect(() => {
    if (typeof document === "undefined") return

    let fallbackTimerId: number | null = null
    let idleHandle: IdleCallbackHandle | null = null

    const loadScript = () => {
      if (hasLoadedRef.current) return

      const existingScript = document.querySelector<HTMLScriptElement>(
        `script[src="${JOTFORM_AGENT_SCRIPT_SRC}"]`,
      )
      if (existingScript) {
        hasLoadedRef.current = true
        return
      }

      const script = document.createElement("script")
      script.src = JOTFORM_AGENT_SCRIPT_SRC
      script.async = true
      script.defer = true
      document.body.appendChild(script)
      hasLoadedRef.current = true
    }

    const triggerLoadAndCleanupInteractionListeners = () => {
      loadScript()
      window.removeEventListener("pointerdown", triggerLoadAndCleanupInteractionListeners)
      window.removeEventListener("keydown", triggerLoadAndCleanupInteractionListeners)
      window.removeEventListener("scroll", triggerLoadAndCleanupInteractionListeners)
    }

    window.addEventListener("pointerdown", triggerLoadAndCleanupInteractionListeners, { once: true })
    window.addEventListener("keydown", triggerLoadAndCleanupInteractionListeners, { once: true })
    window.addEventListener("scroll", triggerLoadAndCleanupInteractionListeners, {
      once: true,
      passive: true,
    })

    const requestIdle = getRequestIdleCallback()
    if (requestIdle) {
      idleHandle = requestIdle(() => loadScript(), { timeout: 5000 })
    } else {
      fallbackTimerId = window.setTimeout(loadScript, 3000)
    }

    return () => {
      if (fallbackTimerId !== null) {
        window.clearTimeout(fallbackTimerId)
      }

      if (idleHandle !== null) {
        const cancelIdle = getCancelIdleCallback()
        cancelIdle?.(idleHandle)
      }

      window.removeEventListener("pointerdown", triggerLoadAndCleanupInteractionListeners)
      window.removeEventListener("keydown", triggerLoadAndCleanupInteractionListeners)
      window.removeEventListener("scroll", triggerLoadAndCleanupInteractionListeners)

      hasLoadedRef.current = false
      removeJotformAgentNodes()
    }
  }, [])

  return null
}

export default HomepageSupportChatbot
