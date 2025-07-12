import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import BookForm from "@/components/admin/forms/BookForm";

const Page = () => {
    return (
        <>
            <Button asChild className="mb-10 w-fit border border-light-300 bg-indigo-950 text-xs font-medium text-neutral-100 hover:bg-light-300,">
                <Link href="/admin/books">Voltar</Link>
            </Button>

            <section className="w-full max-w-2xl">
                <BookForm />
            </section>
        </>
    );
};
export default Page;