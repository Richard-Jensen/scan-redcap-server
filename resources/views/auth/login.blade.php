@extends('layouts.app')

@section('content')
<div class="container log-in-page">
    <div class="log-in-form-container">
        <h2 class="log-in-form-header">{{ __('Login') }}</h2>

        <form method="POST" action="{{ route('login') }}">
            @csrf

            @if ($errors->has('email'))
                <span class="invalid-feedback">
                    <strong>{{ $errors->first('email') }}</strong>
                </span>
            @endif

            @if ($errors->has('password'))
                <span class="invalid-feedback">
                    <strong>{{ $errors->first('password') }}</strong>
                </span>
            @endif

            <label for="email">{{ __('E-Mail Address') }}</label>
            <input id="email" type="email" class="form-control{{ $errors->has('email') ? ' is-invalid' : '' }}" name="email" value="{{ old('email') }}" required autofocus>

            <label for="password">{{ __('Password') }}</label>
            <input id="password" type="password" class="form-control{{ $errors->has('password') ? ' is-invalid' : '' }}" name="password" required>



            <input type="checkbox" name="remember" id="remember" {{ old('remember') ? 'checked' : '' }}>
            <label class="label-inline" for="remember">{{ __('Remember me') }}</label>

            <div>
              <button type="submit" class="button button-full-width">
                  {{ __('Login') }}
              </button>
            </div>

            <div class="forgot-password">
              <a href="{{ route('password.request') }}">
                  {{ __('Forgot Your Password?') }}
              </a>
            </div>
        </form>
    </div>
</div>
@endsection
