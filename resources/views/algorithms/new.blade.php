@extends('layouts.app')

@section('content')
  <div class="container">
      <form method="POST" action="{{ route('algorithms.create') }}">
          @csrf

          <label for="title">{{ __('Title') }}</label>
          <input id="title" type="text" class="form-control{{ $errors->has('title') ? ' is-invalid' : '' }}" name="title" value="{{ old('title') }}">

          <textarea name="algorithms" rows="30" class="algorithms-content"></textarea>

          <button type="submit" class="button">
              {{ __('Save') }}
          </button>
      </form>
  </div>
@endsection
