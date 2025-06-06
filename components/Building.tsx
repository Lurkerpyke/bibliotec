const DevelopmentPage = () => {
    return (
        <div
            className="min-h-screen flex items-center justify-center p-4"
            style={{ backgroundColor: '#f0f9ff' }}
        >
            <div
                className="w-full max-w-md rounded-2xl p-8 text-center shadow-2xl"
                style={{ backgroundColor: '#ffffff' }}
            >
                {/* Animated construction icon */}
                <div className="mx-auto mb-6 h-24 w-24 animate-bounce">
                    <div
                        className="flex h-full w-full items-center justify-center rounded-full"
                        style={{ backgroundColor: '#a3d3ff' }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12"
                            viewBox="0 0 24 24"
                            style={{ fill: '#2999ff' }}
                        >
                            <path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z" />
                        </svg>
                    </div>
                </div>

                {/* Pulsing text */}
                <h1
                    className="mb-3 md:text-3xl font-bold"
                    style={{ color: '#1e293b' }}
                >
                    Em Desenvolvimento
                </h1>

                <p
                    className="mb-6 text-lg opacity-90"
                    style={{ color: '#334155' }}
                >
                    Estamos construindo algo incrível!
                </p>

                {/* Animated progress bar */}
                <div className="mb-8 h-2.5 w-full rounded-full bg-gray-200">
                    <div
                        className="h-2.5 rounded-full bg-gradient-to-r from-blue-200 to-blue-500 animate-pulse"
                        style={{ width: '65%' }}
                    ></div>
                </div>

                {/* Construction elements */}
                <div className="flex justify-center space-x-4">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="h-10 w-10 animate-float rounded-lg flex items-center justify-center"
                            style={{
                                backgroundColor: '#a3d3ff', // Light orange
                                animationDelay: `${i * 0.3}s`
                            }}
                        >
                            <span className="text-xl" style={{ color: '#ea580c' }}>
                                {['🔧', '🚧', '🛠️'][i]}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DevelopmentPage;