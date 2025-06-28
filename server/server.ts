import express, { Express, Request, Response } from 'express'
import cors from 'cors'

import { sampleTransformerData, TransformerData } from './sampleTransformerData'

const app: Express = express()
const PORT: number = 3001

// Enable CORS for all routes
app.use(cors())

// Endpoint to get transformer data
app.get('/getTransformerData', (req: Request, res: Response<TransformerData[]>) => {
  // Simulate network lag
  setTimeout(() => {
    res.json(sampleTransformerData)
  }, 500)
})

// Start the server
app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`)
})
