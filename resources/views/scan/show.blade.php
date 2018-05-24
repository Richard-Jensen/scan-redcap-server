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
@endsection
