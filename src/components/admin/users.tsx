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

import { Role, User } from "@/types"
import userService from "@/api/users"

export default function users() {
  const queryClient = useQueryClient()

  const [user, setUser] = useState<User>({
    userId: "",
    email: "",
    phoneNumber: "",
    firstName: "",
    lastName: "",
    role: 0
  })

  const { data: users, error } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: userService.getUsers
  })

  const resetUser = () => {
    setUser({
      userId: "",
      email: "",
      phoneNumber: "",
      firstName: "",
      lastName: "",
      role: 0
    })
  }

  const handleDeleteUser = async (id: string): Promise<void> => {
    await userService.deleteUser(id)
    queryClient.invalidateQueries({ queryKey: ["users"] })
  }

  const handleBanUser = async (id: string): Promise<void> => {
    console.log("boo", id)
    await userService.editUser(id, user)
    queryClient.invalidateQueries({ queryKey: ["users"] })
    resetUser
  }

  return (
    <div className="w-full">
      <section className="w-full md:w-3/4 mx-auto">
        <main className="grid flex-1 items-start gap-4 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <TabsContent value="all">
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle>Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-center">Full Name</TableHead>
                        <TableHead className="text-center">Email</TableHead>
                        <TableHead className="text-center">Phone number</TableHead>
                        <TableHead className="text-center">Role</TableHead>
                        <TableHead className="hidden md:table-cell text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users?.map((u) => {
                        return (
                          <TableRow>
                            <TableCell className="font-medium">
                              {" "}
                              {u.firstName + " " + u.lastName}{" "}
                            </TableCell>
                            <TableCell className="font-medium"> {u.email} </TableCell>

                            <TableCell className="font-medium"> {u.phoneNumber} </TableCell>

                            <TableCell className="font-medium"> {Role[u.role]} </TableCell>
                            <TableCell className="flex gap-2">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    className="w-full"
                                    onClick={() => {
                                      console.log("user", u)
                                      setUser({
                                        userId: u.userId,
                                        email: u.email,
                                        phoneNumber: u.phoneNumber,
                                        firstName: u.firstName,
                                        lastName: u.lastName,
                                        role: 3
                                      })
                                    }}
                                  >
                                    BAN
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Are you absolutely sure you want to BAN this user?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently BAN{" "}
                                      <b>"{u.firstName}"</b> from the database.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction>
                                      <Button onClick={() => handleBanUser(u.userId)}>BAN</Button>
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
                                      Are you absolutely sure you want to delete this user?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete{" "}
                                      <b>"{u.firstName}"</b> from the database.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction>
                                      <Button onClick={() => handleDeleteUser(u.userId)}>
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
