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

Auth::routes();

Route::get('/', 'HomeController@index')->name('home');

Route::get('/home', 'HomeController@index')->name('home');

Route::get('/profile', 'UserController@show')->name('profile');
Route::patch('/profile', 'UserController@update')->name('users.update');

Route::get('/scan', 'ScanController@index')->name('scan.index');
Route::get('/scan/new', 'ScanController@new')->name('scan.new');
Route::get('/scan/{id}', 'ScanController@show')->name('scan.show');
Route::post('/scan/create', 'ScanController@create')->name('scan.create');
Route::patch('/scan/{id}/update', 'ScanController@update')->name('scan.update');
Route::delete('/scan/{id}/destroy', 'ScanController@destroy')->name('scan.destroy');

// save SCAN JSON
Route::post('/scan/{id}/save', 'ScanController@save')->name('scan.save');

Route::get('/algorithms', 'AlgorithmsController@index')->name('algorithms.index');
Route::get('/algorithms/new', 'AlgorithmsController@new')->name('algorithms.new');
Route::get('/algorithms/{id}', 'AlgorithmsController@show')->name('algorithms.show');
Route::patch('/algorithms/{id}', 'AlgorithmsController@update')->name('algorithms.update');
Route::delete('/algorithms/{id}', 'AlgorithmsController@destroy')->name('algorithms.destroy');
Route::post('/algorithms/create', 'AlgorithmsController@store')->name('algorithms.create');
