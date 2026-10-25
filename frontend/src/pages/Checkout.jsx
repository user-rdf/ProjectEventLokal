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

  // Fallback default data (hanya untuk tampilan awal, akan ditimpa oleh state dari halaman sebelumnya)
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
    id: 'reguler', // Akan ditimpa oleh UUID asli dari halaman sebelumnya
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
  const subtotal = (selectedTicket.price || 0) * quantity;
  const platformFee = (selectedTicket.price || 0) > 0 ? 5000 : 0;
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
          <div onClick={() => navigate('/')} className="flex items-center cursor-pointer group select-none gap-2">
            <span className="text-xl font-black text-[#5046B8]">EVENT 2 GO</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/login')} className="w-9 h-9 rounded-full bg-[#5046B8] hover:bg-[#4339a2] text-white flex items-center justify-center shadow-sm transition-transform active:scale-95 cursor-pointer" title="Akun Saya">
              <User className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </header>

      {/* ================= TOP SUB-NAV & PROGRESS STEPPER ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-2">
        <div className="bg-white rounded-2xl border border-gray-200/70 shadow-sm px-5 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <button onClick={() => navigate(passedEvent?.slug ? `/events/${passedEvent.slug}` : '/events')} className="group inline-flex items-center gap-2 text-xs font-black tracking-wider uppercase text-neutral-800 hover:text-[#5046B8] transition-colors">
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
              <span>KEMBALI KE DETAIL EVENT</span>
            </button>
            <p className="text-[10px] sm:text-[11px] font-bold text-neutral-500 tracking-wider mt-0.5">
              <span className="text-[#5046B8] font-black uppercase">SESI TRANSAKSI RESMI</span> &bull; {eventData.code}
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 text-xs font-bold">
            <div className="flex items-center gap-1.5 text-[#5046B8]">
              <div className="w-5 h-5 rounded-full bg-[#5046B8] text-white flex items-center justify-center shadow-sm"><Check className="w-3 h-3 stroke-[3]" /></div>
              <span className="text-[11px] uppercase tracking-wider font-extrabold line-through text-neutral-400">1. PILIH TIKET</span>
            </div>
            <div className="w-6 sm:w-8 h-px bg-gray-300"></div>
            <div className="flex items-center gap-1.5 text-[#5046B8]">
              <div className="w-5 h-5 rounded-full bg-[#5046B8] text-white flex items-center justify-center text-[10px] font-black shadow-sm">2</div>
              <span className="text-[11px] uppercase tracking-wider font-black">2. DATA PEMESAN</span>
            </div>
            <div className="w-6 sm:w-8 h-px bg-gray-200"></div>
            <div className="flex items-center gap-1.5 text-gray-400">
              <div className="w-5 h-5 rounded-full border border-gray-300 text-gray-400 flex items-center justify-center text-[10px] font-bold">3</div>
              <span className="text-[11px] uppercase tracking-wider font-medium">3. PEMBAYARAN</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MAIN SPLIT-SCREEN LAYOUT ================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ================= KOLOM KIRI: FORM DATA PEMESAN & TIKET TERPILIH ================= */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 sm:p-8">
              <div className="mb-6">
                <span className="inline-block text-[10px] font-black tracking-widest text-[#5046B8] uppercase bg-[#5046B8]/10 px-2.5 py-1 rounded-md mb-2">IDENTITAS PENANGGUNG JAWAB</span>
                <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">Data Pemesan (Sesuai Identitas Resmi)</h1>
                <p className="text-xs text-neutral-500 mt-1">Pastikan data valid karena e-ticket dan QR code masuk akan dikirimkan ke kontak terdaftar.</p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-[11px] font-black tracking-wider uppercase text-neutral-800 mb-1.5">NAMA LENGKAP (SESUAI KTP / PASPOR) <span className="text-rose-600">*</span></label>
                  <div className="relative">
                    <input type="text" name="fullName" required value={formData.fullName} onChange={handleInputChange} placeholder="Masukkan nama lengkap sesuai tanda pengenal" className="w-full bg-[#F8F9FC] hover:bg-white focus:bg-white border border-gray-200 focus:border-[#5046B8] focus:ring-2 focus:ring-[#5046B8]/20 rounded-xl px-4 py-3 text-sm text-neutral-900 font-medium transition-all outline-none pr-10" />
                    <CreditCard className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] font-black tracking-wider uppercase text-neutral-800 mb-1.5">ALAMAT EMAIL / GMAIL KONFIRMASI <span className="text-rose-600">*</span></label>
                    <div className="relative">
                      <input type="email" name="email" required value={formData.email} onChange={handleInputChange} placeholder="contoh: nama@email.com" className="w-full bg-[#F8F9FC] hover:bg-white focus:bg-white border border-gray-200 focus:border-[#5046B8] focus:ring-2 focus:ring-[#5046B8]/20 rounded-xl px-4 py-3 text-sm text-neutral-900 font-medium transition-all outline-none pr-10" />
                      <Mail className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-black tracking-wider uppercase text-neutral-800 mb-1.5">NOMOR WHATSAPP AKTIF <span className="text-rose-600">*</span></label>
                    <div className="relative">
                      <input type="tel" name="whatsapp" required value={formData.whatsapp} onChange={handleInputChange} placeholder="0812xxxxxxxx" className="w-full bg-[#F8F9FC] hover:bg-white focus:bg-white border border-gray-200 focus:border-[#5046B8] focus:ring-2 focus:ring-[#5046B8]/20 rounded-xl px-4 py-3 text-sm text-neutral-900 font-medium transition-all outline-none pr-10" />
                      <Phone className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-black tracking-widest text-[#5046B8] uppercase">KATEGORI TIKET TERPILIH</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-neutral-950 tracking-tight">{selectedTicket.title}</h2>
                </div>
                <button type="button" onClick={() => navigate(passedEvent?.slug ? `/events/${passedEvent.slug}` : '/events')} className="inline-flex items-center gap-1.5 bg-[#EEEDFA] hover:bg-[#E2E0F8] text-[#5046B8] px-3.5 py-1.5 rounded-full text-xs font-black tracking-wider uppercase transition-colors shrink-0 cursor-pointer">
                  <Pencil className="w-3.5 h-3.5" />
                  <span>UBAH TIKET</span>
                </button>
              </div>

              <div className="border-2 border-[#5046B8] bg-[#F9F8FE] rounded-2xl p-4 sm:p-5 relative mt-4 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#5046B8]/10 text-[#5046B8] flex items-center justify-center shrink-0">
                      <Ticket className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm sm:text-base text-neutral-950">{selectedTicket.title}</h3>
                      <div className="flex items-center gap-2 mt-0.5 text-xs">
                        <span className="font-black text-[#5046B8]">{selectedTicket.priceFormatted} {selectedTicket.unit}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-[#F3F4F6] border border-gray-200/60 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-[11px] font-black tracking-wider uppercase text-neutral-800">KUANTITAS TIKET</h4>
                </div>
                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <button type="button" onClick={() => setQuantity((prev) => Math.max(1, prev - 1))} disabled={quantity <= 1} className="w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center font-bold text-neutral-700 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer">-</button>
                  <span className="font-black text-sm w-6 text-center select-none text-neutral-950">{quantity}</span>
                  <button type="button" onClick={() => setQuantity((prev) => Math.min(4, prev + 1))} disabled={quantity >= 4} className="w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center font-bold text-neutral-700 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer">+</button>
                </div>
              </div>
            </div>
          </div>

          {/* ================= KOLOM KANAN: ORDER SUMMARY ================= */}
          <div className="lg:col-span-4 lg:sticky lg:top-8 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-md overflow-hidden">
              <div className="bg-[#2D2A78] p-3.5 px-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#A5B4FC]" />
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-wider text-[#C7D2FE] block leading-tight">RESERVASI SEMENTARA</span>
                    <h3 className="font-extrabold text-xs sm:text-sm text-white leading-tight">Selesaikan Pesanan</h3>
                  </div>
                </div>
                <div className="bg-white/15 backdrop-blur-sm px-2.5 py-1 rounded-md text-sm font-black font-mono tracking-wider text-white">
                  {formatTimer(timeLeft)}
                </div>
              </div>

              <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-900">
                <img src={eventData.posterUrl} alt={eventData.title} className="w-full h-full object-cover filter brightness-75" />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent p-4 flex flex-col justify-end text-white">
                  <span className="inline-block self-start text-[9px] font-black uppercase tracking-wider bg-[#5046B8] text-white px-2 py-0.5 rounded mb-1.5 shadow-sm">{eventData.badge}</span>
                  <h4 className="font-black text-base sm:text-lg leading-tight text-white drop-shadow-md">{eventData.title}</h4>
                </div>
              </div>

              <div className="p-4 border-b border-gray-100 flex items-center justify-between text-xs">
                <div className="flex items-start gap-2">
                  <Building className="w-4 h-4 text-[#5046B8] shrink-0 mt-0.5" />
                  <span className="font-bold text-neutral-800 text-[11px] leading-tight">{eventData.venue}</span>
                </div>
              </div>

              <div className="p-4 pt-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">RINCIAN TIKET TERPILIH</span>
                <div className="bg-[#F8F9FC] border border-gray-200/70 rounded-xl p-3 flex items-start justify-between gap-2 text-xs">
                  <div>
                    <h5 className="font-extrabold text-neutral-900 leading-snug">{selectedTicket.title}</h5>
                    <p className="text-[11px] text-neutral-500 mt-0.5">{quantity} Tiket x {selectedTicket.priceFormatted}</p>
                  </div>
                  <span className="font-bold text-[#5046B8] shrink-0">Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className="px-4 pb-4 space-y-2 text-xs text-neutral-600">
                <div className="flex justify-between items-center">
                  <span>Subtotal Harga Tiket</span>
                  <span className="font-bold text-neutral-900">Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>
                {platformFee > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1">Biaya Layanan Platform <Info className="w-3 h-3 text-neutral-400" /></span>
                    <span className="font-bold text-neutral-900">Rp {platformFee.toLocaleString('id-ID')}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3 mt-2">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500 block">TOTAL ESTIMASI</span>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-xl text-[#2D2A78] tracking-tight block">Rp {grandTotal.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-3 border-t border-gray-200 bg-white space-y-3.5">
                <div className="bg-[#F9FAFB] p-3 rounded-xl border border-gray-200/80">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="w-4 h-4 mt-0.5 rounded text-[#5046B8] focus:ring-[#5046B8] border-gray-300 accent-[#5046B8] cursor-pointer" />
                    <span className="text-[11px] text-neutral-700 leading-snug">
                      Saya setuju data saya (nama, email, nomor telepon) dibagikan ke panitia untuk keperluan event ini, sesuai Kebijakan Privasi.
                    </span>
                  </label>
                </div>

                <button type="button" onClick={handleSubmit} className="w-full bg-[#3D32A0] hover:bg-[#322886] text-white py-3.5 px-5 rounded-xl font-black text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.99] cursor-pointer">
                  <span>LANJUT KE PEMBAYARAN</span>
                  <ArrowRight className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

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
            
            // ✅ PERBAIKAN SESUAI KONTRAK API v1.3 (Bagian 2 & 7)
            const bookingPayload = {
              ticket_type_id: selectedTicket.id, // HARUS berupa UUID dari halaman sebelumnya
              attendee_name: formData.fullName || 'Peserta Event',
              attendee_email: formData.email,
              attendee_phone: cleanPhone,
              consent: consent // Ditambahkan sesuai rekomendasi Bagian 7 kontrak API
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
            // ✅ HANDLING ERROR SESUAI KONTRAK API v1.3 (Bagian 3: 409 untuk Kuota Habis / Email Ganda)
            const msg = err.status === 409
              ? 'Kuota tiket habis atau email Anda sudah terdaftar di event ini. Silakan coba kategori lain atau gunakan email berbeda.'
              : (err.message || 'Gagal memproses pendaftaran. Silakan coba lagi.');
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