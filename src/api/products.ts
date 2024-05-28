import { Product } from "@/types"
import api from "."

export default {
  getProducts: async () => {
    try {
      const res = await api.get("/products")
      return res.data.data.items
    } catch (error) {
      console.error(error)
      return Promise.reject(new Error("Something went wrong"))
    }
  },
  postProduct: async (product: Product) => {
    try {
      const res = await api.post("/products", product)
      return res.data
    } catch (error) {
      console.error(error)
      return Promise.reject(new Error("Something went wrong"))
    }
  },
  deleteProduct: async (id: string) => {
    try {
      const res = await api.delete(`/products/${id}`)
      return res.data
    } catch (error) {
      return Promise.reject(new Error("Something went wrong"))
    }
  },

  editProduct: async (id: string, product: Product) => {
    try {
      const res = await api.put(`/products/${id}`, product)
      return res.data
    } catch (error) {
      return Promise.reject(new Error("Something went wrong"))
    }
  }
}
