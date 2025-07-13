"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { useEffect, useState } from "react";
import { useDebounce } from "@/lib/hooks/useDebounce";

export default function BookSearch() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    useEffect(() => {
        const params = new URLSearchParams(searchParams);
        if (debouncedSearchTerm) {
            params.set("search", debouncedSearchTerm);
        } else {
            params.delete("search");
        }
        router.push(`/books?${params.toString()}`);
    }, [debouncedSearchTerm, router, searchParams]);

    return (
        <div className="relative mb-6">
            <Icons.search className="absolute left-1 md:left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
                type="text"
                placeholder="Pesquise livros..."
                className="pl-5 md:pl-10 pr-16 md:pr-24 text-[#fff2a6] text-xs md:text-sm h-8 md:h-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
                variant="ghost"
                size="sm"
                className="absolute right-0 top-1/2 -translate-y-1/2 h-7 md:h-9 bg-slate-800 text-[#fff2a6] hover:bg-[#fff2a6] text-xs md:text-sm"
                onClick={() => setSearchTerm("")}
                disabled={!searchTerm}
            >
                Limpar
            </Button>
        </div>
    );
}