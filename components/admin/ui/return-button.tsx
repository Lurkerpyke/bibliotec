"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { RefreshCw, CheckCircle } from "lucide-react";

export function ReturnButton() {
    const { pending } = useFormStatus();

    return (
        <Button
            type="submit"
            className="bg-amber-600 hover:bg-amber-700"
            disabled={pending}
        >
            {pending ? (
                <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                </>
            ) : (
                <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Returned
                </>
            )}
        </Button>
    );
}