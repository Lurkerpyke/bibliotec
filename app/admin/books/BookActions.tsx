// app/admin/books/BookActions.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { toast } from "sonner";
import { deleteBook } from "@/lib/actions/books";
import { Icons } from "@/components/icons";

export default function BookActions({ bookId }: { bookId: string }) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteBook(bookId);
            toast.success("Book deleted successfully");
            router.refresh();
        } catch (error) {
            toast.error("Failed to delete book");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Icons.more className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    onClick={() => router.push(`/books/${bookId}`)}
                    className="cursor-pointer"
                >
                    <Icons.view className="h-4 w-4 mr-2" />
                    View Details
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => router.push(`/admin/books/edit/${bookId}`)}
                    className="cursor-pointer"
                >
                    <Icons.edit className="h-4 w-4 mr-2" />
                    Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={handleDelete}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    disabled={isDeleting}
                >
                    {isDeleting ? (
                        <Icons.spinner className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                        <Icons.trash className="h-4 w-4 mr-2" />
                    )}
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}