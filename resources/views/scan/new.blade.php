@extends('layouts.app')

@section('content')
  @if (Session::has('success'))
    <div class="alert alert-info">{{ Session::get('success') }}</div>
  @endif
  <div id="container">
    <form method="POST" action="{{ route('scan') }}">
        @csrf

        <div class="form-group row">
            <label for="id" class="col-md-4 col-form-label text-md-right">{{ __('ID') }}</label>

            <div class="col-md-6">
                <input id="id" type="id" class="form-control{{ $errors->has('cpr') ? ' is-invalid' : '' }}" name="id" value="{{ old('id') }}" required>

                @if ($errors->has('id'))
                    <span class="invalid-feedback">
                        <strong>{{ $errors->first('id') }}</strong>
                    </span>
                @endif
            </div>
        </div>

        <div class="form-group row mb-0">
            <div class="col-md-6 offset-md-4">
                <button type="submit" class="btn btn-primary">
                    {{ __('New') }}
                </button>
            </div>
        </div>
    </form>
  </div>
@endsection
