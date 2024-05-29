import React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Select } from "@radix-ui/react-select";
import { Button } from "../ui/button";

export default function profile() {
  return (
    <div>
      User profile
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent>
      
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button>Edit</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
