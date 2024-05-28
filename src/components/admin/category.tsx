import { ChangeEvent, FormEvent, useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"

import { Input } from "../ui/input"
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

import { Category } from "@/types"
import categoryService from "@/api/categories"

export default function CategoryPage() {
  const queryClient = useQueryClient()

  const [category, setCategory] = useState<Category>({
    name: "",
    categoryId: "",
    description: ""
  })

  const { data: categories, error: cError } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: categoryService.getCategories
  })

  const handleChange = (ev: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = ev.target
    setCategory({ ...category, [name]: value })
  }

  const handleSubmit = async (ev: FormEvent<HTMLFormElement>): Promise<void> => {
    ev.preventDefault()
    await categoryService.postCategory(category)
    queryClient.invalidateQueries({ queryKey: ["categories"] })
  }

  const resetCategory = () => {
    setCategory({
      categoryId: "",
      name: "",
      description: ""
    })
  }

  const handleDeleteCategory = async (id: string): Promise<void> => {
    await categoryService.deleteCategory(id)
    queryClient.invalidateQueries({ queryKey: ["categories"] })
  }
  const handleEditCategory = async (id: string): Promise<void> => {
    await categoryService.editCategory(id, category)
    queryClient.invalidateQueries({ queryKey: ["categories"] })
    resetCategory
  }

  return (
    <div className="w-full">
      <form
        className="my-20 md:w-2/3 w-full mx-auto"
        onSubmit={handleSubmit}
        onReset={resetCategory}
      >
        <h3 className="scroll-m-20 text-2xl front-semibold tracking-tighter ">Add new Category</h3>
        <Input
          name="name"
          className="my-2"
          type="text"
          placeholder="Name"
          onChange={handleChange}
        />
        <Input
          name="description"
          className="my-2"
          type="text"
          placeholder="Description"
          onChange={handleChange}
        />

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
        //* list of categories
      }
      <section className="w-full md:w-3/4 mx-auto">
        <main className="grid flex-1 items-start gap-4 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <TabsContent value="all">
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle>Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-center">Name</TableHead>
                        <TableHead className="text-center">Description</TableHead>
                        <TableHead className="hidden md:table-cell text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categories?.map((c) => {
                        return (
                          <TableRow>
                            <TableCell className="font-medium"> {c.name} </TableCell>
                            <TableCell className="font-medium"> {c.description} </TableCell>
                            <TableCell className="flex gap-2">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    className="w-full"
                                    variant="outline"
                                    onClick={() => {
                                      setCategory({ ...c, name: c.name })
                                    }}
                                  >
                                    Edit
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Edit Category</AlertDialogTitle>
                                    <Input
                                      name="name"
                                      className="my-2"
                                      type="text"
                                      placeholder="Name"
                                      value={category.name}
                                      onChange={handleChange}
                                    />
                                    <Input
                                      name="description"
                                      className="my-2"
                                      type="text"
                                      placeholder="Description"
                                      value={category.description}
                                      onChange={handleChange}
                                    />
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel
                                      className="w-full"
                                      onClick={() => {
                                        resetCategory
                                      }}
                                    >
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      className="w-full"
                                      onClick={() => {
                                        handleEditCategory(c.categoryId)
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
                                      Are you absolutely sure you want to delete this category?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete{" "}
                                      <b>"{c.name}"</b> from the database.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction>
                                      <Button onClick={() => handleDeleteCategory(c.categoryId)}>
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
