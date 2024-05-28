export type Product = {
  productId: string
  name: string
  price: number
  stock: number
  description: string
  category: string
}

export type User = {
  userId: string
  email: string
  phoneNumber: string
  firstName: string
  lastName: string
  role: number
}

export type Category = {
  categoryId: string
  name: string
  description: string
}

export type Cart = {
  products: Product[]
}

export const Role = {
  0: "User",
  1: "Admin",
  3: "Banned"
} as const

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
  handleStoreUser: (user: DecodedUser) => void
}
