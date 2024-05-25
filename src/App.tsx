import { createBrowserRouter, RouterProvider } from "react-router-dom"

import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"

import "./App.css"
import { createContext, useState } from "react"
import { GlobalContextType, GlobalState, Product } from "./types"
import api from "./api"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/dashboard",
    element: <Dashboard />
  }
])

export const GlobalContext = createContext<GlobalContextType | null>(null)

export default function App() {
  const [state, setState] = useState<GlobalState>({
    cart: []
  })

  const handleAddToCart = async (product: Product) => {
    setState({ ...state, cart: [...state.cart, product] })
    await addToCart()
  }

  // todo: u know what to do, edit this function
  // todo: cart id to variable. product id to variable.
  const addToCart = async () => {
    try {
      console.log("Boo", state)
      const res = await api.post("/cartitems", {
        cartId: "0f7ecab1-184d-490e-941a-bd3b342d51d1",
        productId: "5622db48-776e-44a9-985a-15e99204a60a",
        quantity: 1
      })
      return res.data
    } catch (error) {
      console.error(error)
      return Promise.reject(new Error("Something went wrong"))
    }
  }

  return (
    <div className="App">
      <GlobalContext.Provider value={{ state, handleAddToCart }}>
        <RouterProvider router={router} />
      </GlobalContext.Provider>
    </div>
  )
}
