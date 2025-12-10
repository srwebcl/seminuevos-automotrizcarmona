<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
public function up(): void
{
    Schema::table('banners', function (Blueprint $table) {
        // Tipos de banner: 'promo' (cuadros), 'hero' (fondo inicio), 'full' (banner ancho)
        $table->string('type')->default('promo')->after('id');

        // Para el Banner Ancho
        $table->string('mobile_image_path')->nullable()->after('image_path');

        // Para el Hero
        $table->string('video_path')->nullable()->after('mobile_image_path');

        // Para vincular a categorías
        $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete()->after('link');
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
