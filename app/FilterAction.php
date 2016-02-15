<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class FilterAction extends Model
{
    protected $table = "filters_actions";

    public function filter() {
        return $this->belongsTo("App\Filter", "filter_id");
    }
}
