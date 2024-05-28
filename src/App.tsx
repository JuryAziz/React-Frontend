import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { createContext, useState } from "react"

import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import Cart from "./components/user/cart"
import ProductDetails from "./components/user/productDetails"
import "./App.css"
import { DecodedUser, GlobalContextType, GlobalState, Product } from "./types"
import Login from "./pages/Login"
import { Signup } from "./pages/Signup"
import PrivateRoute from "./components/PrivateRoute"

import { ThemeProvider } from "@/components/theme-provider"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/signup",
    element: <Signup />
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    )
  },
  {
    path: "/cart",
    element: (
      <PrivateRoute>
        <Cart />
      </PrivateRoute>
    )
  },
  {
    path: "/product/:productId",
    element: <ProductDetails />
  }
])

export const GlobalContext = createContext<GlobalContextType | null>(null)

export default function App() {
  const [state, setState] = useState<GlobalState>({
    cart: JSON.parse(localStorage.getItem("cart") as string) || [],
    user: null
  })

  const handleStoreUser = (user: DecodedUser) => {
    setState({ ...state, user: user })
  }

  const handleLogout = () => {
    setState({ ...state, user: null })
  }

  // * cart is in frontend for now...
  const handleAddToCart = (product: Product) => {
    setState({ ...state, cart: [...state.cart, product] })
    localStorage.setItem("cart", JSON.stringify([...state.cart, product]))
  }

  const handleDeleteFromCart = (id: string) => {
    const filteredCart = state.cart.filter((product) => product.productId !== id)
    setState({ ...state, cart: filteredCart })
    localStorage.setItem("cart", JSON.stringify(filteredCart))
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <GlobalContext.Provider
        value={{ state, handleLogout, handleAddToCart, handleDeleteFromCart, handleStoreUser }}
      >
        <RouterProvider router={router} />
      </GlobalContext.Provider>
    </ThemeProvider>
  )
}
