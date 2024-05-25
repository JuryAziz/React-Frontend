export type Product = {
  id: string
  name: string
  price: number
  stock: number
  description: string
  categories: string[]
}

export type Category = {
  id: string
  name: string
}

export type Cart = {
  products: Product[]
}

export type GlobalState = {
  cart: Product[]
}

export type GlobalContextType = {
  state: GlobalState,
  handleAddToCart: (product: Product) => void
}