import Product from "@/components/admin/product"
import Navbar from "@/components/ui/navbar"

export default function Dashboard() {
  return (
    <div className="mx-auto">
      <Navbar />
      <Product />
    </div>
  )
}
