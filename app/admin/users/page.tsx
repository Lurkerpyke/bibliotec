import { sql, ilike, or } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Icons } from "@/components/icons";
import { users } from "@/database/schema";
import { db } from "@/database/drizzle";
import { transformUser } from './types';
import SearchUsers from "@/components/admin/forms/SearchUsers";
import { deleteUser, updateUserRole, updateUserStatus } from "./actions";

export const dynamic = "force-dynamic";

const Page = async ({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) => {
    // Get search and page safely
    const search = searchParams?.search ? String(searchParams.search) : "";
    const page = searchParams?.page ? parseInt(String(searchParams.page)) : 1;
    const perPage = 10;

    // Fetch users with search and pagination
    const whereClause = search
        ? or(
            ilike(users.fullName, `%${search}%`),
            ilike(users.email, `%${search}%`),
            sql`${users.universityId}::text ILIKE ${`%${search}%`}`,
            sql`${users.status}::text ILIKE ${`%${search}%`}`,
            sql`${users.role}::text ILIKE ${`%${search}%`}`
        )
        : undefined;

    const allUsers = await db
        .select()
        .from(users)
        .where(whereClause)
        .orderBy(users.createdAt)
        .limit(perPage)
        .offset((page - 1) * perPage);

    const totalUsers = await db
        .select({ count: sql<number>`count(*)` })
        .from(users)
        .where(whereClause)
        .then((res) => Number(res[0]?.count || 0));

    // Create serializable query object
    const baseQuery = search ? { search } : {};

    return (
        <section className="w-full rounded-2xl bg-white p-6 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-blue-500">Manage Users</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Approve, reject, or manage user permissions
                    </p>
                </div>
            </div>

            <div className="bg-gray-50 rounded-lg border p-4 mb-6">
                <SearchUsers />
            </div>

            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-100">
                        <TableRow>
                            <TableHead className="text-black">User</TableHead>
                            <TableHead className="text-black">Email</TableHead>
                            <TableHead className="text-black">University ID</TableHead>
                            <TableHead className="text-black">Status</TableHead>
                            <TableHead className="text-black">Role</TableHead>
                            <TableHead className="text-black">Joined</TableHead>
                            <TableHead className="text-right text-black">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {allUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-12">
                                    <div className="flex flex-col items-center justify-center">
                                        <Icons.user className="h-12 w-12 text-gray-400 mb-3" />
                                        <h3 className="font-medium text-gray-900">No users found</h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Try adjusting your search or add a new user
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            allUsers.map((user) => {
                                const transformedUser = transformUser(user);
                                return (
                                    <TableRow key={user.id} className="hover:bg-gray-50">
                                        <TableCell>
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <span className="text-blue-700 font-medium">
                                                        {user.fullName.charAt(0)}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {user.fullName}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-black">{user.email}</TableCell>
                                        <TableCell className="text-black">{user.universityId}</TableCell>
                                        <TableCell>
                                            <Badge
                                                className={transformedUser.status === 'APPROVED'
                                                    ? "bg-green-100 text-green-800"
                                                    : transformedUser.status === 'PENDING'
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : "bg-red-100 text-red-800"
                                                }
                                            >
                                                {transformedUser.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                className={transformedUser.role === 'ADMIN'
                                                    ? "bg-purple-100 text-purple-800"
                                                    : "bg-blue-100 text-blue-800"
                                                }
                                            >
                                                {transformedUser.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-black">{user.createdAt ? user.createdAt.toLocaleDateString() : "N/A"}</TableCell>
                                        <TableCell className="text-right text-black">
                                            <div className="flex justify-end space-x-2">
                                                {transformedUser.status === 'PENDING' && (
                                                    <>
                                                        <form action={async () => {
                                                            "use server"
                                                            await updateUserStatus(user.id, "APPROVED")
                                                        }}>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="text-green-600 hover:text-green-900"
                                                                type="submit"
                                                            >
                                                                Approve
                                                            </Button>
                                                        </form>
                                                        <form action={async () => {
                                                            "use server"
                                                            await updateUserStatus(user.id, "REJECTED")
                                                        }}>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="text-red-600 hover:text-red-900"
                                                                type="submit"
                                                            >
                                                                Reject
                                                            </Button>
                                                        </form>
                                                        
                                                    </>
                                                )}

                                                {transformedUser.status === 'APPROVED' && transformedUser.role === 'USER' && (
                                                    <>
                                                        <form action={async () => {
                                                            "use server"
                                                            await updateUserRole(user.id, "ADMIN")
                                                        }}>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="text-purple-600 hover:text-purple-900"
                                                                type="submit"
                                                            >
                                                                Make Admin
                                                            </Button>
                                                        </form>
                                                    </>
                                                    
                                                )}

                                                {transformedUser.role === 'ADMIN' && (
                                                    <>
                                                        <form action={async () => {
                                                            "use server"
                                                            await updateUserRole(user.id, "USER")
                                                        }}>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                                                                type="submit"
                                                            >
                                                                Remove Admin
                                                            </Button>
                                                        </form>
                                                    </>
                                                )}

                                                <form action={async () => {
                                                    "use server"
                                                    await deleteUser(user.id)
                                                }}>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-gray-600 hover:text-gray-900"
                                                        type="submit"
                                                    >
                                                        Delete
                                                    </Button>
                                                </form>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(page - 1) * perPage + 1}</span>{" "}
                    to{" "}
                    <span className="font-medium">
                        {Math.min(page * perPage, totalUsers)}
                    </span>{" "}
                    of <span className="font-medium">{totalUsers}</span> users
                </p>
                <div className="flex space-x-2">
                    <Button
                        variant="outline"
                        className="bg-blue-100 text-blue-500 hover:bg-blue-200"
                        disabled={page <= 1}
                        asChild={page > 1}
                    >
                        {page > 1 ? (
                            <Link
                                href={{
                                    pathname: "/admin/users",
                                    query: { ...baseQuery, page: page - 1 },
                                }}
                            >
                                Previous
                            </Link>
                        ) : (
                            <span>Previous</span>
                        )}
                    </Button>
                    <Button
                        variant="outline"
                        className="bg-blue-100 text-blue-500 hover:bg-blue-200"
                        disabled={page * perPage >= totalUsers}
                        asChild={page * perPage < totalUsers}
                    >
                        {page * perPage < totalUsers ? (
                            <Link
                                href={{
                                    pathname: "/admin/users",
                                    query: { ...baseQuery, page: page + 1 },
                                }}
                            >
                                Next
                            </Link>
                        ) : (
                            <span>Next</span>
                        )}
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default Page;