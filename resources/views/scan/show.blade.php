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
  </div>

  <div id="scan-app" class="scan-app-container">
  </div>

  @if ($record)
    <div class="record-metadata">
      <form method="POST" action="{{ route('scan.update', $record->record_id) }}" class="record-metadata-form">
          @csrf
          @method('PATCH')

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
      <div>{{ __('messages.updated_diff') }}  {{ $record->updated_at->diffForHumans() }}</div>
    </div>
  @endif
@endsection
