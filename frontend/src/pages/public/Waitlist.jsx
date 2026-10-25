import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
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
  Info,
  ArrowRight,
  ExternalLink,
  RotateCw
} from 'lucide-react';
import { getEvent, listEvents } from '../../api/events';
import { joinWaitlist } from '../../api/bookings';

export default function Waitlist() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const preselectedTicketId = searchParams.get('ticket');
  const location = useLocation();

  // State Event & Tiket dari API Database
  const [event, setEvent] = useState(location.state?.event || null);
  const [loadingEvent, setLoadingEvent] = useState(!location.state?.event);
  const [loadError, setLoadError] = useState(null);

  // State Input Form Peserta
  const [namaLengkap, setNamaLengkap] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [selectedTicketId, setSelectedTicketId] = useState(
    preselectedTicketId || location.state?.selectedTicket?.id || ''
  );
  const [isAgreed, setIsAgreed] = useState(false);

  // State Pengiriman ke Backend
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [queueResult, setQueueResult] = useState(null);

  // Fetch Event dari Backend Database
  useEffect(() => {
    let isMounted = true;
    const targetSlug = slug || 'workshop-python-dasar';

    setLoadingEvent(true);
    getEvent(targetSlug)
      .then((data) => {
        if (!isMounted) return;
        setEvent(data);
        // Tentukan tiket default
        if (data?.ticket_types?.length > 0) {
          const matchPre = data.ticket_types.find((t) => t.id === preselectedTicketId);
          if (matchPre) {
            setSelectedTicketId(matchPre.id);
          } else {
            // Pilih tiket pertama yang kuotanya habis (waitlist priority)
            const soldOut = data.ticket_types.find((t) => (t.remaining ?? (t.quota - t.sold)) <= 0);
            setSelectedTicketId(soldOut ? soldOut.id : data.ticket_types[0].id);
          }
        }
      })
      .catch(async (err) => {
        if (!isMounted) return;
        console.warn('Gagal memuat event slug:', targetSlug, err.message);
        // Jika slug tidak valid atau /waitlist dibuka langsung, coba cari event pertama dari katalog
        try {
          const all = await listEvents();
          if (all && all.length > 0 && isMounted) {
            const first = await getEvent(all[0].slug);
            if (isMounted) {
              setEvent(first);
              if (first?.ticket_types?.length > 0) {
                const soldOut = first.ticket_types.find((t) => (t.remaining ?? (t.quota - t.sold)) <= 0);
                setSelectedTicketId(soldOut ? soldOut.id : first.ticket_types[0].id);
              }
            }
          }
        } catch (e2) {
          if (isMounted) setLoadError(err.message || 'Event tidak ditemukan');
        }
      })
      .finally(() => {
        if (isMounted) setLoadingEvent(false);
      });

    return () => { isMounted = false; };
  }, [slug, preselectedTicketId]);

  // Submit Handler: Kirim data ke API POST /api/v1/waitlist
  const handleJoinWaitlist = async (e) => {
    e.preventDefault();

    if (!selectedTicketId) {
      setSubmitError('Silakan pilih kategori tiket yang diinginkan.');
      return;
    }

    if (!isAgreed) {
      setSubmitError('Mohon centang persetujuan ketentuan antrean resmi.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        ticket_type_id: selectedTicketId,
        attendee_name: namaLengkap.trim(),
        attendee_email: email.trim().toLowerCase(),
        attendee_phone: whatsapp.trim()
      };

      const res = await joinWaitlist(payload);
      setQueueResult(res);
      setIsSubmitted(true);
    } catch (err) {
      console.error('Waitlist submission failed:', err);
      // Format pesan error ramah pengguna
      if (err.code === 'EL003' || err.message?.includes('sudah')) {
        setSubmitError('Email ini sudah terdaftar dalam antrean daftar tunggu untuk kategori tiket ini.');
      } else if (err.code === 'EL005') {
        setSubmitError('Tiket untuk kategori ini masih tersedia! Anda dapat langsung melakukan pembelian tiket.');
      } else if (err.code === 'EL002') {
        setSubmitError('Kategori tiket tidak ditemukan atau sudah tidak aktif.');
      } else {
        setSubmitError(err.message || 'Terjadi kesalahan saat mendaftar antrean.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedTier = event?.ticket_types?.find((t) => t.id === selectedTicketId) || null;
  const isSelectedTierAvailable = selectedTier ? (selectedTier.remaining ?? (selectedTier.quota - selectedTier.sold)) > 0 : false;

  const formatEventDate = (dateStr) => {
    if (!dateStr) return 'Tanggal belum ditentukan';
    try {
      return new Date(dateStr).toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) + ' WIB';
    } catch {
      return dateStr;
    }
  };

  // Hitung total antrean pada tiket yang terpilih
  const activeWaitlistCount = selectedTier?.waitlist_count ?? 0;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-neutral-900 font-sans selection:bg-[#5953C7] selection:text-white flex flex-col justify-between">
      
      {/* ================= TOP NAVBAR ================= */}
      <header className="w-full bg-white border-b border-gray-200/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo EVENT 2 GO */}
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
            <div className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#5953C7]/10 text-[#5953C7] border border-[#5953C7]/20">
              OFFICIAL WAITLIST
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
              onClick={() => navigate('/template-email')}
              className="text-xs font-bold text-neutral-600 hover:text-[#5953C7] uppercase tracking-wider transition-colors cursor-pointer hidden sm:block"
            >
              TEMPLATE EMAIL
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
            onClick={() => event?.slug ? navigate(`/events/${event.slug}`) : navigate('/events')}
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-neutral-700 hover:text-[#5953C7] transition-colors cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:border-[#5953C7] transition-colors">
              <ArrowLeft className="w-3.5 h-3.5 text-neutral-700 group-hover:text-[#5953C7]" />
            </div>
            <span>KEMBALI KE DETAIL EVENT</span>
          </button>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEEDFA] text-[#5953C7] border border-indigo-100">
            <span className="w-2 h-2 rounded-full bg-[#5953C7] animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-wider">
              SISTEM ANTREAN OTOMATIS AKTIF
            </span>
          </div>
        </div>

        {/* ================= PAGE HEADER SECTION ================= */}
        <div className="pb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEEDFA] text-[#5953C7] border border-indigo-100 mb-3">
            <Ticket className="w-3.5 h-3.5 text-[#5953C7]" />
            <span className="text-[11px] font-black uppercase tracking-wider">
              KUOTA PENUH • DAFTAR TUNGGU RESMI
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight leading-tight">
            Masuk Daftar Tunggu (Waitlist)
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 mt-2 max-w-3xl leading-relaxed">
            Tiket untuk acara ini telah terisi penuh. Daftarkan nama Anda ke antrean resmi <strong className="text-neutral-900 font-bold">EVENT 2 GO</strong>. Ketika panitia membatalkan tiket peserta lain, kuota otomatis dialokasikan ke pendaftar nomor pertama dan tiket resmi dikirimkan langsung ke email Anda.
          </p>
        </div>

        {loadingEvent ? (
          <div className="py-20 text-center text-neutral-400">
            <div className="w-8 h-8 border-2 border-[#5953C7] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs font-bold">Memuat informasi event dari database...</p>
          </div>
        ) : loadError ? (
          <div className="bg-white rounded-3xl p-8 border border-red-200 text-center max-w-xl mx-auto">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h3 className="font-bold text-neutral-900 text-base mb-1">Gagal Memuat Acara</h3>
            <p className="text-xs text-neutral-500 mb-4">{loadError}</p>
            <button
              onClick={() => navigate('/events')}
              className="bg-[#5953C7] text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#473ebf]"
            >
              Lihat Katalog Event
            </button>
          </div>
        ) : (
          /* ================= 1. LAYOUT GRID (KIRI 7 KOLOM, KANAN 5 KOLOM) ================= */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ================= KOLOM KIRI (7 GRID): FORM DATA PEMESAN ================= */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm relative">
                
                {/* Form Card Header */}
                <div className="flex items-start justify-between pb-6 border-b border-gray-100 mb-6">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-neutral-900 tracking-tight">
                      Data Pendaftar Antrean
                    </h2>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Identitas Anda akan disinkronkan langsung saat tiket resmi diterbitkan.
                    </p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#EEEDFA] text-[#5953C7]">
                    01 / 02
                  </span>
                </div>

                {/* Error Banner jika Submit Gagal */}
                {submitError && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-700 animate-in fade-in">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-bold">{submitError}</p>
                      {submitError.includes('masih tersedia') && (
                        <button
                          type="button"
                          onClick={() => navigate(`/events/${event.slug}/checkout`)}
                          className="mt-2 text-xs font-black text-[#5953C7] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>Lanjut ke Halaman Pendaftaran &amp; Pembelian Langsung</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Warning jika kategori yang dipilih ternyata MASIH TERSEDIA */}
                {isSelectedTierAvailable && (
                  <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-800">
                    <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="flex-1 text-xs">
                      <p className="font-bold">
                        Tiket "{selectedTier?.name}" masih tersedia (Sisa {selectedTier?.remaining ?? (selectedTier?.quota - selectedTier?.sold)} tiket)!
                      </p>
                      <p className="text-amber-700 mt-0.5">
                        Anda tidak perlu mengantre. Anda dapat langsung membeli tiket sekarang.
                      </p>
                      <button
                        type="button"
                        onClick={() => navigate(`/events/${event.slug}/checkout`, {
                          state: { event, selectedTicket: selectedTier }
                        })}
                        className="mt-2.5 inline-flex items-center gap-1.5 bg-[#5953C7] text-white px-4 py-1.5 rounded-full font-bold text-[11px] uppercase tracking-wider hover:bg-[#473ebf] shadow-xs cursor-pointer"
                      >
                        <span>Daftar Langsung &rarr;</span>
                      </button>
                    </div>
                  </div>
                )}

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
                    <div className="bg-[#F9FAFB] border border-gray-200/90 rounded-xl px-4 py-3 flex items-center gap-3 focus-within:border-[#5953C7] focus-within:ring-2 focus-within:ring-[#5953C7]/10 transition-all">
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
                        TIKET AKAN DIKIRIM KE SINI
                      </span>
                    </div>
                    <div className="bg-[#F9FAFB] border border-gray-200/90 rounded-xl px-4 py-3 flex items-center gap-3 focus-within:border-[#5953C7] focus-within:ring-2 focus-within:ring-[#5953C7]/10 transition-all">
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

                  {/* 3. NOMOR WHATSAPP / TELEPON */}
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-bold tracking-wider uppercase mb-1.5">
                      <label htmlFor="whatsapp" className="text-neutral-700">
                        NOMOR WHATSAPP / TELEPON AKTIF
                      </label>
                      <span className="text-neutral-400 font-semibold">
                        FORMAT 8-15 DIGIT
                      </span>
                    </div>
                    <div className="bg-[#F9FAFB] border border-gray-200/90 rounded-xl px-4 py-3 flex items-center gap-3 focus-within:border-[#5953C7] focus-within:ring-2 focus-within:ring-[#5953C7]/10 transition-all">
                      <Phone className="w-4 h-4 text-neutral-400 shrink-0" />
                      <input
                        id="whatsapp"
                        type="tel"
                        required
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="081234567890"
                        className="w-full bg-transparent text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none font-medium"
                      />
                    </div>
                  </div>

                  {/* 4. PILIHAN KATEGORI TIKET (DARI DATABASE) */}
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-bold tracking-wider uppercase mb-2">
                      <span className="text-neutral-700">
                        PILIH KATEGORI TIKET
                      </span>
                      <span className="text-[#5953C7] font-bold text-[11px] normal-case tracking-normal">
                        Tersedia di Database
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {event?.ticket_types?.map((cat) => {
                        const isSelected = selectedTicketId === cat.id;
                        const remainingSeats = cat.remaining ?? (cat.quota - cat.sold);
                        const isSoldOut = remainingSeats <= 0;

                        return (
                          <div
                            key={cat.id}
                            onClick={() => setSelectedTicketId(cat.id)}
                            className={`flex flex-col justify-between p-3.5 rounded-2xl transition-all cursor-pointer select-none ${
                              isSelected
                                ? 'border-2 border-[#5953C7] bg-[#F8F7FD] shadow-sm'
                                : 'border border-gray-200/90 bg-[#F9FAFB] hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2.5 min-w-0 pr-1">
                                <div
                                  className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all ${
                                    isSelected
                                      ? 'border-2 border-[#5953C7]'
                                      : 'border border-gray-400'
                                  }`}
                                >
                                  {isSelected && (
                                    <div className="w-2 h-2 rounded-full bg-[#5953C7]" />
                                  )}
                                </div>
                                <span className="text-xs font-bold text-neutral-900 truncate">
                                  {cat.name}
                                </span>
                              </div>

                              <span className="text-xs font-extrabold text-[#5953C7] shrink-0 font-mono">
                                {cat.price_idr === 0 ? 'Gratis' : `Rp ${cat.price_idr?.toLocaleString('id-ID')}`}
                              </span>
                            </div>

                            {/* Badge Kuota / Waitlist Status */}
                            <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px]">
                              {isSoldOut ? (
                                <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                                  KUOTA HABIS • ANTREAN
                                </span>
                              ) : (
                                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                                  TERSEDIA ({remainingSeats} TIKET)
                                </span>
                              )}

                              {cat.waitlist_count > 0 && (
                                <span className="text-neutral-500 font-medium">
                                  {cat.waitlist_count} mengantre
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 5. INFORMASI ALOKASI ANTREAN (1 TIKET PER ORANG) */}
                  <div className="bg-[#F9FAFB] border border-gray-200/90 rounded-2xl p-4 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-neutral-800 block">
                        Alokasi Pendaftaran Antrean
                      </span>
                      <span className="text-neutral-500 text-[11px] block mt-0.5">
                        Satu akun email mendapatkan 1 posisi antrean per kategori tiket
                      </span>
                    </div>
                    <span className="px-3 py-1 bg-white border border-gray-200 rounded-lg font-black text-neutral-900 text-xs shadow-xs">
                      1 Tiket
                    </span>
                  </div>

                  {/* 6. CHECKBOX PERSETUJUAN */}
                  <div className="pt-2">
                    <label className="flex items-start gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isAgreed}
                        onChange={(e) => setIsAgreed(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#5953C7] focus:ring-[#5953C7] cursor-pointer"
                      />
                      <span className="text-xs text-neutral-600 leading-relaxed">
                        Saya memahami bahwa pendaftaran ini adalah antrean resmi (waiting list) dan tiket akan otomatis diterbitkan apabila ada pembatalan kuota dari peserta lain.
                      </span>
                    </label>
                  </div>

                  {/* 7. TOMBOL SUBMIT */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#5953C7] hover:bg-[#473ebf] text-white py-3.5 px-6 rounded-full font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <RotateCw className="w-4 h-4 animate-spin" />
                          <span>Mendaftarkan ke Antrean Database...</span>
                        </>
                      ) : (
                        <>
                          <span>Masuk Antrean Resmi Sekarang</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>

                </form>

              </div>
            </div>

            {/* ================= KOLOM KANAN (5 GRID): INFORMASI ACARA & MEKANISME ================= */}
            <div className="lg:col-span-5 space-y-5">
              
              {/* CARD 1: INFORMASI ACARA */}
              <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm space-y-4">
                
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#5953C7]">
                    EVENT TERVERIFIKASI
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400">
                    ID: {event?.id?.slice(0, 8)}
                  </span>
                </div>

                <div>
                  <h3 className="font-black text-base sm:text-lg text-neutral-900 leading-snug">
                    {event?.title}
                  </h3>
                  <div className="mt-3 space-y-2 text-xs text-neutral-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#5953C7] shrink-0" />
                      <span>{formatEventDate(event?.starts_at)}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#5953C7] shrink-0 mt-0.5" />
                      <span className="leading-snug">{event?.venue}</span>
                    </div>
                  </div>
                </div>

                {/* Box Status Kapasitas */}
                <div className="bg-[#F9FAFB] rounded-2xl p-4 border border-gray-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-500 font-medium">
                      Status Kapasitas
                    </span>
                    <span className="font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
                      Kuota Penuh (100%)
                    </span>
                  </div>

                  {/* Progress Bar (Penuh 100%) */}
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden mt-2.5">
                    <div className="h-full bg-[#5953C7] rounded-full w-full" />
                  </div>

                  {/* Info Antrean Database */}
                  <div className="flex items-center justify-between text-xs mt-3 pt-1">
                    <div className="flex items-center gap-1.5 font-bold text-neutral-700">
                      <span className="w-2 h-2 rounded-full bg-[#5953C7] animate-pulse" />
                      <span>{activeWaitlistCount} Orang Mengantre</span>
                    </div>
                    <span className="text-[11px] text-[#5953C7] font-semibold">
                      Kategori: {selectedTier?.name || 'Reguler'}
                    </span>
                  </div>
                </div>

              </div>

              {/* CARD 2: MEKANISME ANTREAN OTOMATIS EVENT 2 GO */}
              <div className="bg-[#F2F0FB] rounded-3xl p-6 border border-indigo-100 shadow-sm relative">
                
                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck className="w-4 h-4 text-[#5953C7]" />
                  <h4 className="font-black text-xs uppercase tracking-wider text-neutral-900">
                    MEKANISME ANTREAN EVENT 2 GO
                  </h4>
                </div>

                <div className="space-y-3.5">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-white text-[#5953C7] font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs border border-indigo-100">
                      1
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-neutral-900 leading-snug">
                        Antrean Masuk ke Database
                      </h5>
                      <p className="text-[11px] text-neutral-600 leading-relaxed mt-0.5">
                        Urutan antrean dijamin adil berdasarkan waktu pendaftaran (First In, First Out).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-white text-[#5953C7] font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs border border-indigo-100">
                      2
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-neutral-900 leading-snug">
                        Promosi Otomatis Saat Ada Pembatalan
                      </h5>
                      <p className="text-[11px] text-neutral-600 leading-relaxed mt-0.5">
                        Ketika panitia membatalkan pendaftaran peserta lain, sistem database otomatis menaikkan pendaftar nomor 1 menjadi peserta aktif.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-white text-[#5953C7] font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs border border-indigo-100">
                      3
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-neutral-900 leading-snug">
                        E-Tiket QR Resmi Dikirim ke Email
                      </h5>
                      <p className="text-[11px] text-neutral-600 leading-relaxed mt-0.5">
                        Anda akan langsung menerima email resmi "Kamu mendapat tiket!" lengkap dengan QR Code yang dapat di-scan panitia saat acara.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Link Preview Email */}
                <div className="mt-5 pt-4 border-t border-indigo-100 flex items-center justify-between text-xs">
                  <span className="text-neutral-600 text-[11px]">
                    Ingin melihat bentuk emailnya?
                  </span>
                  <button
                    type="button"
                    onClick={() => navigate('/template-email')}
                    className="font-black text-[11px] text-[#5953C7] hover:underline uppercase tracking-wider cursor-pointer"
                  >
                    PREVIEW EMAIL TIKET &rarr;
                  </button>
                </div>

              </div>

            </div>

          </div>
        )}

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
              Pendaftaran untuk <strong>{namaLengkap}</strong> telah berhasil disimpan ke database antrean resmi <strong>EVENT 2 GO</strong>.
            </p>

            {/* Badge Nomor Antrean Real dari Backend */}
            <div className="bg-[#F8F7FD] border border-indigo-100 rounded-2xl p-4 my-5">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                NOMOR POSISI ANTREAN ANDA
              </span>
              <div className="text-3xl font-black text-[#5953C7] font-mono mt-1">
                Antrean Ke-{queueResult?.position ?? 1}
              </div>
              <p className="text-[11px] text-neutral-600 mt-1">
                Kategori: <strong>{selectedTier?.name}</strong> • {event?.title}
              </p>
            </div>

            <p className="text-[11px] text-neutral-500 leading-relaxed mb-6">
              Jika terjadi pembatalan pendaftaran, sistem akan otomatis mempromosikan antrean dan mengirimkan E-Tiket ber-QR Code resmi ke alamat email <strong>{email}</strong>.
            </p>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => navigate('/template-email')}
                className="w-full bg-[#5953C7] hover:bg-[#473ebf] text-white py-3 rounded-full font-bold text-xs uppercase tracking-wider shadow-sm transition-colors cursor-pointer"
              >
                Lihat Contoh Email Tiket
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
