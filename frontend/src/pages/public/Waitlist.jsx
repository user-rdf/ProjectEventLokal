import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Ticket,
  Calendar,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Mail,
  Phone,
  User,
  Minus,
  Plus,
  HelpCircle,
  X,
  CreditCard,
  MessageSquare,
  Sparkles,
  Check
} from 'lucide-react';

export default function Waitlist() {
  const navigate = useNavigate();
  const { slug } = useParams();

  // =========================================================================
  // 3. DUMMY DATA (API-READY: Mudah diganti dengan response API backend)
  // =========================================================================
  const mockEventData = {
    title: 'Malam Keakraban Sipil & Simfoni Akus...',
    fullTitle: 'Malam Keakraban Sipil & Simfoni Akustik 2026',
    organizer: 'HIMPUNAN SENI • 23 LAYERS',
    dateTime: 'Minggu, 22 November 2026 • 16.00 WIB',
    venue: 'Amphitheater Budaya, Grand ITB Bandung',
    capacityText: 'Kapasitas Penuh',
    capacityPercentage: '1.200 Kursi (100%)',
    queueCount: 98,
    allocationChance: '~18%',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    categories: [
      {
        id: 'any',
        name: 'Kategori Apa Saja (Fleksibel)',
        badge: 'REKOMENDASI',
        note: null
      },
      {
        id: 'vip',
        name: 'VIP Soundcheck Pass',
        badge: null,
        note: 'Prioritas 1'
      },
      {
        id: 'cat1',
        name: 'CAT 1 • Center Floor',
        badge: null,
        note: 'Terbatas'
      },
      {
        id: 'cat2',
        name: 'CAT 2 • Grand Tier Balcony',
        badge: null,
        note: 'Reguler'
      }
    ],
    mechanisms: [
      {
        step: 1,
        title: 'Verifikasi Slot Otomatis',
        desc: 'Setiap tiket yang tidak diselesaikan transaksinya dalam 15 menit otomatis dialihkan ke antrean berikutnya.'
      },
      {
        step: 2,
        title: 'Akses Instan via Tautan Eksklusif',
        desc: 'Anda mendapatkan private purchase link via email dan WhatsApp yang aktif selama 15 menit sebelum dilempar ke urutan bawahnya.'
      },
      {
        step: 3,
        title: 'Jaminan Harga Resmi',
        desc: 'Semua tiket waiting list diterbitkan sesuai harga normal tanpa markup calo atau biaya tambahan tersembunyi.'
      }
    ]
  };

  // =========================================================================
  // 2. STATE MANAGEMENT INPUT USER
  // =========================================================================
  const [namaLengkap, setNamaLengkap] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [kategoriTiket, setKategoriTiket] = useState('any');
  const [jumlahTiket, setJumlahTiket] = useState(2);
  const [isAgreed, setIsAgreed] = useState(false);

  // State untuk interaksi UI & feedback
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [queueNumber, setQueueNumber] = useState(null);

  // Counter kuantitas tiket
  const handleDecrement = () => {
    if (jumlahTiket > 1) {
      setJumlahTiket((prev) => prev - 1);
    }
  };

  const handleIncrement = () => {
    if (jumlahTiket < 4) {
      setJumlahTiket((prev) => prev + 1);
    }
  };

  // =========================================================================
  // 4. DUMMY SUBMIT HANDLER (API-READY)
  // =========================================================================
  const handleJoinWaitlist = (e) => {
    e.preventDefault();

    if (!isAgreed) {
      alert('Mohon setujui ketentuan pendaftaran antrean resmi.');
      return;
    }

    // Kumpulkan semua state input ke dalam satu object payload
    const payload = {
      eventSlug: slug || 'malam-keakraban-sipil-2026',
      namaLengkap,
      email,
      whatsapp,
      kategoriTiket,
      jumlahTiket,
      isAgreed,
      timestamp: new Date().toISOString()
    };

    console.log('Data siap dikirim ke backend:', payload);
    // TODO: Ganti dengan fetch API POST ke backend
    // Contoh:
    // await fetch('/api/waitlist', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(payload)
    // });

    // Simulasi respons sukses antrean
    const assignedQueue = mockEventData.queueCount + 1;
    setQueueNumber(assignedQueue);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-neutral-900 font-sans selection:bg-[#5046B8] selection:text-white flex flex-col justify-between">
      
      {/* ================= TOP NAVBAR ================= */}
      <header className="w-full bg-white border-b border-gray-200/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div
              onClick={() => navigate('/')}
              className="flex items-center gap-2 cursor-pointer select-none group"
            >
              <span className="text-lg font-black tracking-tight text-neutral-900 group-hover:text-[#5046B8] transition-colors">
                23. EVENTS
              </span>
            </div>
            <div className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gray-100 text-neutral-600 border border-gray-200/60">
              TWENTY THREE LAYERS
            </div>
          </div>

          {/* Nav Links & Profile */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/events')}
              className="text-xs font-bold text-neutral-600 hover:text-[#5046B8] uppercase tracking-wider transition-colors cursor-pointer"
            >
              KATALOG EVENT
            </button>
            <button
              onClick={() => alert('Pusat Bantuan Sistem Reservasi 23 Layers siap melayani Anda.')}
              className="text-xs font-bold text-neutral-600 hover:text-[#5046B8] uppercase tracking-wider transition-colors cursor-pointer hidden md:block"
            >
              BANTUAN
            </button>
            <button
              onClick={() => navigate('/login')}
              className="w-9 h-9 rounded-full border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-neutral-600 transition-colors shadow-sm cursor-pointer"
              title="Akun Saya"
            >
              <User className="w-4 h-4 text-neutral-700" />
            </button>
          </div>

        </div>
      </header>

      {/* ================= MAIN CONTENT WRAPPER ================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full">
        
        {/* ================= SUB-NAV: BACK & STATUS BADGE ================= */}
        <div className="flex items-center justify-between pb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-neutral-700 hover:text-[#5046B8] transition-colors cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:border-[#5046B8] transition-colors">
              <ArrowLeft className="w-3.5 h-3.5 text-neutral-700 group-hover:text-[#5046B8]" />
            </div>
            <span>KEMBALI KE DETAIL EVENT</span>
          </button>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEEDFA] text-[#5046B8] border border-indigo-100">
            <span className="w-2 h-2 rounded-full bg-[#5046B8] animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-wider">
              SISTEM ANTREAN PRIORITAS AKTIF
            </span>
          </div>
        </div>

        {/* ================= PAGE HEADER SECTION ================= */}
        <div className="pb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEEDFA] text-[#5046B8] border border-indigo-100 mb-3">
            <Ticket className="w-3.5 h-3.5 text-[#5046B8]" />
            <span className="text-[11px] font-black uppercase tracking-wider">
              KUOTA REGULER PENUH • WAITING LIST RESMI
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight leading-tight">
            Masuk Daftar Tunggu
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 mt-2 max-w-3xl leading-relaxed">
            Tiket resmi untuk kurasi ini telah terisi penuh. Daftarkan nama Anda ke sistem reservasi prioritas <strong className="text-neutral-900 font-bold">Twenty Three Layers</strong>. Notifikasi alokasi otomatis akan dikirim via email &amp; WhatsApp jika ada pembatalan rilis.
          </p>
        </div>

        {/* ================= 1. LAYOUT GRID (KIRI 7 KOLOM, KANAN 5 KOLOM) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ================= KOLOM KIRI (7 GRID): FORM DATA PEMESAN ================= */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm relative">
              
              {/* Form Card Header */}
              <div className="flex items-start justify-between pb-6 border-b border-gray-100 mb-6">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-neutral-900 tracking-tight">
                    Data Pemesan Prioritas
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Identitas akan disinkronkan langsung dengan tiket masuk digital.
                  </p>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#EEEDFA] text-[#5046B8]">
                  01 / 02
                </span>
              </div>

              {/* Form Input Container */}
              <form onSubmit={handleJoinWaitlist} className="space-y-5">
                
                {/* 1. NAMA LENGKAP */}
                <div>
                  <div className="flex items-center justify-between text-[10px] font-bold tracking-wider uppercase mb-1.5">
                    <label htmlFor="namaLengkap" className="text-neutral-700">
                      NAMA LENGKAP
                    </label>
                    <span className="text-neutral-400 font-semibold">
                      *WAJIB SESUAI ID
                    </span>
                  </div>
                  <div className="bg-[#F9FAFB] border border-gray-200/90 rounded-xl px-4 py-3 flex items-center gap-3 focus-within:border-[#5046B8] focus-within:ring-2 focus-within:ring-[#5046B8]/10 transition-all">
                    <User className="w-4 h-4 text-neutral-400 shrink-0" />
                    <input
                      id="namaLengkap"
                      type="text"
                      required
                      value={namaLengkap}
                      onChange={(e) => setNamaLengkap(e.target.value)}
                      placeholder="Contoh: Raditya Mahendra"
                      className="w-full bg-transparent text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none font-medium"
                    />
                  </div>
                </div>

                {/* 2. ALAMAT EMAIL AKTIF */}
                <div>
                  <div className="flex items-center justify-between text-[10px] font-bold tracking-wider uppercase mb-1.5">
                    <label htmlFor="email" className="text-neutral-700">
                      ALAMAT EMAIL AKTIF
                    </label>
                    <span className="text-neutral-400 font-semibold">
                      TAUTAN PEMBAYARAN DIKIRIM KE SINI
                    </span>
                  </div>
                  <div className="bg-[#F9FAFB] border border-gray-200/90 rounded-xl px-4 py-3 flex items-center gap-3 focus-within:border-[#5046B8] focus-within:ring-2 focus-within:ring-[#5046B8]/10 transition-all">
                    <Mail className="w-4 h-4 text-neutral-400 shrink-0" />
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@domain.com"
                      className="w-full bg-transparent text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none font-medium"
                    />
                  </div>
                </div>

                {/* 3. NOMOR WHATSAPP AKTIF */}
                <div>
                  <div className="flex items-center justify-between text-[10px] font-bold tracking-wider uppercase mb-1.5">
                    <label htmlFor="whatsapp" className="text-neutral-700">
                      NOMOR WHATSAPP AKTIF
                    </label>
                    <span className="text-neutral-400 font-semibold">
                      NOTIFIKASI INSTAN 15 MENIT
                    </span>
                  </div>
                  <div className="bg-[#F9FAFB] border border-gray-200/90 rounded-xl px-4 py-3 flex items-center gap-3 focus-within:border-[#5046B8] focus-within:ring-2 focus-within:ring-[#5046B8]/10 transition-all">
                    <Phone className="w-4 h-4 text-neutral-400 shrink-0" />
                    <input
                      id="whatsapp"
                      type="tel"
                      required
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="0812 3456 7890"
                      className="w-full bg-transparent text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none font-medium"
                    />
                  </div>
                </div>

                {/* 4. KATEGORI TIKET YANG DIINGINKAN (RADIO GROUP) */}
                <div>
                  <div className="flex items-center justify-between text-[10px] font-bold tracking-wider uppercase mb-2">
                    <span className="text-neutral-700">
                      KATEGORI TIKET YANG DIINGINKAN
                    </span>
                    <span className="text-[#5046B8] font-bold text-[11px] normal-case tracking-normal">
                      Fleksibel = Peluang Tertinggi
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {mockEventData.categories.map((cat) => {
                      const isSelected = kategoriTiket === cat.id;
                      return (
                        <div
                          key={cat.id}
                          onClick={() => setKategoriTiket(cat.id)}
                          className={`flex items-center justify-between p-3.5 rounded-xl transition-all cursor-pointer select-none ${
                            isSelected
                              ? 'border-2 border-[#5046B8] bg-[#F8F7FD] shadow-sm'
                              : 'border border-gray-200/90 bg-[#F9FAFB] hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 pr-1">
                            {/* Custom Radio Button */}
                            <div
                              className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all ${
                                isSelected
                                  ? 'border-2 border-[#5046B8]'
                                  : 'border border-gray-400'
                              }`}
                            >
                              {isSelected && (
                                <div className="w-2 h-2 rounded-full bg-[#5046B8]" />
                              )}
                            </div>
                            <span className="text-xs font-bold text-neutral-900 truncate">
                              {cat.name}
                            </span>
                          </div>

                          {/* Badge atau Note */}
                          {cat.badge && (
                            <span className="shrink-0 bg-[#EEEDFA] text-[#5046B8] text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-xs">
                              {cat.badge}
                            </span>
                          )}
                          {cat.note && (
                            <span className="shrink-0 text-[10px] text-neutral-500 font-medium">
                              {cat.note}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 5. JUMLAH TIKET & JENDELA PEMBAYARAN CEPAT */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  
                  {/* Counter Jumlah Tiket */}
                  <div>
                    <label className="text-[10px] font-bold text-neutral-700 tracking-wider uppercase block mb-1.5">
                      JUMLAH TIKET DIBUTUHKAN
                    </label>
                    <div className="bg-[#F9FAFB] border border-gray-200/90 rounded-xl px-4 py-2.5 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={handleDecrement}
                        disabled={jumlahTiket <= 1}
                        className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <span className="font-black text-sm text-neutral-900 select-none">
                        {jumlahTiket} Tiket
                      </span>

                      <button
                        type="button"
                        onClick={handleIncrement}
                        disabled={jumlahTiket >= 4}
                        className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Info Jendela Pembayaran Cepat */}
                  <div>
                    <label className="text-[10px] font-bold text-neutral-700 tracking-wider uppercase block mb-1.5">
                      JENDELA PEMBAYARAN CEPAT
                    </label>
                    <div className="bg-[#F9FAFB] border border-gray-200/90 rounded-xl px-4 py-3 flex items-center gap-2.5 h-[46px]">
                      <Clock className="w-4 h-4 text-[#5046B8] shrink-0" />
                      <span className="text-xs font-semibold text-neutral-700 leading-tight">
                        Batas klaim 15 menit pasca rilis
                      </span>
                    </div>
                  </div>

                </div>

                {/* 6. CHECKBOX PERSETUJUAN */}
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isAgreed}
                      onChange={(e) => setIsAgreed(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded text-[#5046B8] focus:ring-[#5046B8] border-gray-300 accent-[#5046B8] cursor-pointer"
                    />
                    <span className="text-[11px] text-neutral-600 leading-relaxed">
                      Saya menyetujui bahwa pendaftaran ini menempatkan saya di antrean resmi. Saya bersedia menerima notifikasi rilis otomatis melalui email terverifikasi dan WhatsApp dari kurator Twenty Three Layers.
                    </span>
                  </label>
                </div>

                {/* 7. TOMBOL SUBMIT */}
                <button
                  type="submit"
                  className="w-full bg-[#5046B8] hover:bg-[#4339a2] text-white py-4 px-6 rounded-xl font-black text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.99] cursor-pointer"
                >
                  <span>GABUNG DAFTAR TUNGGU SEKARANG</span>
                  <ArrowRight className="w-4 h-4 ml-0.5" />
                </button>

                {/* Catatan Kaki */}
                <p className="text-center text-[11px] text-neutral-500 font-medium">
                  Tanpa biaya muka. Pembayaran hanya dilakukan jika alokasi tiket Anda telah resmi terkonfirmasi.
                </p>

              </form>

            </div>
          </div>

          {/* ================= KOLOM KANAN (5 GRID): EVENT TERKAIT & MEKANISME ================= */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* CARD 1: EVENT TERKAIT (SOLD OUT) */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm relative overflow-hidden">
              
              {/* Card Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1.5 text-[#5046B8]">
                  <Ticket className="w-4 h-4" />
                  <span className="text-[11px] font-black uppercase tracking-wider">
                    EVENT TERKAIT
                  </span>
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-neutral-100 text-neutral-700">
                  SOLD OUT
                </span>
              </div>

              {/* Event Info & Thumbnail */}
              <div className="flex items-start gap-4">
                <img
                  src={mockEventData.imageUrl}
                  alt={mockEventData.fullTitle}
                  className="w-20 h-20 rounded-2xl object-cover shrink-0 shadow-xs border border-gray-100"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    <CheckCircle2 className="w-3 h-3 text-[#5046B8]" />
                    <span>{mockEventData.organizer}</span>
                  </div>

                  <h3 className="font-black text-sm text-neutral-900 leading-snug mt-1">
                    {mockEventData.title}
                  </h3>

                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-neutral-600">
                      <Calendar className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span className="truncate">{mockEventData.dateTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-neutral-600">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span className="truncate">{mockEventData.venue}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider Tiket Terkurasi */}
              <div className="relative flex items-center justify-center my-5">
                <div className="w-full border-t border-dashed border-gray-200" />
                <span className="absolute bg-white px-3 text-[9px] font-bold uppercase tracking-widest text-neutral-400">
                  TIKET TERKURASI
                </span>
              </div>

              {/* Box Kapasitas & Antrean */}
              <div className="bg-[#F9FAFB] rounded-2xl p-4 border border-gray-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-500 font-medium">
                    {mockEventData.capacityText}
                  </span>
                  <span className="font-black text-neutral-900">
                    {mockEventData.capacityPercentage}
                  </span>
                </div>

                {/* Progress Bar (Penuh 100%) */}
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden mt-2.5">
                  <div className="h-full bg-[#5046B8] rounded-full w-full" />
                </div>

                {/* Info Antrean & Peluang */}
                <div className="flex items-center justify-between text-xs mt-3 pt-1">
                  <div className="flex items-center gap-1.5 font-bold text-neutral-700">
                    <span className="w-2 h-2 rounded-full bg-[#5046B8]" />
                    <span>{mockEventData.queueCount} Orang Mengantre</span>
                  </div>
                  <span className="font-bold text-[#5046B8]">
                    Peluang Alokasi {mockEventData.allocationChance}
                  </span>
                </div>
              </div>

            </div>

            {/* CARD 2: MEKANISME RESERVASI 23 LAYERS */}
            <div className="bg-[#F2F0FB] rounded-3xl p-6 border border-indigo-100 shadow-sm relative">
              
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-4 h-4 text-[#5046B8]" />
                <h4 className="font-black text-xs uppercase tracking-wider text-neutral-900">
                  MEKANISME RESERVASI 23 LAYERS
                </h4>
              </div>

              {/* Steps via .map() */}
              <div className="space-y-3.5">
                {mockEventData.mechanisms.map((mech) => (
                  <div key={mech.step} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-white text-[#5046B8] font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs border border-indigo-100">
                      {mech.step}
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-neutral-900 leading-snug">
                        {mech.title}
                      </h5>
                      <p className="text-[11px] text-neutral-600 leading-relaxed mt-0.5">
                        {mech.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Bantuan */}
              <div className="mt-5 pt-4 border-t border-indigo-100 flex items-center justify-between text-xs">
                <span className="text-neutral-600 text-[11px]">
                  Perlu bantuan panitia?
                </span>
                <button
                  type="button"
                  onClick={() => alert('Layanan Helpdesk 23 Layers: support@twentythreelayers.com')}
                  className="font-black text-[11px] text-[#5046B8] hover:underline uppercase tracking-wider cursor-pointer"
                >
                  HUBUNGI HELP DESK
                </button>
              </div>

            </div>

          </div>

        </div>

      </main>

      {/* ================= BOTTOM GLOBAL FOOTER ================= */}
      <footer className="w-full bg-[#F8F9FA] border-t border-gray-200/80 py-6 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-black text-neutral-800">23.</span>
            <span>© 2026 Twenty Three Layers Inc. All Rights Reserved. Curated Cultural Ticketing.</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button onClick={() => alert('Syarat & Ketentuan Layanan')} className="hover:underline hover:text-neutral-700 cursor-pointer">
              Syarat &amp; Ketentuan
            </button>
            <span>•</span>
            <button onClick={() => alert('Kebijakan Privasi Pengguna')} className="hover:underline hover:text-neutral-700 cursor-pointer">
              Privasi
            </button>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gray-100 text-neutral-600 font-mono text-[10px] border border-gray-200">
              <ShieldCheck className="w-3 h-3 text-[#5046B8]" />
              <span>256-BIT SSL SECURED</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ================= MODAL SUKSES GABUNG DAFTAR TUNGGU ================= */}
      {isSubmitted && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 text-center shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-neutral-900">
              Anda Resmi Masuk Antrean!
            </h3>
            <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
              Pendaftaran untuk <strong>{namaLengkap}</strong> telah terdata di sistem reservasi prioritas <strong>Twenty Three Layers</strong>.
            </p>

            {/* Badge Nomor Antrean */}
            <div className="bg-[#F8F7FD] border border-indigo-100 rounded-2xl p-4 my-5">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                NOMOR ANTREAN PRIORITAS
              </span>
              <div className="text-2xl font-black text-[#5046B8] font-mono mt-1">
                #WL-{queueNumber}
              </div>
              <p className="text-[11px] text-neutral-500 mt-1">
                Kategori: <strong>{mockEventData.categories.find(c => c.id === kategoriTiket)?.name}</strong> ({jumlahTiket} Tiket)
              </p>
            </div>

            <p className="text-[11px] text-neutral-500 leading-relaxed mb-6">
              Tautan pembayaran eksklusif akan dikirimkan otomatis ke <strong>{email}</strong> dan WhatsApp <strong>{whatsapp}</strong> jika ada slot rilis tiket.
            </p>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="w-full bg-[#5046B8] hover:bg-[#4339a2] text-white py-3 rounded-full font-bold text-xs uppercase tracking-wider shadow-sm transition-colors cursor-pointer"
              >
                Lihat Detail Pendaftaran
              </button>
              <button
                type="button"
                onClick={() => navigate('/events')}
                className="w-full border border-gray-200 text-neutral-700 py-3 rounded-full font-bold text-xs uppercase tracking-wider hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                Kembali ke Katalog Event
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
