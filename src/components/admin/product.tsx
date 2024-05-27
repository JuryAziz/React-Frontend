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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Tabs, TabsContent } from "../ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "../ui/alert-dialog"

import { Category, Product } from "@/types"
import api from "@/api"

export default function ProductPage() {
  const queryClient = useQueryClient()

  const [product, setProduct] = useState<Product>({
    productId: "",
    name: "",
    price: 0,
    stock: 0,
    description: "",
    categories: []
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

  const editProduct = async (id: string) => {
    try {
      const res = await api.put(`/products/${id}`, product)
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

  // todo: fix this after editing backend to allow only one category
  // const onSelect = (value: string) => {
  //   setProduct({ ...product, categories: product.categories.push(value) })
  // }

  const handleDeleteProduct = async (id: string): Promise<void> => {
    await deleteProduct(id)
    queryClient.invalidateQueries({ queryKey: ["products"] })
  }
  const handleEditProduct = async (id: string): Promise<void> => {
    await editProduct(id)
    queryClient.invalidateQueries({ queryKey: ["products"] })
  }
  return (
    <div className="w-full">
      <form
        className="my-20 md:w-2/3 w-full mx-auto"
        onSubmit={handleSubmit}
        onReset={() => {
          setProduct({
            productId: "",
            name: "",
            price: 0,
            stock: 0,
            description: "",
            categories: []
          })
        }}
      >
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
        <Select
        // onValueChange={ onSelect }
        >
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
      <section className="w-full md:w-3/4 mx-auto">
        <main className="grid flex-1 items-start gap-4 sm:py-0 md:gap-8">
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
                        <TableHead className="hidden md:table-cell text-center">
                          Description
                        </TableHead>
                        <TableHead className="hidden md:table-cell text-center">Price</TableHead>
                        <TableHead className="hidden md:table-cell text-center">Quantity</TableHead>
                        <TableHead className="hidden md:table-cell text-center">Category</TableHead>
                        <TableHead className="hidden md:table-cell text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products?.map((p) => {
                        return (
                          <TableRow>
                            <TableCell className="font-medium"> {p.name} </TableCell>
                            <TableHead className="hidden md:table-cell text-center">
                              {p.description}
                            </TableHead>
                            <TableCell className="font-medium"> {p.price} </TableCell>
                            <TableCell className="font-medium"> {p.stock} </TableCell>
                            <TableCell className="font-medium">{p.categories[0]?.name} </TableCell>
                            <TableCell className="flex gap-2">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    className="w-full"
                                    variant="outline"
                                    onClick={() => {
                                      setProduct(p)
                                    }}
                                  >
                                    Edit
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Edit product</AlertDialogTitle>
                                    <Input
                                      name="name"
                                      className="my-2"
                                      type="text"
                                      placeholder="Name"
                                      value={product.name}
                                      onChange={handleChange}
                                    />
                                    <Input
                                      name="price"
                                      className="my-2"
                                      type="number"
                                      placeholder="Price"
                                      value={product.price}
                                      onChange={handleChange}
                                    />
                                    <Input
                                      name="stock"
                                      className="my-2"
                                      type="number"
                                      placeholder="Stock"
                                      value={product.stock}
                                      onChange={handleChange}
                                    />
                                    <Input
                                      name="description"
                                      className="my-2"
                                      type="text"
                                      placeholder="Description"
                                      value={product.description}
                                      onChange={handleChange}
                                    />
                                    <Select
                                    // onValueChange={ onSelect }
                                    >
                                      <SelectTrigger className="my-2">
                                        <SelectValue placeholder="Select a Category" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectGroup>
                                          <SelectLabel>Categories</SelectLabel>
                                          {categories?.map((c) => {
                                            return (
                                              <SelectItem
                                                key={c.id}
                                                value={product.categories[0]?.name}
                                              >
                                                {c.name}
                                              </SelectItem>
                                            )
                                          })}
                                        </SelectGroup>
                                      </SelectContent>
                                    </Select>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="w-full">Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      className="w-full"
                                      onClick={() => {
                                        handleEditProduct(p.productId)
                                      }}
                                    >
                                      Save
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button className="w-full">Delete</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Are you absolutely sure you want to delete this product?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete{" "}
                                      <b>"{p.name}"</b> from the database.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction>
                                      <Button onClick={() => handleDeleteProduct(p.productId)}>
                                        Delete
                                      </Button>
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
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
      </section>
    </div>
  )
}
