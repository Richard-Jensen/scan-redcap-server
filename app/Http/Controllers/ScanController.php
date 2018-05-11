<?php
namespace App\Http\Controllers;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\ScanData;

class ScanController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
        $this->client = new Client();
        $this->api_endpoint = env('REDCAP_URL');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $records = ScanData::create()->getRecords();

        return view('scan.index')->with('records', $records);
    }

    public function new()
    {
        return view('scan.new');
    }

    public function create(Request $request)
    {
        $response = ScanData
            ::create()
            ->setId($request->id)
            ->setInitials($request->initials)
            ->updateOrCreate();

        if ($response !== 'error') {
            return redirect()
                ->back()
                ->with('success', "SCAN with id $response created");
        } else {
            return redirect()
                ->back()
                ->with('error', 'An error occured. SCAN not created.');
        }
    }

    public function update(Request $request, $id)
    {
        $response = ScanData::create()
          ->setInitials($request->initials)
          ->updateOrCreate($id);

          if ($response !== 'error') {
              return redirect()
                  ->back()
                  ->with('success', "SCAN with id $response created");
          } else {
              return redirect()
                  ->back()
                  ->with('error', 'An error occured. SCAN not created.');
          }
    }

    public function show($id)
    {
        $record = ScanData::create()->getRecordById($id);

        return view('scan.show')->with('record', $record);
    }
}
