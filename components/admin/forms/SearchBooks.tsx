// app/admin/books/SearchBooks.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { useEffect, useState } from "react";
import { useDebounce } from "@/lib/hooks/useDebounce";

export default function SearchBooks() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState(
        searchParams.get("search") || ""
    );
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    useEffect(() => {
        const params = new URLSearchParams(searchParams);

        if (debouncedSearchTerm) {
            params.set("search", debouncedSearchTerm);
            params.delete("page");
        } else {
            params.delete("search");
        }

        router.push(`/admin/books?${params.toString()}`);
    }, [debouncedSearchTerm, router]);

    return (
        <div className="relative">
            <Icons.search className="absolute left-1 md:left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
                type="search"
                placeholder="Buscar livros por título, autor ou gênero..."
                className="pl-5 md:pl-10 pr-16 text-black text-xs md:text-sm h-8 md:h-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
                variant="secondary"
                size="sm"
                className="absolute right-0 top-1/2 -translate-y-1/2 h-8 bg-blue-100 text-blue-500 hover:bg-blue-200"
                onClick={() => setSearchTerm("")}
                disabled={!searchTerm}
            >
                Limpar
            </Button>
        </div>
    );
}