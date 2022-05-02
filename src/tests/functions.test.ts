jest.mock('node-fetch')
import fetch from 'node-fetch'
const { Response } = jest.requireActual('node-fetch')
import { getData, getImage } from '../functions'
import fs from 'fs'

const houseData = {
  id: 0,
  address: 'anything',
  homeowner: 'anyone',
  price: 123456,
  photoURL: 'http://www.yahoo.com/image.png'
}

describe('getData', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  const successResponse = {
    ok: true,
    houses: [houseData]
  }

  const failureResponse = { ok: false, message: "doesn't matter" }

  it('gets called once when the response is successful', async () => {
    ;(fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue(
      new Response(JSON.stringify(successResponse))
    )
    await getData()
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('gets called thrice when the first two responses are unsuccessful', async () => {
    ;(fetch as jest.MockedFunction<typeof fetch>)
      .mockResolvedValue(new Response(JSON.stringify(successResponse)))
      .mockResolvedValueOnce(new Response(JSON.stringify(failureResponse)))
      .mockResolvedValueOnce(new Response(JSON.stringify(failureResponse)))
    await getData()
    expect(fetch).toHaveBeenCalledTimes(3)
  })
})

describe('getImages', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('fetches the image and saves it to an appropriately named file', async () => {
    jest.mock('node-fetch')
    ;(fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
      body: { pipe: jest.fn() }
    } as unknown as typeof Response)
    const mockCreateWriteStream = jest.fn()
    jest
      .spyOn(fs, 'createWriteStream')
      .mockImplementation(mockCreateWriteStream)
    const fileExtension = houseData.photoURL.match(/\.[0-9a-z]+$/i)
    const fileName = houseData.id + '-' + houseData.address + fileExtension
    await getImage(houseData, '../images')

    expect(mockCreateWriteStream).toBeCalledWith(`../images/${fileName}`)
  })
})
