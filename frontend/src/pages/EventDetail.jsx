import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Share2, 
  Heart, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Ticket, 
  Info, 
  ChevronRight,
  Sparkles,
  QrCode,
  User,
  Users
} from 'lucide-react';

const EventDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [selectedTicket, setSelectedTicket] = useState('vip');
  const [ticketCount, setTicketCount] = useState(1);
  const [activeTab, setActiveTab] = useState('deskripsi');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');

  const ticketTiers = [
    {
      id: 'vip',
      name: 'VIP Soundcheck & Festival',
      type: 'Standing (Free Standing Area Depan)',
      price: 1500000,
      quota: 42,
      perks: ['Akses Soundcheck Session', 'VIP Lanyard & ID Card', 'Antrian Fast Track Khusus']
    },
    {
      id: 'cat1',
      name: 'CAT 1 - Tribun Tengah',
      type: 'Numbered Seating (Kursi Bernomor)',
      price: 850000,
      quota: 120,
      perks: ['Pandangan Panggung Terbaik', 'Free Snack Box', 'Dedicated Entrance']
    },
    {
      id: 'cat2',
      name: 'CAT 2 - Tribun Atas',
      type: 'Numbered Seating',
      price: 550000,
      quota: 250,
      perks: ['Tempat Duduk Nyaman', 'Akses Mudah ke Food Court']
    },
    {
      id: 'fest',
      name: 'Festival Reguler',
      type: 'Standing Area',
      price: 350000,
      quota: 310,
      perks: ['Akses ke Semua Booth & Merchandise']
    }
  ];

  const currentTier = ticketTiers.find(t => t.id === selectedTicket) || ticketTiers[0];
  const subtotal = currentTier.price * ticketCount;
  const tax = subtotal * 0.1;
  const adminFee = 5000;
  const grandTotal = subtotal + tax + adminFee;

  const handleCheckout = (e) => {
    e.preventDefault();
    setCheckoutSuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-neutral-900 font-sans selection:bg-[#5953C7] selection:text-white">
      
      {/* ================= HEADER NAVBAR ================= */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/events')}
              className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-600 transition-colors flex items-center gap-1.5 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Daftar Event</span>
            </button>
            <div 
              onClick={() => navigate('/events')} 
              className="flex items-center cursor-pointer group select-none ml-2"
            >
              <img 
                src="/images/Logo logo_EVENT2 GO.png" 
                alt="EVENT 2 GO" 
                className="h-8 w-auto object-contain group-hover:scale-105 transition-transform" 
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 px-3 py-2">
              <Share2 className="w-4 h-4" />
              <span>Bagikan</span>
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="bg-[#5953C7] hover:bg-[#4a44b5] text-white text-xs font-bold px-4 py-2 rounded-full shadow-sm"
            >
              Masuk
            </button>
          </div>
        </div>
      </header>

      {/* ================= BREADCRUMB ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <span className="hover:text-neutral-900 cursor-pointer" onClick={() => navigate('/')}>Beranda</span>
          <ChevronRight className="w-3 h-3" />
          <span className="hover:text-neutral-900 cursor-pointer" onClick={() => navigate('/events')}>Daftar Event</span>
          <ChevronRight className="w-3 h-3" />
          <span className="font-semibold text-neutral-900 truncate">YF Live in Jakarta GBK Stadium 2024</span>
        </div>
      </div>

      {/* ================= MAIN CONTAINER ================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Banner Hero Showcase */}
        <div className="w-full bg-[#EFC936] rounded-3xl p-8 sm:p-12 mb-8 relative overflow-hidden shadow-md">
          {/* Corner Stars */}
          <span className="absolute top-4 left-4 text-black text-2xl font-black">★</span>
          <span className="absolute top-4 right-4 text-black text-2xl font-black">★</span>
          <span className="absolute bottom-4 left-4 text-black text-2xl font-black">★</span>
          <span className="absolute bottom-4 right-4 text-black text-2xl font-black">★</span>

          <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-6 relative z-10">
            <div className="md:col-span-8 text-neutral-950">
              <div className="inline-flex items-center gap-2 bg-neutral-950 text-[#EFC936] px-3.5 py-1 rounded-full text-xs font-black tracking-wider uppercase mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>OFFICIAL STADIUM CONCERT</span>
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight uppercase leading-[0.95] mb-4">
                YF LIVE IN JAKARTA<br />GBK STADIUM 2024
              </h1>
              <p className="text-xs sm:text-sm font-medium text-neutral-800 max-w-xl leading-relaxed">
                Tur dunia spektakuler musisi papan atas dengan tata panggung 360 derajat, efek pyrotechnic kelas dunia, dan sound system stadium berstandar internasional.
              </p>
            </div>
            <div className="md:col-span-4 flex justify-start md:justify-end">
              <div className="bg-neutral-950 text-white p-6 rounded-2xl text-center shadow-xl border border-neutral-800">
                <span className="text-[10px] tracking-widest text-[#EFC936] font-extrabold uppercase block mb-1">TANGGAL KONSER</span>
                <span className="text-3xl sm:text-4xl font-black block">24.10.26</span>
                <span className="text-xs text-neutral-300 mt-1 block">Pukul 19.00 WIB</span>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout (Details on Left, Ticket Box on Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Event Details (7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Quick Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-sm flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-purple-50 text-[#5953C7]">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-neutral-400 block font-medium">Tanggal</span>
                  <span className="font-bold text-xs sm:text-sm text-neutral-950">Sabtu, 24 Okt 2026</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-sm flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-purple-50 text-[#5953C7]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-neutral-400 block font-medium">Waktu Mulai</span>
                  <span className="font-bold text-xs sm:text-sm text-neutral-950">19.00 - 23.00 WIB</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-sm flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-purple-50 text-[#5953C7]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-neutral-400 block font-medium">Lokasi</span>
                  <span className="font-bold text-xs sm:text-sm text-neutral-950">Stadion Utama GBK</span>
                </div>
              </div>
            </div>

            {/* Promotor / Organizer Box */}
            <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-neutral-950 text-[#EFC936] font-black text-xl flex items-center justify-center">
                  YF
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-sm text-neutral-950">Promotor Entertainment Asia</h4>
                    <CheckCircle2 className="w-4 h-4 text-[#5953C7]" />
                  </div>
                  <p className="text-xs text-neutral-500">Penyelenggara Resmi Terverifikasi &bull; 45 Event Sukses</p>
                </div>
              </div>
              <button className="border border-neutral-300 hover:border-neutral-900 text-xs font-bold px-4 py-1.5 rounded-full transition-colors">
                Lihat Profil
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-neutral-200 flex gap-6 text-xs sm:text-sm font-bold">
              <button 
                onClick={() => setActiveTab('deskripsi')}
                className={`pb-3 transition-colors relative ${activeTab === 'deskripsi' ? 'text-[#5953C7] border-b-2 border-[#5953C7]' : 'text-neutral-500 hover:text-neutral-900'}`}
              >
                Deskripsi Acara
              </button>
              <button 
                onClick={() => setActiveTab('rundown')}
                className={`pb-3 transition-colors relative ${activeTab === 'rundown' ? 'text-[#5953C7] border-b-2 border-[#5953C7]' : 'text-neutral-500 hover:text-neutral-900'}`}
              >
                Rundown Konser
              </button>
              <button 
                onClick={() => setActiveTab('seatplan')}
                className={`pb-3 transition-colors relative ${activeTab === 'seatplan' ? 'text-[#5953C7] border-b-2 border-[#5953C7]' : 'text-neutral-500 hover:text-neutral-900'}`}
              >
                Denah Kursi / Seatplan
              </button>
              <button 
                onClick={() => setActiveTab('ketentuan')}
                className={`pb-3 transition-colors relative ${activeTab === 'ketentuan' ? 'text-[#5953C7] border-b-2 border-[#5953C7]' : 'text-neutral-500 hover:text-neutral-900'}`}
              >
                Syarat & Ketentuan
              </button>
            </div>

            {/* Tab Content */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200/80 shadow-sm leading-relaxed text-neutral-700 text-xs sm:text-sm space-y-4">
              {activeTab === 'deskripsi' && (
                <>
                  <h3 className="font-black text-lg text-neutral-950 mb-2">Tentang Konser Spektakuler YF 2024</h3>
                  <p>
                    Bersiaplah untuk malam paling bersejarah di industri musik tanah air! Konser <strong>YF LIVE IN JAKARTA 24.10.26</strong> di Stadion Utama Gelora Bung Karno akan menyuguhkan penampilan selama 3 jam tanpa henti dengan kolaborasi musisi tamu kejutan dan produksi panggung terbesar sepanjang tahun.
                  </p>
                  <p>
                    Setiap pemegang tiket mendapatkan gelang interaktif LED synchronizer yang akan menyala serempak sepanjang pertunjukan, menciptakan lautan cahaya spektakuler di dalam stadion GBK.
                  </p>
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-900 mt-4 flex items-start gap-3">
                    <Info className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
                    <div>
                      <span className="font-bold block">Pemberitahuan Masuk Pintu Gerbang</span>
                      <span>Gate stadion akan dibuka mulai pukul 15.00 WIB. Disarankan datang lebih awal untuk penukaran wristband dan pemeriksaan tas.</span>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'rundown' && (
                <div className="space-y-3">
                  <h3 className="font-black text-lg text-neutral-950 mb-4">Jadwal Rundown Acara</h3>
                  <div className="border-l-2 border-[#5953C7] pl-4 space-y-4">
                    <div>
                      <span className="text-xs font-black text-[#5953C7]">13.00 - 16.00 WIB</span>
                      <h5 className="font-bold text-neutral-900">Penukaran E-Voucher ke Wristband & Soundcheck VIP</h5>
                      <p className="text-xs text-neutral-500">Khusus pemegang tiket VIP Soundcheck</p>
                    </div>
                    <div>
                      <span className="text-xs font-black text-[#5953C7]">16.00 WIB</span>
                      <h5 className="font-bold text-neutral-900">Open Gate Semua Kategori</h5>
                      <p className="text-xs text-neutral-500">Pintu masuk Tribun & Festival dibuka</p>
                    </div>
                    <div>
                      <span className="text-xs font-black text-[#5953C7]">18.30 WIB</span>
                      <h5 className="font-bold text-neutral-900">Opening Act Special Guest</h5>
                      <p className="text-xs text-neutral-500">Pertunjukan pembuka oleh artis kolaborator</p>
                    </div>
                    <div>
                      <span className="text-xs font-black text-[#5953C7]">19.30 - 23.00 WIB</span>
                      <h5 className="font-bold text-neutral-900">Main Show: YF Live in Concert</h5>
                      <p className="text-xs text-neutral-500">Pertunjukan 30+ lagu hits & fireworks finale</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'seatplan' && (
                <div>
                  <h3 className="font-black text-lg text-neutral-950 mb-4">Denah Panggung & Kategori Kursi</h3>
                  <div className="bg-neutral-900 text-white rounded-xl p-8 flex flex-col items-center justify-center text-center">
                    <div className="w-48 py-3 bg-[#EFC936] text-black font-black text-xs uppercase tracking-widest rounded-lg mb-8 shadow-md">
                      PANGGUNG UTAMA (STAGE)
                    </div>
                    <div className="w-full max-w-md grid grid-cols-2 gap-3 mb-6">
                      <div className="p-4 bg-purple-600 rounded-lg text-xs font-bold text-white shadow">
                        VIP FESTIVAL LEFT
                      </div>
                      <div className="p-4 bg-purple-600 rounded-lg text-xs font-bold text-white shadow">
                        VIP FESTIVAL RIGHT
                      </div>
                    </div>
                    <div className="w-full max-w-lg p-4 bg-blue-600 rounded-lg text-xs font-bold text-white mb-4 shadow">
                      FESTIVAL REGULER STANDING
                    </div>
                    <div className="w-full max-w-xl p-4 bg-emerald-600 rounded-lg text-xs font-bold text-white shadow">
                      CAT 1 TRIBUN (BERNOMOR) & CAT 2 TRIBUN ATAS
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'ketentuan' && (
                <div className="space-y-3">
                  <h3 className="font-black text-lg text-neutral-950 mb-2">Syarat & Ketentuan Pembelian Tiket</h3>
                  <ul className="list-disc pl-5 space-y-2 text-xs text-neutral-600">
                    <li>1 identitas (KTP/SIM/Paspor) maksimal dapat membeli 4 tiket.</li>
                    <li>E-Tiket resmi dengan QR Code akan dikirim langsung ke alamat email pemesan setelah pembayaran terverifikasi.</li>
                    <li>Tiket yang sudah dibeli bersifat non-refundable (tidak dapat dikembalikan) kecuali ada pembatalan resmi dari promotor.</li>
                    <li>Dilarang membawa senjata tajam, kamera profesional (DSLR/Mirrorless), serta makanan dan minuman dari luar.</li>
                  </ul>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Ticket Booking Checkout Box (5 Cols) */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-lg p-6 sm:p-8">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-6">
                <div>
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">PILIH TIKET</span>
                  <h3 className="font-black text-xl text-neutral-950">Kategori Tiket</h3>
                </div>
                <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Tersedia
                </span>
              </div>

              {/* Ticket Tier Radio Options */}
              <div className="space-y-3 mb-6">
                {ticketTiers.map((tier) => (
                  <div 
                    key={tier.id}
                    onClick={() => setSelectedTicket(tier.id)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      selectedTicket === tier.id 
                        ? 'border-[#5953C7] bg-purple-50/40 shadow-sm' 
                        : 'border-neutral-200 hover:border-neutral-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <h4 className="font-bold text-sm text-neutral-950">{tier.name}</h4>
                        <p className="text-[11px] text-neutral-500">{tier.type}</p>
                      </div>
                      <span className="font-black text-sm text-[#5953C7]">
                        Rp {tier.price.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="mt-2.5 pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px]">
                      <span className="text-neutral-400">Sisa kuota: {tier.quota} tiket</span>
                      <span className="font-bold text-neutral-700">{tier.perks[0]}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quantity Counter */}
              <div className="flex items-center justify-between py-4 border-t border-b border-neutral-100 mb-6">
                <div>
                  <span className="font-bold text-xs text-neutral-900 block">Jumlah Tiket</span>
                  <span className="text-[11px] text-neutral-400">Maksimal 4 tiket per akun</span>
                </div>
                <div className="flex items-center gap-3 bg-neutral-100 rounded-full p-1">
                  <button 
                    onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                    className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-neutral-800 hover:bg-neutral-200 transition-colors"
                  >
                    -
                  </button>
                  <span className="font-black text-sm w-4 text-center">{ticketCount}</span>
                  <button 
                    onClick={() => setTicketCount(Math.min(4, ticketCount + 1))}
                    className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-neutral-800 hover:bg-neutral-200 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Price Calculation Summary */}
              <div className="space-y-2 text-xs text-neutral-600 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal ({ticketCount}x tiket)</span>
                  <span className="font-semibold text-neutral-900">Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pajak Hiburan & Pemda (10%)</span>
                  <span className="font-semibold text-neutral-900">Rp {tax.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Biaya Layanan & E-Tiket</span>
                  <span className="font-semibold text-neutral-900">Rp {adminFee.toLocaleString('id-ID')}</span>
                </div>
                <div className="pt-3 border-t border-neutral-200 flex justify-between items-center text-sm font-black text-neutral-950">
                  <span>Total Pembayaran</span>
                  <span className="text-[#5953C7] text-lg">Rp {grandTotal.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button 
                onClick={() => navigate('/checkout')}
                className="w-full bg-[#5953C7] hover:bg-[#4a44b5] text-white py-3.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Ticket className="w-4 h-4" />
                <span>Beli Tiket Sekarang</span>
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-neutral-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Transaksi aman dengan enkripsi bank berstandar OJK</span>
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* ================= MODAL CHECKOUT & INSTANT E-TICKET ================= */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            {!checkoutSuccess ? (
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-6">
                  <div>
                    <h3 className="font-black text-lg text-neutral-950">Konfirmasi Pemesanan</h3>
                    <p className="text-xs text-neutral-500">Tiket akan langsung dikirimkan ke email Anda</p>
                  </div>
                  <button 
                    onClick={() => setShowCheckoutModal(false)}
                    className="text-neutral-400 hover:text-neutral-900 font-bold p-1"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleCheckout} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1.5">Nama Lengkap Sesuai KTP</label>
                    <input 
                      type="text" 
                      required 
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      placeholder="Masukkan nama lengkap"
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-[#5953C7]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1.5">Alamat Email Penerima E-Ticket</label>
                    <input 
                      type="email" 
                      required 
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      placeholder="contoh: nama@email.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-[#5953C7]"
                    />
                  </div>

                  <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100 space-y-1.5 text-xs text-neutral-700">
                    <div className="flex justify-between font-bold text-neutral-900">
                      <span>{currentTier.name} ({ticketCount}x)</span>
                      <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-neutral-500">
                      <span>Total Biaya (Termasuk Pajak & Fee)</span>
                      <span className="font-bold text-[#5953C7]">Rp {grandTotal.toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button 
                      type="submit"
                      className="w-full bg-[#5953C7] hover:bg-[#4a44b5] text-white py-3 rounded-full font-bold text-xs uppercase tracking-wider shadow-md transition-all"
                    >
                      Bayar Sekarang &rarr;
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="text-center py-4 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-black text-xl text-neutral-950">Pembayaran Berhasil!</h3>
                <p className="text-xs text-neutral-600 max-w-sm mx-auto">
                  Selamat, tiket resmi konser <strong>YF LIVE IN JAKARTA</strong> telah diterbitkan dan dikirimkan ke <strong>{buyerEmail || 'email Anda'}</strong>.
                </p>

                {/* Virtual E-Ticket Preview Card */}
                <div className="bg-neutral-900 text-white rounded-2xl p-5 text-left border-2 border-[#EFC936] my-4 shadow-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                    <span className="font-black text-xs text-[#EFC936] tracking-wider uppercase">EVENTR E-PASS</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold">TERKONFIRMASI</span>
                  </div>
                  <div className="py-3">
                    <h4 className="font-black text-sm text-white">YF LIVE IN JAKARTA 24.10.26</h4>
                    <p className="text-[11px] text-neutral-400">Atas Nama: {buyerName || 'Pengunjung Resmi'}</p>
                    <p className="text-[11px] text-[#EFC936] font-bold mt-1">Kategori: {currentTier.name} ({ticketCount} Tiket)</p>
                  </div>
                  <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
                    <QrCode className="w-10 h-10 text-white" />
                    <span className="font-mono text-[10px] text-neutral-400 tracking-widest">EVT-2410-GBK-9982</span>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setShowCheckoutModal(false);
                    setCheckoutSuccess(false);
                  }}
                  className="bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs px-6 py-2.5 rounded-full"
                >
                  Tutup & Selesai
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default EventDetail;