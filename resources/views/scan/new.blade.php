@extends('layouts.app')

@section('content')
  <div class="container">
    @if (Session::has('success'))
      <div class="alert alert-info">{{ Session::get('success') }}</div>
    @endif
    @if (Session::has('error'))
      <div class="alert alert-danger">{{ Session::get('error') }}</div>
    @endif

    <form method="POST" action="{{ route('scan.create') }}">
        @csrf

        <label for="id">{{ __('ID') }}</label>
        <input id="id" type="text" class="form-control{{ $errors->has('id') ? ' is-invalid' : '' }}" name="id" value="{{ old('id') }}" required>

        <label for="initials">{{ __('Initials') }}</label>
        <input id="initials" type="text" class="form-control{{ $errors->has('initials') ? ' is-invalid' : '' }}" name="initials" value="{{ old('initials') }}">

        @if ($errors->has('id'))
            <span class="invalid-feedback">
                <strong>{{ $errors->first('id') }}</strong>
            </span>
        @endif

        <button type="submit" class="button">
            {{ __('New') }}
        </button>
    </form>
  </div>
@endsection
