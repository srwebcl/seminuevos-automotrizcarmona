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
        Schema::table('site_settings', function (Blueprint $table) {
            $table->string('clearance_hero_desktop')->nullable();
            $table->string('clearance_hero_mobile')->nullable();
            $table->text('clearance_legal')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            $table->dropColumn([
                'clearance_hero_desktop',
                'clearance_hero_mobile',
                'clearance_legal'
            ]);
        });
    }
};
