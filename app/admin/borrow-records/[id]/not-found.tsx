import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-6">
            <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                    Borrow Record Not Found
                </h1>
                <p className="mt-6 text-base leading-7 text-gray-600">
                    The borrow record you're looking for doesn't exist or has been removed.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Button asChild>
                        <Link href="/admin/borrow-records">
                            Back to Borrow Records
                        </Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/admin">Go to Dashboard</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}