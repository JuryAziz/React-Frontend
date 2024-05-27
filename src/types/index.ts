export type Product = {
  productId: string
  name: string
  price: number
  stock: number
  description: string
  categories: Category[]
}

export type Category = {
  id: string
  name: string
}

export type Cart = {
  products: Product[]
}

export const ROLE = {
  Admin: "Admin",
  User: "User"
} as const

export type DecodedUser = {
  aud: string
  exp: string
  iat: string
  iss: string
  nameid: string
  nbf: string
  role: keyof typeof ROLE
}

export type DecodedToken = {
  aud: string
  exp: number
  iat: number
  iss: string
  nameid: string[]
  nbf: number
}
export type GlobalState = {
  cart: Product[]
  user: DecodedUser | null
}

export type GlobalContextType = {
  state: GlobalState
  handleAddToCart: (product: Product) => void
  handleDeleteFromCart: (id: string) => void
}
