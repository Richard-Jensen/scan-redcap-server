@extends('layouts.app')

@section('content')
<div class="container">
    @include('shared.messages')

    <a href="{{ route('scan.new') }}" class="button">{{ __('Create SCAN') }}</a>

    <div>
        @if (!empty($records))
          @if (count($records) === 1)
            I have one record
            <a href="{{ route('scan.show', ['id' => $records[0]->record_id]) }}">{{ $records[0]->record_id }}</a>

          @elseif (count($records) > 1)
            {{ count($records) }} {{ __('records') }}
            <table>
              <thead>
                <tr>
                  <th>{{ __('ID') }}</th>
                  <th>{{ __('Initials') }}</th>
                  <th>{{ __('Created') }}</th>
                  <th>{{ __('Updated') }}</th>
                </tr>
              </thead>
              <tbody>
                @foreach($records as $record)
                  <tr>
                    <td>
                      <a href="{{ route('scan.show', ['id' => $record->record_id]) }}"> {{ $record->record_id }} </a>
                    </td>
                    <td>
                      {{ $record->initials }}
                    </td>
                    <td title="{{ $record->created_at->timezone('Europe/Copenhagen') }}">{{ $record->created_at->diffForHumans() }}</td>
                    <td title="{{ $record->updated_at->timezone('Europe/Copenhagen') }}">{{ $record->updated_at->diffForHumans() }}</td>
                  </tr>
                @endforeach
              </tbody>
          </table>
          @endif
        @endif
  </div>
</div>
@endsection
