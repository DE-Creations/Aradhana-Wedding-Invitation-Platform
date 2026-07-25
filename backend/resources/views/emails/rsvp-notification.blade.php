@component('mail::message')
# New RSVP Received

Good news! A guest has responded to your invitation for
**{{ $invitation->groom_name }} & {{ $invitation->bride_name }}**.

@component('mail::panel')
**Guest:** {{ $rsvp->guest_name }}
**Response:** {{ ucfirst($rsvp->attendance) }}
**Number of Guests:** {{ $rsvp->number_of_guests }}
@if($rsvp->dietary_requirements)
**Dietary Requirements:** {{ $rsvp->dietary_requirements }}
@endif
@if($rsvp->message)
**Message:** "{{ $rsvp->message }}"
@endif
@endcomponent

You can view all RSVPs in your dashboard.

@component('mail::button', ['url' => rtrim(config('app.url'), '/').'/dashboard', 'color' => 'primary'])
Open Dashboard
@endcomponent

Warm regards,
**{{ config('app.name') }}**
@endcomponent
