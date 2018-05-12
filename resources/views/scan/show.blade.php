@extends('layouts.app')

@section('content')
  <div class="container">
    @if (Session::has('success'))
      <div class="alert alert-info">{{ Session::get('success') }}</div>
    @endif
    @if (Session::has('error'))
      <div class="alert alert-danger">{{ Session::get('error') }}</div>
    @endif

    @if ($record)
      <div>ID: {{ $record->record_id }}</div>
      <div>{{ __('messages.updated_at') }}  {{ $record->updated_at->diffForHumans() }}</div>
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
