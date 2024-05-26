import { useQuery } from "@tanstack/react-query"

import { Button } from "../components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "../components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

import { Category, Product } from "../types"
import api from "../api"
import "../App.css"
import { useContext } from "react"
import { GlobalContext } from "@/App"
import NavBar from "@/components/ui/navbar";

export default function Home() {
  const context = useContext(GlobalContext)
  if (!context) throw new Error("No context provided")
  const { state, handleAddToCart } = context

  const getProducts = async () => {
    try {
      const res = await api.get("/products")
      return res.data.data.items
    } catch (error) {
      console.error(error)
      return Promise.reject(new Error("Something went wrong"))
    }
  }

  const getCategories = async () => {
    try {
      const res = await api.get("/categories")
      return res.data.data.items
    } catch (error) {
      console.error(error)
      return Promise.reject(new Error("Something went wrong"))
    }
  }

  // ! ADMIN DASHBOARD !
  // const handleDeleteProduct = (productID: string) => {
  //   console.log("Boo")
  // }

  // Queries
  const { data: products, error: pError } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: getProducts
  })

  const { data: categories, error: cError } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: getCategories
  })

  const onSelect = (value: string) => {
    // * filter by category value contains name of the category
  }

  return (
    <div className="Home">
      <NavBar />
      <h1 className="text-2xl uppercase mb-10">Products</h1>

      <Select onValueChange={onSelect}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Categories</SelectLabel>
            {categories?.map((c) => {
              return (
                <SelectItem key={c.id} value={c.name}>
                  {c.name}
                </SelectItem>
              )
            })}
          </SelectGroup>
        </SelectContent>
      </Select>

      <section className="flex flex-col md:flex-row gap-2 justify-center max-w-6xl mx-auto flex-wrap">
        {products?.map((product) => (
          <Card key={product.productId} className="w-[350px]">
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
              <CardDescription>{product?.categories[0]?.name}</CardDescription>
            </CardHeader>
            <CardContent className="my-1">
              <p>{product.description}</p>
              <p>{product.price}</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => handleAddToCart(product)}>
                Add to cart
              </Button>
              {
                // ! MOVE TO ADMIN DASHBOARD !
                /* <Button className="w-full" onClick={() => handleDeleteProduct(product.id)}>
                delete
              </Button>
              <Button className="w-full" onClick={() => handleDeleteProduct(product.id)}>
                edit
              </Button> */
                // ! MOVE TO ADMIN DASHBOARD !
              }
            </CardFooter>
          </Card>
        ))}
      </section>
      {pError && <p className="text-red-500">{pError.message}</p>}
    </div>
  )
}
