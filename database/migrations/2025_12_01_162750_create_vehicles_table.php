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
    Schema::create('vehicles', function (Blueprint $table) {
        $table->id();

        $table->foreignId('brand_id')->constrained()->cascadeOnDelete();
        $table->foreignId('location_id')->nullable()->constrained()->nullOnDelete();
        // Nueva relación con categorías
        $table->foreignId('category_id')->constrained()->cascadeOnDelete();

        $table->string('model');
        $table->integer('year');
        $table->integer('km');
        $table->integer('price');

        $table->string('fuel')->nullable();
        $table->string('transmission')->nullable();
        $table->string('traction')->nullable();
        $table->string('color')->nullable();
        $table->string('motor')->nullable();

        // Estados de Negocio
        $table->boolean('is_featured')->default(false);
        $table->boolean('is_offer')->default(false);
        $table->boolean('is_clearance')->default(false);
        $table->boolean('is_premium')->default(false);

        $table->boolean('is_published')->default(true);
        $table->boolean('is_sold')->default(false);

        $table->string('slug')->unique();
        $table->text('description')->nullable();

        $table->json('photos')->nullable();

        $table->softDeletes();
        $table->timestamps();
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
