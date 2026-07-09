@extends('emails.layout')

@php
    $emailTitle = 'Your Aradhana Account Expires Soon';
    $recipientEmail = $user->email;
@endphp

@section('content')

    {{-- Greeting --}}
    <h1 style="font-size:26px; font-weight:normal; color:#1a1208;
               letter-spacing:0.5px; margin-bottom:8px; font-family:Georgia,serif;">
        Account Expiry Notice
    </h1>
    <p style="font-size:14px; color:#8b6a4a; letter-spacing:2px;
              text-transform:uppercase; font-family:Arial,sans-serif; margin-bottom:32px;">
        A gentle reminder from Aradhana
    </p>

    {{-- Main body --}}
    <p style="font-size:16px; line-height:1.8; color:#3a3028; margin-bottom:20px; font-family:Georgia,serif;">
        Dear <strong>{{ $user->name }}</strong>@if(isset($wedding) && $wedding) <span style="color:#8b6a4a;">({{ $wedding->bride_name }} &amp; {{ $wedding->groom_name }})</span>@endif,
    </p>

    <p style="font-size:15px; line-height:1.9; color:#4a3c30; margin-bottom:20px; font-family:Georgia,serif;">
        We hope your wedding celebrations have been everything you dreamed of.
        We are writing to let you know that your <strong>Aradhana</strong> account
        is scheduled to expire in <strong>3 days</strong>.
    </p>

    {{-- Expiry highlight box --}}
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 28px 0;">
        <tr>
            <td style="background:#fdf8f2; border:1px solid #e8d4b8;
                       border-radius:2px; padding: 20px 28px;">
                <p style="font-size:13px; color:#8b6a4a; text-transform:uppercase;
                          letter-spacing:1.5px; font-family:Arial,sans-serif; margin-bottom:8px;">
                    Account Expiry Date
                </p>
                <p style="font-size:20px; color:#1a1208; font-family:Georgia,serif; font-weight:normal;">
                    {{ $expiryDate->format('l, F j, Y') }}
                </p>
            </td>
        </tr>
    </table>

    <p style="font-size:15px; line-height:1.9; color:#4a3c30; margin-bottom:20px; font-family:Georgia,serif;">
        After this date, your account and shared memories will no longer be accessible.
        We recommend taking the following steps before your account expires:
    </p>

    {{-- Checklist --}}
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 28px;">
        <tr>
            <td style="padding: 6px 0;">
                <p style="font-size:14px; color:#4a3c30; font-family:Georgia,serif; line-height:1.7;">
                    &rsaquo;&nbsp; Export or note any important guest information
                </p>
            </td>
        </tr>
        <tr>
            <td style="padding: 6px 0;">
                <p style="font-size:14px; color:#4a3c30; font-family:Georgia,serif; line-height:1.7;">
                    &rsaquo;&nbsp; Download any memories or gallery images you wish to keep
                </p>
            </td>
        </tr>
    </table>

    <p style="font-size:15px; line-height:1.9; color:#4a3c30; margin-bottom:32px; font-family:Georgia,serif;">
        If you have any questions or need assistance, please reach out to our team and
        we will be happy to help.
        <br /><br />
        Thank you for choosing Aradhana. It has been a privilege to be part of your wedding journey.
    </p>

    {{-- Closing --}}
    <p style="font-size:15px; line-height:1.8; color:#3a3028; font-family:Georgia,serif;">
        Warmly,<br />
        <span style="color:#8b6a4a; font-style:italic;">The Aradhana Team</span>
    </p>

@endsection
