import React from "react"
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"

import { Product } from "@/types"
import api from "@/api"
import Navbar from "../ui/navbar";

export default function ProductDetails() {
  const params = useParams()

  const getProduct = async () => {
    try {
      const res = await api.get(`/products/${params.productId}`)
      return res.data
    } catch (error) {
      return Promise.reject(new Error("Something went wrong"))
    }
  }

  const {
    data: product,
    isLoading,
    error
  } = useQuery<Product>({
    queryKey: ["product"],
    queryFn: getProduct
  })

  if (isLoading) {
    // todo: gif or something
    return <p> Loading...</p>
  }

  if (!product) {
    // todo: 404?
    return <p> no product found</p>
    }

    return <div>
        <Navbar />
        
  </div>
}
