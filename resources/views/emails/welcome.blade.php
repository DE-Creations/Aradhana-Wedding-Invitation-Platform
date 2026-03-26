@extends('emails.layout')

@php
    $emailTitle = 'Welcome to Aradhana';
    $recipientEmail = $user->email;
@endphp

@section('content')

    {{-- Greeting --}}
    <h1 style="font-size:26px; font-weight:normal; color:#1a1208;
               letter-spacing:0.5px; margin-bottom:8px; font-family:Georgia,serif;">
        Welcome to Aradhana
    </h1>
    <p style="font-size:14px; color:#8b6a4a; letter-spacing:2px;
              text-transform:uppercase; font-family:Arial,sans-serif; margin-bottom:32px;">
        Your journey begins here
    </p>

    {{-- Main body --}}
    <p style="font-size:16px; line-height:1.8; color:#3a3028; margin-bottom:20px; font-family:Georgia,serif;">
        Dear <strong>{{ $user->name }}</strong>,
    </p>

    <p style="font-size:15px; line-height:1.9; color:#4a3c30; margin-bottom:20px; font-family:Georgia,serif;">
        We are truly honoured to welcome you to <strong>Aradhana</strong> — a premium digital platform
        crafted exclusively for beautiful, meaningful weddings.
    </p>

    <p style="font-size:15px; line-height:1.9; color:#4a3c30; margin-bottom:20px; font-family:Georgia,serif;">
        Thank you for trusting us to be part of your special celebration.
        Your account is now active and your wedding setup is ready for you.
    </p>

    @if ($wedding)
    {{-- Wedding highlight box --}}
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 28px 0;">
        <tr>
            <td style="background:#faf5ef; border-left:3px solid #c9a96e;
                       padding: 20px 24px; border-radius:2px;">
                <p style="font-size:13px; color:#8b6a4a; text-transform:uppercase;
                          letter-spacing:1.5px; font-family:Arial,sans-serif; margin-bottom:10px;">
                    Your Wedding
                </p>
                <p style="font-size:18px; color:#1a1208; font-family:Georgia,serif;">
                    {{ $wedding->bride_name }} &amp; {{ $wedding->groom_name }}
                </p>
            </td>
        </tr>
    </table>
    @endif

    <p style="font-size:15px; line-height:1.9; color:#4a3c30; margin-bottom:28px; font-family:Georgia,serif;">
        You can now log in to your Aradhana dashboard to personalise your wedding invitation,
        manage your guest list, and share your love story with the world.
    </p>

    {{-- Login CTA button --}}
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 32px;">
        <tr>
            <td align="center">
                <a href="{{ url('/login') }}"
                   target="_blank"
                   style="display:inline-block; padding: 14px 40px;
                          background: linear-gradient(135deg,#8b6a4a,#c9a96e);
                          color:#ffffff; font-family:Arial,sans-serif;
                          font-size:14px; font-weight:600; letter-spacing:1px;
                          text-decoration:none; border-radius:2px;
                          text-transform:uppercase;">
                    Login to Your Dashboard
                </a>
            </td>
        </tr>
    </table>

    <p style="font-size:15px; line-height:1.9; color:#4a3c30; margin-bottom:32px; font-family:Georgia,serif;">
        If you have any questions, our team is always here to help.
        We wish you a beautiful, joyful celebration.
    </p>

    {{-- Closing --}}
    <p style="font-size:15px; line-height:1.8; color:#3a3028; font-family:Georgia,serif;">
        With warmth &amp; blessings,<br />
        <span style="color:#8b6a4a; font-style:italic;">The Aradhana Team</span>
    </p>

@endsection
