import { User } from "@/types"
import api from "."

export default {
  getUsers: async () => {
    try {
      const res = await api.get("/users")
      return res.data.data.items
    } catch (error) {
      console.error(error)
      return Promise.reject(new Error("Something went wrong"))
    }
  },
  postUser: async (user: User) => {
    try {
      const res = await api.post("/users", user)
      return res.data
    } catch (error) {
      console.error(error)
      return Promise.reject(new Error("Something went wrong"))
    }
  },
  deleteUser: async (id: string) => {
    try {
      const res = await api.delete(`/users/${id}`)
      return res.data
    } catch (error) {
      return Promise.reject(new Error("Something went wrong"))
    }
  },

  editUser: async (id: string, user: User) => {
    try {
      const res = await api.put(`/users/${id}`, user)
      return res.data
    } catch (error) {
      return Promise.reject(new Error("Something went wrong"))
    }
  }
}
