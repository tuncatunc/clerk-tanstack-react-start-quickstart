import { createFileRoute } from '@tanstack/react-router'
import { SignIn } from '@clerk/tanstack-react-start'

export const Route = createFileRoute('/_auth')({
  beforeLoad: ({ context }) => {
    if (!context.userId) {
      throw new Error('Not authenticated')
    }
  },
  errorComponent: ({ error }) => {
    if (error.message === 'Not authenticated') {
      return (
        <div className="flex items-center justify-center p-12">
          <SignIn />
        </div>
      )
    }

    throw error
  },
})

function RouteComponent() {
  return <div>Hello "/_auth"!</div>
}
