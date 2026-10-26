# User Stories & Acceptance Criteria — EventLokal (EVENT 2 GO) 🎟️

Dokumen spesifikasi kebutuhan pengguna (*user requirements*) untuk sistem pendaftaran dan manajemen tiket event **EventLokal (EVENT 2 GO)**. Dokumen ini disusun untuk memenuhi standar kurikulum **IK102 Dasar Pengembangan Perangkat Lunak** dengan format baku:
> **Sebagai** [Peran Pengguna / Role],  
> **Saya ingin** [Aksi / Fitur yang Dibutuhkan],  
> **Sehingga** [Tujuan Bisnis / Manfaat yang Dihasilkan].

Setiap User Story dilengkapi dengan kriteria penerimaan (*Acceptance Criteria*) berbasis format **Given - When - Then** (Gherkin syntax) agar dapat diuji secara terukur (*testable & verifiable*).

---

## Daftar User Stories

| ID | Modul / Fitur | Target Role | Prioritas |
| :--- | :--- | :--- | :--- |
| **US-01** | Eksplorasi & Filter Katalog Event | Calon Peserta (Public) | High |
| **US-02** | Pendaftaran & Checkout Tiket Atomik | Calon Peserta (Public) | Critical |
| **US-03** | Pendaftaran Antrean Daftar Tunggu (Waitlist) | Calon Peserta (Public) | High |
| **US-04** | Penerimaan E-Tiket & QR Code via Email | Peserta Terdaftar | Critical |
| **US-05** | Pendaftaran Akun Penyelenggara Baru | Panitia Acara (Organizer) | High |
| **US-06** | Pembuatan Event Baru (3-Step Wizard) | Panitia Acara (Organizer) | Critical |
| **US-07** | Manajemen Draf & Publikasi Event | Panitia Acara (Organizer) | High |
| **US-08** | Pembatalan Booking & Promosi Otomatis FIFO | Panitia Acara (Organizer) | Critical |
| **US-09** | Pemindaian QR Code Masuk (Check-in Lapangan) | Petugas Lapangan (Staff) | Critical |
| **US-10** | Pemantauan Metrik, Kehadiran & Laporan Finansial | Panitia Acara (Organizer) | Medium |

---

### US-01: Eksplorasi & Filter Katalog Event
- **Sebagai** Calon Peserta Acara,
- **Saya ingin** menjelajahi katalog event publik dan menyaringnya berdasarkan kata kunci pencarian, kategori event, serta filter harga (gratis/berbayar),
- **Sehingga** saya dapat menemukan acara yang sesuai dengan minat dan ketersediaan waktu saya secara cepat.

#### Acceptance Criteria (Given - When - Then)
- **Skenario 1.1: Menampilkan event yang aktif dan valid**
  - **Given** terdapat event di database dengan status `published` dan tanggal selesai (`ends_at`) belum lewat waktu sekarang (`NOW()`),
  - **When** calon peserta membuka halaman katalog `/events`,
  - **Then** sistem menampilkan daftar kartu event yang memuat judul, kategori, tanggal, lokasi, harga termurah, dan sisa tiket yang tersedia dari view `v_public_events`.
- **Skenario 1.2: Memfilter event berdasarkan kategori dan pencarian nama**
  - **Given** calon peserta berada di halaman `/events`,
  - **When** calon peserta memilih kategori `"workshop"` dan mengetikkan kata kunci `"python"`,
  - **Then** sistem memperbarui daftar event yang hanya menampilkan acara dengan kategori workshop dan judul yang memuat kata "python" secara instan.
- **Skenario 1.3: Event berstatus draft tidak ditampilkan**
  - **Given** terdapat event yang disimpan panitia dengan status `draft`,
  - **When** calon peserta membuka halaman katalog publik `/events`,
  - **Then** sistem tidak menampilkan event berstatus draft tersebut di halaman publik.

---

### US-02: Pendaftaran & Checkout Tiket Atomik
- **Sebagai** Calon Peserta Acara,
- **Saya ingin** memesan tiket acara (baik gratis maupun berbayar) dengan mengisi nama, email, dan nomor telepon,
- **Sehingga** kuota tiket saya terjamin dan saya mendapatkan tiket resmi tanpa risiko kehabisan akibat benturan transaksi serentak.

#### Acceptance Criteria (Given - When - Then)
- **Skenario 2.1: Checkout berhasil pada kuota tersedia**
  - **Given** kategori tiket memiliki sisa kuota $\ge 1$ dan calon peserta belum pernah terdaftar aktif di event tersebut,
  - **When** calon peserta mengisi formulir checkout dengan data valid dan menekan tombol konfirmasi bayar / daftar,
  - **Then** fungsi basis data `checkout()` mengunci baris tiket (`FOR UPDATE`), menambah kolom `sold` sebanyak 1, membuat record `bookings` (`confirmed`), `payments` (`paid`), dan menerbitkan `tickets` (`valid`) secara atomik dalam satu transaksi, lalu mengarahkan peserta ke halaman `/ticket-sent`.
- **Skenario 2.2: Penolakan overselling saat kuota habis tepat bersamaan (Race Condition)**
  - **Given** tiket hanya tersisa 1 buah dan terdapat dua calon peserta melakukan checkout pada milidetik yang sama,
  - **When** transaksi pertama berhasil mengunci dan mengambil kuota tiket terakhir,
  - **Then** transaksi kedua membaca kuota tiket sudah habis (`sold >= quota`), membatalkan transaksi dengan pesan error `EL001: Kuota tiket untuk kategori ini telah habis`, dan tidak membuat data booking palsu.
- **Skenario 2.3: Pencegahan registrasi ganda dengan email yang sama**
  - **Given** calon peserta sudah memiliki booking aktif (`confirmed`) untuk event tertentu,
  - **When** calon peserta mencoba mendaftar kembali pada event yang sama dengan email yang sama,
  - **Then** sistem menolak pendaftaran dengan error `EL003: Email ini sudah terdaftar untuk event tersebut` berkat partial unique index `idx_unique_active_booking_per_event`.

---

### US-03: Pendaftaran Antrean Daftar Tunggu (Waitlist)
- **Sebagai** Calon Peminat Acara,
- **Saya ingin** mendaftarkan diri ke dalam antrean daftar tunggu (*waitlist*) ketika kuota tiket yang saya inginkan sudah habis terjual,
- **Sehingga** saya berkesempatan mendapatkan tiket secara otomatis apabila ada peserta lain yang membatalkan pesanannya.

#### Acceptance Criteria (Given - When - Then)
- **Skenario 3.1: Pendaftaran antrean saat kuota tiket habis**
  - **Given** suatu kategori tiket memiliki sisa kuota 0 (`sold >= quota`),
  - **When** peminat membuka halaman `/events/:slug/waitlist` dan mengirimkan formulir dengan nama, email, dan nomor telepon,
  - **Then** fungsi basis data `join_waitlist()` memvalidasi bahwa kuota memang habis, menyimpan data antrean ke tabel `waitlist_entries` dengan status `waiting` dan timestamp `joined_at = NOW()`, serta menampilkan konfirmasi nomor antrean.
- **Skenario 3.2: Penolakan pendaftaran waitlist jika kuota tiket masih ada**
  - **Given** kategori tiket masih memiliki kuota kosong (`sold < quota`),
  - **When** peminat mencoba memanggil endpoint waitlist,
  - **Then** sistem menolak aksi dengan error `EL005: Tiket masih tersedia, silakan lakukan pendaftaran biasa`.
- **Skenario 3.3: Mencegah duplikasi pendaftaran antrean**
  - **Given** email peminat sudah tercatat dalam status `waiting` pada kategori tiket tersebut,
  - **When** peminat mencoba mendaftar waitlist kembali dengan email yang sama,
  - **Then** sistem menolak dengan pesan error `EL003: Email sudah berada di daftar tunggu`.

---

### US-04: Penerimaan E-Tiket & QR Code via Email
- **Sebagai** Peserta yang Berhasil Mendaftar,
- **Saya ingin** menerima email konfirmasi resmi berisi rincian acara dan QR Code e-tiket individual yang tersemat langsung,
- **Sehingga** saya dapat menyimpannya di ponsel pintar saya dan menunjukkannya kepada petugas di lokasi acara tanpa harus mencetak kertas fisik.

#### Acceptance Criteria (Given - When - Then)
- **Skenario 4.1: Pengiriman email konfirmasi instan setelah checkout**
  - **Given** transaksi checkout peserta berhasil dikonfirmasi oleh sistem,
  - **When** background task pengiriman email (`email_service.py`) dijalankan,
  - **Then** sistem merender kode tiket unik menjadi gambar PNG QR Code menggunakan pustaka `qrcode[pil]`, menyusun template email HTML responsif dengan branding EVENT 2 GO (`#5953C7`), menyematkan gambar QR melalui inline CID (*Content-ID*), dan mengirimkannya ke inbox SMTP peserta (Mailpit).
- **Skenario 4.2: Email konfirmasi pembatalan tiket**
  - **Given** panitia membatalkan tiket seorang peserta,
  - **When** sistem memproses pembatalan,
  - **Then** email notifikasi otomatis terkirim ke peserta dengan status informasi bahwa tiket dan kode QR sebelumnya telah dinyatakan tidak berlaku (`void`).

---

### US-05: Pendaftaran Akun Penyelenggara Baru
- **Sebagai** Pengurus Komunitas atau Panitia Kampus,
- **Saya ingin** mendaftarkan akun penyelenggara baru secara mandiri melalui form registrasi panitia,
- **Sehingga** saya dapat langsung login ke portal panitia dan mulai mengelola kegiatan kampus saya.

#### Acceptance Criteria (Given - When - Then)
- **Skenario 5.1: Registrasi panitia dengan data valid**
  - **Given** calon panitia berada di halaman `/daftar-panitia`,
  - **When** panitia menginput nama organisasi/panitia, email yang belum terdaftar, dan password minimal 8 karakter,
  - **Then** sistem mengenkripsi password menggunakan `bcrypt`, menyimpan akun ke tabel `users` dengan role `organizer`, menghasilkan token JWT autentikasi, dan mengarahkan panitia langsung ke `/dashboard`.
- **Skenario 5.2: Validasi email duplikat**
  - **Given** sebuah alamat email sudah terdaftar di database,
  - **When** pengguna lain mencoba mendaftar dengan email yang sama (baik huruf kapital maupun kecil),
  - **Then** tipe data `citext` pada PostgreSQL menolak registrasi dan sistem mengembalikan status HTTP 409 Conflict dengan pesan bahwa email sudah terdaftar.

---

### US-06: Pembuatan Event Baru (3-Step Wizard)
- **Sebagai** Panitia Acara (Organizer),
- **Saya ingin** membuat acara baru melalui formulir bertahap 3 langkah yang tervalidasi secara komprehensif,
- **Sehingga** informasi umum acara, jadwal, lokasi, dan beberapa kategori tiket dengan kuota masing-masing dapat terkonfigurasi dengan terstruktur tanpa kesalahan input.

#### Acceptance Criteria (Given - When - Then)
- **Skenario 6.1: Validasi formulir bertahap**
  - **Given** panitia berada pada Langkah 1 pembuatan event di `/buat-event`,
  - **When** panitia mengosongkan judul, lokasi, atau tanggal acara lalu menekan tombol lanjut,
  - **Then** sistem mencegah pergantian langkah, menampilkan highlight border merah pada input yang bermasalah, dan menampilkan pesan kesalahan spesifik di bawah field terkait.
- **Skenario 6.2: Konfigurasi multi-kategori tiket**
  - **Given** panitia berada pada Langkah 2 (Tiket),
  - **When** panitia menambahkan beberapa kategori tiket (misalnya *Presale*, *Reguler*, dan *VIP*) dengan harga dan kuota berbeda,
  - **Then** sistem menyimpan konfigurasi tiket tersebut dan memvalidasi bahwa total kuota lebih besar dari nol serta harga tidak bernilai negatif.
- **Skenario 6.3: Transaksi pembuatan event di database**
  - **Given** panitia telah meninjau seluruh data di Langkah 3,
  - **When** panitia menekan tombol simpan,
  - **Then** backend mengeksekusi pembuatan data event di tabel `events` dan baris-baris tiket di tabel `ticket_types` dalam satu transaksi database tunggal yang konsisten.

---

### US-07: Manajemen Draf & Publikasi Event
- **Sebagai** Panitia Acara (Organizer),
- **Saya ingin** memilih antara menyimpan acara sebagai "Draft" atau langsung "Publikasikan Sekarang",
- **Sehingga** saya memiliki keleluasaan untuk menyiapkan konsep acara secara privat terlebih dahulu sebelum resmi diluncurkan ke hadapan publik.

#### Acceptance Criteria (Given - When - Then)
- **Skenario 7.1: Menyimpan event sebagai draft**
  - **Given** panitia telah mengisi detail event di Langkah 3,
  - **When** panitia menekan tombol "Simpan sebagai Draft",
  - **Then** sistem membuat event dengan status `draft`, tidak memanggil endpoint `/publish`, menampilkan modal sukses berstatus Draft, dan event belum muncul di katalog pencarian `/events`.
- **Skenario 7.2: Mempublikasikan event langsung atau dari halaman kelola**
  - **Given** sebuah event berstatus `draft` dan telah memiliki minimal satu kategori tiket,
  - **When** panitia menekan tombol "Publikasikan Sekarang" (baik saat buat event atau dari `/manage-event/:id`),
  - **Then** backend mengubah status event menjadi `published` melalui endpoint `PATCH /publish`, sehingga event seketika muncul di katalog publik dan siap menerima registrasi peserta.

---

### US-08: Pembatalan Booking & Promosi Otomatis FIFO
- **Sebagai** Panitia Acara (Organizer),
- **Saya ingin** membatalkan pendaftaran peserta yang berhalangan hadir dan membiarkan sistem mempromosikan antrean waitlist urutan teratas secara otomatis,
- **Sehingga** kursi acara yang kosong terisi kembali secara adil tanpa kerja manual dari pihak panitia.

#### Acceptance Criteria (Given - When - Then)
- **Skenario 8.1: Pembatalan saat antrean waitlist tersedia**
  - **Given** terdapat booking terkonfirmasi dan terdapat calon peserta di `waitlist_entries` dengan status `waiting` yang mendaftar paling awal (`joined_at` paling lampau),
  - **When** panitia membatalkan booking tersebut melalui stored procedure `cancel_booking()`,
  - **Then** status booking lama diubah menjadi `cancelled`, status tiket lama diubah menjadi `void`, antrean waitlist pertama diubah menjadi `promoted`, sistem membuat booking dan tiket baru untuk peserta waitlist tersebut, serta mengirimkan email pemberitahuan tiket kepada peserta baru.
- **Skenario 8.2: Pembatalan saat tidak ada antrean waitlist**
  - **Given** tidak ada orang di daftar tunggu (`waitlist_entries`),
  - **When** panitia membatalkan booking,
  - **Then** status booking diubah menjadi `cancelled`, status tiket menjadi `void`, dan kolom `sold` pada `ticket_types` berkurang 1 sehingga kuota terbuka kembali untuk publik.
- **Skenario 8.3: Pencegahan pembatalan tiket yang sudah check-in**
  - **Given** seorang peserta telah hadir di lokasi acara dan tiketnya tercatat di tabel `check_ins`,
  - **When** panitia mencoba membatalkan booking peserta tersebut,
  - **Then** stored procedure menolak pembatalan dengan pesan error `EL007: Peserta sudah check-in, tidak dapat dibatalkan`.

---

### US-09: Pemindaian QR Code Masuk (Check-in Lapangan)
- **Sebagai** Petugas Lapangan / Scanner (Staff),
- **Saya ingin** memindai QR Code tiket pengunjung di pintu gerbang masuk menggunakan kamera ponsel atau memasukkan kode tiket secara manual,
- **Sehingga** keabsahan tiket terverifikasi dalam hitungan detik dan risiko tiket palsu atau duplikasi pemakaian dapat dicegah.

#### Acceptance Criteria (Given - When - Then)
- **Skenario 9.1: Verifikasi tiket valid pertama kali**
  - **Given** tiket pengunjung berstatus `valid` dan belum pernah dipindai sebelumnya,
  - **When** petugas memindai QR code tiket di tab Scanner (`/manage-event/:id`),
  - **Then** sistem mencatat data ke tabel `check_ins`, memperbarui status tiket menjadi `used`, dan layar scanner menampilkan visual hijau "Tiket Valid & Berhasil Check-in" beserta nama peserta dan kategori tiket.
- **Skenario 9.2: Deteksi dan penolakan tiket yang sudah pernah digunakan (Double Scan)**
  - **Given** tiket sudah pernah berhasil check-in beberapa waktu sebelumnya,
  - **When** petugas atau pihak lain mencoba memindai tiket yang sama untuk kedua kalinya,
  - **Then** sistem menolak verifikasi dengan status visual merah "Tiket Sudah Digunakan", menampilkan waktu check-in pertama kali, dan mencegah peserta kedua masuk.
- **Skenario 9.3: Deteksi tiket yang telah dibatalkan**
  - **Given** tiket peserta telah dibatalkan oleh panitia (status `void`),
  - **When** kode tiket dipindai di pintu masuk,
  - **Then** sistem menolak dan menampilkan status peringatan bahwa tiket tidak sah atau telah dibatalkan.

---

### US-10: Pemantauan Metrik, Kehadiran & Laporan Finansial
- **Sebagai** Panitia Acara (Organizer),
- **Saya ingin** melihat ringkasan statistik kehadiran secara real-time, rincian omset per kategori tiket, serta mengekspor daftar peserta ke dalam format CSV,
- **Sehingga** panitia dapat mengevaluasi keberhasilan acara dan melaporkan pertanggungjawaban kegiatan secara transparan kepada institusi kampus.

#### Acceptance Criteria (Given - When - Then)
- **Skenario 10.1: Tampilan metrik kehadiran real-time**
  - **Given** acara sedang berlangsung dan petugas scanner sedang memverifikasi pengunjung,
  - **When** panitia membuka tab Info atau Laporan di `/manage-event/:id`,
  - **Then** sistem menampilkan persentase tingkat kehadiran (*attendance rate*), rasio tiket terjual terhadap kuota, serta jumlah total pengunjung yang sudah masuk dari view `v_event_stats`.
- **Skenario 10.2: Laporan pendapatan per kategori tiket**
  - **Given** event memiliki penjualan tiket berbayar,
  - **When** panitia mengakses tab Laporan Keuangan,
  - **Then** sistem menyajikan tabel rincian omset per kategori tiket dari view `v_ticket_type_revenue` yang memuat nama tiket, harga satuan, tiket terjual, dan total akumulasi rupiah.
- **Skenario 10.3: Ekspor data peserta ke CSV**
  - **Given** terdapat daftar peserta yang terdaftar pada event,
  - **When** panitia menekan tombol "Export CSV" di tab Peserta,
  - **Then** browser mengunduh berkas `.csv` berisi data terstruktur (Kode Tiket, Nama, Email, Nomor Telepon, Kategori Tiket, Status Booking, dan Waktu Check-in).
