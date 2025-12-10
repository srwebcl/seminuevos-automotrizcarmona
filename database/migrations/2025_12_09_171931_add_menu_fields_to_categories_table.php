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
        Schema::table('categories', function (Blueprint $table) {
            $table->boolean('is_menu_item')->default(false)->after('is_active');
            $table->integer('menu_order')->default(0)->after('is_menu_item');
            $table->string('filter_query')->nullable()->after('slug')->comment('Query string especial (ej: is_premium=1)');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn(['is_menu_item', 'menu_order', 'filter_query']);
        });
    }
};
