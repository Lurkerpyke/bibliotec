// app/admin/books/page.tsx
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

import BookActions from "./BookActions";
import BookStatusBadge from "./BookStatusBadge";
import { Icons } from "@/components/icons";
import SearchBooks from "./SearchBooks";
import { books } from "@/database/schema";
import { db } from "@/database/drizzle";

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

    // Fetch books with search and pagination
    const whereClause = search
        ? or(
            ilike(books.title, `%${search}%`),
            ilike(books.author, `%${search}%`),
            ilike(books.genre, `%${search}%`)
        )
        : undefined;

    const allBooks = await db
        .select()
        .from(books)
        .where(whereClause)
        .orderBy(books.createdAt)
        .limit(perPage)
        .offset((page - 1) * perPage);

    const totalBooks = await db
        .select({ count: sql<number>`count(*)` })
        .from(books)
        .where(whereClause)
        .then((res) => Number(res[0]?.count || 0));

    // Create serializable query object
    const baseQuery = search ? { search } : {};

    return (
        <section className="w-full rounded-2xl bg-white p-6 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Book Management</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Manage all books in the library
                    </p>
                </div>

                <Button asChild className="bg-blue-100 text-blue-500 hover:bg-blue-200">
                    <Link href="/admin/books/new">
                        <Icons.plus className="h-4 w-4 mr-2" />
                        Add New Book
                    </Link>
                </Button>
            </div>

            <div className="bg-gray-50 rounded-lg border p-4 mb-6">
                <SearchBooks />
            </div>

            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-100">
                        <TableRow>
                            <TableHead className="w-[200px] text-black">Book</TableHead>
                            <TableHead className="text-black">Author</TableHead>
                            <TableHead className="hidden md:table-cell text-black">Genre</TableHead>
                            <TableHead className="text-center text-black">Copies</TableHead>
                            <TableHead className="text-center text-black">Status</TableHead>
                            <TableHead className="text-right text-black">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {allBooks.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-12">
                                    <div className="flex flex-col items-center justify-center">
                                        <Icons.book className="h-12 w-12 text-gray-400 mb-3" />
                                        <h3 className="font-medium text-gray-900">No books found</h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Try adjusting your search or add a new book
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            allBooks.map((book) => (
                                <TableRow key={book.id} className="hover:bg-gray-50">
                                    <TableCell>
                                        <div className="flex items-center">
                                            <div
                                                className="w-10 h-14 rounded-sm mr-3 flex-shrink-0"
                                                style={{ backgroundColor: book.coverColor }}
                                            />
                                            <div>
                                                <Link
                                                    href={`/books/${book.id}`}
                                                    className="font-medium text-gray-900 hover:underline"
                                                >
                                                    {book.title}
                                                </Link>
                                                <p className="text-xs text-gray-500 mt-1 truncate">
                                                    {book.summary.length > 100 ? `${book.summary.slice(0, 100)}...` : book.summary}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium text-black">{book.author}</TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <Badge variant="outline" className="text-black">{book.genre}</Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center items-center">
                                            <span className="font-medium text-black">
                                                {book.availableCopies}
                                            </span>
                                            <span className="mx-1 text-gray-400">/</span>
                                            <span className="text-gray-600">{book.totalCopies}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <BookStatusBadge
                                            available={book.availableCopies}
                                            total={book.totalCopies}
                                        />
                                    </TableCell>
                                    <TableCell className="text-right text-black">
                                        <BookActions bookId={book.id}/>
                                    </TableCell>
                                </TableRow>
                            ))
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
                        {Math.min(page * perPage, totalBooks)}
                    </span>{" "}
                    of <span className="font-medium">{totalBooks}</span> books
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
                                    pathname: "/admin/books",
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
                        disabled={page * perPage >= totalBooks}
                        asChild={page * perPage < totalBooks}
                    >
                        {page * perPage < totalBooks ? (
                            <Link
                                href={{
                                    pathname: "/admin/books",
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