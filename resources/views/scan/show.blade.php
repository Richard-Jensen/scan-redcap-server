@extends('layouts.app')

@section('content')
  @if ($record)
    <div>ID: {{ $record->record_id }}</div>
    <div>Updated at: {{ $record->updated_at }}</div>
  @endif

  <div id="scan-app">
  </div>
@endsection
