"use client";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { sendOverdueNotices } from "@/lib/actions/notices";
import { toast } from "sonner";

export function SendNoticesButton() {
    const [isPending, startTransition] = useTransition();

    const handleClick = () => {
        startTransition(async () => {
            const result = await sendOverdueNotices();

            if (result.success) {
                toast.success(result.message);
            } else {
                toast.error(result.error || "Failed to send notices");
            }
        });
    };

    return (
        <Button
            className="mt-4 w-full"
            variant="destructive"
            onClick={handleClick}
            disabled={isPending}
        >
            {isPending ? "Sending..." : "Send Notices"}
        </Button>
    );
}