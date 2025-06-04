// actions/books.ts
"use server";


import { db } from "@/database/drizzle";
import { books, borrowRecords } from "@/database/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const deleteBook = async (bookId: string) => {
    try {
        // Delete related borrow records first
        await db.delete(borrowRecords).where(eq(borrowRecords.bookId, bookId));

        // Then delete the book
        await db.delete(books).where(eq(books.id, bookId));

        revalidatePath("/admin/books");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete book:", error);
        throw new Error("Database error: Could not delete book");
    }
};