import { useContext } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { GlobalContext } from "@/App"
import NavBar from "../ui/navbar"

export default function Cart() {
  const context = useContext(GlobalContext)
  if (!context) throw new Error("No context provided")
  const { state, handleAddToCart } = context

  return (
    <div className="">
      <NavBar />
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <Tabs defaultValue="all">
          <TabsContent value="all">
            <Card x-chunk="dashboard-06-chunk-0">
              <CardHeader>
                <CardTitle>Cart</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">Price</TableHead>
                      <TableHead className="hidden md:table-cell">Quantity</TableHead>
                      <TableHead className="hidden md:table-cell"> Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {state.cart.map((product) => {
                      return (
                        <TableRow>
                          <TableCell className="font-medium ml-"> {product.name} </TableCell>
                          <TableCell className="font-medium"> {product.price} </TableCell>
                          <TableCell className="font-medium"> 1 </TableCell>
                          {
                            // todo: fixed quantity for now edit later
                          }
                          <TableCell>
                            <Button>delete</Button>
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
  )
}
