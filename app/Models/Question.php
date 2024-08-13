<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;

    protected $fillable = [
        'lobby_id',
        'text',
        'answer',
        'time_limit',
    ];

    public function lobby()
    {
        return $this->belongsTo(Lobby::class);
    }

    public function answers()
    {
        return $this->hasMany(Answer::class);
    }
}