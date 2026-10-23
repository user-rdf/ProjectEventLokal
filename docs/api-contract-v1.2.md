# EventLokal: Kontrak API v1.2

Disusun 22 Oktober 2026 dari "Laporan Proyek Terbaru untuk Tim" (versi revisi web app). Menggantikan v1.0 dan v1.1. Simpan sementara sebagai `docs/api-contract-v1.2-draft.md`. Jangan menimpa `docs/api-contract.md` yang sudah ada di repo sebelum keduanya dibandingkan.

**Cara membaca dokumen ini.** Database (`db/init/*.sql`) sudah jadi dan teruji, jadi kontrak ini mengikuti database, bukan sebaliknya. Dokumen ini ditulis dari laporan, bukan dari isi kode, jadi bagian bertanda **[CEK]** harus dicocokkan dengan file asli sebelum dipakai. Bila ada perbedaan, urutan yang menang: (1) `db/init/*.sql`, (2) `backend/app/schemas/*.py` dan route yang sudah terdaftar, (3) dokumen ini. Bila ketemu perbedaan, laporkan dan perbarui dokumen ini lewat PR, jangan menebak.

Nama field JSON sengaja tidak ditulis di sini karena skema Pydantic sudah ada di `backend/app/schemas/`. Daftar data yang dikirim ditulis dengan kata biasa. Salin nama field aslinya dari file skema ke dokumen ini saat memeriksa.

## 1. Konvensi umum

| Hal | Ketentuan |
|---|---|
| Alamat dasar | `http://localhost:8000/api/v1` |
| Dokumentasi otomatis | `http://localhost:8000/docs` |
| Format | JSON UTF-8 |
| Akses publik | Tanpa token. Dipakai peserta (tanpa login) |
| Akses panitia dan staf | Semua path `/manage/...`. Header `Authorization: Bearer <token>` dari `POST /auth/login` |
| Peran | `organizer` (panitia) dan `staff` (staf scanner), disimpan di `users.role` dan diperiksa di backend |
| Validasi input | Skema Pydantic. Kegagalan validasi dibalas 422 (mengikuti kode yang sudah ada dan pemetaan `23514` di laporan) |
| Paginasi | Daftar (`attendees`, `waitlist`, `tickets/search`) memakai `page` dan `per_page` bila sudah diimplementasikan **[CEK]** |
| Waktu | Disimpan dan dikirim sebagai waktu UTC. Kolom waktu event di database adalah `starts_at` dan `ends_at` |
| Uang | Bilangan bulat rupiah |

## 2. Format error dan pemetaan SQLSTATE

Error dikirim dalam satu bentuk. Bentuk persisnya ada di `backend/app/core/errors.py` **[CEK]**. Target yang disepakati di PRD: objek `error` berisi `code`, `message` (bahasa Indonesia), `details`, dan `request_id`.

Fungsi database melempar error dengan SQLSTATE khusus. Backend menerjemahkannya di satu tempat (`core/errors.py`):

| SQLSTATE | Arti | HTTP | Catatan |
|---|---|---|---|
| `EL001` | Kuota habis | 409 | Frontend menawarkan daftar tunggu |
| `EL002` | Event atau tiket tidak tersedia | 404 | |
| `EL003` | Email sudah terdaftar atau sudah di daftar tunggu | 409 | |
| `EL005` | Tiket masih tersedia, daftar tunggu ditolak | 409 | |
| `EL006` | Pendaftaran tidak ditemukan atau sudah dibatalkan | 404 atau 409 | Tidak ditemukan 404, sudah dibatalkan 409. Pembedanya dibaca dari pesan error **[CEK]** |
| `EL007` | Peserta sudah check-in, tidak bisa dibatalkan | 409 | |
| `23514` | Data melanggar CHECK (format email atau telepon, dan sebagainya) | 422 | |
| lainnya | Tidak dikenal | 500 | Detail hanya ke log, tidak dikirim ke klien |

`EL004` tidak ada di laporan. Cek `02_functions.sql`, mungkin tidak dipakai.

Tambahan HTTP umum: 401 untuk token tidak ada, salah, atau kedaluwarsa dan untuk login yang salah (pesan umum, tidak membocorkan apakah email terdaftar). 403 bila peran tidak diizinkan. 404 dipakai juga untuk event milik panitia lain.

## 3. Endpoint (17)

### Auth

| Endpoint | Akses | Yang dilakukan | Sukses | Error khusus |
|---|---|---|---|---|
| `POST /auth/register` | publik | Membuat akun panitia (`organizer`), password di-hash bcrypt | 201 | 409 email sudah terdaftar. 422 |
| `POST /auth/login` | publik | Mengembalikan token JWT | 200 | 401 dengan pesan umum. 422 |

Akun staf tidak dibuat lewat API. Staf berasal dari data (seed) **[CEK]**.

### Peserta (publik, tanpa login)

| Endpoint | Yang dilakukan | Sukses | Error khusus |
|---|---|---|---|
| `GET /events` | Daftar event dari view `v_public_events`. Hanya event `published`. Filter: pencarian, kategori, gratis atau berbayar **[CEK nama parameter]** | 200 | 422 |
| `GET /events/{slug}` | Detail event dan kategori tiket dengan sisa kuota | 200 | 404 |
| `POST /bookings` | Memanggil `checkout`. Setelah commit, backend mengirim email tiket berisi QR | 201 | 404 `EL002`. 409 `EL001` (tawarkan daftar tunggu). 409 `EL003`. 422 |
| `POST /waitlist` | Memanggil `join_waitlist`, hanya bila tiket benar-benar habis | 201 | 404 `EL002`. 409 `EL005`. 409 `EL003`. 422 |

Data yang dikirim ke `POST /bookings`: pilihan kategori tiket, nama, email, nomor telepon, dan persetujuan penggunaan data. Ke `POST /waitlist`: kategori tiket, nama, email, nomor telepon. Satu pendaftaran adalah satu tiket (tabel `tickets` punya UNIQUE pada booking).

Respons `POST /bookings` harus memuat data pendaftaran dan tiket (kode tiket), dan menyatakan apakah email sudah diantrekan **[CEK]**.

### Panitia (login, peran `organizer`)

| Endpoint | Yang dilakukan | Sukses | Error khusus |
|---|---|---|---|
| `GET /manage/home` | Beranda dari view `v_event_stats`: event `ongoing` dengan jumlah hadir, serta `upcoming` dan `finished` | 200 | 401 |
| `POST /manage/events` | Membuat event beserta kategori tiket (harga dan kuota). Status awal `draft` | 201 | 422 |
| `GET /manage/events/{id}` | Info event dan kuota per kategori | 200 | 404 bila bukan milik sendiri |
| `PATCH /manage/events/{id}/publish` | Mengubah status menjadi `published` | 200 | 404. 422 bila belum punya kategori tiket **[CEK]** |
| `GET /manage/events/{id}/attendees` | Tabel peserta | 200 | 404 |
| `GET /manage/events/{id}/waitlist` | Antrean daftar tunggu | 200 | 404 |
| `POST /manage/bookings/{id}/cancel` | Memanggil `cancel_booking`. Setelah commit, backend mengirim email "Kamu mendapat tiket" ke orang yang naik dari antrean | 200 | 404 `EL006`. 409 `EL006`. 409 `EL007` |
| `POST /manage/bookings/{id}/resend-ticket` | Mengirim ulang email tiket | 200 | 404 **[CEK penulisan path: `resend-ticket` atau `resend_ticket`]** |
| `GET /manage/events/{id}/reports/summary` | Laporan dari view `v_ticket_type_revenue`: pendapatan per kategori, terdaftar, hadir, tingkat kehadiran | 200 | 404 |

### Panitia atau staf (login, peran `organizer` atau `staff`)

| Endpoint | Yang dilakukan | Sukses | Error khusus |
|---|---|---|---|
| `POST /manage/check-ins` | Memanggil `check_in(event, kode, petugas)`. `petugas` diambil dari token, bukan dari body | 201 bila `valid` | 409 `already_used` (sertakan waktu check-in pertama), 409 `cancelled`, 409 `wrong_event`, 404 `invalid` |
| `GET /manage/events/{id}/tickets/search` | Pencarian manual berdasarkan nama, email, telepon, atau kode tiket | 200 | 404 |

Pemetaan hasil `check_in` ke layar scan: `valid` hijau, `already_used` merah (tampilkan waktu pertama), `invalid` merah, `cancelled` merah, `wrong_event` kuning. Check-in manual memakai endpoint yang sama dengan kode tiket yang diperoleh dari pencarian. Bentuk persis respons mengikuti `schemas/checkin.py` dan `ScanResultSheet.jsx` **[CEK]**.

Endpoint infrastruktur `GET /health` ada di luar kontrak dan dipakai tes.

## 4. Aturan per alur

**Checkout (`POST /bookings`).** Semuanya dijalankan di dalam fungsi `checkout` dalam satu transaksi: kunci baris kategori tiket (`SELECT ... FOR UPDATE`), cek event dan kuota dan email belum terdaftar, tambah jumlah terjual, buat booking, pembayaran simulasi, dan tiket dengan kode acak. Gagal di langkah mana pun berarti rollback penuh. Backend tidak mengulang logika itu. Setelah commit, backend membuat QR dan mengirim email. Gagal kirim email tidak membatalkan pendaftaran, dan tersedia kirim ulang tiket.

**Pembatalan dan daftar tunggu.** `cancel_booking` membatalkan booking, menggugurkan tiket (`void`), membebaskan kuota, dan menaikkan orang pertama di antrean, semuanya dalam satu transaksi. Pembatalan hanya oleh panitia. Peserta yang sudah check-in tidak bisa dibatalkan (`EL007`). Cara backend mengetahui siapa yang naik dari antrean (dari nilai kembalian fungsi atau dari query setelahnya) harus dicek di `02_functions.sql` **[CEK]**.

**Check-in.** Sekali pakai dijaga di database: kunci baris tiket, UNIQUE pada `check_ins.ticket_id`, dan trigger `check_ins_use_ticket`. Backend hanya memanggil fungsi dan menerjemahkan hasilnya.

**Email.** Dikirim lewat SMTP (Mailpit di pengembangan, `localhost:8025`). Tiga jenis: tiket QR, promosi daftar tunggu, dan kirim ulang tiket. Pembuat email dan QR sudah ada (`email_service.py`, `qr_service.py`).

**Privasi.** Nomor telepon dan email peserta hanya muncul di rute `/manage/...`.

## 5. Akses dan keamanan

1. Rute publik tidak memerlukan token. Semua rute `/manage/...` memerlukan token yang valid.
2. `staff` hanya boleh memanggil `POST /manage/check-ins` dan `GET /manage/events/{id}/tickets/search`. Selain itu hanya `organizer`.
3. Panitia yang membuka event milik panitia lain mendapat 404.
4. Apakah staf dibatasi pada event tertentu atau boleh memindai event mana saja belum jelas di laporan **[CEK]**. Bila tidak dibatasi, itu keputusan yang perlu disepakati dan dicatat.
5. Semua SQL memakai parameter (psycopg 3). Tidak ada string SQL yang dirangkai dari input. Password tidak pernah dicatat di log.

## 6. Daftar periksa sebelum dipakai agen

1. Salin nama field JSON asli dari `backend/app/schemas/*.py` ke dokumen ini.
2. Samakan path di bagian 3 dengan route yang terdaftar. Jalankan `tests/test_contract_routes.py`.
3. Baca `02_functions.sql`: argumen dan nilai kembalian `checkout`, `join_waitlist`, `cancel_booking`, `check_in`, dan di mana `EL004` dipakai.
4. Putuskan soal staf (bagian 5 butir 4) dan email unik per event atau per kategori tiket (laporan menyebut keduanya di tempat berbeda).
5. Pastikan nama parameter filter `GET /events` dan format respons daftar.

## 7. Perbedaan dari PRD awal

1. Role `staff` tetap ada (PRD awal menghapusnya menurut pesan tim di awal, laporan terbaru memakainya).
2. Tidak ada tabel `venues`. Lokasi adalah kolom pada `events`, sehingga aturan kuota tidak boleh melebihi kapasitas venue tidak berlaku.
3. Satu pendaftaran satu tiket (bukan 1 sampai 5).
4. Validasi dibalas 422 (PRD menulis 400).
5. Jumlah endpoint 17 (PRD awal 27), dengan path berbeda dan tanpa `GET /auth/me`, daftar event panitia, kategori tiket terpisah, dan laporan kehadiran lintas event.
6. Peserta tidak membatalkan atau mengirim ulang tiket sendiri.
7. Tambahan di database yang tidak ada di PRD: `audit_log`, tiga view, dan trigger `bookings_audit`.
