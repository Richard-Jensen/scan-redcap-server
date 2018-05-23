@extends('layouts.app')

@section('content')
  <div class="container">
    <h1>Algorithms</h1>
    @if (count($algorithms) === 0)
      No algorithms yet. <a href="{{ route('algorithms.new') }}">Create one.</a>
    @endif

    @if (count($algorithms) > 0)
      @foreach($algorithms as $algorithm)
        <li>
          <a href="{{ route('algorithms.show', ['id' => $algorithm->id]) }}">
            {{ $algorithm->title }}
          </a>
        </li>
      @endforeach
      <a href="{{ route('algorithms.new') }}">Create algorithms.</a>
    @endif
  </div>
@endsection
