<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Result extends Model
{
    use HasFactory;

    protected $fillable = ['quiz_id', 'participant_name', 'score'];

    public function quiz()
    {
        return $this->belongsTo(Quiz::class);
    }
}
