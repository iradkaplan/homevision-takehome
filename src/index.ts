import express, { Request, Response } from 'express'
import { getFirstTenPagesAndDownloadImages } from './functions'

const app = express()
const port = process.env.PORT || '8000'

// parse application/json
app.use(express.json())

app.use('/', async (req: Request, res: Response) => {
  const pages = await getFirstTenPagesAndDownloadImages()
  res.send(pages)
})

app.listen(port, () => {
  return console.log(`Server is listening on ${port}`)
})
