import { createWriteStream, existsSync, mkdirSync } from 'fs'
import fetch from 'node-fetch'
import path from 'path'
import { SomeRequired, ApiResponse, HouseData } from './types'

export async function getData(
  page = 1,
  perPage = 10
): Promise<SomeRequired<ApiResponse, 'houses' | 'ok'>> {
  const response = await fetch(
    `http://app-homevision-staging.herokuapp.com/api_project/houses?page=${page}&per_page=${perPage}`
  )
  const responseJSON: ApiResponse = await response.json()
  if (responseJSON['ok']) {
    return responseJSON as SomeRequired<ApiResponse, 'houses' | 'ok'>
  }
  console.log(`making recursive call for page ${page}`)
  return getData(page, perPage)
}

export async function getImage(
  houseData: HouseData,
  folderPath: string
): Promise<void> {
  const fileExtension = houseData.photoURL.match(/\.[0-9a-z]+$/i)
  const fileName = houseData.id + '-' + houseData.address + fileExtension
  const imageResponse = await fetch(houseData.photoURL)
  imageResponse.body.pipe(createWriteStream(path.join(folderPath, fileName)))
}

export async function getFirstTenPagesAndDownloadImages(): Promise<
  HouseData[]
> {
  const pages: HouseData[] = []
  for (let page = 1; page <= 10; page++) {
    const data = await getData(page)
    pages.push(...data.houses)
  }

  const imageFolder = 'images'
  if (!existsSync(imageFolder)) {
    mkdirSync(imageFolder)
  }
  await Promise.all(
    pages.map((houseData) => {
      getImage(houseData, imageFolder)
    })
  )
  return pages
}
