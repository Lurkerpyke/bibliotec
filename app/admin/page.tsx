// app/admin/page.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Activity, Book, User, BarChart3, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { getDashboardData } from "@/lib/admin/actions/admin-dashboard";
import { SendNoticesButton } from "@/components/SendNoticesButton";

const Page = async () => {
    const {
        userCounts,
        bookStats,
        borrowStats,
        recentPendingUsers,
        overdueBooks
    } = await getDashboardData();

    // Helper functions to get counts
    const getUserCount = (status: string) =>
        userCounts.find(uc => uc.status === status)?.count || 0;

    const getBorrowCount = (status: string) =>
        borrowStats.find(bs => bs.status === status)?.count || 0;

    const totalUsers = getUserCount("PENDING") + getUserCount("APPROVED") + getUserCount("REJECTED");
    const totalBorrows = getBorrowCount("BORROWED") + getBorrowCount("RETURNED");

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-600 mt-2">
                        Overview of your library management system
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button asChild variant='outline' className="bg-blue-100 text-blue-500 hover:bg-blue-200">
                        <Link href="/admin/books/new" className="flex items-center gap-2">
                            <Book className="h-4 w-4" />
                            Add New Book
                        </Link>
                    </Button>
                    <Button variant="outline" asChild className="bg-blue-100 text-blue-500 hover:bg-blue-200">
                        <Link href="/admin/users" className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Manage Users
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-l-4 border-blue-500 bg-gray-100">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <User className="h-5 w-5 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalUsers}</div>
                        <div className="mt-3 flex flex-wrap gap-2">
                            <Badge variant="default" className="px-2 py-0.5 bg-blue-200 text-blue-600">
                                Approved: {getUserCount("APPROVED")}
                            </Badge>
                            <Badge variant="destructive" className="px-2 py-0.5 bg-blue-200 text-blue-600">
                                Pending: {getUserCount("PENDING")}
                            </Badge>
                            <Badge variant="destructive" className="px-2 py-0.5">
                                Rejected: {getUserCount("REJECTED")}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-emerald-500 bg-gray-100">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Books Inventory</CardTitle>
                        <Book className="h-5 w-5 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{bookStats.totalBooks}</div>
                        <div className="mt-3 flex flex-wrap gap-2">
                            <Badge variant="default" className="px-2 py-0.5 bg-green-200 text-green-600">
                                Copies: {bookStats.totalCopies}
                            </Badge>
                            <Badge variant="default" className="px-2 py-0.5 bg-green-200 text-green-600">
                                Available: {bookStats.availableCopies}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-amber-500 bg-gray-100">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Borrow Records</CardTitle>
                        <BarChart3 className="h-5 w-5 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalBorrows}</div>
                        <div className="mt-3 flex flex-wrap gap-2">
                            <Badge variant="destructive" className="px-2 py-0.5">
                                Active: {getBorrowCount("BORROWED")}
                            </Badge>
                            <Badge variant="default" className="px-2 py-0.5 bg-amber-200 text-amber-600">
                                Returned: {getBorrowCount("RETURNED")}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-rose-500 bg-gray-100">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Overdue Books</CardTitle>
                        <Clock className="h-5 w-5 text-rose-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{overdueBooks.length}</div>
                        <p className="text-xs text-gray-500 mt-1">
                            {overdueBooks.length > 0 ? "Action required" : "All books returned on time"}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pending Users */}
                <Card className="bg-gray-100">
                    <CardHeader className="flex flex-row justify-between items-center">
                        <div>
                            <CardTitle>Pending Approvals</CardTitle>
                            <CardDescription>
                                Users waiting for account verification
                            </CardDescription>
                        </div>
                        <Button variant="link" className="text-blue-600" asChild>
                            <Link href="/admin/users?status=PENDING">View All</Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow >
                                    <TableHead className="text-black">User</TableHead>
                                    <TableHead className="text-black">University ID</TableHead>
                                    <TableHead className="text-black">Date</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentPendingUsers.length > 0 ? (
                                    recentPendingUsers.map(user => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-gray-100 border rounded-full w-8 h-8 flex items-center justify-center">
                                                        <span className="text-sm font-medium">
                                                            {user.fullName.split(" ").map(n => n[0]).join("")}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <div>{user.fullName}</div>
                                                        <div className="text-xs text-gray-500">{user.email}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{user.universityId}</TableCell>
                                            <TableCell>
                                                {format(new Date(user.createdAt), "MMM dd, yyyy")}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button size="sm" variant="outline" asChild>
                                                    <Link href={`/admin/users?search=${user.email}`}>Review</Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <CheckCircle className="h-8 w-8 text-green-500" />
                                                <p className="text-gray-500">No pending approvals</p>
                                                <p className="text-sm text-gray-400">All users have been reviewed</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Overdue Books */}
                <Card className="bg-gray-100">
                    <CardHeader className="flex flex-row justify-between items-center">
                        <div>
                            <CardTitle>Overdue Books</CardTitle>
                            <CardDescription>
                                Books that are past their due date
                            </CardDescription>
                        </div>
                        <Button variant="link" className="text-blue-600" asChild>
                            <Link href="/admin/borrow-records?status=OVERDUE">View All</Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-black">Book & Borrower</TableHead>
                                    <TableHead className="text-black">Due Date</TableHead>
                                    <TableHead className="text-black">Days Overdue</TableHead>
                                    <TableHead className="text-right">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {overdueBooks.length > 0 ? (
                                    overdueBooks.map(record => {
                                        const dueDate = new Date(record.dueDate);
                                        const today = new Date();
                                        const diffTime = Math.abs(today.getTime() - dueDate.getTime());
                                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                                        return (
                                            <TableRow key={record.id}>
                                                <TableCell>
                                                    <div className="font-medium">{record.bookTitle}</div>
                                                    <div className="text-sm text-gray-500">
                                                        Borrowed by: {record.userName}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {format(dueDate, "MMM dd, yyyy")}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="destructive" className="px-2.5">
                                                        {diffDays} days
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button size="sm" variant="outline" asChild>
                                                        <Link href={`/admin/borrow-records/${record.id}`}>Manage</Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <CheckCircle className="h-8 w-8 text-green-500" />
                                                <p className="text-gray-500">No overdue books</p>
                                                <p className="text-sm text-gray-400">All books are returned on time</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="hover:shadow-md transition-shadow bg-gray-100">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-100 p-3 rounded-full">
                                <Book className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-medium">Add New Book</h3>
                                <p className="text-sm text-gray-500 mt-1">Add books to your library</p>
                            </div>
                        </div>
                        <Button variant='outline' className="mt-4 w-full bg-blue-100 text-blue-500 hover:bg-blue-200" asChild>
                            <Link href="/admin/books/new">Add Book</Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow bg-gray-100">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-emerald-100 p-3 rounded-full">
                                <Activity className="h-6 w-6 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="font-medium">Manage Borrows</h3>
                                <p className="text-sm text-gray-500 mt-1">Track and manage borrow records</p>
                            </div>
                        </div>
                        <Button className="mt-4 w-full bg-blue-100 text-blue-500 hover:bg-blue-200" variant="outline" asChild>
                            <Link href="/admin/borrow-records">View Records</Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow bg-gray-100">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-amber-100 p-3 rounded-full">
                                <User className="h-6 w-6 text-amber-600" />
                            </div>
                            <div>
                                <h3 className="font-medium">User Management</h3>
                                <p className="text-sm text-gray-500 mt-1">Manage library users activities</p>
                            </div>
                        </div>
                        <Button className="mt-4 w-full bg-blue-100 text-blue-500 hover:bg-blue-200" variant="outline" asChild>
                            <Link href="/admin/users">Manage Users</Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow bg-gray-100">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-rose-100 p-3 rounded-full">
                                <AlertCircle className="h-6 w-6 text-rose-600" />
                            </div>
                            <div>
                                <h3 className="font-medium">Overdue Notices</h3>
                                <p className="text-sm text-gray-500 mt-1">Send reminders for overdue books</p>
                            </div>
                        </div>
                        <SendNoticesButton />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Page;