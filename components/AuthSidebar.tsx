export function AuthSidebar() {
    return (
        <div className="hidden lg:block relative h-screen w-1/2 bg-gradient-to-br from-[#6366f1] to-[#4338ca]">
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative h-full flex items-center justify-center p-8">
                <div className="max-w-md text-white">
                    <h2 className="text-4xl font-bold mb-4">Welcome Back</h2>
                    <p className="text-lg opacity-90">
                        Manage your university library account and access thousands of books with ease.
                    </p>
                    <div className="mt-12">
                        {/* Book illustration SVG */}
                        <svg viewBox="0 0 400 300" className="w-full">
                            <path
                                d="M80 50h240v200H80z"
                                className="fill-white/10 stroke-white/30"
                                strokeWidth="2"
                            />
                            <path
                                d="M100 70l20-20 20 20M100 110l40-40 40 40"
                                className="fill-none stroke-white"
                                strokeWidth="2"
                            />
                            <path
                                d="M160 150h160v80H160z"
                                className="fill-white/5 stroke-white/20"
                                strokeWidth="2"
                            />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    )
}