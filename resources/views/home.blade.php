@extends('layouts.app')

@section('content')
<div class="container">
    @include('shared.messages')

    <h2>Dashboard</h2>

    <a href="{{ route('scan.new') }}" class="button">{{ __('Create SCAN') }}</a>
    <a href="{{ route('profile') }}" class="button button-outline">{{ __('Edit profile') }}</a>

    <div>
        @if (count($records) === 1)
          I have one record
          <a href="{{ route('scan.show', ['id' => $records[0]->record_id]) }}">{{ $records[0]->record_id }}</a>

        @elseif (count($records) > 1)
          I have {{ count($records) }} records
          <ul>
          @foreach($records as $record)
            <li>
              <a href="{{ route('scan.show', ['id' => $record->record_id]) }}">
                {{ $record->record_id }}

              </a>
              {{ $record->updated_at }}
              {{ $record->updated_at->diffForHumans() }}
            </li>
          @endforeach
          </ul>
        @endif
  </div>
</div>
@endsection
