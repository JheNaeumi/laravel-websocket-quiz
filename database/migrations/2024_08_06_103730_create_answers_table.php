<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('question_id')->constrained()->onDelete('cascade');
            $table->foreignId('lobby_id')->constrained()->onDelete('cascade');
            $table->string('answer');
            $table->timestamps();

            // Ensure a user can only answer a question once per lobby
            $table->unique(['user_id', 'question_id', 'lobby_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('answers');
    }
};
