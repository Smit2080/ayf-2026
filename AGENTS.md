# AYF Project — Developer Notes

## Admin Panel (Cream/Black Theme)
- All 7 pages (Dashboard, Registrations, Volunteers, Profiles, Competitions, Analytics, Settings) render with live Supabase data
- AdminButton.tsx uses `display: flex` + `alignItems: center` (was `display: block`, causing text to be 12.5px off-center)
- CSS variables in `app/globals.css`: cream palette (`--cream: #E8DFC8`, `--card: #FBF8F0`, etc.)
- Auth protected via middleware + server-side `getAdminUser()` check

## Known Issues
- **competition_meta table doesn't exist**: The migration SQL in `supabase_migration_v2.sql` was never run. Go to supabase.com/dashboard/project/mdikvuejzuctrqzotkip → SQL Editor → paste the SQL and run. This affects:
  - Settings page: "No competitions configured yet" instead of toggle switches
  - Competitions API: falls back to grouping by `competition_name` from registrations
- **Auth token refresh**: Cookies expire every 1 hour. Refresh via Supabase auth endpoint with the current refresh token.

## Build & Run
```powershell
cd E:\Projects\AYF
npx next build --webpack
npx next start -p 3000
```
