@extends('layouts.app')

@section('content')
  <div class="container">
    @if ($record)
      <div>ID: {{ $record->record_id }}</div>
      <div>Updated at: {{ $record->updated_at }}</div>
      <form method="POST" action="{{ route('scan.update', $record->record_id) }}">
          @csrf
          @method('PATCH')

          <label for="initials">{{ __('Initials') }}</label>
          <input id="initials" type="text" class="form-control{{ $errors->has('initials') ? ' is-invalid' : '' }}" name="initials" value="{{ $record->initials }}">

          <button type="submit" class="button">
              {{ __('Update') }}
          </button>
      </form>
    @endif
  </div>

  <div id="scan-app">
  </div>
@endsection
