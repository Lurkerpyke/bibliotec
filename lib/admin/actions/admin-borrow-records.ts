
import { and, eq, or, like, sql } from "drizzle-orm";
import { formatISO, parseISO } from "date-fns";
import { books, borrowRecords, users } from "@/database/schema";
import { db } from "@/database/drizzle";

export type BorrowRecord = {
    id: string;
    borrowDate: Date;
    dueDate: Date;
    returnDate: Date | null;
    status: "BORROWED" | "RETURNED";
    userName: string;
    userEmail: string;
    bookTitle: string;
    isOverdue: boolean;
};

export const getBorrowRecords = async (
    status?: "BORROWED" | "RETURNED" | "OVERDUE",
    search?: string
): Promise<BorrowRecord[]> => {
    let whereConditions = [];
    const today = formatISO(new Date(), { representation: "date" });

    if (status === "OVERDUE") {
        whereConditions.push(
            and(
                eq(borrowRecords.status, "BORROWED"),
                sql`${borrowRecords.dueDate}::date < ${today}::date`
            )
        );
    } else if (status) {
        whereConditions.push(eq(borrowRecords.status, status));
    }

    if (search) {
        whereConditions.push(
            or(
                like(users.fullName, `%${search}%`),
                like(books.title, `%${search}%`),
                like(users.email, `%${search}%`)
            )
        );
    }

    const records = await db
        .select({
            id: borrowRecords.id,
            borrowDate: borrowRecords.borrowDate,
            dueDate: borrowRecords.dueDate,
            returnDate: borrowRecords.returnDate,
            status: borrowRecords.status,
            userName: users.fullName,
            userEmail: users.email,
            bookTitle: books.title,
        })
        .from(borrowRecords)
        .innerJoin(users, eq(borrowRecords.userId, users.id))
        .innerJoin(books, eq(borrowRecords.bookId, books.id))
        .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
        .orderBy(borrowRecords.borrowDate);

    return records.map(record => ({
        ...record,
        borrowDate: new Date(record.borrowDate),
        dueDate: parseISO(record.dueDate),
        returnDate: record.returnDate ? parseISO(record.returnDate) : null,
        userName: record.userName || "Unknown User",
        userEmail: record.userEmail || "unknown@example.com",
        bookTitle: record.bookTitle || "Unknown Book",
        isOverdue: record.status === "BORROWED" &&
            parseISO(record.dueDate) < new Date()
    }));
};