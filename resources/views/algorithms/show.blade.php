@extends('layouts.app')

@section('content')
  <div class="container">
    <h1>Algorithms</h1>

    @include('shared.messages')
    @if ($algorithms)
      <form method="POST" action="{{ route('algorithms.update', $algorithms->id) }}">
          @csrf
          @method('PATCH')

          <label for="title">{{ __('Title') }}</label>
          <input id="title" type="text" class="form-control{{ $errors->has('title') ? ' is-invalid' : '' }}" name="title" value="{{ $algorithms->title }}">

          <textarea name="algorithms" rows="30" class="algorithms-content">{{ $algorithms->algorithms }}</textarea>

          @if ($errors->has('title'))
              <span class="invalid-feedback">
                  <strong>{{ $errors->first('title') }}</strong>
              </span>
          @endif

          <button type="submit" class="button">
              {{ __('Save') }}
          </button>
      </form>

      <form method="POST" action="{{ route('algorithms.destroy', $algorithms->id) }}">
        @csrf
        @method('DELETE')
        <button  class="button button-outline">
            {{ __('Delete') }}
        </button>
      </form>
    @endif
  </div>
@endsection
