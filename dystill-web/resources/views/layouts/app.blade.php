<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>dystill web</title>

    <!-- Fonts -->
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet">

    <!-- Styles -->
    <link href="{{ asset('css/app.min.css') }}" rel="stylesheet">

    <script src="{{ asset('js/fonts.js') }}" defer></script>
    @yield('header')
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark py-0">
        <div class="container">
            <a class="navbar-brand" href="#">
                <h1 class="title">dystill web</h1>
            </a>
        </div>
    </nav>
    <main class="py-4">
        @yield('content')
    </main>
</body>
</html>
