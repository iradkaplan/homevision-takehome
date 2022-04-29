import express, { Request, Response } from 'express'
import fetch from 'node-fetch'
import path from 'path'
import { createWriteStream, existsSync, mkdirSync } from 'fs'

const app = express()
const port = process.env.PORT || '8000'

// parse application/json
app.use(express.json())

app.use('/', async (req: Request, res: Response) => {
  const pages: HouseData[] = []
  for (let i = 1; i <= 2; i++) {
    const data = await getData(i)
    pages.push(...data.houses)
  }

  if (!existsSync('images')) {
    mkdirSync('images')
  }
  await Promise.all(
    pages.map((page) => {
      getImage(page)
    })
  )
  res.send(pages)
})

app.listen(port, () => {
  return console.log(`Server is listening on ${port}`)
})

async function getData(
  page = 1,
  perPage = 10
): Promise<SomeRequired<ApiResponse, 'houses' | 'ok'>> {
  // console.log('running getData')
  const response = await fetch(
    `http://app-homevision-staging.herokuapp.com/api_project/houses?page=${page}&per_page=${perPage}`
  )
  const responseJSON: ApiResponse = await response.json()
  if (responseJSON['ok']) {
    return responseJSON as SomeRequired<ApiResponse, 'houses' | 'ok'>
  }
  return getData(page, perPage)
}

async function getImage(houseData: HouseData): Promise<void> {
  const fileExtension = houseData.photoURL.match(/\.[0-9a-z]+$/i)
  const fileName = houseData.id + '-' + houseData.address + fileExtension
  console.log(fileName)
  const imageResponse = await fetch(houseData.photoURL)
  imageResponse.body.pipe(createWriteStream(path.join('images', fileName)))
}

type Required<T> = { [P in keyof T]-?: T[P] }
type SomeRequired<T, TRequired extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, TRequired>
> &
  Required<Pick<T, TRequired>>

type ApiResponse = {
  houses?: HouseData[]
  ok: boolean
  message?: string
}

type HouseData = {
  id: number
  address: string
  homeowner: string
  price: number
  photoURL: string
}
