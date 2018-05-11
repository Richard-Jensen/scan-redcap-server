@extends('layouts.app')

@section('content')
<div class="container">
    <h2>{{ __('Login') }}</h2>

    <form method="POST" action="{{ route('login') }}">
        @csrf

        <label for="email">{{ __('E-Mail Address') }}</label>
        <input id="email" type="email" class="form-control{{ $errors->has('email') ? ' is-invalid' : '' }}" name="email" value="{{ old('email') }}" required autofocus>
        @if ($errors->has('email'))
            <span class="invalid-feedback">
                <strong>{{ $errors->first('email') }}</strong>
            </span>
        @endif


        <label for="password">{{ __('Password') }}</label>
        <input id="password" type="password" class="form-control{{ $errors->has('password') ? ' is-invalid' : '' }}" name="password" required>
        @if ($errors->has('password'))
            <span class="invalid-feedback">
                <strong>{{ $errors->first('password') }}</strong>
            </span>
        @endif


        <input type="checkbox" name="remember" id="remember" {{ old('remember') ? 'checked' : '' }}>
        <label class="label-inline" for="remember">{{ __('Remember me') }}</label>

        <div>
          <button type="submit" class="button">
              {{ __('Login') }}
          </button>

          <a class="button button-clear" href="{{ route('password.request') }}">
              {{ __('Forgot Your Password?') }}
          </a>
        </div>
    </form>
</div>
@endsection
