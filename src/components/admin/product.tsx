import { ChangeEvent, FormEvent, useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { FileUploaderMinimal } from "@uploadcare/react-uploader"

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
import productService from "@/api/products"
import categoryService from "@/api/categories"
import "@uploadcare/react-uploader/core.css"

export default function ProductPage() {
  const queryClient = useQueryClient()

  const [product, setProduct] = useState<Product>({
    productId: "",
    name: "",
    price: 0,
    stock: 0,
    description: "",
    category: ""
  })

  const { data: products, error: pError } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: productService.getProducts
  })

  const { data: categories, error: cError } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: categoryService.getCategories
  })

  const handleChange = (ev: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = ev.target
    setProduct({ ...product, [name]: value })
  }

  const handleSubmit = async (ev: FormEvent<HTMLFormElement>): Promise<void> => {
    ev.preventDefault()
    await productService.postProduct(product)
    queryClient.invalidateQueries({ queryKey: ["products"] })
  }

  const onSelect = (value: string) => {
    setProduct({
      ...product,
      category: value
    })
  }
  const resetProduct = () => {
    setProduct({
      productId: "",
      name: "",
      price: 0,
      stock: 0,
      description: "",
      category: ""
    })
  }
  const handleDeleteProduct = async (id: string): Promise<void> => {
    await productService.deleteProduct(id)
    queryClient.invalidateQueries({ queryKey: ["products"] })
  }
  const handleEditProduct = async (id: string): Promise<void> => {
    await productService.editProduct(id, product)
    queryClient.invalidateQueries({ queryKey: ["products"] })
    resetProduct
  }
  return (
    <div className="w-full">
      <form
        className="my-20 md:w-2/3 w-full mx-auto"
        onSubmit={handleSubmit}
        onReset={resetProduct}
      >
        <h3 className="scroll-m-20 text-2xl front-semibold tracking-tighter "> Add new Product </h3>

        <FileUploaderMinimal
          pubkey="cab88e23d5230efdabfd"
          maxLocalFileSizeBytes={10000000}
          multiple={false}
          imgOnly={true}
        />

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
                  <SelectItem key={c.categoryId} value={c.name}>
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
                            <TableCell className="font-medium">{p.category?.name} </TableCell>
                            <TableCell className="flex gap-2">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    className="w-full"
                                    variant="outline"
                                    onClick={() => {
                                      setProduct({ ...p, category: p.category?.name })
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
                                    <Select onValueChange={onSelect}>
                                      <SelectTrigger className="my-2">
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
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel
                                      className="w-full"
                                      onClick={() => {
                                        resetProduct
                                      }}
                                    >
                                      Cancel
                                    </AlertDialogCancel>
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
