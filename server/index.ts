import express from 'express'
import cors from 'cors'
import { createRouteHandler } from 'uploadthing/express'
import { ourFileRouter } from '../src/server/uploadthing'

const app = express()

app.use(cors())

app.use(
  '/api/uploadthing',
  createRouteHandler({
    router: ourFileRouter,
    config: {
      token: process.env.UPLOADTHING_TOKEN,
    },
  })
)

const PORT = process.env.PORT || 3001

app.listen(PORT)
