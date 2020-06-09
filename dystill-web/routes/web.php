<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Auth::routes(['register' => false]);

Route::group(['middleware' => 'auth'], function () {
    Route::get('/', "HomeController@index");

    Route::get('/srv/rules', "RulesController@index");
    Route::post('/srv/rules', "RulesController@store");
    Route::get('/srv/rules/{id}', "RulesController@show");
    Route::post('/srv/rules/{id}', "RulesController@update");
    Route::delete('/srv/rules/{id}', "RulesController@destroy");

    Route::get('/srv/mailboxes', "MailboxController@index");
});
