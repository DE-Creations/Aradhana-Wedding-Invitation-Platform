# Starting the scheduler (Aradhana)

## What runs on a schedule

| Task | When | What it does |
|---|---|---|
| `users:expire` | once a day at **2:00 AM** (app timezone, Asia/Colombo) | Marks clients whose `expire_date` has passed as `expired` and deletes their main image, gallery images and memory images. |
| `mail:big-day-wishes`, `mail:expiry-reminder` | every 5 minutes, **only when `MAIL_ENABLED=true`** | Email reminders. Email is switched off by default, so these are not scheduled. |

The schedule is defined in `bootstrap/app.php`. Laravel does not run it by itself: the server must call
`php artisan schedule:run` **every minute**. Each call checks what is due and runs it, so one cron entry is all that is needed.
The "2 AM" is decided by Laravel using the app timezone, not by the server clock or the cron time zone.

## 1. Production server (Hostinger hPanel)

1. Find the folder that contains the `artisan` file. This is the Laravel project root (it may be `public_html`, or a folder above it).
2. Find the PHP binary. Use the PHP version that is selected for the domain in hPanel. If you have SSH, run `which php`; on shared hosting it is often `/usr/bin/php`, and some plans use a versioned path such as `/opt/alt/php82/usr/bin/php`. The Cron Jobs page in hPanel may also show the PHP command.
3. In hPanel open **Advanced -> Cron Jobs** and create a cron job:
   - Schedule: **every minute** (`* * * * *`).
   - Command (replace the two paths with your own):

   ```bash
   cd /home/YOUR_ACCOUNT/domains/aradhana.vip/public_html && /usr/bin/php artisan schedule:run >> /dev/null 2>&1
   ```

   For the first few days you can keep a log instead of discarding the output:

   ```bash
   cd /home/YOUR_ACCOUNT/domains/aradhana.vip/public_html && /usr/bin/php artisan schedule:run >> storage/logs/cron.log 2>&1
   ```

4. Make sure the server `.env` has `MAIL_ENABLED=false` (or leave the line out; the default is off), then clear the config cache so the setting takes effect:

   ```bash
   php artisan config:clear
   ```

## 2. Check that it works

From the project folder (SSH or a one-off cron job):

```bash
php artisan schedule:list      # should list only users:expire, with its next due time
php artisan schedule:run -v    # runs whatever is due right now (nothing outside 2:00 AM)
```

The day after the cron job is created, look at the clients you expected to be expired: their status should now be `expired` and
their images removed. If you used the `cron.log` variant, the file shows each minute's run.
If nothing happens, the usual causes are a wrong project path, the wrong PHP binary or version, or the cron job not being set to run every minute.

## 3. Local development (Windows)

- Keep a terminal open and run `php artisan schedule:work`. It runs the scheduler every minute until you stop it with Ctrl+C.
- Or create a Windows Task Scheduler task that runs `php artisan schedule:run` every minute from the project folder.

To run the expiry cleanup once by hand: `php artisan users:expire`. **It really deletes the images of expired clients**, so do not run it against data you want to keep.

## 4. Turning emails back on

1. Set `MAIL_ENABLED=true` in `.env` and make sure the `MAIL_*` SMTP settings are valid.
2. Run `php artisan config:clear`.
3. `php artisan schedule:list` now also lists `mail:big-day-wishes` and `mail:expiry-reminder`, and the welcome email is sent again when an admin creates a client.

Reminders that were skipped while email was off are not sent later: the big-day and expiry commands only act in a narrow time window.
