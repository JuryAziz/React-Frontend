import { Category } from "@/types"
import api from "."

export default {
  getCategories: async () => {
    try {
      const res = await api.get("/categories")
      return res.data.data.items
    } catch (error) {
      console.error(error)
      return Promise.reject(new Error("Something went wrong"))
    }
  },
  postCategory: async (category: Category) => {
    try {
      const res = await api.post("/categories", category)
      return res.data
    } catch (error) {
      console.error(error)
      return Promise.reject(new Error("Something went wrong"))
    }
  },
  deleteCategory: async (id: string) => {
    try {
      const res = await api.delete(`/categories/${id}`)
      return res.data
    } catch (error) {
      return Promise.reject(new Error("Something went wrong"))
    }
  },

  editCategory: async (id: string, category: Category) => {
    try {
      const res = await api.put(`/categories/${id}`, category)
      return res.data
    } catch (error) {
      return Promise.reject(new Error("Something went wrong"))
    }
  }
}
