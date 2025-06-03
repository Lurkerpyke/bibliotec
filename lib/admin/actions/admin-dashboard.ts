// lib/admin-dashboard.ts


import { db } from "@/database/drizzle";
import { books, borrowRecords, users } from "@/database/schema";
import { toDateString } from "@/lib/tds";
import { eq, sql, count, and, gte, lte } from "drizzle-orm";

// Define types for our data
export type UserCount = {
    status: "PENDING" | "APPROVED" | "REJECTED";
    count: number;
};

export type BookStats = {
    totalBooks: number;
    totalCopies: number;
    availableCopies: number;
};

export type BorrowCount = {
    status: "BORROWED" | "RETURNED";
    count: number;
};

export type RecentPendingUser = {
    id: string;
    fullName: string;
    email: string;
    universityId: number;
    createdAt: Date;
};

export type OverdueBook = {
    id: string;
    dueDate: string | Date;
    bookTitle: string;
    userName: string;
};

export type DashboardData = {
    userCounts: UserCount[];
    bookStats: BookStats;
    borrowStats: BorrowCount[];
    recentPendingUsers: RecentPendingUser[];
    overdueBooks: OverdueBook[];
};

export const getDashboardData = async (): Promise<DashboardData> => {
    // User counts by status
    const userCounts = await db
        .select({
            status: users.status,
            count: count()
        })
        .from(users)
        .groupBy(users.status) as UserCount[];

    // Book statistics
    const bookStatsResult = await db
        .select({
            totalBooks: count(books.id),
            totalCopies: sql<number>`sum(${books.totalCopies})`,
            availableCopies: sql<number>`sum(${books.availableCopies})`,
        })
        .from(books);

    const bookStats: BookStats = {
        totalBooks: Number(bookStatsResult[0]?.totalBooks || 0),
        totalCopies: Number(bookStatsResult[0]?.totalCopies || 0),
        availableCopies: Number(bookStatsResult[0]?.availableCopies || 0),
    };

    // Borrow records
    const borrowStats = await db
        .select({
            status: borrowRecords.status,
            count: count()
        })
        .from(borrowRecords)
        .groupBy(borrowRecords.status) as BorrowCount[];

    // Recent pending users (last 7 days)
    const recentPendingUsers = await db
        .select({
            id: users.id,
            fullName: users.fullName,
            email: users.email,
            universityId: users.universityId,
            createdAt: users.createdAt
        })
        .from(users)
        .where(
            and(
                eq(users.status, "PENDING"),
                gte(users.createdAt, new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
            )
        )
        .orderBy(users.createdAt)
        .limit(5) as RecentPendingUser[];

    const today = new Date().toISOString().split('T')[0];

    // Overdue books (due in the past)
    const overdueBooks = await db
        .select({
            id: borrowRecords.id,
            dueDate: borrowRecords.dueDate,
            bookTitle: books.title,
            userName: users.fullName
        })
        .from(borrowRecords)
        .innerJoin(books, eq(borrowRecords.bookId, books.id))
        .innerJoin(users, eq(borrowRecords.userId, users.id))
        .where(
            and(
                eq(borrowRecords.status, "BORROWED"),
                lte(borrowRecords.dueDate, toDateString(new Date()))

            )
        )
        .limit(5) as OverdueBook[];

    return {
        userCounts,
        bookStats,
        borrowStats,
        recentPendingUsers,
        overdueBooks
    };
};