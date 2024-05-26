import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { createContext, useState } from "react"

import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import Cart from "./components/user/cart"
import ProductDetails from "./components/user/productDetails";
import "./App.css"
import { GlobalContextType, GlobalState, Product } from "./types"


const router = createBrowserRouter([
  {
    path: "/Home",
    element: <Home />
  },
  {
    path: "/dashboard",
    element: <Dashboard />
  },
  {
    path: "/cart",
    element: <Cart />
  },
  {
    path: "/product/:productId",
    element: <ProductDetails/>
  }
])

export const GlobalContext = createContext<GlobalContextType | null>(null)

export default function App() {
  const [state, setState] = useState<GlobalState>({
    cart: []
  })

  // * cart is in frontend for now...
  const handleAddToCart = (product: Product) => {
    setState({ ...state, cart: [...state.cart, product] })
    // await addToCart(product)
  }
    const handleDeleteFromCart = (id: string) => {
      const filteredCart = state.cart.filter( (product) => product.productId !== id )
      setState({ ...state, cart: filteredCart })
      // await addToCart(product)
    }
  // // todo: u know what to do, edit this function
  // // todo: cart id to variable. product id to variable.
  // const addToCart = async (product: Product) => {
  //   try {
  //     console.log("Boo", product)
  //     const res = await api.post("/cartitems", {
  //       cartId: "0f7ecab1-184d-490e-941a-bd3b342d51d1",
  //       productId: product.productId,
  //       quantity: 1
  //     })
  //     return res.data
  //   } catch (error) {
  //     console.error(error)
  //     return Promise.reject(new Error("Something went wrong"))
  //   }
  // }

  return (
    <div className="App">
      <GlobalContext.Provider value={{ state, handleAddToCart, handleDeleteFromCart}}>
        <RouterProvider router={router} />
      </GlobalContext.Provider>
    </div>
  )
}
