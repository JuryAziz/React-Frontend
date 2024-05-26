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
import { Tabs, TabsContent } from "../ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

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

  const deleteProduct = async (id: string) => {
    try {
      const res = await api.delete(`/products/${id}`)
      return res.data
    } catch (error) {
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

  const handleDeleteProduct = async (id: string): Promise<void> => {
    await deleteProduct(id)
    queryClient.invalidateQueries({ queryKey: ["products"] })
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
      <div className="w-full mx-auto md:w-2/3">
        <main className="grid flex-1 items-start gap-4  sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <TabsContent value="all">
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle>Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-center">Name</TableHead>
                        <TableHead className="hidden md:table-cell text-center">Price</TableHead>
                        <TableHead className="hidden md:table-cell text-center">Quantity</TableHead>
                        <TableHead className="hidden md:table-cell text-center"> Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products?.map((product) => {
                        return (
                          <TableRow>
                            <TableCell className="font-medium"> {product.name} </TableCell>
                            <TableCell className="font-medium"> {product.price} </TableCell>
                            <TableCell className="font-medium"> {product.stock} </TableCell>
                            <TableCell className="flex gap-2">
                              <Button
                                className="w-full"
                                variant="outline"
                                // onClick={() => handleDeleteProduct(product.id)}
                              >
                                Edit
                              </Button>
                              <Button
                                className="w-full"
                                onClick={() => handleDeleteProduct(product.productId)}
                              >
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                      <TableRow></TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
