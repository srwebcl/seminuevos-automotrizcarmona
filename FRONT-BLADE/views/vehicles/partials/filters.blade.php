<form action="{{ route('vehicles.index') }}" method="GET">

    @if(request()->anyFilled(['brand_id', 'category_id', 'year_from', 'search']))
        <a href="{{ route('vehicles.index') }}"
            class="block w-full text-center text-xs font-bold text-red-500 hover:bg-red-50 py-3 rounded-lg mb-6 transition border border-transparent hover:border-red-100">
            <i class="fa-solid fa-trash-can mr-1"></i> LIMPIAR FILTROS
        </a>
    @endif

    <div class="mb-8">
        <h3 class="text-xs font-black text-gray-900 uppercase tracking-widest mb-4">Búsqueda</h3>
        <div class="relative">
            <i class="fa-solid fa-magnifying-glass absolute left-3 top-3.5 text-gray-400 text-xs"></i>
            <input type="text" name="search" value="{{ request('search') }}" placeholder="Modelo, versión..."
                class="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-3 text-sm font-medium focus:ring-black focus:border-black transition placeholder-gray-400">
        </div>
    </div>

    <div class="mb-8">
        <h3 class="text-xs font-black text-gray-900 uppercase tracking-widest mb-4">Marcas</h3>
        <div class="space-y-3 max-h-60 overflow-y-auto scrollbar-hide pr-2">
            <label
                class="flex items-center justify-between cursor-pointer group hover:bg-gray-50 p-1 rounded-md transition">
                <div class="flex items-center">
                    <input type="radio" name="brand_id" value="" class="hidden" onchange="this.form.submit()" {{ !request('brand_id') ? 'checked' : '' }}>
                    <div
                        class="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center mr-3 group-hover:border-black {{ !request('brand_id') ? 'bg-black border-black' : '' }}">
                        <div class="w-1.5 h-1.5 rounded-full bg-white {{ !request('brand_id') ? 'block' : 'hidden' }}">
                        </div>
                    </div>
                    <span
                        class="text-sm {{ !request('brand_id') ? 'font-bold text-black' : 'text-gray-600' }}">Todas</span>
                </div>
            </label>

            @foreach($brands as $brand)
                <label
                    class="flex items-center justify-between cursor-pointer group hover:bg-gray-50 p-1 rounded-md transition">
                    <div class="flex items-center">
                        <input type="radio" name="brand_id" value="{{ $brand->id }}" class="hidden"
                            onchange="this.form.submit()" {{ request('brand_id') == $brand->id ? 'checked' : '' }}>
                        <div
                            class="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center mr-3 group-hover:border-black {{ request('brand_id') == $brand->id ? 'bg-black border-black' : '' }}">
                            <div
                                class="w-1.5 h-1.5 rounded-full bg-white {{ request('brand_id') == $brand->id ? 'block' : 'hidden' }}">
                            </div>
                        </div>
                        <span
                            class="text-sm {{ request('brand_id') == $brand->id ? 'font-bold text-black' : 'text-gray-600' }}">{{ $brand->name }}</span>
                    </div>
                    <span
                        class="text-[10px] text-gray-400 font-bold bg-gray-100 px-2 py-0.5 rounded-full">{{ $brand->vehicles_count }}</span>
                </label>
            @endforeach
        </div>
    </div>

    <div class="mb-8 border-t border-gray-100 pt-6">
        <h3 class="text-xs font-black text-gray-900 uppercase tracking-widest mb-4">Categoría</h3>
        <div class="space-y-3">
            @foreach($categories as $cat)
                <label
                    class="flex items-center justify-between cursor-pointer group hover:bg-gray-50 p-1 rounded-md transition">
                    <div class="flex items-center">
                        <input type="radio" name="category_id" value="{{ $cat->id }}" class="hidden"
                            onchange="this.form.submit()" {{ request('category_id') == $cat->id ? 'checked' : '' }}>
                        <div
                            class="w-4 h-4 rounded border border-gray-300 flex items-center justify-center mr-3 group-hover:border-black {{ request('category_id') == $cat->id ? 'bg-black border-black' : '' }}">
                            <i
                                class="fa-solid fa-check text-white text-[8px] {{ request('category_id') == $cat->id ? 'block' : 'hidden' }}"></i>
                        </div>
                        <span
                            class="text-sm {{ request('category_id') == $cat->id ? 'font-bold text-black' : 'text-gray-600' }}">{{ $cat->name }}</span>
                    </div>
                    <span
                        class="text-[10px] text-gray-400 font-bold bg-gray-100 px-2 py-0.5 rounded-full">{{ $cat->vehicles_count }}</span>
                </label>
            @endforeach
        </div>
    </div>

    <div class="mb-8 border-t border-gray-100 pt-6">
        <h3 class="text-xs font-black text-gray-900 uppercase tracking-widest mb-4">Año</h3>
        <div class="flex gap-2">
            <div class="relative w-1/2">
                <select name="year_from" onchange="this.form.submit()"
                    class="w-full bg-gray-50 border border-gray-200 rounded-lg text-sm px-3 py-2.5 font-medium appearance-none cursor-pointer hover:border-black transition focus:ring-black focus:border-black">
                    <option value="">Desde</option>
                    @foreach($years as $year)
                        <option value="{{ $year }}" {{ request('year_from') == $year ? 'selected' : '' }}>{{ $year }}</option>
                    @endforeach
                </select>
                <i
                    class="fa-solid fa-chevron-down absolute right-3 top-3.5 text-xs text-gray-400 pointer-events-none"></i>
            </div>
            <div class="relative w-1/2">
                <select name="year_to" onchange="this.form.submit()"
                    class="w-full bg-gray-50 border border-gray-200 rounded-lg text-sm px-3 py-2.5 font-medium appearance-none cursor-pointer hover:border-black transition focus:ring-black focus:border-black">
                    <option value="">Hasta</option>
                    @foreach($years as $year)
                        <option value="{{ $year }}" {{ request('year_to') == $year ? 'selected' : '' }}>{{ $year }}</option>
                    @endforeach
                </select>
                <i
                    class="fa-solid fa-chevron-down absolute right-3 top-3.5 text-xs text-gray-400 pointer-events-none"></i>
            </div>
        </div>
    </div>

</form>