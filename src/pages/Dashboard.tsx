import Category from "@/components/admin/category"
import Product from "@/components/admin/product"
import Navbar from "@/components/navbar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs"

export default function Dashboard() {
  return (
    <div className="mx-auto">
      <Navbar />
      <Tabs defaultValue="products" className="mx auto">
        <TabsList className="flex justify-center mb-20">
          <TabsTrigger value="products" className="w-[400px]">
            Products
          </TabsTrigger>
          <TabsTrigger value="categories" className="w-[400px]">
            Categories
          </TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          <Product />
        </TabsContent>
        <TabsContent value="categories">
          <Category />
        </TabsContent>
      </Tabs>
    </div>
  )
}
