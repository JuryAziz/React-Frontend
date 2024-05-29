import React, { useContext } from "react"
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import api from "@/api"
import Navbar from "../navbar"
import { Button } from "../ui/button"
import { GlobalContext } from "@/App"

export default function ProductDetails() {
  const params = useParams()
  const context = useContext(GlobalContext)
  if (!context) throw new Error("No context provided")
  const { handleAddToCart } = context

  const getProduct = async () => {
    try {
      const res = await api.get(`/products/${params.productId}`)
      return res.data
    } catch (error) {
      return Promise.reject(new Error("Something went wrong"))
    }
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ["product"],
    queryFn: getProduct
  })

  const product = data?.data

  return (
    <div>
      <Navbar />
      {isLoading ? (
        <p> Loading...</p>
      ) : error ? (
        <p> no product found</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6 lg:gap-12 items-start max-w-6xl px-4 mx-auto py-6">
          <div className="grid gap-4 md:gap-10 items-start">
            <img
              alt="Product Image"
              className="aspect-[2/3] object-cover border border-gray-200 w-full rounded-lg overflow-hidden dark:border-gray-800"
              height={300}
              src={product?.thumbnail}
              width={300}
            />
          </div>
          <div className="grid gap-4 md:gap-10 items-start">
            <div className="grid gap-4">
              <h1 className="font-bold text-3xl lg:text-4xl">{product?.name}</h1>
              <div>
                <p>{product?.description}</p>
              </div>
            </div>
            <Button className="w-full" onClick={() => handleAddToCart(product)}>
              Add to cart
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
