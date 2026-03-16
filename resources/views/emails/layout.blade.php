<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>{{ $emailTitle ?? config('app.name', 'Aradhana') }}</title>
    <style>
        /* Reset */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            background-color: #f5f0eb;
            font-family: Georgia, 'Times New Roman', serif;
            color: #3a3028;
            -webkit-font-smoothing: antialiased;
        }
        a { color: #8b6a4a; text-decoration: none; }
        img { border: 0; display: block; max-width: 100%; }
    </style>
</head>
<body>
<table width="100%" cellpadding="0" cellspacing="0" border="0"
       style="background-color:#f5f0eb; padding: 40px 16px;">
    <tr>
        <td align="center">

            {{-- Email card --}}
            <table width="600" cellpadding="0" cellspacing="0" border="0"
                   style="max-width:600px; width:100%; background:#ffffff;
                          border-radius:4px; overflow:hidden;
                          box-shadow:0 2px 12px rgba(0,0,0,0.08);">

                {{-- Header / Logo --}}
                <tr>
                    <td align="center"
                        style="background-color:#1a1208; padding: 32px 40px;">
                        <img src="{{ $message->embed(public_path('images/logo-text.png')) }}"
                             alt="Aradhana"
                             width="160"
                             style="width:160px; height:auto; display:block; margin:0 auto;" />
                    </td>
                </tr>

                {{-- Decorative line --}}
                <tr>
                    <td style="height:4px; background: linear-gradient(90deg,#8b6a4a,#c9a96e,#8b6a4a);"></td>
                </tr>

                {{-- Body --}}
                <tr>
                    <td style="padding: 48px 48px 40px;">
                        @yield('content')
                    </td>
                </tr>

                {{-- Divider --}}
                <tr>
                    <td style="padding: 0 48px;">
                        <hr style="border:none; border-top:1px solid #e8ddd4;" />
                    </td>
                </tr>

                {{-- Footer --}}
                <tr>
                    <td align="center"
                        style="padding: 28px 48px 36px; background-color:#faf7f4;">
                        <p style="font-size:13px; color:#9a8878; font-family:Georgia,serif; line-height:1.6;">
                            With love &amp; care,<br />
                            <strong style="color:#6b4f35; letter-spacing:0.5px;">The Aradhana Team</strong>
                        </p>
                        <p style="margin-top:16px; font-size:11px; color:#b8a898; letter-spacing:0.5px; text-transform:uppercase; font-family:Arial,sans-serif;">
                            Aradhana &mdash; Premium Wedding Invitations Platform
                        </p>
                        <p style="margin-top:8px; font-size:11px; color:#c8b8a8; font-family:Arial,sans-serif;">
                            This email was sent to {{ $recipientEmail ?? '' }}.<br />
                            Please do not reply to this email.
                        </p>
                    </td>
                </tr>

            </table>
            {{-- /Email card --}}

        </td>
    </tr>
</table>
</body>
</html>
