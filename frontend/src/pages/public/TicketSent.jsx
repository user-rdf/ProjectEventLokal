import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  Mail,
  RotateCw,
  ShieldCheck,
  Headphones,
  Calendar,
  MapPin,
  User,
  Ticket,
  ArrowRight,
  Info
} from 'lucide-react';

export default function TicketSent() {
  const navigate = useNavigate();
  const location = useLocation();
  const stateData = location.state || {};

  // =========================================================================
  // MOCK DATA (API-READY)
  // =========================================================================
  const mockData = {
    orderId: stateData.orderId || '#EL-TK8819',
    status: 'LUNAS & TERVERIFIKASI',
    issuedAt: stateData.issuedAt || new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) + ' WIB',
    event: {
      title: stateData.eventTitle || 'Seminar Karier Teknologi & Startup',
      tourName: 'EVENT KAMPUS RESMI',
      ticketCategory: stateData.ticketCategory || 'Reguler / Mahasiswa',
      passType: 'OFFICIAL E-PASS',
      dateTime: stateData.dateTime || 'Sabtu, 31 Okt 2026',
      doorOpen: 'Pintu Buka 1 Jam Sebelum Acara',
      venueName: stateData.venueName || 'Aula Utama Gedung Rektorat Lt. 3',
      venueAddress: 'Area Kampus Terverifikasi',
      gate: 'A',
      section: 'UTAMA',
      row: '01',
      seat: 'PASS',
      ticketId: stateData.orderId || 'TK-EL8819',
      authenticatedBy: 'AUTHENTICATED BY EVENT 2 GO',
      coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'
    },
    delivery: {
      status: 'Terkirim via Email',
      email: stateData.email || 'peserta@eventlokal.test'
    },
    buyerName: stateData.fullName || 'Peserta Terdaftar',
    guides: [
      {
        id: 1,
        title: 'Cek Kotak Masuk & Spam Email',
        desc: `Email tiket resmi dari EVENT 2 GO berisi barcode & QR Code akses telah dikirimkan ke alamat ${stateData.email || 'peserta@eventlokal.test'}.`
      },
      {
        id: 2,
        title: 'Tunjukkan QR Code Saat Registrasi',
        desc: `Tunjukkan QR Code tiket dari email kepada staf panitia di ${stateData.venueName || 'lokasi acara'} saat registrasi masuk.`
      },
      {
        id: 3,
        title: 'Syarat Identitas Peserta',
        desc: `Nama peserta terdaftar: ${stateData.fullName || 'Peserta Terdaftar'}. Bawa kartu identitas (KTM / KTP) jika diperlukan validasi saat check-in.`
      }
    ],
    payment: {
      methodBadge: stateData.total === 0 ? 'GRATIS / BEBAS BIAYA' : 'LUNAS VIA QRIS / TRANSFER',
      items: [
        {
          name: `1x Tiket ${stateData.ticketCategory || 'Reguler'}`,
          amount: stateData.total || 0,
          amountFormatted: stateData.totalFormatted || 'Rp 0'
        }
      ],
      total: stateData.total || 0,
      totalFormatted: stateData.totalFormatted || (stateData.total === 0 ? 'Gratis' : 'Rp 0'),
      refId: stateData.orderId || 'TRX-EL-8819'
    }
  };

  // State Interaksi
  const [isResending, setIsResending] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleResendEmail = () => {
    setIsResending(true);
    setTimeout(() => {
      setIsResending(false);
      showToast(`Email e-ticket berhasil dikirim ulang ke ${mockData.delivery.email}!`);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-neutral-900 font-sans selection:bg-[#5953C7] selection:text-white flex flex-col justify-between">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#27255D] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300 border border-indigo-400/30">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* ================= TOP NAVBAR ================= */}
      <header className="w-full bg-white border-b border-gray-200/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Sub-Brand */}
          <div className="flex items-center gap-3">
            <div
              onClick={() => navigate('/')}
              className="flex items-center cursor-pointer select-none group"
            >
              <img
                src="/images/Logo logo_EVENT2 GO.png"
                alt="EVENT 2 GO"
                className="h-8 w-auto object-contain group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gray-100 text-neutral-600 border border-gray-200/60">
              OFFICIAL E-TICKET
            </div>
          </div>

          {/* Nav Links & Profile */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/events')}
              className="text-xs font-bold text-neutral-600 hover:text-[#5953C7] uppercase tracking-wider transition-colors cursor-pointer"
            >
              KATALOG EVENT
            </button>
            <button
              onClick={() => showToast('Pusat Bantuan siap melayani pertanyaan tiket Anda.')}
              className="text-xs font-bold text-neutral-600 hover:text-[#5953C7] uppercase tracking-wider transition-colors cursor-pointer hidden md:block"
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

      {/* ================= MAIN CONTENT ================= */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full">
        
        {/* ================= 1. HEADER SECTION ================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-gray-200/80">
          <div>
            {/* Status & Order ID Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEEDFA] border border-indigo-100 text-[#5953C7] mb-3">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#5953C7]" />
              <span className="text-[11px] font-black tracking-wider uppercase">
                STATUS: {mockData.status}
              </span>
              <span className="text-indigo-300">•</span>
              <span className="text-[11px] font-mono font-bold text-neutral-600">
                ORDER ID {mockData.orderId}
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight leading-tight">
              Pendaftaran Berhasil!
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1.5 max-w-2xl leading-relaxed">
              Tiket resmi beserta QR Code masuk telah dikirimkan langsung ke email Anda. Tiket dapat langsung ditunjukkan melalui layar HP saat masuk acara.
            </p>
          </div>

          {/* Waktu Penerbitan Badge */}
          <div className="shrink-0">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-gray-200/80 text-neutral-600 text-xs font-medium shadow-xs">
              <Clock className="w-3.5 h-3.5 text-neutral-500" />
              <span>Diterbitkan: {mockData.issuedAt}</span>
            </div>
          </div>
        </div>

        {/* ================= 2. CONTENT SECTIONS ================= */}
        <div className="py-8 space-y-6">
          
          {/* Card 1: Status Pengiriman Email (Highlight Box) */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-indigo-100 shadow-sm relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#5953C7]/10 text-[#5953C7] flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                      {mockData.delivery.status}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-neutral-900 mt-1">
                    Tiket Dikirim ke: <span className="text-[#5953C7]">{mockData.delivery.email}</span>
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Periksa kotak masuk atau folder spam email Anda untuk mengunduh QR Code tiket resmi.
                  </p>
                </div>
              </div>

              {/* Tombol Kirim Ulang */}
              <button
                type="button"
                onClick={handleResendEmail}
                disabled={isResending}
                className="inline-flex items-center justify-center gap-2 bg-[#5953C7] hover:bg-[#473ebf] text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-sm hover:shadow active:scale-95 disabled:opacity-50 cursor-pointer self-start sm:self-auto shrink-0"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
                <span>{isResending ? 'MENGIRIM...' : 'KIRIM ULANG EMAIL'}</span>
              </button>
            </div>
          </div>

          {/* Grid: Detail Acara & Panduan Check-in */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Kolom Kiri: Rincian Acara & Peserta (7 Cols) */}
            <div className="md:col-span-7 space-y-6">
              
              {/* Box Rincian Acara */}
              <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-[#5953C7]" />
                    <h3 className="font-black text-sm text-neutral-900 tracking-tight uppercase">
                      Informasi Acara &amp; Tiket
                    </h3>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-[#EEEDFA] text-[#5953C7] px-2.5 py-0.5 rounded-full">
                    {mockData.event.ticketCategory}
                  </span>
                </div>

                <div>
                  <h4 className="text-base sm:text-lg font-black text-neutral-950 leading-snug">
                    {mockData.event.title}
                  </h4>
                  <div className="mt-3 space-y-2 text-xs text-neutral-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#5953C7] shrink-0" />
                      <span className="font-semibold text-neutral-800">{mockData.event.dateTime}</span>
                      <span className="text-neutral-400">({mockData.event.doorOpen})</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-[#5953C7] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-neutral-800 block">{mockData.event.venueName}</span>
                        <span className="text-neutral-400 text-[11px]">{mockData.event.venueAddress}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">
                      NAMA PESERTA
                    </span>
                    <span className="font-black text-neutral-900 mt-0.5 block">
                      {mockData.buyerName}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">
                      KODE TIKET RESMI
                    </span>
                    <span className="font-mono font-black text-[#5953C7] mt-0.5 block">
                      {mockData.event.ticketId}
                    </span>
                  </div>
                </div>
              </div>

              {/* Box Rincian Pembayaran */}
              <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-black text-neutral-800 tracking-wider uppercase">
                    RINGKASAN TRANSAKSI
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100">
                    {mockData.payment.methodBadge}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-neutral-600 border-b border-gray-100 pb-3">
                  {mockData.payment.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span>{item.name}</span>
                      <span className="font-mono font-bold text-neutral-800">
                        {item.amountFormatted}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 flex items-baseline justify-between">
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-neutral-900 block">
                      Total Dibayarkan
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400 block mt-0.5">
                      Ref: {mockData.payment.refId}
                    </span>
                  </div>
                  <div className="text-xl font-black text-[#5953C7] font-mono">
                    {mockData.payment.totalFormatted}
                  </div>
                </div>
              </div>

            </div>

            {/* Kolom Kanan: Panduan Masuk & Informasi Venue (5 Cols) */}
            <div className="md:col-span-5 space-y-4">
              <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black text-neutral-900 tracking-tight uppercase">
                    Panduan &amp; Prosedur Masuk
                  </h3>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-neutral-100 text-neutral-600">
                    INFO GATE
                  </span>
                </div>

                <div className="space-y-3">
                  {mockData.guides.map((item) => (
                    <div
                      key={item.id}
                      className="bg-[#F9FAFB] rounded-2xl p-4 border border-gray-100 flex items-start gap-3 hover:border-gray-200 transition-colors"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#5953C7] text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5 shadow-xs">
                        {item.id}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-neutral-900 leading-snug">
                          {item.title}
                        </h4>
                        <p className="text-[11px] sm:text-xs text-neutral-500 mt-1 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-amber-50/70 border border-amber-200/70 rounded-2xl flex items-start gap-2.5 text-[11px] text-amber-900">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    Tidak perlu mencetak tiket fisik! Cukup tunjukkan barcode dari email saat panitia melakukan scanning di pintu masuk.
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* ================= 3. FOOTER ACTION ================= */}
        <div className="mt-6 pt-6 border-t border-gray-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-neutral-600">
            <Headphones className="w-4 h-4 text-[#5953C7] shrink-0" />
            <span>Butuh bantuan terkait tiket Anda? Hubungi Layanan Bantuan EVENT 2 GO</span>
          </div>

          <button
            type="button"
            onClick={() => navigate('/events')}
            className="bg-[#5953C7] hover:bg-[#473ebf] text-white px-8 py-3.5 rounded-full font-black text-xs sm:text-sm tracking-wider uppercase transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>KEMBALI KE KATALOG EVENT</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </main>

      {/* ================= BOTTOM GLOBAL FOOTER ================= */}
      <footer className="w-full bg-[#F8F9FA] border-t border-gray-200/80 py-6 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/images/Logo logo_EVENT2 GO.png" alt="EVENT 2 GO" className="h-5 w-auto object-contain" />
            <span>© {new Date().getFullYear()} EVENT 2 GO. All Rights Reserved. Platform Pendaftaran &amp; Manajemen Event Kampus.</span>
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
              <ShieldCheck className="w-3 h-3 text-[#5953C7]" />
              <span>256-BIT SSL SECURED</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
