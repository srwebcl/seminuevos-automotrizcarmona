export default function Loading() {
    return (
        // Fondo oscuro sutil (40%) con desenfoque, similar a los modales de contacto
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-200">

            {/* Spinner fino y elegante */}
            <div className="relative">
                <div className="w-12 h-12 border-4 border-white/20 rounded-full"></div>
                <div className="w-12 h-12 border-4 border-t-white rounded-full animate-spin absolute top-0 left-0"></div>
            </div>

        </div>
    );
}