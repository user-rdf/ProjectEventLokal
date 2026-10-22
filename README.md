# EventLokal

Web-based event registration and ticketing for campus and community committees.
Final exam project: IK301 Advanced Database Systems + IK102 Software Development Fundamentals.

## Requirements
- Docker Desktop (Docker Compose v2), Git

## Run (about 5 minutes)
```bash
git clone <repo-url> && cd eventlokal
cp .env.example .env          # then edit the passwords/secrets
docker compose up --build
```
| Service | URL |
|---|---|
| Web app | http://localhost:3000 |
| API docs (Swagger) | http://localhost:8000/docs |
| Test inbox (ticket emails) | http://localhost:8025 |
| PostgreSQL | localhost:5433 |

## Pages
| Route | Page |
|---|---|
| / | Home: Daftar Event / Kelola Event |
| /events, /events/:slug | Public event list and detail |
| /events/:slug/register, /tickets/sent | Registration (name, email, phone) and confirmation |
| /login, /manage | Organizer login and home |
| /manage/events/:id | Event tabs: Info, Peserta, Scan, Daftar Tunggu, Laporan |

API contract: `docs/api-contract.md`. Design: `docs/design/`.

## Test accounts
TODO: fill after seed data exists.

## Run tests
```bash
docker compose exec backend pytest
```

## Database
TODO: ERD (`db/erd/`), schema (`db/init/`), why PostgreSQL, performance proof (`docs/performance/`).

## AI usage
TODO: list every AI tool used and what it was used for (required by the exam brief).

## Team and contributions
TODO
