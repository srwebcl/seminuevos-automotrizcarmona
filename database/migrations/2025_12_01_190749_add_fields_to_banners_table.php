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
        $table->string('subtitle')->nullable()->after('title'); // Ej: OFERTA DEL MES
        $table->string('button_text')->nullable()->after('subtitle')->default('Ver más');
        $table->string('style')->default('standard')->after('button_text'); // standard, premium, dark
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('banners', function (Blueprint $table) {
            //
        });
    }
};
