import { eq } from "drizzle-orm";
import { parseISO } from "date-fns";
import { books, borrowRecords, users } from "@/database/schema";
import { db } from "@/database/drizzle";

export type BorrowRecordDetail = {
    id: string;
    borrowDate: Date;
    dueDate: Date;
    returnDate: Date | null;
    status: "BORROWED" | "RETURNED";
    userName: string;
    userEmail: string;
    userUniversityId: number;
    userStatus: "PENDING" | "APPROVED" | "REJECTED" | null;
    bookTitle: string;
    bookAuthor: string;
    bookGenre: string;
    bookCoverUrl: string;
    bookTotalCopies: number;
    isOverdue: boolean;
};

export const getBorrowRecord = async (id: string): Promise<BorrowRecordDetail | null> => {
    const record = await db
        .select({
            id: borrowRecords.id,
            borrowDate: borrowRecords.borrowDate,
            dueDate: borrowRecords.dueDate,
            returnDate: borrowRecords.returnDate,
            status: borrowRecords.status,
            userName: users.fullName,
            userEmail: users.email,
            userUniversityId: users.universityId,
            userStatus: users.status,
            bookTitle: books.title,
            bookAuthor: books.author,
            bookGenre: books.genre,
            bookCoverUrl: books.coverUrl,
            bookTotalCopies: books.totalCopies,
            bookAvailableCopies: books.availableCopies, // Add this
        })
        .from(borrowRecords)
        .innerJoin(users, eq(borrowRecords.userId, users.id))
        .innerJoin(books, eq(borrowRecords.bookId, books.id))
        .where(eq(borrowRecords.id, id))
        .limit(1);

    if (record.length === 0) return null;

    const data = record[0];
    const dueDate = parseISO(data.dueDate);
    const today = new Date();

    return {
        ...data,
        borrowDate: new Date(data.borrowDate),
        dueDate,
        returnDate: data.returnDate ? parseISO(data.returnDate) : null,
        isOverdue: data.status === "BORROWED" && dueDate < today
    };
  };