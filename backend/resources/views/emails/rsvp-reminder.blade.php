@component('mail::message')
# A Gentle Reminder 💛

Dear **{{ $guest->name }}**,

We noticed we haven't yet received your RSVP for the wedding of
**{{ $invitation->groom_name }}** & **{{ $invitation->bride_name }}**.

@component('mail::panel')
**When:** {{ optional($invitation->ceremony_date)->format('l, F j, Y \a\t g:i A') }}
**Where:** {{ $invitation->ceremony_venue }}, {{ $invitation->ceremony_address }}
@endcomponent

It would mean the world to us to know whether you can join our celebration.

@component('mail::button', ['url' => $url, 'color' => 'primary'])
Respond Now
@endcomponent

With love,
**{{ $invitation->groom_name }} & {{ $invitation->bride_name }}**
@endcomponent
