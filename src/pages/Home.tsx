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

import { Category, Product } from "../types"
import api from "../api"

import "../App.css"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { on } from "events"

export default function Home() {
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
  // Queries
  const { data: products, error: pError } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: getProducts
  })

  const { data: categories, error: cError } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: getCategories
  })

  const handleDelete = (ev) => {
    console.log(ev.target.value)
  }

  const onSelect = (ev) => {
    console.log(ev.target.value)
  }
  return (
    <div className="Home">
      <h1 className="text-2xl uppercase mb-10">Products</h1>

      <Select>
        <SelectTrigger className="w-[180px]" onChange={onSelect}>
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

      <section className="flex flex-col md:flex-row gap-2 justify-around max-w-6xl mx-auto flex-wrap">
        {products?.map((product) => (
          <Card key={product.id} className="w-[350px]">
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
              <CardDescription>
                {product.categories?.map((category: Category) => {
                  return category.name + ", "
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="my-1">
              <p>{product.description}</p>
              <p>{product.price}</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Add to cart</Button>
              <Button className="w-full" onClick={handleDelete}>
                delete
              </Button>
              <Button className="w-full">edit</Button>
            </CardFooter>
          </Card>
        ))}
      </section>
      {pError && <p className="text-red-500">{pError.message}</p>}
    </div>
  )
}
