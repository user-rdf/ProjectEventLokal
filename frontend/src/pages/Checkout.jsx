import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  User,
  Mail,
  Phone,
  CreditCard,
  Ticket,
  Clock,
  Building,
  Info,
  ShieldCheck,
  Send,
  Wallet,
  Headphones,
  Lock,
  Pencil,
  CheckCircle2
} from 'lucide-react';
import PaymentMethodModal from '../components/PaymentMethodModal';
import { createBooking } from '../api/bookings';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const passedEvent = location.state?.event;
  const passedTicket = location.state?.selectedTicket;
  const passedQuantity = location.state?.quantity || 1;

  // Fallback default data
  const defaultEventData = {
    id: 'event2go-default',
    code: 'EVENT 2 GO TRANSACTION',
    title: 'Pendaftaran Event Kampus',
    badge: 'EVENT RESMI',
    dateTime: 'Waktu Pelaksanaan Event',
    venue: 'Lokasi Kampus Terdaftar',
    gate: 'Pintu Masuk Utama',
    posterUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
    organizer: 'EVENT 2 GO'
  };

  const defaultTicket = {
    id: 'reguler',
    title: 'Tiket Peserta',
    name: 'Tiket Peserta',
    price: 0,
    priceFormatted: 'Gratis',
    unit: '/ tiket',
    desc: 'Akses masuk kegiatan resmi dengan QR code digital terenkripsi.',
    tag: 'Akses Masuk',
    badge: 'TIKET TERPILIH'
  };

  const eventData = passedEvent ? {
    id: passedEvent.id,
    slug: passedEvent.slug,
    code: `Event: ${passedEvent.title}`,
    title: passedEvent.title,
    badge: passedEvent.category?.toUpperCase() || 'EVENT KAMPUS',
    dateTime: passedEvent.dateTime,
    venue: passedEvent.venue,
    gate: 'Pintu Masuk Utama',
    posterUrl: passedEvent.posterUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
    organizer: 'EVENT 2 GO'
  } : defaultEventData;

  const [selectedTicket, setSelectedTicket] = useState(passedTicket || defaultTicket);
  const [quantity, setQuantity] = useState(passedQuantity);
  const [consent, setConsent] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    whatsapp: '',
    identityNumber: ''
  });

  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Timer Countdown (10 menit = 600 detik)
  const [timeLeft, setTimeLeft] = useState(600);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Kalkulasi Harga Otomatis & Dinamis
  const subtotal = selectedTicket.price * quantity;
  const platformFee = selectedTicket.price > 0 ? 5000 : 0;
  const grandTotal = subtotal + platformFee;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!consent) {
      alert('Mohon setujui pembagian data sebelum melanjutkan ke pembayaran.');
      return;
    }
    setShowPaymentModal(true);
  };

  return (
    <div className="min-h-screen bg-[#F7F7FA] text-neutral-900 font-sans selection:bg-[#5046B8] selection:text-white pb-16">
      
      {/* ================= TOP NAVBAR ================= */}
      <header className="w-full bg-white border-b border-gray-200/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo EVENT2 GO */}
          <div
            onClick={() => navigate('/')}
            className="flex items-center cursor-pointer group select-none gap-2"
          >
            <img
              src="/images/Logo logo_EVENT2 GO.png"
              alt="EVENT 2 GO"
              className="h-8 sm:h-9 w-auto object-contain group-hover:scale-105 transition-transform"
            />
          </div>

          {/* User Profile Avatar */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="w-9 h-9 rounded-full bg-[#5046B8] hover:bg-[#4339a2] text-white flex items-center justify-center shadow-sm transition-transform active:scale-95 cursor-pointer"
              title="Akun Saya"
            >
              <User className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </header>

      {/* ================= TOP SUB-NAV & PROGRESS STEPPER ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-2">
        <div className="bg-white rounded-2xl border border-gray-200/70 shadow-sm px-5 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Back button & Order ID */}
          <div>
            <button
              onClick={() => navigate(passedEvent?.slug ? `/events/${passedEvent.slug}` : '/events')}
              className="group inline-flex items-center gap-2 text-xs font-black tracking-wider uppercase text-neutral-800 hover:text-[#5046B8] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
              <span>KEMBALI KE DETAIL EVENT ({eventData.title.toUpperCase()})</span>
            </button>
            <p className="text-[10px] sm:text-[11px] font-bold text-neutral-500 tracking-wider mt-0.5">
              <span className="text-[#5046B8] font-black uppercase">SESI TRANSAKSI RESMI</span> &bull; {eventData.code}
            </p>
          </div>

          {/* Stepper Steps (1. PILIH TIKET -> 2. DATA PEMESAN -> 3. PEMBAYARAN) */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs font-bold">
            
            {/* Step 1: Done */}
            <div className="flex items-center gap-1.5 text-[#5046B8]">
              <div className="w-5 h-5 rounded-full bg-[#5046B8] text-white flex items-center justify-center shadow-sm">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span className="text-[11px] uppercase tracking-wider font-extrabold line-through text-neutral-400">1. PILIH TIKET</span>
            </div>

            <div className="w-6 sm:w-8 h-px bg-gray-300"></div>

            {/* Step 2: Active */}
            <div className="flex items-center gap-1.5 text-[#5046B8]">
              <div className="w-5 h-5 rounded-full bg-[#5046B8] text-white flex items-center justify-center text-[10px] font-black shadow-sm">
                2
              </div>
              <span className="text-[11px] uppercase tracking-wider font-black">2. DATA PEMESAN</span>
            </div>

            <div className="w-6 sm:w-8 h-px bg-gray-200"></div>

            {/* Step 3: Pending */}
            <div className="flex items-center gap-1.5 text-gray-400">
              <div className="w-5 h-5 rounded-full border border-gray-300 text-gray-400 flex items-center justify-center text-[10px] font-bold">
                3
              </div>
              <span className="text-[11px] uppercase tracking-wider font-medium">3. PEMBAYARAN</span>
            </div>

          </div>

        </div>
      </div>

      {/* ================= MAIN SPLIT-SCREEN LAYOUT ================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ================= KOLOM KIRI: FORM DATA PEMESAN & TIKET TERPILIH (8 COLS) ================= */}
          <div className="lg:col-span-8 space-y-6">

            {/* CARD 1: DATA PEMESAN (SESUAI IDENTITAS RESMI) */}
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 sm:p-8">
              
              <div className="mb-6">
                <span className="inline-block text-[10px] font-black tracking-widest text-[#5046B8] uppercase bg-[#5046B8]/10 px-2.5 py-1 rounded-md mb-2">
                  IDENTITAS PENANGGUNG JAWAB
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
                  Data Pemesan (Sesuai Identitas Resmi)
                </h1>
                <p className="text-xs text-neutral-500 mt-1">
                  Pastikan data valid karena e-ticket dan QR code masuk akan dikirimkan ke kontak terdaftar.
                </p>
              </div>

              <div className="space-y-5">
                
                {/* Field 1: Nama Lengkap */}
                <div>
                  <label className="block text-[11px] font-black tracking-wider uppercase text-neutral-800 mb-1.5">
                    NAMA LENGKAP (SESUAI KTP / PASPOR) <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Masukkan nama lengkap sesuai tanda pengenal"
                      className="w-full bg-[#F8F9FC] hover:bg-white focus:bg-white border border-gray-200 focus:border-[#5046B8] focus:ring-2 focus:ring-[#5046B8]/20 rounded-xl px-4 py-3 text-sm text-neutral-900 font-medium transition-all outline-none pr-10"
                    />
                    <CreditCard className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Akan diverifikasi bersama kartu tanda pengenal di gate penukaran wristband.
                  </p>
                </div>

                {/* Field 2 & 3: Email & WhatsApp (2 Columns) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  
                  {/* Email */}
                  <div>
                    <label className="block text-[11px] font-black tracking-wider uppercase text-neutral-800 mb-1.5">
                      ALAMAT EMAIL / GMAIL KONFIRMASI <span className="text-rose-600">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="contoh: nama@email.com"
                        className="w-full bg-[#F8F9FC] hover:bg-white focus:bg-white border border-gray-200 focus:border-[#5046B8] focus:ring-2 focus:ring-[#5046B8]/20 rounded-xl px-4 py-3 text-sm text-neutral-900 font-medium transition-all outline-none pr-10"
                      />
                      <Mail className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-1">
                      PDF E-Ticket & Invoice dikirim ke surel ini.
                    </p>
                  </div>

                  {/* Nomor WhatsApp */}
                  <div>
                    <label className="block text-[11px] font-black tracking-wider uppercase text-neutral-800 mb-1.5">
                      NOMOR WHATSAPP AKTIF <span className="text-rose-600">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="whatsapp"
                        required
                        value={formData.whatsapp}
                        onChange={handleInputChange}
                        placeholder="0812xxxxxxxx"
                        className="w-full bg-[#F8F9FC] hover:bg-white focus:bg-white border border-gray-200 focus:border-[#5046B8] focus:ring-2 focus:ring-[#5046B8]/20 rounded-xl px-4 py-3 text-sm text-neutral-900 font-medium transition-all outline-none pr-10"
                      />
                      <Phone className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-1">
                      Notifikasi gate jam buka & broadcast acara via WA.
                    </p>
                  </div>

                </div>

                {/* Field 4: Nomor Identitas */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[11px] font-black tracking-wider uppercase text-neutral-800">
                      NOMOR IDENTITAS (NIK KTP / PASPOR / KITAS)
                    </label>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                      Opsional
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      name="identityNumber"
                      value={formData.identityNumber}
                      onChange={handleInputChange}
                      placeholder="Contoh: 3174051209930005"
                      className="w-full bg-[#F8F9FC] hover:bg-white focus:bg-white border border-gray-200 focus:border-[#5046B8] focus:ring-2 focus:ring-[#5046B8]/20 rounded-xl px-4 py-3 text-sm text-neutral-900 font-medium transition-all outline-none pr-10"
                    />
                    <CreditCard className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Mempercepat validasi penukaran wristband fisik jika antrian padat.
                  </p>
                </div>

              </div>

            </div>

            {/* CARD 2: KATEGORI TIKET TERPILIH (SEDERHANA: SINGLE TICKET) */}
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 sm:p-8">
              
              {/* Header: Kategori Tiket Terpilih & Tombol Ubah Tiket */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-black tracking-widest text-[#5046B8] uppercase">
                      KATEGORI TIKET TERPILIH
                    </span>
                    <span className="bg-[#3B3494] text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
                      LANGKAH 1
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-neutral-950 tracking-tight">
                    {selectedTicket.title}
                  </h2>
                  <p className="text-xs text-neutral-500 mt-1 leading-relaxed max-w-xl">
                    {selectedTicket.desc}
                  </p>
                </div>

                {/* Tombol Ubah Tiket */}
                <button
                  type="button"
                  onClick={() => navigate(passedEvent?.slug ? `/events/${passedEvent.slug}` : '/events')}
                  className="inline-flex items-center gap-1.5 bg-[#EEEDFA] hover:bg-[#E2E0F8] text-[#5046B8] px-3.5 py-1.5 rounded-full text-xs font-black tracking-wider uppercase transition-colors shrink-0 cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>UBAH TIKET</span>
                </button>
              </div>

              {/* Card Tiket Terpilih (Kotak dengan border ungu & background pudar) */}
              <div className="border-2 border-[#5046B8] bg-[#F9F8FE] rounded-2xl p-4 sm:p-5 relative mt-4 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  
                  {/* Info Tiket Kiri */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#5046B8]/10 text-[#5046B8] flex items-center justify-center shrink-0">
                      <Ticket className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm sm:text-base text-neutral-950">
                        {selectedTicket.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5 text-xs">
                        <span className="font-black text-[#5046B8]">
                          {selectedTicket.priceFormatted} {selectedTicket.unit}
                        </span>
                        <span className="text-neutral-400 font-medium">
                          &bull; {selectedTicket.tag}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Badge Tiket Terpilih Kanan */}
                  <div className="shrink-0">
                    <span className="bg-[#312784] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-md shadow-sm">
                      {selectedTicket.badge}
                    </span>
                  </div>

                </div>
              </div>

              {/* Kotak Kuantitas Tiket (bg-gray-100) */}
              <div className="mt-4 bg-[#F3F4F6] border border-gray-200/60 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-[11px] font-black tracking-wider uppercase text-neutral-800">
                    KUANTITAS TIKET
                  </h4>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Maksimal 4 tiket per satu identitas akun
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    disabled={quantity <= 1}
                    className="w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center font-bold text-neutral-700 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-black text-sm w-6 text-center select-none text-neutral-950">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => Math.min(4, prev + 1))}
                    disabled={quantity >= 4}
                    className="w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center font-bold text-neutral-700 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Kotak Info: Jaminan Tempat & Akses VIP */}
              <div className="mt-3 bg-[#F8F9FA] border border-gray-200/80 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-neutral-600">
                <ShieldCheck className="w-4 h-4 text-[#5046B8] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong className="text-neutral-900 font-bold">Jaminan Tempat &amp; Akses VIP:</strong> E-ticket berenkripsi dengan barcode fast-lane akses akan langsung dikirim setelah proses pembayaran terverifikasi.
                </p>
              </div>

            </div>

          </div>

          {/* ================= KOLOM KANAN: ORDER SUMMARY (STICKY) (4 COLS) ================= */}
          <div className="lg:col-span-4 lg:sticky lg:top-8 space-y-4">

            {/* ORDER SUMMARY CONTAINER */}
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-md overflow-hidden">
              
              {/* 1. Timer Header: Reservasi Sementara */}
              <div className="bg-[#2D2A78] p-3.5 px-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#A5B4FC]" />
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-wider text-[#C7D2FE] block leading-tight">
                      RESERVASI SEMENTARA
                    </span>
                    <h3 className="font-extrabold text-xs sm:text-sm text-white leading-tight">
                      Selesaikan Pesanan
                    </h3>
                  </div>
                </div>

                {/* Countdown Time Badge */}
                <div className="bg-white/15 backdrop-blur-sm px-2.5 py-1 rounded-md text-sm font-black font-mono tracking-wider text-white">
                  {formatTimer(timeLeft)}
                </div>
              </div>

              {/* 2. Detail Poster & Judul Event */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-900">
                <img
                  src={eventData.posterUrl}
                  alt={eventData.title}
                  className="w-full h-full object-cover filter brightness-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent p-4 flex flex-col justify-end text-white">
                  <span className="inline-block self-start text-[9px] font-black uppercase tracking-wider bg-[#5046B8] text-white px-2 py-0.5 rounded mb-1.5 shadow-sm">
                    {eventData.badge}
                  </span>
                  <h4 className="font-black text-base sm:text-lg leading-tight text-white drop-shadow-md">
                    {eventData.title}
                  </h4>
                  <p className="text-[11px] text-gray-200 mt-1 flex items-center gap-1.5">
                    <span>{eventData.dateTime}</span>
                  </p>
                </div>
              </div>

              {/* 3. Info Venue / Stadion */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between text-xs">
                <div className="flex items-start gap-2">
                  <Building className="w-4 h-4 text-[#5046B8] shrink-0 mt-0.5" />
                  <span className="font-bold text-neutral-800 text-[11px] leading-tight">
                    {eventData.venue}
                  </span>
                </div>
                <span className="text-[11px] font-bold text-[#5046B8] bg-[#5046B8]/10 px-2 py-0.5 rounded shrink-0">
                  {eventData.gate}
                </span>
              </div>

              {/* 4. Ringkasan Tiket Terpilih */}
              <div className="p-4 pt-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                  RINCIAN TIKET TERPILIH
                </span>
                <div className="bg-[#F8F9FC] border border-gray-200/70 rounded-xl p-3 flex items-start justify-between gap-2 text-xs">
                  <div>
                    <h5 className="font-extrabold text-neutral-900 leading-snug">
                      {selectedTicket.title}
                    </h5>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      {quantity} Tiket x {selectedTicket.priceFormatted}
                    </p>
                  </div>
                  <span className="font-bold text-[#5046B8] shrink-0">
                    Rp {subtotal.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* 5. Rincian Tagihan & Total */}
              <div className="px-4 pb-4 space-y-2 text-xs text-neutral-600">
                <div className="flex justify-between items-center">
                  <span>Subtotal Harga Tiket</span>
                  <span className="font-bold text-neutral-900">Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>
                {platformFee > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1">
                      Biaya Layanan Platform
                      <Info className="w-3 h-3 text-neutral-400" />
                    </span>
                    <span className="font-bold text-neutral-900">Rp {platformFee.toLocaleString('id-ID')}</span>
                  </div>
                )}

                {/* Divider Line & Total Estimasi */}
                <div className="border-t border-gray-200 pt-3 mt-2">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500 block">
                        TOTAL ESTIMASI
                      </span>
                      <span className="text-[11px] text-neutral-400">
                        Termasuk semua pajak resmi
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-xl text-[#2D2A78] tracking-tight block">
                        Rp {grandTotal.toLocaleString('id-ID')}
                      </span>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase">
                        IDR Netto
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 6. Jaminan & Perks Keamanan */}
              <div className="p-4 border-t border-gray-100 bg-[#FAFAFC] space-y-2 text-[11px] text-neutral-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#5046B8] shrink-0" />
                  <span>E-Ticket QR Code unik berenkripsi ganda (anti-duplikasi).</span>
                </div>
                <div className="flex items-center gap-2">
                  <Send className="w-3.5 h-3.5 text-[#5046B8] shrink-0" />
                  <span>Pengiriman instan ke surel &amp; WhatsApp begitu pelunasan selesai.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wallet className="w-3.5 h-3.5 text-[#5046B8] shrink-0" />
                  <span>Dapat diunduh ke Apple Wallet / Google Wallet.</span>
                </div>
              </div>

              {/* 7. PEMINDAHAN: CHECKBOX PERSETUJUAN & TOMBOL LANJUT KE PEMBAYARAN */}
              <div className="p-4 pt-3 border-t border-gray-200 bg-white space-y-3.5">
                
                {/* Checkbox Persetujuan Privasi */}
                <div className="bg-[#F9FAFB] p-3 rounded-xl border border-gray-200/80">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded text-[#5046B8] focus:ring-[#5046B8] border-gray-300 accent-[#5046B8] cursor-pointer"
                    />
                    <span className="text-[11px] text-neutral-700 leading-snug">
                      Saya setuju data saya (nama, email, nomor telepon) dibagikan ke panitia YF Live In Jakarta untuk keperluan event ini, sesuai Kebijakan Privasi.
                    </span>
                  </label>
                </div>

                {/* Tombol Ungu Penuh: Lanjut ke Pembayaran */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full bg-[#3D32A0] hover:bg-[#322886] text-white py-3.5 px-5 rounded-xl font-black text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.99] cursor-pointer"
                >
                  <span>LANJUT KE PEMBAYARAN</span>
                  <ArrowRight className="w-4 h-4 ml-0.5" />
                </button>

                {/* Footnote Keamanan */}
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-neutral-500 text-center pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Transaksi aman dengan enkripsi bank berstandar OJK &amp; garansi tiket 100% sah.</span>
                </div>

                {/* Live Chat Kurator Footer */}
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-neutral-500">
                  <div className="flex items-center gap-1.5">
                    <Headphones className="w-3.5 h-3.5 text-[#5046B8]" />
                    <span className="text-[10px]">Butuh bantuan checkout? Hubungi kurator Twenty Three Layers via</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert('Live Chat dibuka 24 jam untuk melayani pertanyaan tiket Anda.')}
                    className="text-[#5046B8] font-bold text-[10px] hover:underline flex items-center gap-0.5 shrink-0 cursor-pointer"
                  >
                    <span>Live Chat</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

              </div>

            </div>

          </div>

        </div>
      </main>

      {/* ================= MODAL SUKSES CHECKOUT ================= */}
      {paymentSuccess && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 text-center shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-neutral-900">Pesanan Berhasil Disimpan!</h3>
            <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
              Data pemesanan untuk <strong>{formData.fullName}</strong> dengan tiket <strong>{selectedTicket.title}</strong> ({quantity}x) senilai <strong>Rp {grandTotal.toLocaleString('id-ID')}</strong> telah siap dilanjutkan ke proses pembayaran.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <button
                onClick={() => setPaymentSuccess(false)}
                className="w-full bg-[#5046B8] hover:bg-[#4339a2] text-white py-3 rounded-full font-bold text-xs uppercase tracking-wider shadow-sm transition-colors cursor-pointer"
              >
                Tutup Notifikasi
              </button>
              <button
                onClick={() => navigate('/events')}
                className="w-full border border-gray-200 text-neutral-700 py-3 rounded-full font-bold text-xs uppercase tracking-wider hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                Kembali ke Daftar Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL PILIH METODE PEMBAYARAN ================= */}
      <PaymentMethodModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        totalAmount={grandTotal}
        onConfirmPayment={async (method) => {
          setSubmitting(true);
          setApiError('');
          try {
            // Bersihkan nomor telepon untuk format regex DB (+62 / 08...)
            const cleanPhone = (formData.whatsapp || '').replace(/[\s-]/g, '') || '081234567890';
            const bookingPayload = {
              ticket_type_id: selectedTicket.id,
              attendee_name: formData.fullName || 'Peserta Event',
              attendee_email: formData.email,
              attendee_phone: cleanPhone
            };

            const res = await createBooking(bookingPayload);
            setShowPaymentModal(false);

            navigate('/tickets/sent', {
              state: {
                email: formData.email,
                fullName: formData.fullName,
                orderId: res.ticket_code || (`#EL-${(res.booking_id || '').slice(0, 8)}`),
                ticketCategory: selectedTicket.title || selectedTicket.name,
                paymentMethod: method,
                eventTitle: eventData.title,
                dateTime: eventData.dateTime,
                venueName: eventData.venue,
                total: grandTotal,
                totalFormatted: `Rp ${grandTotal.toLocaleString('id-ID')}`
              }
            });
          } catch (err) {
            setShowPaymentModal(false);
            const msg = err.status === 409
              ? 'Kuota tiket habis atau email Anda sudah terdaftar di event ini.'
              : (err.message || 'Gagal memproses pendaftaran.');
            alert(msg);
          } finally {
            setSubmitting(false);
          }
        }}
      />

    </div>
  );
};

export default Checkout;
