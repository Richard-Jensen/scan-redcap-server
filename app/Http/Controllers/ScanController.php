<?php
namespace App\Http\Controllers;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

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
        return view('scan.index');
    }

    public function new()
    {
        return view('scan.new');
    }

    public function create(Request $request)
    {
        $request = $this->client->post($this->api_endpoint, [
            'body' => json_encode(['id' => $request->id])
        ]);

        return redirect()
            ->back()
            ->with('success', 'SCAN created');

        return response($request->getBody())->header(
            'Content-Type',
            $request->getHeader('content-type')
        );
    }
}
