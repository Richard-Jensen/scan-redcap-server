<?php

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

Route::get('/', function () {
    return view('welcome');
});

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');

Route::get('/profile', 'UserController@show')->name('profile');
Route::patch('/profile', 'UserController@update')->name('users.update');

Route::get('/scan', 'ScanController@index')->name('scan');
Route::get('/scan/new', 'ScanController@new')->name('scan.new');
Route::post('/scan', 'ScanController@create')->name('scan');
