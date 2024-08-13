<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lobby extends Model
{
    use HasFactory;

    protected $fillable = [
        'host_id',
        'name',
        'status',
        'current_question_index',
    ];

    public function host()
    {
        return $this->belongsTo(User::class, 'host_id');
    }

    public function questions()
    {
        return $this->hasMany(Question::class);
    }

    public function participants()
    {
        return $this->belongsToMany(User::class, 'lobby_user')->withTimestamps();
    }
}