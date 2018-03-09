@extends('layouts.app')

@section('content')
  @if (Session::has('success'))
   <div class="alert alert-info">{{ Session::get('success') }}</div>
@endif
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-body">
            <form method="POST" action="{{ route('users.update') }}">
              {{ method_field('PATCH') }}
              @csrf

              <div class="form-group row">
                <label for="name" class="col-sm-4 col-form-label text-md-right">{{ __('Name') }}</label>

                <div class="col-md-6">
                  <input id="name" type="name" class="form-control{{ $errors->has('name') ? ' is-invalid' : '' }}" name="name" value="{{ Auth::user()->name }}" required autofocus>

                  @if ($errors->has('name'))
                    <span class="invalid-feedback">
                      <strong>{{ $errors->first('name') }}</strong>
                    </span>
                  @endif
                </div>
              </div>

              <div class="form-group row">
                <label for="email" class="col-sm-4 col-form-label text-md-right">{{ __('E-Mail Address') }}</label>

                <div class="col-md-6">
                  <input id="email" type="email" class="form-control{{ $errors->has('email') ? ' is-invalid' : '' }}" name="email" value="{{ Auth::user()->email }}" required autofocus>

                  @if ($errors->has('email'))
                    <span class="invalid-feedback">
                      <strong>{{ $errors->first('email') }}</strong>
                    </span>
                  @endif
                </div>
              </div>

              <div class="form-group row">
                <label for="redcap_token" class="col-sm-4 col-form-label text-md-right">{{ __('REDCap Token') }}</label>

                <div class="col-md-6">
                  <input id="redcap_token" type="text" class="form-control{{ $errors->has('redcap_token') ? ' is-invalid' : '' }}" name="redcap_token" value="{{ Auth::user()->redcap_token }}" required autofocus>

                  @if ($errors->has('redcap_token'))
                    <span class="invalid-feedback">
                      <strong>{{ $errors->first('redcap_token') }}</strong>
                    </span>
                  @endif
                </div>
              </div>

              <div class="form-group row mb-0">
                <div class="col-md-6 offset-md-4">
                  <button type="submit" class="btn btn-primary">
                      {{ __('Save') }}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>

@endsection
