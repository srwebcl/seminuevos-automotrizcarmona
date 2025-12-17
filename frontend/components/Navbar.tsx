import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center">
                            <span className="text-2xl font-black text-blue-900 tracking-tighter">
                                CARMONA
                            </span>
                        </Link>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
                        <Link href="/" className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                            Inicio
                        </Link>
                        <Link href="/catalogo" className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                            Catálogo
                        </Link>
                        <a href="#" className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-blue-700 transition">
                            Vender mi auto
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
}
