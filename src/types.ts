export type SomeRequired<T, TRequired extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, TRequired>
> &
  Required<Pick<T, TRequired>>

export type ApiResponse = {
  houses?: HouseData[]
  ok: boolean
  message?: string
}

export type HouseData = {
  id: number
  address: string
  homeowner: string
  price: number
  photoURL: string
}
