<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\ScanData;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $records = ScanData::create()->getRecords();

        if ($records === 'error') {
          return view('home')->with('error', 'An error occured.');
        } else {
          return view('home')->with('records', $records);
        }
    }
}
