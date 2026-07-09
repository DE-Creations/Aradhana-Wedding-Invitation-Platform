@extends('emails.layout')

@php
    $emailTitle = 'Wishing You a Beautiful Wedding Day';
    $recipientEmail = $user->email;
@endphp

@section('content')

    {{-- Greeting --}}
    <h1 style="font-size:26px; font-weight:normal; color:#1a1208;
               letter-spacing:0.5px; margin-bottom:8px; font-family:Georgia,serif;">
        Tomorrow Is Your Big Day
    </h1>
    <p style="font-size:14px; color:#8b6a4a; letter-spacing:2px;
              text-transform:uppercase; font-family:Arial,sans-serif; margin-bottom:32px;">
        Official Wishes from Aradhana
    </p>

    {{-- Main body --}}
    <p style="font-size:16px; line-height:1.8; color:#3a3028; margin-bottom:20px; font-family:Georgia,serif;">
        Dear <strong>{{ $user->name }}</strong> <span style="color:#8b6a4a;">({{ $wedding->bride_name }} &amp; {{ $wedding->groom_name }})</span>,
    </p>

    <p style="font-size:15px; line-height:1.9; color:#4a3c30; margin-bottom:20px; font-family:Georgia,serif;">
        As you prepare to begin one of the most beautiful chapters of your life,
        the entire <strong>Aradhana</strong> team wishes to pause and send you our
        warmest, most heartfelt blessings.
    </p>

    {{-- Couple highlight --}}
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 28px 0;">
        <tr>
            <td align="center"
                style="background:#faf5ef; border-top:1px solid #e8d4b8;
                       border-bottom:1px solid #e8d4b8; padding: 24px 32px;">
                <p style="font-size:22px; color:#1a1208; font-family:Georgia,serif;
                          font-weight:normal; letter-spacing:1px; margin-bottom:8px;">
                    {{ $wedding->bride_name }} &amp; {{ $wedding->groom_name }}
                </p>
                <p style="font-size:13px; color:#8b6a4a; font-family:Arial,sans-serif;
                          letter-spacing:1.5px; text-transform:uppercase;">
                    {{ $eventDate->format('l, F j, Y') }}
                </p>
            </td>
        </tr>
    </table>

    <p style="font-size:15px; line-height:1.9; color:#4a3c30; margin-bottom:20px; font-family:Georgia,serif;">
        Tomorrow, as two souls become one, may every moment be filled with love, laughter,
        and memories that last a lifetime. May your union be blessed with joy, strength,
        and a happiness that only grows deeper with each passing year.
    </p>

    <p style="font-size:15px; line-height:1.9; color:#4a3c30; margin-bottom:32px; font-family:Georgia,serif;">
        We are honoured to have been a small part of your beautiful story.
        Wishing you both a truly magical wedding day.
    </p>

    {{-- Blessing quote --}}
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 32px;">
        <tr>
            <td style="border-left:3px solid #c9a96e; padding: 12px 20px;">
                <p style="font-size:15px; color:#6b4f35; font-style:italic;
                          line-height:1.8; font-family:Georgia,serif;">
                    &ldquo;May your love story be timeless, and your happiness be boundless.&rdquo;
                </p>
            </td>
        </tr>
    </table>

    {{-- Closing --}}
    <p style="font-size:15px; line-height:1.8; color:#3a3028; font-family:Georgia,serif;">
        With love &amp; warm wishes,<br />
        <span style="color:#8b6a4a; font-style:italic;">The Aradhana Team</span>
    </p>

@endsection
