# Aradhana — Wedding Invitation Platform (Backend)

Laravel 12 REST API + **Filament v5** admin & user panels for the Aradhana
digital wedding-invitation platform. It powers the public invitation pages,
RSVP collection, guest management, and email delivery consumed by the React
(Vite) frontend.

---

## Tech Stack

- **Laravel 12** (PHP 8.2+)
- **Filament v5** — two panels: `/admin` and `/dashboard`
- **Laravel Sanctum** — token auth for the SPA
- **MySQL 8** — primary datastore
- **Database queue** + **Mail** — asynchronous RSVP notifications, invitations & reminders
- **Local `public` disk** — media storage (photos, music)

---

## Requirements

- PHP **8.2+** with extensions: `intl`, `pdo_mysql`, `mbstring`, `fileinfo`, `gd`
- Composer 2
- MySQL 8 (or MariaDB 10.3+)
- Node is **not** required for the backend (the SPA lives in the parent project)

> The `intl` extension is mandatory for Filament. On XAMPP, enable
> `extension=intl` in `php.ini`.

---

## Installation

```bash
# 1. Install dependencies
composer install

# 2. Environment
cp .env.example .env
php artisan key:generate

# 3. Configure .env (see below), then create the database
#    e.g. CREATE DATABASE aradhana_backend CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 4. Migrate + seed
php artisan migrate --seed

# 5. Storage symlink (public/storage -> storage/app/public)
php artisan storage:link

# 6. Serve
php artisan serve
```

### Key `.env` values

```dotenv
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173      # React app origin (used for links + CORS)

DB_CONNECTION=mysql
DB_DATABASE=aradhana_backend
DB_USERNAME=root
DB_PASSWORD=

FILESYSTEM_DISK=public
QUEUE_CONNECTION=database

MAIL_MAILER=smtp
MAIL_HOST=smtp.hostinger.com
MAIL_PORT=465
MAIL_ENCRYPTION=ssl
MAIL_USERNAME=noreply@yourdomain.com
MAIL_PASSWORD=your_email_password
MAIL_FROM_ADDRESS=noreply@yourdomain.com
MAIL_FROM_NAME="Aradhana"
```

---

## Running the Queue & Scheduler

RSVP notifications, invitation emails and reminders are dispatched to the
**database queue**. Run a worker:

```bash
php artisan queue:work
```

Scheduled tasks (defined in `routes/console.php`):

| Command                        | Schedule       | Purpose                                              |
| ------------------------------ | -------------- | --------------------------------------------------- |
| `invitations:expire`           | daily 02:00    | Expire published invitations 1 day after the event  |
| `invitations:send-reminders`   | daily 10:00    | Remind un-responded guests 14 & 3 days before event |

On the server, register a single cron entry:

```cron
* * * * * cd /path/to/backend && php artisan schedule:run >> /dev/null 2>&1
```

For Supervisor-managed queue workers on Hostinger/Ubuntu, run
`php artisan queue:work --sleep=3 --tries=3`.

---

## Panels

| Panel | URL          | Access                          |
| ----- | ------------ | ------------------------------- |
| Admin | `/admin`     | Users with `role = admin`       |
| User  | `/dashboard` | Any authenticated user          |

Access is enforced by `User::canAccessPanel()`.

### Seeded logins (password: `password`)

| Role  | Email                  |
| ----- | ---------------------- |
| Admin | `admin@aradhana.test`  |
| User  | `user1@aradhana.test`  |
| User  | `user2@aradhana.test`  |

### Admin panel

- **Users** — list/filter by role & plan, invitations count, CRUD.
- **Invitations** — couple names, status badges, tabs (All / Published / Drafts / Expired), Guests & RSVPs relation managers.
- **RSVPs** — read-only list with **Export to CSV**.
- **Contact Messages** — mark read/unread, unread nav badge.
- **Dashboard widgets** — stats, invitations-per-month line chart, accepted-vs-declined pie chart, latest RSVPs table.

### User panel

- **My Invitations** — scoped to the logged-in user, 7-tab create/edit form
  (Basic Info, Family, Ceremony, Reception, Contact, Media, Customization),
  actions: **Publish / Unpublish / Copy Link / Preview / Delete**.
- **Guests** relation manager — manual add, **CSV import**, **Send Invitation**,
  **Send Reminder**, copyable personalized links.
- **RSVPs** relation manager — read-only with total-attending summary.
- **Profile** page — edit name, email, password.

---

## Public API

Base path: `/api`. Public endpoints are throttled to **60 req/min**,
authenticated endpoints to **120 req/min**.

### Public (no auth)

| Method | Endpoint                                  | Description                        |
| ------ | ----------------------------------------- | ---------------------------------- |
| GET    | `/api/invitations/{slug}`                 | Published invitation + gallery     |
| GET    | `/api/invitations/{slug}/guest/{token}`   | Invitation + guest RSVP context    |
| POST   | `/api/rsvp`                               | Submit / update an RSVP            |

### Authenticated (Sanctum)

| Method | Endpoint                                            | Description                |
| ------ | -------------------------------------------------- | -------------------------- |
| GET    | `/api/user`                                        | Current user               |
| GET    | `/api/user/invitations`                            | Owner's invitations        |
| POST   | `/api/user/invitations`                            | Create invitation          |
| PUT    | `/api/user/invitations/{invitation}`               | Update invitation          |
| DELETE | `/api/user/invitations/{invitation}`               | Delete invitation          |
| POST   | `/api/user/invitations/{invitation}/guests/import` | CSV guest import           |

All responses use **API Resources** (`InvitationResource`, `RsvpResource`, …)
and never expose raw models. The invitation payload includes computed
`days_until_event`, `google_calendar_url`, and `ceremony_map_url` /
`reception_map_url` fields, matching the frontend contract.

---

## File Uploads

Stored on the `public` disk with UUID filenames:

```
storage/app/public/
├── photos/couples   ← couple main photos
├── photos/gallery   ← gallery images
├── photos/grooms    ← groom photos
├── photos/brides    ← bride photos
└── music            ← background music
```

Validation: photos ≤ 5 MB (`jpg,jpeg,png,webp`), music ≤ 10 MB
(`mp3,wav,ogg`), max 20 gallery photos per invitation.

---

## Architecture Notes

- **Slugs** auto-generate from the couple's first names (`vimukthi-and-piumi`)
  and de-duplicate with `-2`, `-3`, … suffixes.
- **Guest tokens** are 32-char random strings for un-guessable personal URLs.
- **RSVP notifications** use the Event → Listener → Job pattern
  (`RsvpSubmitted` → `SendRsvpNotificationListener` → `SendRsvpNotification`).
- **Authorization** via `InvitationPolicy` (owners only; admins bypass).
- **CORS** (`config/cors.php`) restricts API access to `FRONTEND_URL` with
  credentials support for Sanctum.
- Queries use eager loading / `withCount` to avoid N+1.

---

## Testing

```bash
php artisan test
```

Feature tests cover panel access & scoping and mailable rendering. Factories
exist for every model.

---

## Deployment (Hostinger Cloud / Ubuntu + Nginx)

1. Set `APP_ENV=production`, `APP_DEBUG=false`, real `APP_URL` & `FRONTEND_URL`.
2. `composer install --no-dev --optimize-autoloader`
3. `php artisan migrate --force`
4. `php artisan storage:link`
5. `php artisan config:cache route:cache view:cache`
6. Point Nginx to the `public/` directory.
7. Configure Supervisor for `queue:work` and a cron entry for `schedule:run`.
