"use client";

import Image from "next/image";
import { adminSideBarLinks } from "@/constants";
import Link from "next/link";
import { cn, getInitials } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Session } from "next-auth";

const Sidebar = ({ session }: { session: Session }) => {
    const pathname = usePathname();

    return (
        <nav className="sticky top-0 h-screen w-20 md:w-70 transition-all duration-300 border-r border-slate-100 bg-white overflow-y-auto">
            {/* Logo Section */}
            <div className="flex flex-col items-center md:items-start px-4 py-6">
                <div className="flex items-center gap-3">
                    <Link href='/'>
                        <Image
                            src="/icons/admin/logo.svg"
                            alt="Bibliotec Logo"
                            width={32}
                            height={32}
                            className="w-8 h-8 md:w-10 md:h-10 transition-all"
                        />
                    </Link>
                    <h1 className="hidden md:block text-xl font-bold text-slate-700 tracking-tight">
                        Bibliotec
                    </h1>
                </div>
            </div>

            {/* Navigation Links */}
            <div className="px-2 py-4 space-y-1">
                {adminSideBarLinks.map((link) => {
                    const isSelected = pathname === link.route ||
                        (link.route !== "/admin" && pathname.startsWith(link.route));

                    return (
                        <Link
                            href={link.route}
                            key={link.route}
                            className="group block outline-none"
                        >
                            <div className={cn(
                                "flex items-center justify-center md:justify-start gap-3 rounded-lg p-3 transition-colors",
                                isSelected
                                    ? "bg-blue-100 border border-blue-200"
                                    : "hover:bg-slate-50"
                            )}>
                                <div className="relative w-6 h-6">
                                    <Image
                                        src={link.img}
                                        alt={link.text}
                                        fill
                                        className={cn(
                                            "object-contain transition-transform",
                                            isSelected
                                                ? "text-blue-600 scale-110"
                                                : "text-slate-400 group-hover:text-slate-600"
                                        )}
                                        style={{ color: 'currentColor' }} // For SVG coloring
                                    />
                                </div>
                                <span className={cn(
                                    "hidden md:block text-sm font-medium transition-colors",
                                    isSelected ? "text-blue-600" : "text-slate-600"
                                )}>
                                    {link.text}
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* User Profile */}
            <div className="mt-auto p-4 border-t border-slate-100">
                <div className="flex items-center justify-center md:justify-start gap-3">
                    <Avatar className="w-9 h-9 md:w-10 md:h-10">
                        <AvatarFallback className="bg-blue-200 text-blue-900">
                            {getInitials(session?.user?.name || "IN")}
                        </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block space-y-0.5">
                        <p className="text-sm font-medium text-slate-700 line-clamp-1">
                            {session?.user?.name}
                        </p>
                        <p className="text-xs text-slate-500 line-clamp-1">
                            {session?.user?.email}
                        </p>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Sidebar;