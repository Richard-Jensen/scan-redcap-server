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

                    <p>You are logged in!</p>

                    API token: <input type="text" value="{{ Auth::user()->api_token }}" onclick="this.select()" />
                    <br />

                    REDCap token: <input type="text" placeholder="None set" value="" onclick="this.select()" />
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
