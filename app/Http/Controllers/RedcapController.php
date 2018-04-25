<?php

namespace App\Http\Controllers;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RedcapController extends Controller
{
  public function __construct()
  {
    $this->client = new Client();
    $this->api_endpoint = 'https://redcap.au.dk/api/';
  }

  public function index() {
    $data = array(
      'token' => Auth::user()->redcap_token,
      'content' => 'record',
      'format' => 'json',
      'rawOrLabel' => 'raw',
      'rawOrLabelHeaders' => 'raw',
      'exportCheckboxLabel' => 'false',
      'exportSurveyFields' => 'false',
      'exportDataAccessGroups' => 'false',
      'returnFormat' => 'json',
    );

    try {
      $request = $this->client->post($this->api_endpoint, [
        'form_params' => $data
      ]);
      $response = response($request->getBody())
        ->header('Content-Type', $request->getHeader('content-type'));
    } catch (ClientException $e) {
      $response = [];
    }

    return $response;
  }

  public function create(Request $request) {
    $data = array(
      'token' => Auth::user()->redcap_token,
      'content' => 'record',
      'format' => 'json',
      'type' => 'flat',
      'overwriteBehavior' => 'normal',
      'data' => "[{ \"record_id\": " . $request->record_id .  "}]",
      'returnContent' => 'count',
      'returnFormat' => 'json',
    );

    $request = $this->client->post($this->api_endpoint, [
      'form_params' => $data
    ]);

    return response($request->getBody())
              ->header('Content-Type', $request->getHeader('content-type'));
  }
}
