@extends('layouts.app')

@section('content')
<div class="container">

    <h2>Dashboard</h2>

        @if (session('status'))
            <div class="alert alert-success">
                {{ session('status') }}
            </div>
        @endif

    <h5>{{ __('You are logged in as') }}: <strong>{{ Auth::user()->email }}</strong>.</h5>
    <ul class="list-group list-group-flush">
      <li class="list-group-item"><strong>API token:</strong> <input type="text" value="{{ Auth::user()->api_token }}" onclick="this.select()" readonly style="border:none;" /></li>
      <li class="list-group-item"><strong>REDCap token:</strong> <input type="text" placeholder="None set" value="{{ Auth::user()->redcap_token }}" onclick="this.select()" readonly style="border:none;" /></li>
    </ul>
    <a href="{{ route('scan.new') }}" class="button">{{ __('Create scan') }}</a>
    <a href="{{ route('profile') }}" class="card-link button button-outline">Edit profile</a>

    <div>
        @if (count($records) === 1)
          I have one record
          {{ $records[0]->record_id }}

        @elseif (count($records) > 1)
          I have {{ count($records) }} records
          <ul>
          @foreach($records as $record)
            <li><a href="{{ route('scan.show', ['id' => $record->record_id]) }}">{{ $record->record_id }}</a></li>
          @endforeach
          </ul>
        @endif
  </div>
</div>
@endsection
