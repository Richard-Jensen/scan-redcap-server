@extends('layouts.app')

@section('content')
  <div class="container">
    @include('shared.messages')

    @if ($scan_info)
      <script>
        window.scanInfo = JSON.parse('{!! $scan_info !!}')
        window.scanData = JSON.parse('{!! $scan_data !!}')
      </script>
    @endif

    @if ($record)
      <div>{{ __('messages.updated_diff') }}  {{ $record->updated_at->diffForHumans() }}</div>
      <form method="POST" action="{{ route('scan.update', $record->record_id) }}">
          @csrf
          @method('PATCH')

          <label for="initials">{{ __('Initials') }}</label>
          <input id="initials" type="text" class="form-control{{ $errors->has('initials') ? ' is-invalid' : '' }}" name="initials" value="{{ $record->initials }}">

          <button type="submit" class="button">
              {{ __('Update') }}
          </button>
      </form>

      <form method="POST" action="{{ route('scan.destroy', $record->record_id) }}">
        @csrf
        @method('DELETE')
        <button  class="button button-outline">
            {{ __('Delete') }}
        </button>
      </form>
    @endif
  </div>

  <div id="scan-app">
  </div>
@endsection
