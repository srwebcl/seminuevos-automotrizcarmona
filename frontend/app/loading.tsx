export default function Loading() {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
                {/* Spinner animado */}
                <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
                <p className="text-sm font-bold text-gray-500 animate-pulse tracking-widest">CARGANDO...</p>
            </div>
        </div>
    );
}