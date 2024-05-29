import { useContext } from "react"
import { Link } from "react-router-dom"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle
} from "./ui/navigation-menu"

import { GlobalContext } from "@/App"
import { ROLE } from "@/types"
import { decodeUser } from "@/lib/utils"
import { ModeToggle } from "./mode-toggle"
import { Card } from "./ui/card"

export default function Navbar() {
  const context = useContext(GlobalContext)
  if (!context) throw new Error("No context provided")
  const { state, handleLogout } = context

  const role = decodeUser()?.role

  return (
    <div className="w-full fixed top-0 left-0 z-50 flex justify-center mb-20">
      <Card className="w-full fixed top-0 left-0 z-50 flex justify-center mb-20">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            {role === ROLE.Admin && (
              <NavigationMenuItem>
                <Link to="/Dashboard">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Dashboard
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            )}
            {role === ROLE.User && (
              <NavigationMenuItem>
                <Link to="/Cart">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Cart
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            )}
            {role === ROLE.User && (
              <NavigationMenuItem>
                <Link to="/profile">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Profile
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            )}
            {state.user ? (
              <NavigationMenuItem>
                <Link to="/">
                  <NavigationMenuLink
                    className={navigationMenuTriggerStyle()}
                    onClick={() => {
                      localStorage.removeItem("token")
                      localStorage.removeItem("user")
                      handleLogout()
                    }}
                  >
                    Logout
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ) : (
              <NavigationMenuItem>
                <Link to="/login">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Login
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            )}
            <NavigationMenuItem>
              <ModeToggle />
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </Card>
    </div>
  )
}
