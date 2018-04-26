@extends('layouts.app')

@section('content')
  @if (count($records) === 1)
    I have one record
    {{ $records[0]->record_id }}

  @elseif (count($records) > 1)
    I have {{ count($records) }} records
    <ul>
    @foreach($records as $record)
      <li>{{ $record->record_id }}</li>
    @endforeach
    </ul>
  @endif

  <div id="scan-app">
  </div>
@endsection
