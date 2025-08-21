import {
  SignedIn,
  UserButton,
  SignedOut,
  SignInButton,
  SignOutButton,
} from '@clerk/tanstack-react-start'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { createMiddleware, createServerFn } from '@tanstack/react-start';
import { z } from 'zod'

export const Route = createFileRoute('/')({
  loader: async () => await getCount(),
  component: Home,
})


const filePath = 'count.txt'

async function readCount() {
  const fs = await import('fs');
  const data = await fs.promises.readFile(filePath, 'utf-8');
  return parseInt(data, 10);
}

const loggingMiddleware = createMiddleware({ type: 'function' })
  .server(async ({ next, data }) => {
    const result = await next()
    return result
  })

const getCount = createServerFn({
  method: 'GET',
})
  .middleware([loggingMiddleware])
  .handler(async () => {
    return await readCount()
  })


const Count = z.object({
  count: z.number(),
})

const updateCount = createServerFn({ method: 'POST' })
  .validator(Count)
  .handler(async ({ data }) => {
    const fs = await import('fs');
    const count = await readCount();
    await fs.promises.writeFile(filePath, (count + data.count).toString());
  })


function Home() {
  const router = useRouter()
  const state = Route.useLoaderData()

  return (
    <div>
      <h1>Index Route</h1>
      <SignedIn>
        <p>You are signed in</p>
        <UserButton />
        <SignOutButton />
      </SignedIn>
      <SignedOut>
        <p>You are signed out</p>
        <SignInButton />
      </SignedOut>
      <button
        onClick={() => {
          updateCount({ data: { count: 1 } })
          router.invalidate()
        }}
      >
        {state}
      </button>

    </div>
  )
}
