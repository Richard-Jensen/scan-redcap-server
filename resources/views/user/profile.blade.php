@extends('layouts.app')

@section('content')
  @if (Session::has('success'))
   <div class="alert alert-info">{{ Session::get('success') }}</div>
 @endif
  <div class="container">
      <form method="POST" action="{{ route('users.update') }}">
        {{ method_field('PATCH') }}
        @csrf

        <label for="name">{{ __('Name') }}</label>
        <input id="name" type="text" class="form-control{{ $errors->has('name') ? ' is-invalid' : '' }}" name="name" value="{{ Auth::user()->name }}" required autofocus>

        @if ($errors->has('name'))
          <span class="invalid-feedback">
            <strong>{{ $errors->first('name') }}</strong>
          </span>
        @endif

        <label for="email">{{ __('E-Mail Address') }}</label>
        <input id="email" type="email" class="form-control{{ $errors->has('email') ? ' is-invalid' : '' }}" name="email" value="{{ Auth::user()->email }}" required autofocus>

        @if ($errors->has('email'))
          <span class="invalid-feedback">
            <strong>{{ $errors->first('email') }}</strong>
          </span>
        @endif

        <label for="redcap_token">{{ __('REDCap Token') }}</label>
        <input id="redcap_token" type="text" class="form-control{{ $errors->has('redcap_token') ? ' is-invalid' : '' }}" name="redcap_token" value="{{ Auth::user()->redcap_token }}" required autofocus>

        @if ($errors->has('redcap_token'))
          <span class="invalid-feedback">
            <strong>{{ $errors->first('redcap_token') }}</strong>
          </span>
        @endif

        <button type="submit" class="button">
            {{ __('Save') }}
        </button>
      </form>
  </div>

@endsection
