export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h3 className="text-2xl font-bold mb-4">Automotriz Carmona</h3>
                    <p className="text-gray-400">
                        Líderes en venta de vehículos seminuevos. Calidad y confianza garantizada.
                    </p>
                </div>
                <div>
                    <h4 className="font-bold mb-4">Enlaces Rápidos</h4>
                    <ul className="space-y-2 text-gray-400">
                        <li><a href="/" className="hover:text-white">Inicio</a></li>
                        <li><a href="/catalogo" className="hover:text-white">Catálogo</a></li>
                        <li><a href="#" className="hover:text-white">Financiamiento</a></li>
                        <li><a href="#" className="hover:text-white">Contacto</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-4">Contacto</h4>
                    <ul className="space-y-2 text-gray-400">
                        <li>Av. Principal 1234, Santiago</li>
                        <li>+56 9 1234 5678</li>
                        <li>contacto@automotrizcarmona.cl</li>
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
                © {new Date().getFullYear()} Automotriz Carmona. Todos los derechos reservados.
            </div>
        </footer>
    );
}
