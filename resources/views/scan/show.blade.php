@extends('layouts.app')

@section('header')
    @if ($scan_info)
        <script>
          window.scanInfo = JSON.parse('{!! $scan_info !!}')
          window.scanData = JSON.parse('{!! $scan_data !!}')
        </script>
    @endif
@endsection

@section('react-app')
    <div id="scan-app" class="scan-app-container"></div>
@endsection
