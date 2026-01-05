import express from 'express'
import cors from 'cors'
import { createRouteHandler } from 'uploadthing/express'
import { ourFileRouter } from '../src/server/uploadthing'
import topicRoutes from './routes/topics'

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// UploadThing routes
app.use(
  '/api/uploadthing',
  createRouteHandler({
    router: ourFileRouter,
    config: {
      token: process.env.UPLOADTHING_TOKEN,
    },
  })
)

// Topic API routes
app.use('/api/topics', topicRoutes)

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  // eslint-disable-next-line no-console
  console.error('Server error:', err)
  res.status(500).json({ success: false, error: err.message || 'Internal server error' })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${PORT}`)
})
