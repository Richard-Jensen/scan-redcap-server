@extends('layouts.app')

@section('content')
  <div class="container">
    @include('shared.messages')

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
            {{ __('Save') }}
        </button>
    </form>
  </div>
@endsection
