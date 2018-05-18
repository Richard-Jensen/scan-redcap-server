<?php
namespace App;

use App\Enc;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class ScanData
{
    public function __construct()
    {
        $this->client = new Client();
        $this->api_endpoint = env('REDCAP_URL');
        $this->redcap_token = Enc::create()->decrypt(Auth::user()->redcap_token);
        $this->base_info = [
            'token' => Enc::create()->decrypt(Auth::user()->redcap_token),
            'format' => 'json',
        ];
    }

    protected $id;
    protected $initials;

    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }

    public function getId()
    {
        return $this->id;
    }

    public function setInitials($initials)
    {
        $this->initials = $initials;
        return $this;
    }

    public function getInitials()
    {
        return $this->initials;
    }

    public static function create()
    {
        $obj = new static();
        return $obj;
    }

    public function updateOrCreate($id = null)
    {
        if (!isset($id)) {
          $new_record = [
            'record_id' => str_random(16),
            'created_at' => time()
          ];
        }

        $record = [
          'record_id' => $id,
          'cpr' => $this->getId(),
          'initials' => $this->getInitials() ?: ' ',
          'updated_at' => time()
        ];

        if (isset($new_record)) {
          $record = array_merge($record, $new_record);
        }

        $data = array(
            'content' => 'record',
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
            return json_decode($request->getBody()->getContents())[0];
        } catch (ClientException $error) {
            return 'error';
        }
    }

    public function getRecords()
    {
        $data = [
          'content' => 'record'
        ];

        $request_array = array_merge($this->base_info, $data);

        try {
            $request = $this->client->post($this->api_endpoint, [
                'form_params' => $request_array
            ]);

            $records = json_decode($request->getBody()->getContents());

            // sort by updated_at column, newest record first
            usort($records, function($a, $b) {
                return $b->updated_at <=> $a->updated_at;
            });

            foreach($records as $record) {
              $record->created_at = Carbon::createFromTimestamp($record->created_at);
              $record->updated_at = Carbon::createFromTimestamp($record->updated_at);
            }

            return $records;
        } catch (ClientException $error) {
            return 'error';
        }
    }

    public function getRecordById($id)
    {
        $data = [
            'content' => 'record',
            'records' => [$id]
        ];

        $request_array = array_merge($this->base_info, $data);

        $scan_data = $this->retreiveFile($id);

        try {
            $request = $this->client->post($this->api_endpoint, [
                'form_params' => $request_array
            ]);

            $record = json_decode($request->getBody()->getContents());

            if (isset($record[0])) {
              $record[0]->created_at = Carbon::createFromTimestamp($record[0]->created_at);
              $record[0]->updated_at = Carbon::createFromTimestamp($record[0]->updated_at);

              return [
                  'scan_info' => $record[0],
                  'scan_data' => $scan_data === 'error' ? [ 'data' => ''] : json_decode($scan_data)
              ];

            } else {
              return [];
            }
        } catch (ClientException $error) {
            return 'error';
        }
    }

    public function destroy($id)
    {
        $data = [
            'content' => 'record',
            'action' => 'delete',
            'records' => [$id]
        ];

        $request_array = array_merge($this->base_info, $data);

        try {
            $request = $this->client->post($this->api_endpoint, [
                'form_params' => $request_array
            ]);

            $record = json_decode($request->getBody()->getContents());

            return $record;
        } catch (ClientException $error) {
            return 'error';
        }
    }

    public function saveFile($data, $id)
    {
        try {
            $request = $this->client->request('POST', $this->api_endpoint, [
                'multipart' => [
                    [
                        'name'     => 'token',
                        'contents' => Enc::create()->decrypt(Auth::user()->redcap_token)
                    ],
                    [
                        'name'     => 'content',
                        'contents' => 'file'
                    ],
                    [
                        'name'     => 'action',
                        'contents' => 'import'
                    ],
                    [
                        'name'     => 'record',
                        'contents' => $id
                    ],
                    [
                        'name'     => 'field',
                        'contents' => 'scan_file'
                    ],
                    [
                        'name'     => 'file',
                        'filename' => time() . '_scan.json',
                        'contents' => json_encode($data)
                    ]
                ]
            ]);

            $response = json_decode($request->getBody()->getContents());

            return $response;
        } catch (ClientException $error) {
            return 'error';
        }
    }

    public function retreiveFile($id)
    {
        $data = [
            'content' => 'file',
            'action' => 'export',
            'record' => $id,
            'field' => 'scan_file',
            'returnFormat' => 'json'
        ];

        $request_array = array_merge($this->base_info, $data);

        try {
            $request = $this->client->post($this->api_endpoint, [
                'form_params' => $request_array
            ]);

            return $request->getBody()->getContents();

        } catch (ClientException $error) {
            return 'error';
        }
    }
}
