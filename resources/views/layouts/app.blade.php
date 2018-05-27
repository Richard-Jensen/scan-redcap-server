<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- Polyfills for older browsers -->
    <script src="https://cdn.polyfill.io/v2/polyfill.js?features=Promise,Map,Array.prototype.find,Array.from,Object.entries" defer async></script>

    <!-- Styles -->
    <link rel="stylesheet" href="//cdn.rawgit.com/necolas/normalize.css/master/normalize.css">

    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    @yield('header')
</head>
<body>
    <div id="app">
        <nav class="container">
            <a class="" href="{{ url('/') }}">
                {{ config('app.name', 'Laravel') }}
            </a>

            <div class="navigation navigation-right">
                <a class="nav-link{{ App::getLocale() == 'da' ? ' nav-link-active' : '' }}" href="/setlocale/da">DA</a>
                <a class="nav-link{{ App::getLocale() == 'en' ? ' nav-link-active' : '' }}" href="/setlocale/en">EN</a>
                @guest
                    <a class="nav-link" href="{{ route('login') }}">{{ __('Login') }}</a>
                @else
                    <span class="nav-link">{{ Auth::user()->email }}</span>
                    <a class="nav-link" href="{{ route('home') }}">{{ __('Home') }}</a>
                    <a class="nav-link" href="{{ route('profile') }}">{{ __('Profile') }}</a>
                    <a class="nav-link" href="{{ route('algorithms.index') }}">{{ __('Algorithms') }}</a>
                    <a class="nav-link" href="{{ route('logout') }}"
                       onclick="event.preventDefault();
                                     document.getElementById('logout-form').submit();">
                        {{ __('Logout') }}
                    </a>
                    <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
                        @csrf
                    </form>
                @endguest
            </div>
        </nav>

        @if(View::hasSection('content'))
            <main class="content">
                @yield('content')
            </main>
        @endif
        @yield('react-app')
    </div>

    <!-- Scripts -->
    <script src="{{ asset('js/app.js') }}"></script>
</body>
</html>
