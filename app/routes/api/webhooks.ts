import { verifyWebhook } from '@clerk/tanstack-react-start/webhooks'
import { createAPIFileRoute } from '@tanstack/react-start/api'

export const APIRoute = createAPIFileRoute('/api/webhooks')({
  POST: async ({ request }) => {
    try {
      const evt = await verifyWebhook(request)

      // Do something with payload
      // For this guide, log payload to console
      const { id } = evt.data
      const eventType = evt.type
      console.log(
        `Received webhook with ID ${id} and event type of ${eventType}`,
      )
      console.log('Webhook payload:', evt.data)

      return new Response('Webhook received', { status: 200 })
    } catch (err) {
      console.error('Error verifying webhook:', err)
      return new Response('Error verifying webhook', { status: 400 })
    }
  },
})
