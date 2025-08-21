/// <reference types="vite/client" />
import * as React from 'react'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { ClerkProvider } from '@clerk/tanstack-react-start'
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { createMiddleware, createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { getWebRequest } from '@tanstack/react-start/server'
import { getAuth } from '@clerk/tanstack-react-start/server'

const fetchClerkAuth = createServerFn({ method: 'GET' }).handler(async () => {
  // const request = getWebRequest();
  // const { userId } = await getAuth(request!);

  return {
    userId: 'user_31XxzYjOCP1paHIustla1QRaMRw',
  }
})

export const Route = createRootRoute({
  beforeLoad: async () => {
    const { userId } = await fetchClerkAuth()

    return {
      userId,
    }
  },
  component: RootComponent,
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
    scripts: [
      {
        src: '/scripts/sideshift.js'
      },
      {
        src: 'https://sideshift.ai/static/js/main.js',
      }
    ],
    styles: [
    ]
  }),

})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html>
        <head>
          <HeadContent />
        </head>
        <body>
          {children}
          <TanStackRouterDevtools position="bottom-right" />
          <Scripts />
        </body>
      </html>
    </ClerkProvider>
  )
}
