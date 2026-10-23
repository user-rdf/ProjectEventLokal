# EventLokal: Struktur Modul Backend (mengikuti repo dan laporan 22 Okt 2026)

Patokan susunan kode backend FastAPI + PostgreSQL. Folder dan nama file yang berlaku adalah yang sudah ada di repo. Jangan membuat folder paralel seperti `api/`. Letakkan di `docs/struktur-modul-backend.md`.

## 1. Aturan lapisan

Satu arah saja:

```
routers  ->  services  ->  repositories  ->  PostgreSQL (fungsi, trigger, view)
```

1. `routers` hanya menerima request, memvalidasi lewat `schemas`, memanggil service, dan membentuk respons.
2. `services` memegang aturan yang tidak ada di database (kirim email, buat QR, menyusun respons). Tidak menulis SQL.
3. `repositories` memegang SQL eksplisit (psycopg 3, memakai `db/pool.py`). Hanya repository yang memanggil fungsi dan view database.
4. Logika inti sudah ada di database: `checkout`, `join_waitlist`, `cancel_booking`, `check_in`, trigger `check_ins_use_ticket` dan `bookings_audit`, dan view `v_public_events`, `v_event_stats`, `v_ticket_type_revenue`. Python hanya memanggil dan menerjemahkan hasilnya. Jangan menulis ulang aturan kuota, check-in, atau promosi antrean di Python.
5. Error database diterjemahkan di satu tempat, `core/errors.py` (pemetaan SQLSTATE `EL001` sampai `EL007` dan `23514` ada di kontrak bagian 2).
6. Dilarang: router yang menjalankan SQL, repository yang memanggil service, dan SQL yang dirangkai dari input pengguna.

## 2. Pemetaan endpoint, file, dan objek database

| Endpoint | Router | Service | Repository | Objek database |
|---|---|---|---|---|
| `POST /auth/register`, `/auth/login` | `auth.py` | (di router atau service kecil) | perlu repository `users` **[CEK]** | tabel `users` |
| `GET /events`, `GET /events/{slug}` | `public_events.py` | tidak perlu | `events_repo.py` | view `v_public_events` |
| `POST /bookings` | `bookings.py` | `booking_service.py`, `email_service.py`, `qr_service.py` | `booking_repo.py` | fungsi `checkout` |
| `POST /waitlist` | `bookings.py` atau router baru `waitlist.py` **[CEK]** | `booking_service.py` | `booking_repo.py` | fungsi `join_waitlist` |
| `GET /manage/home` | `manage_events.py` | tidak perlu | `events_repo.py` | view `v_event_stats` |
| `POST /manage/events`, `GET /manage/events/{id}`, `PATCH .../publish` | `manage_events.py` | tidak perlu | `events_repo.py` | tabel `events`, `ticket_types` |
| `GET .../attendees`, `GET .../waitlist` | `attendees.py` | tidak perlu | `booking_repo.py` | tabel `bookings`, `tickets`, `waitlist_entries` |
| `POST /manage/bookings/{id}/cancel` | `attendees.py` | `booking_service.py`, `email_service.py` | `booking_repo.py` | fungsi `cancel_booking` |
| `POST /manage/bookings/{id}/resend-ticket` | `attendees.py` | `booking_service.py`, `email_service.py` | `booking_repo.py` | tabel `bookings`, `tickets` |
| `POST /manage/check-ins`, `GET .../tickets/search` | `checkins.py` | `checkin_service.py` (disarankan) | `checkin_repo.py` | fungsi `check_in` |
| `GET .../reports/summary` | `reports.py` | tidak perlu | `reports_repo.py` | view `v_ticket_type_revenue` |

Catatan: dua router untuk `/manage/bookings/...` (cancel dan resend) sebaiknya berada di router yang berprefix `/manage`, jangan di `bookings.py` yang publik. Tanda **[CEK]** berarti saya belum melihat file-nya dan hanya menebak lokasi yang paling mungkin.

## 3. Isi tiap modul

1. **Core.** `config.py` membaca environment, `security.py` untuk bcrypt dan JWT, `errors.py` untuk kelas error dan pemetaan SQLSTATE. Dependency `get_current_user` dan pengecekan peran (`organizer` atau `staff`) harus ada satu tempat, jangan diulang di tiap router.
2. **Auth.** Mendaftar panitia dan login. Login yang salah memberi pesan umum.
3. **Event.** Event publik dibaca dari view. Event panitia memakai pengecekan "event ini milik panitia ini" yang dibuat sekali dan dipakai ulang oleh peserta, waitlist, laporan, dan check-in. Panitia lain dijawab 404.
4. **Pemesanan.** Router memvalidasi input. Service memanggil `checkout` lewat repository, lalu mengirim email setelah COMMIT lewat tugas latar belakang. Gagal email tidak membatalkan pendaftaran.
5. **Waitlist.** Masuk antrean lewat `join_waitlist`. Promosi otomatis terjadi di dalam `cancel_booking`. Setelah pembatalan, backend mengirim email ke orang yang naik. Cara mengetahuinya bergantung pada nilai kembalian `cancel_booking` **[CEK di `02_functions.sql`]**.
6. **Check-in.** Memanggil `check_in(event, kode, petugas)` dengan `petugas` dari token. Hasilnya (`valid`, `already_used`, `invalid`, `cancelled`, `wrong_event`) diterjemahkan ke HTTP seperti di kontrak.
7. **Laporan.** Hanya membaca dari view.

## 4. Tes

Sudah ada 20 tes (validasi skema, keamanan, email dan QR, rute, dan 7 tes database). Hal yang harus diperhatikan:

1. **Tes database dilewati otomatis bila database tidak terjangkau.** "Dilewati" bukan "lulus". Selalu jalankan dengan database hidup, dan baca jumlah skipped di output. Jangan melaporkan tes database lulus bila skipped.
2. Setelah endpoint terisi, tambahkan tes alur lewat HTTP untuk: checkout sukses, kuota habis (409), email ganda (409), pembayaran atau validasi gagal (422), pembatalan yang menaikkan antrean, check-in dua kali (409), check-in tiket event lain, dan akses tanpa token ke `/manage` (401).
3. `tests/test_contract_routes.py` membandingkan 17 endpoint kontrak dengan route yang terdaftar. Jalankan setelah tiap modul untuk melihat sisa pekerjaan.

## 5. Urutan pengerjaan (semua endpoint sekarang masih 501)

1. Core: dependency autentikasi dan peran, pemetaan error. Auth (register dan login).
2. `GET /events` dan `GET /events/{slug}` (membaca view, paling aman).
3. `POST /bookings` dengan email dan QR. Ini inti demo, kerjakan dengan tes alur penuh.
4. `POST /manage/check-ins` dan pencarian manual.
5. Beranda panitia, buat dan publikasikan event, peserta dan antrean.
6. Pembatalan, promosi antrean, dan kirim ulang tiket.
7. Laporan.

Setelah modul 3 selesai, sambungkan frontend dan coba satu alur penuh (daftar, email masuk di Mailpit, scan, scan ulang ditolak). Jangan menunggu semua endpoint selesai.

## 6. Catatan lingkungan

1. Kamera scan hanya bekerja di `localhost` atau HTTPS. Demo scan dari laptop atau lewat hosting HTTPS.
2. Dengan Docker, file di `db/init` dijalankan hanya pada volume database yang masih kosong. Setelah mengubah skema, jalankan `docker compose down -v` lalu `up`. Tanpa Docker, pakai `db/setup_local.sh` atau `.bat`.
3. Perubahan skema dibuat di file `db/init` lalu di-commit. Jangan mengubah skema lewat DBeaver saja.
4. Tidak ada rahasia di repo. Hanya `.env.example` yang di-commit.
