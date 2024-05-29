import { useQuery } from "@tanstack/react-query"
import { ChangeEvent, useContext, useState } from "react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import Navbar from "@/components/navbar"

import { GlobalContext } from "@/App"
import { Category, Product } from "@/types"
import productServices from "@/api/products"
import api from "@/api"

export default function Home() {
  const [searchBy, setSearchBy] = useState<string>("")

  const context = useContext(GlobalContext)
  if (!context) throw new Error("No context provided")
  const { handleAddToCart } = context

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
    queryFn: productServices.getProducts
  })

  const { data: categories, error: cError } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: getCategories
  })

  const onSelect = (value: string) => {
    // * filter by category value contains name of the category
  }

  const handleSearch = (ev: ChangeEvent<HTMLInputElement>) => {
    setSearchBy(ev.target.value)
  }

  return (
    <div className="mx-auto">
      <Navbar />
      <h1 className="text-2xl uppercase mb-10">Products</h1>
      <div className="w-full md:w-2/3 mx-auto ">
        <Input type="search" placeholder="Search for a product..." onChange={handleSearch}></Input>
      </div>
      <div className="flex justify-center p-3 pt-6">
        <Select onValueChange={onSelect}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Categories</SelectLabel>
              {categories?.map((c) => {
                return (
                  <SelectItem key={c.categoryId} value={c.name}>
                    {c.name}
                  </SelectItem>
                )
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <section className="flex flex-col md:flex-row gap-2 justify-center max-w-6xl mx-auto flex-wrap">
        {products
          ?.filter((product) => product.name.toLowerCase().includes(searchBy.toLowerCase()))
          .map((product) => (
            <Card key={product.productId} className="w-[350px] m-h-[250px]">
              <Link to={`/product/${product.productId}`}>
                <CardHeader>
                  <img
                    alt="Product Image"
                    className="aspect-[2/3] border object-contain border-gray-200 rounded-lg overflow-hidden dark:border-gray-800"
                    height={100}
                    src={product?.thumbnail}
                    width={100}
                  />
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>{product.category?.name}</CardDescription>
                </CardHeader>
                <CardContent className="my-1">
                  <p>{product.description}</p>
                  <p>{product.price}</p>
                </CardContent>{" "}
              </Link>
              <CardFooter>
                <Button className="w-full" onClick={() => handleAddToCart(product)}>
                  Add to cart
                </Button>
              </CardFooter>
            </Card>
          ))}
      </section>
      {pError && <p className="text-red-500">{pError.message}</p>}
    </div>
  )
}
