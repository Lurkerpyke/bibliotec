// app/admin/books/BookStatusBadge.tsx
import { Badge } from "@/components/ui/badge";

export default function BookStatusBadge({
    available,
    total,
}: {
    available: number;
    total: number;
}) {
    const getStatus = () => {
        if (available === 0) return { text: "Out of Stock", variant: "destructive" };
        if (available / total < 0.2) return { text: "Low Stock", variant: "warning" };
        return { text: "In Stock", variant: "success" };
    };

    const status = getStatus();

    return (
        <Badge variant={status.variant as "destructive" | "outline" | "default"} className="text-black">
            {status.text}
        </Badge>
    );
}