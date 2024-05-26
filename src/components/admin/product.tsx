import { ChangeEvent, FormEvent, createContext, useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"

import { Input } from "../ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "../ui/select"
import { Button } from "../ui/button"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../ui/table"

import { Category, Product } from "@/types"
import api from "@/api"

export default function ProductPage() {
  const queryClient = useQueryClient()

  const [product, setProduct] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    categoryList: ""
  })

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

  const postProduct = async () => {
    try {
      const res = await api.post("/products", product)
      return res.data
    } catch (error) {
      console.error(error)
      return Promise.reject(new Error("Something went wrong"))
    }
  }

  const { data: products, error: pError } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: getProducts
  })

  const { data: categories, error: cError } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: getCategories
  })

  const handleChange = (ev: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = ev.target
    setProduct({ ...product, [name]: value })
  }

  const handleSubmit = async (ev: FormEvent<HTMLFormElement>): Promise<void> => {
    ev.preventDefault()

    await postProduct()
    queryClient.invalidateQueries({ queryKey: ["products"] })
  }

  const onSelect = (value: string) => {
    setProduct({ ...product, categoryList: value })
  }

  return (
    <div>
      <form className="my-20 w-2/3 mx-auto" onSubmit={handleSubmit}>
        <h3 className="scroll-m-20 text-2xl front-semibold tracking-tighter "> Add new Product </h3>

        <Input
          name="name"
          className="my-2"
          type="text"
          placeholder="Name"
          onChange={handleChange}
        />
        <Input
          name="price"
          className="my-2"
          type="number"
          placeholder="Price"
          onChange={handleChange}
        />
        <Input
          name="stock"
          className="my-2"
          type="number"
          placeholder="Stock"
          onChange={handleChange}
        />
        <Input
          name="description"
          className="my-2"
          type="text"
          placeholder="Description"
          onChange={handleChange}
        />
        <Select onValueChange={onSelect}>
          <SelectTrigger className="my-2">
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

        <div className=" flex justify-between ">
          <Button className="mr-1 grow" variant="outline" type="reset">
            Reset
          </Button>
          <Button className="ml-1 grow" type="submit">
            Submit
          </Button>
        </div>
      </form>
      {
        //* list of products
      }
      <div className="mx-auto max-w-4xl">
        <Table>
          <TableCaption>All products</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Category</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.map((product) => (
              <TableRow key={product.productId}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell className="text-right">{product.categories[0]?.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
