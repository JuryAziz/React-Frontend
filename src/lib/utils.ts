import jwt from "jwt-decode"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import { DecodedToken, DecodedUser } from "@/types"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function decodeUser(): DecodedUser | null {
  const token = localStorage.getItem( "token" )
  
  if (!token) return null
  const decodedToken = jwt<DecodedToken>(token)

  // todo: fix typing
  const decodedUser: any = {}

  for (const [key, value] of Object.entries(decodedToken)) {
    if (key === "nameid" && Array.isArray(value)) {
      decodedUser[key] = value[0]
      decodedUser["role"] = value[1] === "Admin" ? "Admin" : "User"
      continue
    }
    decodedUser[key] = value.toString()
  }
  return decodedUser
}
