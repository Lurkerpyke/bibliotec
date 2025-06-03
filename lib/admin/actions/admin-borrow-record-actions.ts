"use server";

import { db } from "@/database/drizzle";
import { books, borrowRecords } from "@/database/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const markBorrowRecordReturned = async (formData: FormData) => {
    const recordId = formData.get("recordId") as string;

    if (!recordId) {
        throw new Error("Record ID is required");
    }

    try {
        const record = await db
            .select({
                bookId: borrowRecords.bookId,
                status: borrowRecords.status,
            })
            .from(borrowRecords)
            .where(eq(borrowRecords.id, recordId))
            .limit(1);

        const borrowRecord = record[0];

        if (!borrowRecord) {
            return { success: false, message: "Borrow record not found" };
        }

        if (borrowRecord.status === "RETURNED") {
            return { success: false, message: "Book is already returned" };
        }

        await db
            .update(borrowRecords)
            .set({
                status: "RETURNED",
                returnDate: new Date().toISOString(),
            })
            .where(eq(borrowRecords.id, recordId));

        await db
            .update(books)
            .set({
                availableCopies: sql`${books.availableCopies} + 1`,
            })
            .where(eq(books.id, borrowRecord.bookId));

        revalidatePath("/admin/borrow-records");
        revalidatePath(`/admin/borrow-records/${recordId}`);

        return {
            success: true,
            message: "Book successfully marked as returned",
        };
    } catch (error) {
        console.error("Error marking book as returned:", error);
        return {
            success: false,
            message: "An error occurred while processing your request",
        };
    }
};
