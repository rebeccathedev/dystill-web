<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Filter extends Model
{
    public function actions() {
        return $this->hasMany("App/FilterAction");
    }
}
