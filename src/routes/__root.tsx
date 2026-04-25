import { ClerkProvider } from '@clerk/tanstack-react-start'
import { TanStackDevtools } from '@tanstack/react-devtools'
import type { QueryClient } from '@tanstack/react-query'
import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import Crosshair from '#/components/CrossHair'
import Navbar from '#/components/Navbar'
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import appCss from '../styles.css?url'

if (typeof window !== 'undefined') {
  posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_KEY, {
    api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
    defaults: '2026-01-30',
  })
}

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Skilled - The Registry For Agentic Intelligence',
      },
      {
      name: 'description',
      content: 'Discover, publish, and operate reusable agent capabilities from a route-driver workspace'
      }
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className='dark'>
      <head>
        <HeadContent />
      </head>
      <body className='font-sans antialiased wrap-anywhere'>
        <PostHogProvider client={posthog}>
        <ClerkProvider>
          <div id="root-layout">
            <header>
              <div className='frame'>
                <Navbar />
                <Crosshair />
                <Crosshair />
              </div>
            </header>

            <main>
              <div className='frame'>
                {children}
              </div>
            </main>
          </div>
          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
              TanStackQueryDevtools,
            ]}
          />
        </ClerkProvider>
        </PostHogProvider>
        <Scripts />
      </body>
    </html>
  )
}
