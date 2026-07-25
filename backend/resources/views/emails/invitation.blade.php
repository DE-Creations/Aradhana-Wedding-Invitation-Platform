@component('mail::message')
# You're Invited 💛

Dear **{{ $guest->name }}**,

Together with their families, **{{ $invitation->groom_name }}** & **{{ $invitation->bride_name }}**
joyfully invite you to celebrate their wedding.

@component('mail::panel')
**When:** {{ optional($invitation->ceremony_date)->format('l, F j, Y \a\t g:i A') }}
**Where:** {{ $invitation->ceremony_venue }}, {{ $invitation->ceremony_address }}
@endcomponent

@component('mail::button', ['url' => $url, 'color' => 'primary'])
View Your Invitation
@endcomponent

We would be honored by your presence, and kindly ask you to let us know if you can join us.

With love,
**{{ $invitation->groom_name }} & {{ $invitation->bride_name }}**
@endcomponent
