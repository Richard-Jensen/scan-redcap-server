<?php
namespace App;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Support\Facades\Auth;

class ScanData
{
    public function __construct()
    {
        $this->client = new Client();
        $this->api_endpoint = env('REDCAP_URL');
    }

    protected $record_id;

    public function setId($id)
    {
        $this->record_id = $id;
        return $this;
    }

    public function getId()
    {
        return $this->record_id;
    }

    public static function create()
    {
        $obj = new static();
        return $obj;
    }

    public function save()
    {
        $record = ['record_id' => uniqid(), 'cpr' => $this->getId()];

        $data = array(
            'token' => Auth::user()->redcap_token,
            'content' => 'record',
            'format' => 'json',
            'type' => 'flat',
            'overwriteBehavior' => 'normal',
            'data' => "[" . json_encode($record) . "]",
            'returnContent' => 'ids',
            'returnFormat' => 'json'
        );

        try {
            $request = $this->client->post($this->api_endpoint, [
                'form_params' => $data
            ]);
            // how do we do this properly?
            return 'success';
        } catch (ClientException $e) {
            return 'error';
        }
    }

    public function getRecords()
    {
        $data = array(
            'token' => Auth::user()->redcap_token,
            'content' => 'record',
            'format' => 'json'
        );

        try {
            $request = $this->client->post($this->api_endpoint, [
                'form_params' => $data
            ]);
            return $request->getBody();
        } catch (ClientException $e) {
            return 'error';
        }
    }
}
