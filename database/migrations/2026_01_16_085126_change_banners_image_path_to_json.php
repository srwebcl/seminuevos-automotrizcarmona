<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // SQLite doesn't support changing column type directly in some versions or via simple modifiers.
        // But Laravel 11/12 usually handles it.
        // We will make it nullable and text/json.
        Schema::table('banners', function (Blueprint $table) {
            $table->text('image_path')->nullable()->change(); // Use text/json depending on DB driver capabilities for "change"
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('banners', function (Blueprint $table) {
            $table->string('image_path')->nullable()->change();
        });
    }
};
