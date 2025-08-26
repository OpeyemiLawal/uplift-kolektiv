declare global {
  interface Window {
    turnstile: {
      render: (container: string | HTMLElement, options: any) => string
      reset: (widgetId: string) => void
      getResponse: (widgetId: string) => string
    }
  }
}

export {}
