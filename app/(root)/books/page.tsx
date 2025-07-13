import BookCover from "@/components/BookCover";
import { Button } from "@/components/ui/button";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { cn } from "@/lib/utils";
import { sql, ilike, or } from "drizzle-orm";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import BookSearch from "@/components/ui/BookSearch";

type BookWithLoanStatus = Book & {
    isLoanedBook?: boolean;
};

const page = async ({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) => {

    const search = searchParams?.search ? String(searchParams.search) : "";
    const page = searchParams?.page ? parseInt(String(searchParams.page)) : 1;
    const perPage = 18;

    const whereClause = search
        ? or(
            ilike(books.title, `%${search}%`),
            ilike(books.author, `%${search}%`),
            ilike(books.genre, `%${search}%`)
        )
        : undefined;

    const session = await auth();

    if (!session?.user?.id) redirect("/sign-in");

    const allBooks = (await db
        .select()
        .from(books)
        .where(whereClause)
        .orderBy(books.createdAt)
        .limit(perPage)
        .offset((page - 1) * perPage) as BookWithLoanStatus[]);

    const baseQuery = search ? { search } : {};

    const totalBooks = await db
        .select({ count: sql<number>`count(*)` })
        .from(books)
        .where(whereClause)
        .then((res) => Number(res[0]?.count || 0));

    return (
        <>
            <div className="w-full">
                <div className="bg-slate-800 rounded-lg border p-0 md:p-4 mb-6">
                    <BookSearch />
                </div>
                <ul className='mt-10 flex flex-wrap gap-5 max-xs:justify-between xs:gap-10'>
                    {allBooks.map((book) => (
                        <li key={book.id} className={cn(book.isLoanedBook && 'w-full sm:w-52')}>
                            <Link href={`/books/${book.id}`} className={cn(book.isLoanedBook && "w-full flex flex-col items-center")}>
                                <BookCover coverImage={book.coverUrl} coverColor={book.coverColor} />

                                <div className={cn('mt-4', !book.isLoanedBook && 'xs:max-w-40 max-w-28')}>
                                    <p className='mt-2 line-clamp-1 text-base font-semibold text-white xs:text-xl'>
                                        {book.title}
                                    </p>
                                    <p className='mt-1 line-clamp-1 text-sm italic text-light-100 xs:text-base'>{book.genre}</p>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Pagination */}
                <div className="flex flex-col md:flex-row gap-2 items-center justify-between mt-6">
                    <p className="text-xs md:text-sm text-[#fff2a6]/80">
                        Exibindo <span className="font-medium">{(page - 1) * perPage + 1}</span>{" "}
                        até{" "}
                        <span className="font-medium">
                            {Math.min(page * perPage, totalBooks)}
                        </span>{" "}
                        de <span className="font-medium">{totalBooks}</span> livros
                    </p>
                    <div className="flex space-x-2">
                        <Button
                            variant="outline"
                            className="bg-primary text-secondary-foreground hover:bg-[#fff2a6]"
                            disabled={page <= 1}
                            asChild={page > 1}
                        >
                            {page > 1 ? (
                                <Link
                                    href={{
                                        pathname: "/books",
                                        query: { ...baseQuery, page: page - 1 },
                                    }}
                                >
                                    anterior
                                </Link>
                            ) : (
                                <span>anterior</span>
                            )}
                        </Button>
                        <Button
                            variant="outline"
                            className="bg-primary text-secondary-foreground hover:bg-[#fff2a6]"
                            disabled={page * perPage >= totalBooks}
                            asChild={page * perPage < totalBooks}
                        >
                            {page * perPage < totalBooks ? (
                                <Link
                                    href={{
                                        pathname: "/books",
                                        query: { ...baseQuery, page: page + 1 },
                                    }}
                                >
                                    Próximo
                                </Link>
                            ) : (
                                <span>Próximo</span>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
};

export default page;