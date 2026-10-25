import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Ticket, 
  Info, 
  ChevronRight,
  Sparkles,
  Users
} from 'lucide-react';
import { getEvent } from '../api/events';
import { formatDateTime } from '../utils/format';

const EventDetail = () => {
  const navigate = useNavigate();
  const { id, slug } = useParams();
  const eventSlug = slug || id;

  const [backendEvent, setBackendEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTicket, setSelectedTicket] = useState('');
  const [ticketCount, setTicketCount] = useState(1);
  const [activeTab, setActiveTab] = useState('deskripsi');

  useEffect(() => {
    if (!eventSlug) {
      setLoading(false);
      setError('Event tidak ditemukan');
      return;
    }
    let isMounted = true;
    setLoading(true);
    getEvent(eventSlug)
      .then((data) => {
        if (!isMounted) return;
        setBackendEvent(data);
        if (data?.ticket_types?.length > 0) {
          setSelectedTicket(data.ticket_types[0].id);
        }
      })
      .catch((err) => {
        if (isMounted) setError(err.message || 'Gagal memuat detail event');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, [eventSlug]);

  const ticketTiers = backendEvent?.ticket_types?.length > 0
    ? backendEvent.ticket_types.map((tt) => ({
        id: tt.id,
        name: tt.name,
        type: tt.price_idr === 0 ? 'Tiket Gratis' : 'Tiket Berbayar',
        price: tt.price_idr,
        quota: tt.remaining ?? (tt.quota - tt.sold),
        sold: tt.sold,
        perks: [
          (tt.remaining ?? (tt.quota - tt.sold)) === 0
            ? 'Kuota tiket habis (Daftar Tunggu)'
            : `Tersedia sisa ${tt.remaining ?? (tt.quota - tt.sold)} kursi`,
          'E-Tiket dengan QR Code resmi dikirim ke email'
        ]
      }))
    : [];

  const currentTier = ticketTiers.find((t) => t.id === selectedTicket) || ticketTiers[0] || null;
  const subtotal = (currentTier?.price || 0) * ticketCount;
  const adminFee = currentTier?.price > 0 ? 5000 : 0;
  const grandTotal = subtotal + adminFee;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-6 text-center font-sans">
        <div>
          <div className="w-10 h-10 border-4 border-[#5953C7] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-bold text-neutral-700">Memuat informasi event dari database...</p>
        </div>
      </div>
    );
  }

  if (error || !backendEvent) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-6 text-center font-sans">
        <div className="max-w-md bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm">
          <Info className="w-12 h-12 text-amber-500 mx-auto mb-3" />
          <h2 className="text-xl font-black text-neutral-900 mb-2">Event Tidak Ditemukan</h2>
          <p className="text-xs text-neutral-500 mb-6">
            Event yang Anda cari tidak tersedia atau belum dipublikasikan oleh panitia.
          </p>
          <button
            onClick={() => navigate('/events')}
            className="w-full bg-[#5953C7] text-white py-3 rounded-full font-bold text-xs uppercase tracking-wider hover:bg-[#483ec7]"
          >
            Kembali ke Katalog Event
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-neutral-900 font-sans selection:bg-[#5953C7] selection:text-white">
      
      {/* ================= HEADER NAVBAR ================= */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/events')}
              className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-600 transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Katalog</span>
            </button>
            <div 
              onClick={() => navigate('/')} 
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
            <button 
              onClick={() => navigate('/login')}
              className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold px-4 py-2 rounded-full transition-all"
            >
              Portal Panitia
            </button>
          </div>
        </div>
      </header>

      {/* ================= BREADCRUMBS ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <span className="hover:text-neutral-900 cursor-pointer" onClick={() => navigate('/')}>Beranda</span>
          <ChevronRight className="w-3 h-3" />
          <span className="hover:text-neutral-900 cursor-pointer" onClick={() => navigate('/events')}>Daftar Event</span>
          <ChevronRight className="w-3 h-3" />
          <span className="font-semibold text-neutral-900 truncate">
            {backendEvent.title}
          </span>
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
                <span>KATEGORI: {backendEvent.category?.toUpperCase()}</span>
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight uppercase leading-[0.98] mb-4">
                {backendEvent.title}
              </h1>
              <p className="text-xs sm:text-sm font-medium text-neutral-800 max-w-xl leading-relaxed">
                {backendEvent.description}
              </p>
            </div>
            <div className="md:col-span-4 flex justify-start md:justify-end">
              <div className="bg-neutral-950 text-white p-6 rounded-2xl text-center shadow-xl border border-neutral-800">
                <span className="text-[10px] tracking-widest text-[#EFC936] font-extrabold uppercase block mb-1">JADWAL PELAKSANAAN</span>
                <span className="text-2xl sm:text-3xl font-black block">
                  {new Date(backendEvent.starts_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                </span>
                <span className="text-xs text-neutral-300 mt-1 block">
                  Pukul {new Date(backendEvent.starts_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                </span>
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
                  <span className="text-[11px] text-neutral-400 block font-medium">Mulai</span>
                  <span className="font-bold text-xs sm:text-sm text-neutral-950">
                    {formatDateTime(backendEvent.starts_at)}
                  </span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-sm flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-purple-50 text-[#5953C7]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-neutral-400 block font-medium">Selesai</span>
                  <span className="font-bold text-xs sm:text-sm text-neutral-950">
                    {formatDateTime(backendEvent.ends_at)}
                  </span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-sm flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-purple-50 text-[#5953C7]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-neutral-400 block font-medium">Lokasi Venue</span>
                  <span className="font-bold text-xs sm:text-sm text-neutral-950">
                    {backendEvent.venue}
                  </span>
                </div>
              </div>
            </div>

            {/* Promotor / Organizer Box */}
            <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-neutral-950 text-[#EFC936] font-black text-xs flex items-center justify-center tracking-tighter">
                  E2G
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-sm text-neutral-950">Panitia Resmi EVENT 2 GO</h4>
                    <CheckCircle2 className="w-4 h-4 text-[#5953C7]" />
                  </div>
                  <p className="text-xs text-neutral-500">Penyelenggara Terverifikasi &bull; Proteksi Tiket Digital Resmi</p>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-neutral-200 flex gap-6 text-xs sm:text-sm font-bold">
              <button 
                onClick={() => setActiveTab('deskripsi')}
                className={`pb-3 transition-colors relative cursor-pointer ${activeTab === 'deskripsi' ? 'text-[#5953C7] border-b-2 border-[#5953C7]' : 'text-neutral-500 hover:text-neutral-900'}`}
              >
                Deskripsi Acara
              </button>
              <button 
                onClick={() => setActiveTab('rundown')}
                className={`pb-3 transition-colors relative cursor-pointer ${activeTab === 'rundown' ? 'text-[#5953C7] border-b-2 border-[#5953C7]' : 'text-neutral-500 hover:text-neutral-900'}`}
              >
                Jadwal & Agenda
              </button>
              <button 
                onClick={() => setActiveTab('ketentuan')}
                className={`pb-3 transition-colors relative cursor-pointer ${activeTab === 'ketentuan' ? 'text-[#5953C7] border-b-2 border-[#5953C7]' : 'text-neutral-500 hover:text-neutral-900'}`}
              >
                Syarat & Ketentuan
              </button>
            </div>

            {/* Tab Content */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200/80 shadow-sm leading-relaxed text-neutral-700 text-xs sm:text-sm space-y-4">
              {activeTab === 'deskripsi' && (
                <>
                  <h3 className="font-black text-lg text-neutral-950 mb-2">Tentang {backendEvent.title}</h3>
                  <p className="text-neutral-700 leading-relaxed">
                    {backendEvent.description}
                  </p>
                  <div className="bg-purple-50 border border-purple-200 p-4 rounded-xl text-purple-950 mt-4 flex items-start gap-3">
                    <Info className="w-5 h-5 shrink-0 text-[#5953C7] mt-0.5" />
                    <div>
                      <span className="font-bold block">Pemberitahuan Masuk Lokasi</span>
                      <span>Gate check-in dibuka 1 jam sebelum jadwal mulai. Tunjukkan QR Code e-tiket yang dikirim ke email kepada staf scanner panitia.</span>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'rundown' && (
                <div className="space-y-3">
                  <h3 className="font-black text-lg text-neutral-950 mb-4">Perkiraan Susunan Agenda</h3>
                  <div className="border-l-2 border-[#5953C7] pl-4 space-y-4">
                    <div>
                      <span className="text-xs font-black text-[#5953C7]">1 Jam Sebelum Mulai</span>
                      <h5 className="font-bold text-neutral-900">Open Gate & Scan QR E-Tiket</h5>
                      <p className="text-xs text-neutral-500">Registrasi kehadiran dan verifikasi tiket di {backendEvent.venue}</p>
                    </div>
                    <div>
                      <span className="text-xs font-black text-[#5953C7]">
                        {new Date(backendEvent.starts_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                      </span>
                      <h5 className="font-bold text-neutral-900">Sesi Utama: {backendEvent.title}</h5>
                      <p className="text-xs text-neutral-500">Pelaksanaan kegiatan inti sesuai susunan panitia</p>
                    </div>
                    <div>
                      <span className="text-xs font-black text-[#5953C7]">
                        {new Date(backendEvent.ends_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                      </span>
                      <h5 className="font-bold text-neutral-900">Sesi Penutupan & Tanya Jawab</h5>
                      <p className="text-xs text-neutral-500">Penutupan resmi acara</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'ketentuan' && (
                <div className="space-y-3">
                  <h3 className="font-black text-lg text-neutral-950 mb-2">Syarat & Ketentuan Pendaftaran</h3>
                  <ul className="list-disc pl-5 space-y-2 text-xs text-neutral-600">
                    <li>1 alamat email hanya dapat mendaftar 1 kali untuk event ini.</li>
                    <li>E-Tiket resmi dengan QR Code unik akan otomatis dikirimkan ke alamat email peserta.</li>
                    <li>Jika kuota tiket habis, calon peserta dapat bergabung ke Daftar Tunggu (Waitlist) dan akan otomatis dipromosikan jika ada pembatalan tiket.</li>
                    <li>Peserta wajib menjaga ketertiban selama acara berlangsung di {backendEvent.venue}.</li>
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
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                  currentTier?.quota === 0 ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${currentTier?.quota === 0 ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'}`}></span>
                  {currentTier?.quota === 0 ? 'Kuota Penuh' : 'Tersedia'}
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
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <span className="font-black text-sm text-neutral-900 block">{tier.name}</span>
                        <span className="text-[11px] text-neutral-500">{tier.type}</span>
                      </div>
                      <span className="font-extrabold text-sm text-[#5953C7]">
                        {tier.price === 0 ? 'Gratis' : `Rp ${tier.price.toLocaleString('id-ID')}`}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-xs border-t border-neutral-100 pt-2">
                      <span className={`font-semibold ${tier.quota === 0 ? 'text-amber-600' : 'text-neutral-500'}`}>
                        {tier.quota === 0 ? 'Kuota Habis (Masuk Waitlist)' : `Sisa ${tier.quota} tiket`}
                      </span>
                      {selectedTicket === tier.id && (
                        <span className="text-[10px] bg-[#5953C7] text-white font-bold px-2 py-0.5 rounded-full">
                          Terpilih
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculation Summary */}
              <div className="space-y-2 text-xs text-neutral-600 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal ({currentTier?.name})</span>
                  <span className="font-semibold text-neutral-900">
                    {subtotal === 0 ? 'Gratis' : `Rp ${subtotal.toLocaleString('id-ID')}`}
                  </span>
                </div>
                {currentTier?.price > 0 && (
                  <div className="flex justify-between">
                    <span>Biaya Layanan Platform</span>
                    <span className="font-semibold text-neutral-900">Rp {adminFee.toLocaleString('id-ID')}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-neutral-200 flex justify-between items-center text-sm font-black text-neutral-950">
                  <span>Total Pembayaran</span>
                  <span className="text-[#5953C7] text-lg">
                    {grandTotal === 0 ? 'Gratis' : `Rp ${grandTotal.toLocaleString('id-ID')}`}
                  </span>
                </div>
              </div>

              {/* Checkout / Waitlist Button */}
              <button 
                onClick={() => {
                  if (currentTier?.quota === 0) {
                    navigate(`/events/${eventSlug}/waitlist?ticket=${currentTier.id}`);
                  } else {
                    navigate(`/events/${eventSlug}/checkout`, {
                      state: {
                        event: {
                          id: backendEvent.id,
                          slug: eventSlug,
                          title: backendEvent.title,
                          venue: backendEvent.venue,
                          category: backendEvent.category,
                          dateTime: formatDateTime(backendEvent.starts_at),
                          starts_at: backendEvent.starts_at,
                          ends_at: backendEvent.ends_at
                        },
                        selectedTicket: {
                          id: currentTier.id,
                          title: currentTier.name,
                          name: currentTier.name,
                          price: currentTier.price,
                          priceFormatted: currentTier.price === 0 ? 'Gratis' : `Rp ${currentTier.price.toLocaleString('id-ID')}`,
                          quota: currentTier.quota
                        },
                        quantity: 1
                      }
                    });
                  }
                }}
                className={`w-full ${
                  currentTier?.quota === 0 
                    ? 'bg-amber-600 hover:bg-amber-700' 
                    : 'bg-[#5953C7] hover:bg-[#4a44b5]'
                } text-white py-3.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer`}
              >
                <Ticket className="w-4 h-4" />
                <span>{currentTier?.quota === 0 ? 'Masuk Daftar Tunggu (Waitlist)' : 'Daftar & Beli Tiket'}</span>
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-neutral-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Tiket digital resmi terproteksi database EVENT 2 GO</span>
              </div>
            </div>
          </div>

        </div>

      </main>

    </div>
  );
};

export default EventDetail;