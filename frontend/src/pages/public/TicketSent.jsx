import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  QrCode,
  Download,
  Mail,
  RotateCw,
  Eye,
  ShieldCheck,
  Headphones,
  Check,
  X,
  ExternalLink,
  Calendar,
  MapPin,
  Sparkles,
  User
} from 'lucide-react';

export default function TicketSent() {
  const navigate = useNavigate();
  const location = useLocation();
  const stateData = location.state || {};

  // =========================================================================
  // MOCK DATA (API-READY: Mudah dihubungkan dengan API response backend)
  // =========================================================================
  const mockData = {
    orderId: stateData.orderId || '#23L-YF26-8819',
    status: 'LUNAS & TERVERIFIKASI',
    issuedAt: stateData.issuedAt || '24 Mei 2026 • 14:32:08 WIB',
    event: {
      title: stateData.eventTitle || 'YF LIVE IN JAKARTA — GBK STADIUM 2026',
      tourName: 'WORLD TOUR 2026',
      ticketCategory: stateData.ticketCategory || 'VIP SOUNDCHECK',
      passType: 'OFFICIAL E-PASS',
      dateTime: 'Sabtu, 24 Okt 2026',
      doorOpen: 'Pintu Buka 16:00 WIB',
      venueName: 'GBK Main Stadium',
      venueAddress: 'Senayan, Jakarta Pusat',
      gate: 'B',
      section: '01',
      row: '04',
      seat: '28',
      ticketId: '23L-YF26-8819-VIPS',
      authenticatedBy: 'AUTHENTICATED BY EVENT2 GO',
      coverImage: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=800&q=80'
    },
    delivery: {
      status: 'Terkirim (14:32 WIB)',
      email: stateData.email || 'raditya.mahendra@gmail.com'
    },
    guides: [
      {
        id: 1,
        title: 'Check-in Mandiri & Penukaran Wristband',
        desc: 'Pemegang tiket VIP Soundcheck berhak masuk lebih awal. Penukaran wristband dibuka pukul 15.00 WIB di Gate B sebelum sesi soundcheck resmi dimulai pukul 16.30 WIB.'
      },
      {
        id: 2,
        title: 'Folder Spam atau Promosi',
        desc: 'Jika email tiket belum masuk dalam kurun 5 menit, periksa folder Spam atau Tab Promosi pada Gmail/email Anda, lalu tandai email dari Twenty Three Layers sebagai "Bukan Spam".'
      },
      {
        id: 3,
        title: 'Syarat Identitas Masuk Venue',
        desc: 'Wajib membawa kartu identitas fisik resmi (KTP / SIM / Paspor) yang namanya sesuai dengan pemesan tertera: Raditya Mahendra.'
      }
    ],
    payment: {
      methodBadge: 'LUNAS VIA QRIS INSTAN',
      items: [
        {
          name: '1x VIP Soundcheck & Festival (Seat Row 04 / 28)',
          amount: 1500000,
          amountFormatted: 'Rp 1.500.000'
        },
        {
          name: 'Biaya Layanan Platform & Penerbitan Digital',
          amount: 25000,
          amountFormatted: 'Rp 25.000'
        },
        {
          name: 'Pajak Hiburan Daerah (10%)',
          amount: 150000,
          amountFormatted: 'Rp 150.000'
        }
      ],
      total: stateData.total || 1675000,
      totalFormatted: stateData.totalFormatted || 'Rp 1.675.000',
      refId: 'QRIS-881923-JKT'
    }
  };

  // State Interaksi
  const [isResending, setIsResending] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [showEmailPreview, setShowEmailPreview] = useState(false);

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

  const handleDownloadPDF = () => {
    showToast('Mengunduh Official PDF E-Ticket...');
    // Simulasi download
    setTimeout(() => {
      const element = document.createElement('a');
      const file = new Blob([`E-Ticket: ${mockData.event.title}\nID: ${mockData.event.ticketId}\nOrder: ${mockData.orderId}\nNama: Raditya Mahendra`], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `E-Ticket-${mockData.orderId.replace('#', '')}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-neutral-900 font-sans selection:bg-[#5046B8] selection:text-white flex flex-col justify-between">
      
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
              onClick={() => showToast('Pusat Bantuan VIP 24/7 siap melayani pertanyaan tiket Anda.')}
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

      {/* ================= MAIN CONTENT ================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex-1 w-full">
        
        {/* ================= 1. HEADER SECTION ================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8">
          <div>
            {/* Status & Order ID Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEEDFA] border border-indigo-100 text-[#4338CA] mb-3">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#4338CA]" />
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
              Tiket Terkonfirmasi
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1.5 max-w-2xl leading-relaxed">
              Tiket resmi &amp; akses barcode Anda telah diterbitkan dan dikirimkan ke email terdaftar. Simpan tiket fisik digital Anda di bawah.
            </p>
          </div>

          {/* Waktu Penerbitan Badge */}
          <div className="shrink-0">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F3F4F6] border border-gray-200/80 text-neutral-600 text-xs font-medium">
              <Clock className="w-3.5 h-3.5 text-neutral-500" />
              <span>Diterbitkan: {mockData.issuedAt}</span>
            </div>
          </div>
        </div>

        {/* ================= 2. LAYOUT GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ================= KOLOM KIRI (5 GRID): KARTU E-TICKET ================= */}
          <div className="lg:col-span-5 flex flex-col">
            
            {/* Card E-Ticket */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200/80 overflow-hidden relative">
              
              {/* Top Section (Dark Header with Concert Photo) */}
              <div className="relative bg-[#111319] text-white p-6 pt-5 overflow-hidden">
                {/* Background Image with Dark Gradient Overlay */}
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity"
                  style={{ backgroundImage: `url(${mockData.event.coverImage})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111319] via-[#111319]/80 to-transparent" />

                {/* Content Overlay */}
                <div className="relative z-10">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-6">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/10 backdrop-blur-md text-white/90 border border-white/20">
                      {mockData.event.passType}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#EEEDFA] text-[#4338CA] shadow-sm">
                      {mockData.event.ticketCategory}
                    </span>
                  </div>

                  {/* World Tour Label & Title */}
                  <div className="text-[10px] font-bold tracking-widest uppercase text-white/70 mb-1">
                    {mockData.event.tourName}
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-white leading-tight tracking-tight">
                    {mockData.event.title}
                  </h2>
                </div>
              </div>

              {/* Middle Section: Waktu & Lokasi */}
              <div className="p-6">
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Waktu & Tanggal */}
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 tracking-wider uppercase block">
                      WAKTU &amp; TANGGAL
                    </span>
                    <p className="text-sm font-extrabold text-neutral-900 mt-1">
                      {mockData.event.dateTime}
                    </p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {mockData.event.doorOpen}
                    </p>
                  </div>

                  {/* Lokasi Venue */}
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 tracking-wider uppercase block">
                      LOKASI VENUE
                    </span>
                    <p className="text-sm font-extrabold text-neutral-900 mt-1">
                      {mockData.event.venueName}
                    </p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {mockData.event.venueAddress}
                    </p>
                  </div>
                </div>

                {/* Box Detail Gate, Section, Row, Seat */}
                <div className="bg-[#F8F7FD] rounded-xl p-3.5 border border-indigo-100/70 mt-5">
                  <div className="grid grid-cols-4 text-center divide-x divide-indigo-100">
                    <div>
                      <span className="text-[9px] font-bold text-neutral-400 tracking-wider uppercase block">
                        GATE
                      </span>
                      <span className="text-sm font-black text-[#4338CA] block mt-0.5">
                        {mockData.event.gate}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-neutral-400 tracking-wider uppercase block">
                        SECTION
                      </span>
                      <span className="text-sm font-black text-neutral-900 block mt-0.5">
                        {mockData.event.section}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-neutral-400 tracking-wider uppercase block">
                        ROW
                      </span>
                      <span className="text-sm font-black text-neutral-900 block mt-0.5">
                        {mockData.event.row}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-neutral-400 tracking-wider uppercase block">
                        SEAT
                      </span>
                      <span className="text-sm font-black text-[#4338CA] block mt-0.5">
                        {mockData.event.seat}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Perforation Line with Side Notches */}
              <div className="relative flex items-center justify-between my-1">
                {/* Left Notch */}
                <div className="w-5 h-8 bg-[#F8F9FA] rounded-r-full border-r border-t border-b border-gray-200/80 -ml-0.5 shadow-inner" />
                
                {/* Dashed Cut Line */}
                <div className="flex-1 border-b-2 border-dashed border-gray-200 mx-2" />

                {/* Right Notch */}
                <div className="w-5 h-8 bg-[#F8F9FA] rounded-l-full border-l border-t border-b border-gray-200/80 -mr-0.5 shadow-inner" />
              </div>

              {/* Bottom Section: QR Code, Ticket ID & Authenticated Badge */}
              <div className="p-6 pt-4 flex flex-col items-center justify-center text-center">
                
                {/* QR Code Container */}
                <div className="p-3 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center">
                  <QrCode className="w-36 h-36 sm:w-40 sm:h-40 text-neutral-900 stroke-[1.5]" />
                </div>

                {/* Ticket ID */}
                <div className="mt-3.5 font-mono text-xs font-bold tracking-widest text-neutral-700">
                  {mockData.event.ticketId}
                </div>

                {/* Authenticated Pill */}
                <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEEDFA] text-[#4338CA] border border-indigo-100 text-[10px] font-black uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{mockData.event.authenticatedBy}</span>
                </div>

              </div>

            </div>

            {/* Tombol Luar: Unduh PDF E-Ticket */}
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="mt-4 w-full bg-[#F4F4F8] hover:bg-[#EAEAF2] text-neutral-800 py-3.5 px-5 rounded-full font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 border border-gray-200/70 shadow-sm transition-all active:scale-[0.99] cursor-pointer"
            >
              <Download className="w-4 h-4 text-neutral-600" />
              <span>UNDUH PDF E-TICKET RESMI</span>
            </button>

          </div>

          {/* ================= KOLOM KANAN (7 GRID): TIGA CARD INFORMASI ================= */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Card 1: Status Pengiriman Email */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EEEDFA] text-[#4338CA] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 tracking-wider uppercase block">
                      STATUS PENGIRIMAN TIKET
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <h3 className="font-black text-sm text-neutral-900">
                        {mockData.delivery.status}
                      </h3>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Tombol Kirim Ulang */}
                <button
                  type="button"
                  onClick={handleResendEmail}
                  disabled={isResending}
                  className="inline-flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-neutral-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer self-start sm:self-auto"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
                  <span>{isResending ? 'MENGIRIM...' : 'KIRIM ULANG'}</span>
                </button>
              </div>

              {/* Bottom Info: Email & Preview Button */}
              <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs text-neutral-500 block">
                    Alamat email penerima voucher:
                  </span>
                  <span className="text-sm font-bold text-[#4338CA]">
                    {mockData.delivery.email}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowEmailPreview(true)}
                  className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-neutral-700 hover:text-[#4338CA] uppercase tracking-wider transition-colors cursor-pointer self-start sm:self-auto"
                >
                  <Eye className="w-4 h-4 text-neutral-500" />
                  <span>PREVIEW TAMPILAN EMAIL</span>
                </button>
              </div>
            </div>

            {/* Card 2: Panduan Masuk & Informasi Venue */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-black text-neutral-900 tracking-tight">
                  Panduan Masuk &amp; Informasi Venue
                </h3>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#EEEDFA] text-[#4338CA]">
                  PROSEDUR GATE
                </span>
              </div>

              {/* List 3 Langkah Menggunakan .map() */}
              <div className="space-y-3">
                {mockData.guides.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#F9FAFB] rounded-2xl p-4 border border-gray-100 flex items-start gap-3.5 hover:border-gray-200 transition-colors"
                  >
                    {/* Dark Circle Number */}
                    <div className="w-6 h-6 rounded-full bg-[#27255D] text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                      {item.id}
                    </div>
                    {/* Text Details */}
                    <div>
                      <h4 className="font-bold text-sm text-neutral-900 leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 3: Ringkasan Pembayaran Lunas */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black text-neutral-800 tracking-wider uppercase">
                  RINGKASAN PEMBAYARAN LUNAS
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100">
                  {mockData.payment.methodBadge}
                </span>
              </div>

              {/* Rincian Harga via .map() */}
              <div className="space-y-2.5 text-xs text-neutral-600 border-b border-gray-100 pb-4">
                {mockData.payment.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span>{item.name}</span>
                    <span className="font-mono font-bold text-neutral-800">
                      {item.amountFormatted}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total Row */}
              <div className="pt-4 flex items-baseline justify-between">
                <div>
                  <span className="font-bold text-sm text-neutral-900 block">
                    Total Transaksi Dibayarkan
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-xl sm:text-2xl font-black text-[#4338CA] font-mono leading-none">
                    {mockData.payment.totalFormatted}
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400 mt-1 block">
                    ID Ref: {mockData.payment.refId}
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* ================= 5. FOOTER ACTION ================= */}
        <div className="mt-8 pt-6 border-t border-gray-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-neutral-600">
            <Headphones className="w-4 h-4 text-[#4338CA] shrink-0" />
            <span>Butuh bantuan terkait tiket Anda? Hubungi Layanan VIP 23 Layers</span>
          </div>

          <button
            type="button"
            onClick={() => navigate('/events')}
            className="bg-[#3D32A0] hover:bg-[#322886] text-white px-8 py-3.5 rounded-xl font-black text-xs sm:text-sm tracking-wider uppercase transition-all shadow-md hover:shadow-lg active:scale-[0.99] cursor-pointer"
          >
            SELESAI
          </button>
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

      {/* ================= MODAL PREVIEW TAMPILAN EMAIL ================= */}
      {showEmailPreview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 relative shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#4338CA]" />
                <h3 className="font-black text-base text-neutral-900">
                  Preview Email: Tiket Terkonfirmasi
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowEmailPreview(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Email Meta Info */}
            <div className="bg-gray-50 rounded-xl p-3 text-xs text-neutral-600 space-y-1 my-4">
              <p><strong>Dari:</strong> ticketing@twentythreelayers.com (Twenty Three Layers)</p>
              <p><strong>Kepada:</strong> {mockData.delivery.email}</p>
              <p><strong>Subjek:</strong> [CONFIRMED] Official E-Pass {mockData.event.title} - Order {mockData.orderId}</p>
            </div>

            {/* Email Body Preview */}
            <div className="border border-gray-200 rounded-2xl p-5 text-neutral-800 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b pb-3">
                <span className="font-black text-sm tracking-tight text-[#4338CA]">23. EVENTS</span>
                <span className="text-[10px] font-mono text-neutral-500">{mockData.issuedAt}</span>
              </div>
              <p className="font-bold text-sm">Halo Raditya Mahendra,</p>
              <p className="leading-relaxed">
                Terima kasih telah melakukan pembelian tiket resmi di platform kami. Pembayaran Anda telah terverifikasi via QRIS dan tiket Anda telah aktif.
              </p>
              <div className="bg-[#F8F7FD] p-3 rounded-xl border border-indigo-100">
                <p className="font-black text-neutral-900">{mockData.event.title}</p>
                <p className="text-neutral-600 mt-1">{mockData.event.dateTime} • {mockData.event.venueName}</p>
                <p className="text-[#4338CA] font-bold mt-1">Kategori: {mockData.event.ticketCategory} (Gate {mockData.event.gate}, Row {mockData.event.row}, Seat {mockData.event.seat})</p>
              </div>
              <p className="text-neutral-500 text-[11px]">
                Silakan simpan barcode tiket yang terlampir pada attachment email ini atau akses langsung melalui aplikasi kami saat memasuki venue.
              </p>
            </div>

            {/* Modal Close Button */}
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setShowEmailPreview(false)}
                className="bg-neutral-900 hover:bg-neutral-800 text-white px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Tutup Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
