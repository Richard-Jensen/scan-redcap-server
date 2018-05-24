<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\ScanData;
use Session;

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
        $scanData = ScanData::create();
        $records = $scanData->getRecords();
        $projectInfo = $scanData->getProjectInfo();

        if ($records === 'error') {
          return view('home')->with('error', 'An error occured.');
        } else {
          return view('home')->with('records', $records)->with('project_info', $projectInfo);
        }
    }
}
