import posthog from 'posthog-js'

let hasInitializedPostHog = false

function getEnv(name: string): string | undefined {
  const value = import.meta.env[name]
  return typeof value === 'string' && value.trim().length > 0 ? value : undefined
}

function getPostHogConfig() {
  const apiKey =
    getEnv('VITE_PUBLIC_POSTHOG_KEY') ??
    getEnv('VITE_POSTHOG_KEY') ??
    getEnv('VITE_PUBLIC_POSTHOG_API_KEY')
  const apiHost =
    getEnv('VITE_PUBLIC_POSTHOG_HOST') ??
    getEnv('VITE_POSTHOG_HOST') ??
    'https://us.i.posthog.com'

  return { apiKey, apiHost }
}

export function initPostHogClient() {
  if (typeof window === 'undefined' || hasInitializedPostHog) {
    return
  }

  if ((posthog as { __loaded?: boolean }).__loaded) {
    hasInitializedPostHog = true
    return
  }

  const { apiKey, apiHost } = getPostHogConfig()

  if (!apiKey) {
    if (import.meta.env.DEV) {
      console.warn(
        '[PostHog] Missing API key. Set VITE_PUBLIC_POSTHOG_KEY (or VITE_POSTHOG_KEY).',
      )
    }
    return
  }

  posthog.init(apiKey, {
    api_host: apiHost,
    capture_pageview: 'history_change',
    capture_pageleave: true,
  })

  hasInitializedPostHog = true
}

export { posthog }
