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
        $this->redcap_token = Auth::user()->redcap_token;
        $this->base_info = [
            'token' => Auth::user()->redcap_token,
            'content' => 'record',
            'format' => 'json',
        ];
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
        $record = [
          'record_id' => uniqid(),
          'cpr' => $this->getId(),
          'updated_at' => time()
        ];

        $data = array(
            'type' => 'flat',
            'overwriteBehavior' => 'normal',
            'data' => "[" . json_encode($record) . "]",
            'returnContent' => 'ids',
            'returnFormat' => 'json'
        );

        $request_array = array_merge($this->base_info, $data);

        try {
            $request = $this->client->post($this->api_endpoint, [
                'form_params' => $request_array
            ]);
            // how do we do this properly?
            return 'success';
        } catch (ClientException $error) {
            return 'error';
        }
    }

    public function getRecords()
    {
        try {
            $request = $this->client->post($this->api_endpoint, [
                'form_params' => $this->base_info
            ]);

            return json_decode($request->getBody()->getContents());
        } catch (ClientException $error) {
            return 'error';
        }
    }

    public function getRecordById($id)
    {
        $data = [
            'records' => [$id]
        ];

        $request_array = array_merge($this->base_info, $data);

        try {
            $request = $this->client->post($this->api_endpoint, [
                'form_params' => $request_array
            ]);

            $record = json_decode($request->getBody()->getContents());

            if (isset($record[0])) {
              return $record[0];
            } else {
              return [];
            }
        } catch (ClientException $error) {
            return 'error';
        }
    }
}
