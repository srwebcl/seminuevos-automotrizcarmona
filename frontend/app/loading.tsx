export default function Loading() {
    return (
        // Fondo oscuro (60% opacidad) con desenfoque suave (backdrop-blur-sm)
        // Coincide con el estilo de tus modales (FinancingModal / Contact)
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all">

            {/* Spinner minimalista blanco */}
            {/* border-white/20 crea el anillo suave, border-t-white es la parte que gira */}
            <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>

        </div>
    );
}