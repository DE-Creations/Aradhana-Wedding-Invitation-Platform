<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title inertia>{{ config('app.name', 'Aradhana') }}</title>
    <meta property="og:site_name" content="{{ config('app.name', 'Aradhana') }}">
    <meta property="og:title" content="{{ config('app.name', 'Aradhana') }}">
    <meta property="og:description" content="You are invited! Open the link to view your wedding invitation.">
    <meta property="og:url" content="{{ url()->current() }}">
    <meta property="og:type" content="website">
    <meta property="og:image" content="{{ asset('images/logo.png') }}">
    @viteReactRefresh
    @vite('resources/js/App.tsx')
    @inertiaHead
</head>
<body class="font-sans antialiased">
    @inertia
</body>
</html>
