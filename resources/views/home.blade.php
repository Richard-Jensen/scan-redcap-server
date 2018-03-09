@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">

            <div class="card">
                <div class="card-header">Dashboard</div>

                <div class="card-body">
                    @if (session('status'))
                        <div class="alert alert-success">
                            {{ session('status') }}
                        </div>
                    @endif

                    <h5 class="card-title">You are logged in as: <strong>{{ Auth::user()->email }}</strong>.</h5>
                </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item"><strong>API token:</strong> <input type="text" value="{{ Auth::user()->api_token }}" onclick="this.select()" readonly style="border:none;" /></li>
                  <li class="list-group-item"><strong>REDCap token:</strong> <input type="text" placeholder="None set" value="{{ Auth::user()->redcap_token }}" onclick="this.select()" readonly style="border:none;" /></li>
                </ul>
                <div class="card-body">
                  <a href="{{ route('profile') }}" class="card-link btn btn-primary">Edit profile</a>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
