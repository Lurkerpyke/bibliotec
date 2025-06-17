"use server";
import { db } from "@/database/drizzle";
import { books, users, borrowRecords } from "@/database/schema";
import { and, eq, isNull, sql } from "drizzle-orm";
import emailjs from '@emailjs/nodejs';

export const sendOverdueNotices = async () => {
    try {
        // 1. Fetch overdue borrows with user/book details
        const overdueBorrows = await db
            .select({
                userEmail: users.email,
                userName: users.fullName,
                bookTitle: books.title,
                dueDate: borrowRecords.dueDate,
            })
            .from(borrowRecords)
            .innerJoin(users, eq(borrowRecords.userId, users.id))
            .innerJoin(books, eq(borrowRecords.bookId, books.id))
            .where(
                and(
                    isNull(borrowRecords.returnDate), // Not returned
                    // Compare as ISO strings
                    sql`${borrowRecords.dueDate} < ${new Date().toISOString()}`
                )
            );

        if (overdueBorrows.length === 0) {
            return { success: true, message: "No overdue books found" };
        }

        // 2. Group by user to avoid multiple emails
        const noticesByUser: Record<string, { name: string; books: string[] }> = {};
        overdueBorrows.forEach(borrow => {
            if (!noticesByUser[borrow.userEmail]) {
                noticesByUser[borrow.userEmail] = {
                    name: borrow.userName,
                    books: []
                };
            }
            // Convert string to Date object before formatting
            const dueDate = new Date(borrow.dueDate);
            noticesByUser[borrow.userEmail].books.push(
                `${borrow.bookTitle} (Due: ${dueDate.toLocaleDateString()})`
            );
        });

        // 3. Send emails
        let sentCount = 0;
        for (const [email, data] of Object.entries(noticesByUser)) {
            try {
                await emailjs.send(
                    process.env.NOTICE_EMAILJS_SERVICE_ID!,
                    process.env.NOTICE_EMAILJS_TEMPLATE_ID!, // New template ID
                    {
                        email: email,
                        name: data.name,
                        book_list: data.books.join("\n• "),
                        notice_count: data.books.length
                    },
                    {
                        publicKey: process.env.NOTICE_EMAILJS_PUBLIC_KEY!,
                        privateKey: process.env.NOTICE_EMAILJS_PRIVATE_KEY!,
                    }
                );
                sentCount++;
            } catch (error) {
                console.error(`Failed to send to ${email}:`, error);
            }
        }

        return {
            success: true,
            message: `Sent ${sentCount}/${Object.keys(noticesByUser).length} notices`
        };
    } catch (error) {
        console.error("Overdue notice error:", error);
        return { success: false, error: "Failed to send notices" };
    }
};