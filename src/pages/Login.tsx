import { ChangeEvent, FormEvent, useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import api from "@/api"
import { GlobalContext } from "@/App"
import { decodeUser } from "@/lib/utils"
import { ROLE } from "@/types"

export default function Login() {
  const context = useContext(GlobalContext)
  if (!context) throw new Error("No context provided")
  const { handleStoreUser } = context

  const navigate = useNavigate()

  const [user, setUser] = useState({
    email: "",
    password: ""
  })

  const login = async () => {
    try {
      const res = await api.post(`/auth/login`, user)
      return res.data.data.token
    } catch (error) {
      return Promise.reject(new Error("Unable to verify credentials"))
    }
  }

  const handleChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = ev.target
    setUser({ ...user, [name]: value })
  }

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault()
    const token = await login()
    localStorage.setItem("token", token)

    const decodedUser = decodeUser()
    if (decodedUser) handleStoreUser(decodedUser)

    decodedUser?.role === ROLE.Admin ? navigate("/dashboard") : navigate("/")
  }

  return (
    <Card className="w-full max-w-sm m-auto text-left">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>Enter your email below to login to your account.</CardDescription>
      </CardHeader>
      <form action="POST" onSubmit={handleSubmit}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              name="email"
              type="email"
              placeholder="J@example.com"
              required
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link to="#" className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </Link>
            </div>
            <Input name="password" type="password" required onChange={handleChange} />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col text-center">
          <Button className="w-full" type="submit">
            Log in
          </Button>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
