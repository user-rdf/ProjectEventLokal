import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  UploadCloud, 
  Check, 
  Image as ImageIcon, 
  Calendar, 
  MapPin, 
  Target, 
  Plus, 
  Trash2, 
  Clock, 
  Sparkles,
  AlertCircle,
  XCircle,
  CheckCircle2,
  ExternalLink,
  FileText
} from 'lucide-react';
import { EVENT_CATEGORIES, getCategoryLabel } from '../../utils/categories';

const BuatEvent = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isFree, setIsFree] = useState(true);
  const [loading, setLoading] = useState(false);
  const [organizerName, setOrganizerName] = useState('Panitia');

  // Form data state
  const [formData, setFormData] = useState({
    title: '',
    category: 'workshop',
    description: '',
    venue: '',
    date: '',
    startTime: '',
    endTime: ''
  });

  // Ticket types state
  const [ticketTypes, setTicketTypes] = useState([
    { name: 'Reguler', price_idr: '', quota: 100 }
  ]);

  // Errors state
  const [errors, setErrors] = useState({
    title: '',
    category: '',
    venue: '',
    date: '',
    startTime: '',
    endTime: '',
    tickets: []
  });

  const [formBannerError, setFormBannerError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [createdEvent, setCreatedEvent] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [publishActionType, setPublishActionType] = useState('publish'); // 'draft' | 'publish'

  useEffect(() => {
    const name = localStorage.getItem('organizer_name') || 'Panitia Event';
    setOrganizerName(name);
  }, []);

  // Handle perubahan input form utama dan bersihkan error secara real-time
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error field saat user mengetik
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (formBannerError) {
      setFormBannerError(null);
    }
    if (submitError) {
      setSubmitError(null);
    }
  };

  // Handle perubahan tiket dengan dukungan penghapusan angka 0 dan strip leading zero
  const handleTicketChange = (index, field, value) => {
    const newTickets = [...ticketTypes];

    if (field === 'price_idr' || field === 'quota') {
      // Jika input dikosongkan (backspace sampai habis), simpan string kosong agar input bisa kosong
      if (value === '' || value === null || value === undefined) {
        newTickets[index][field] = '';
      } else {
        // Hapus angka 0 di depan jika user mengetik angka lain (misal "020" -> 20)
        const rawStr = value.toString();
        const cleanedStr = rawStr.length > 1 && rawStr.startsWith('0') ? (rawStr.replace(/^0+/, '') || '0') : rawStr;
        const parsed = parseInt(cleanedStr, 10);
        newTickets[index][field] = isNaN(parsed) ? '' : parsed;
      }
    } else {
      newTickets[index][field] = value;
    }

    setTicketTypes(newTickets);

    // Clear error tiket spesifik
    if (errors.tickets && errors.tickets[index] && errors.tickets[index][field]) {
      const updatedTickets = [...errors.tickets];
      updatedTickets[index] = { ...updatedTickets[index], [field]: '' };
      setErrors(prev => ({ ...prev, tickets: updatedTickets }));
    }
    if (formBannerError) setFormBannerError(null);
  };

  const addTicket = () => {
    setTicketTypes([...ticketTypes, { name: 'VIP', price_idr: '', quota: 50 }]);
  };

  const removeTicket = (index) => {
    if (ticketTypes.length > 1) {
      setTicketTypes(ticketTypes.filter((_, i) => i !== index));
      if (errors.tickets) {
        setErrors(prev => ({
          ...prev,
          tickets: prev.tickets.filter((_, i) => i !== index)
        }));
      }
    }
  };

  // ================= VALIDASI LANGKAH 1 =================
  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.title || formData.title.trim().length < 3) {
      newErrors.title = 'Judul event wajib diisi (minimal 3 karakter).';
    }

    if (!formData.category) {
      newErrors.category = 'Silakan pilih kategori event.';
    }

    if (!formData.venue || formData.venue.trim().length < 2) {
      newErrors.venue = 'Lokasi / tempat acara wajib diisi (minimal 2 karakter).';
    }

    if (!formData.date) {
      newErrors.date = 'Tanggal pelaksanaan wajib ditentukan.';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Jam mulai event wajib diisi.';
    }

    // Validasi jam selesai tidak boleh mendahului jam mulai jika diisi
    if (formData.startTime && formData.endTime) {
      if (formData.endTime <= formData.startTime) {
        newErrors.endTime = 'Jam selesai harus lebih lama dari jam mulai.';
      }
    }

    setErrors(prev => ({ ...prev, ...newErrors }));

    const isValid = Object.keys(newErrors).length === 0;
    if (!isValid) {
      setFormBannerError('Mohon lengkapi seluruh kolom bertanda bintang (*) yang ditandai merah.');
    }
    return isValid;
  };

  // ================= VALIDASI LANGKAH 2 =================
  const validateStep2 = () => {
    const ticketErrors = [];
    let hasError = false;

    if (!ticketTypes || ticketTypes.length === 0) {
      setFormBannerError('Minimal harus ada 1 kategori tiket yang dibuat.');
      return false;
    }

    ticketTypes.forEach((t, i) => {
      const err = {};
      if (!t.name || t.name.trim().length === 0) {
        err.name = 'Nama tiket tidak boleh kosong.';
        hasError = true;
      }
      const qVal = parseInt(t.quota, 10);
      if (t.quota === '' || isNaN(qVal) || qVal <= 0) {
        err.quota = 'Kuota tiket harus lebih dari 0.';
        hasError = true;
      }
      if (!isFree) {
        const pVal = parseInt(t.price_idr, 10);
        if (t.price_idr === '' || isNaN(pVal) || pVal < 0) {
          err.price_idr = 'Harga tiket tidak boleh bernilai negatif.';
          hasError = true;
        }
      }
      ticketErrors[i] = err;
    });

    setErrors(prev => ({ ...prev, tickets: ticketErrors }));

    if (hasError) {
      setFormBannerError('Mohon periksa nama dan kuota tiket yang ditandai merah.');
    }
    return !hasError;
  };

  // Navigasi Langkah Berikutnya
  const handleNextStep = () => {
    setFormBannerError(null);
    setSubmitError(null);

    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (step === 2) {
      if (validateStep2()) {
        setStep(3);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // ================= SUBMIT EVENT KE BACKEND =================
  const handleSubmit = async (publishImmediately = true) => {
    setPublishActionType(publishImmediately ? 'publish' : 'draft');
    setFormBannerError(null);
    setSubmitError(null);

    // Validasi ulang Langkah 1 & Langkah 2
    const step1Ok = validateStep1();
    if (!step1Ok) {
      setStep(1);
      setFormBannerError('Informasi event pada Langkah 1 belum lengkap. Silakan periksa kembali.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const step2Ok = validateStep2();
    if (!step2Ok) {
      setStep(2);
      setFormBannerError('Informasi tiket pada Langkah 2 belum lengkap. Silakan periksa kembali.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      if (!token) {
        setSubmitError('Sesi panitia telah berakhir. Silakan login kembali.');
        setLoading(false);
        navigate('/login');
        return;
      }

      // Format ISO 8601
      const starts_at = new Date(`${formData.date}T${formData.startTime}:00`).toISOString();
      let ends_at;
      if (formData.endTime) {
        ends_at = new Date(`${formData.date}T${formData.endTime}:00`).toISOString();
      } else {
        // Default: 3 jam setelah jam mulai
        ends_at = new Date(new Date(`${formData.date}T${formData.startTime}:00`).getTime() + 3 * 3600 * 1000).toISOString();
      }

      const payload = {
        title: formData.title.trim(),
        category: formData.category,
        description: formData.description.trim(),
        venue: formData.venue.trim(),
        starts_at: starts_at,
        ends_at: ends_at,
        ticket_types: ticketTypes.map(t => ({
          name: t.name.trim(),
          price_idr: isFree ? 0 : (parseInt(t.price_idr) || 0),
          quota: parseInt(t.quota) || 1
        }))
      };

      const response = await fetch('/api/v1/manage/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const resData = await response.json().catch(() => ({}));

      if (!response.ok) {
        let msg = 'Gagal membuat event.';
        if (resData.detail) {
          if (Array.isArray(resData.detail)) {
            msg = resData.detail.map(d => {
              const fieldName = d.loc ? d.loc[d.loc.length - 1] : 'Field';
              return `${fieldName}: ${d.msg}`;
            }).join(' | ');
          } else {
            msg = resData.detail;
          }
        }
        setSubmitError(msg);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // Auto-publish jika panitia memilih Publikasikan Sekarang
      if (publishImmediately) {
        try {
          await fetch(`/api/v1/manage/events/${resData.id}/publish`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          resData.status = 'published';
        } catch (pubErr) {
          console.warn("Notice auto-publish:", pubErr);
        }
      } else {
        resData.status = 'draft';
      }

      setCreatedEvent(resData);
      setShowSuccessModal(true);
    } catch (err) {
      console.error("Network submit error:", err);
      setSubmitError('Terjadi kesalahan jaringan atau server tidak merespons. Pastikan koneksi berjalan normal.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  // Helper tampilan tanggal di Langkah 3
  const formatDisplayDate = () => {
    if (!formData.date) return 'Tanggal belum diisi';
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const d = new Date(formData.date);
    const dayName = days[d.getDay()] || '';
    const monthName = months[d.getMonth()] || '';
    return `${dayName}, ${d.getDate()} ${monthName} ${d.getFullYear()}${formData.startTime ? ` • Pukul ${formData.startTime} WIB` : ''}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-28">
      {/* Navbar Atas - Rebranding EVENT 2 GO */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <img 
            src="/images/Logo logo_EVENT2 GO.png" 
            alt="EVENT 2 GO" 
            className="h-8 w-auto object-contain cursor-pointer hover:opacity-90" 
            onClick={() => navigate('/dashboard')}
          />
          <span className="bg-[#EEEDFA] text-[#5953C7] text-xs px-2.5 py-1 rounded-full font-bold ml-2 hidden sm:inline-block">Portal Panitia</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <div className="text-sm font-bold text-gray-900">{organizerName}</div>
            <div className="text-xs text-emerald-600 font-medium">Panitia Terverifikasi</div>
          </div>
          <div className="bg-[#EEEDFA] text-[#5953C7] w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-sm border border-indigo-100">
            {organizerName.charAt(0).toUpperCase()}
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto mt-8 px-6">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="text-gray-500 text-sm font-medium flex items-center gap-1.5 mb-6 hover:text-[#5953C7] transition-colors cursor-pointer"
        >
          <ChevronLeft size={18} /> Beranda Panitia
        </button>
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Buat Event Baru</h1>
            <p className="text-sm text-gray-500 mt-1">Lengkapi informasi acara Anda dan publikasikan ke katalog EVENT 2 GO.</p>
          </div>
        </div>

        {/* Banner Pesan Kesalahan / Validasi Rapi */}
        {(formBannerError || submitError) && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 flex items-start gap-3 animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1 text-sm">
              <span className="font-bold block">Ada data yang belum sesuai atau belum lengkap:</span>
              <p className="text-xs text-red-700 mt-0.5">{formBannerError || submitError}</p>
            </div>
            <button 
              onClick={() => { setFormBannerError(null); setSubmitError(null); }}
              className="text-red-400 hover:text-red-700 cursor-pointer"
            >
              <XCircle size={18} />
            </button>
          </div>
        )}

        {/* Stepper Indikator Bertema EVENT 2 GO */}
        <div className="flex items-center justify-between mb-10 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10 rounded-full"></div>
          
          <div 
            onClick={() => setStep(1)}
            className="flex items-center gap-2.5 bg-gray-50 pr-4 cursor-pointer select-none"
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= 1 ? 'bg-[#5953C7] text-white shadow-xs' : 'bg-gray-200 text-gray-500'}`}>
              {step > 1 ? <Check size={18} className="stroke-[3]" /> : '1'}
            </div>
            <span className={`text-sm ${step >= 1 ? 'text-gray-900 font-bold' : 'text-gray-500'}`}>Info Event</span>
          </div>

          <div 
            onClick={() => { if (step > 2 || validateStep1()) setStep(2); }}
            className="flex items-center gap-2.5 bg-gray-50 px-4 cursor-pointer select-none"
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= 2 ? 'bg-[#5953C7] text-white shadow-xs' : 'bg-gray-200 text-gray-500'}`}>
              {step > 2 ? <Check size={18} className="stroke-[3]" /> : '2'}
            </div>
            <span className={`text-sm ${step >= 2 ? 'text-gray-900 font-bold' : 'text-gray-500'}`}>Kategori Tiket</span>
          </div>

          <div 
            onClick={() => { if (validateStep1() && validateStep2()) setStep(3); }}
            className="flex items-center gap-2.5 bg-gray-50 pl-4 cursor-pointer select-none"
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step === 3 ? 'bg-[#5953C7] text-white shadow-xs' : 'bg-gray-200 text-gray-500'}`}>
              3
            </div>
            <span className={`text-sm ${step === 3 ? 'text-gray-900 font-bold' : 'text-gray-500'}`}>Tinjau & Publikasi</span>
          </div>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm mb-12">
          
          {/* ========== LANGKAH 1: INFO EVENT ========== */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Judul Event */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Judul Event <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleInputChange} 
                  placeholder="Contoh: Workshop Desain UI/UX & Web Modern" 
                  className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none ${
                    errors.title 
                      ? 'border-red-500 bg-red-50/20 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                      : 'border-gray-300 focus:border-[#5953C7] focus:ring-2 focus:ring-[#5953C7]/15'
                  }`}
                />
                {errors.title && (
                  <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1 font-semibold animate-in fade-in duration-150">
                    <AlertCircle size={13} className="shrink-0" />
                    {errors.title}
                  </p>
                )}
              </div>
              
              {/* Kategori Event */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Kategori Event <span className="text-red-500">*</span>
                </label>
                <select 
                  name="category" 
                  value={formData.category} 
                  onChange={handleInputChange} 
                  className={`w-full px-4 py-3 rounded-xl border text-gray-900 bg-white text-sm focus:outline-none transition-all ${
                    errors.category 
                      ? 'border-red-500 bg-red-50/20 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                      : 'border-gray-300 focus:border-[#5953C7] focus:ring-2 focus:ring-[#5953C7]/15'
                  }`}
                >
                  {EVENT_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1 font-semibold">
                    <AlertCircle size={13} className="shrink-0" />
                    {errors.category}
                  </p>
                )}
              </div>

              {/* Poster Upload Placeholder */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-bold text-gray-900">Poster / Banner Event</label>
                  <span className="text-xs text-gray-400 font-medium">Opsional</span>
                </div>
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center bg-[#EEEDFA]/25 text-center hover:bg-[#EEEDFA]/40 transition-colors cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-[#EEEDFA] text-[#5953C7] flex items-center justify-center mb-3 shadow-2xs">
                    <UploadCloud size={24} />
                  </div>
                  <p className="text-sm font-bold text-gray-900 mb-1">Unggah Banner Acara</p>
                  <p className="text-xs text-gray-500">Mendukung format PNG, JPG, WEBP hingga 5MB</p>
                </div>
              </div>

              {/* Tanggal & Waktu */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Tanggal */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Tanggal Pelaksanaan <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="date" 
                    name="date" 
                    value={formData.date} 
                    onChange={handleInputChange} 
                    className={`w-full px-4 py-3 rounded-xl border text-sm text-gray-900 bg-white focus:outline-none transition-all ${
                      errors.date 
                        ? 'border-red-500 bg-red-50/20 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                        : 'border-gray-300 focus:border-[#5953C7] focus:ring-2 focus:ring-[#5953C7]/15'
                    }`}
                  />
                  {errors.date && (
                    <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1 font-semibold animate-in fade-in duration-150">
                      <AlertCircle size={13} className="shrink-0" />
                      {errors.date}
                    </p>
                  )}
                </div>

                {/* Jam Mulai */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Jam Mulai <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="time" 
                    name="startTime" 
                    value={formData.startTime} 
                    onChange={handleInputChange} 
                    className={`w-full px-4 py-3 rounded-xl border text-sm text-gray-900 bg-white focus:outline-none transition-all ${
                      errors.startTime 
                        ? 'border-red-500 bg-red-50/20 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                        : 'border-gray-300 focus:border-[#5953C7] focus:ring-2 focus:ring-[#5953C7]/15'
                    }`}
                  />
                  {errors.startTime && (
                    <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1 font-semibold animate-in fade-in duration-150">
                      <AlertCircle size={13} className="shrink-0" />
                      {errors.startTime}
                    </p>
                  )}
                </div>

                {/* Jam Selesai */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-bold text-gray-900">Jam Selesai</label>
                    <span className="text-[11px] text-gray-400">Opsional</span>
                  </div>
                  <input 
                    type="time" 
                    name="endTime" 
                    value={formData.endTime} 
                    onChange={handleInputChange} 
                    className={`w-full px-4 py-3 rounded-xl border text-sm text-gray-900 bg-white focus:outline-none transition-all ${
                      errors.endTime 
                        ? 'border-red-500 bg-red-50/20 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                        : 'border-gray-300 focus:border-[#5953C7] focus:ring-2 focus:ring-[#5953C7]/15'
                    }`}
                  />
                  {errors.endTime && (
                    <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1 font-semibold animate-in fade-in duration-150">
                      <AlertCircle size={13} className="shrink-0" />
                      {errors.endTime}
                    </p>
                  )}
                </div>
              </div>

              {/* Lokasi Acara */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Lokasi / Tempat Acara <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-4 top-3.5 text-gray-400" />
                  <input 
                    type="text" 
                    name="venue" 
                    value={formData.venue} 
                    onChange={handleInputChange} 
                    placeholder="Contoh: Auditorium Utama Gedung Rektorat Lt. 3" 
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm bg-white focus:outline-none transition-all ${
                      errors.venue 
                        ? 'border-red-500 bg-red-50/20 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                        : 'border-gray-300 focus:border-[#5953C7] focus:ring-2 focus:ring-[#5953C7]/15'
                    }`}
                  />
                </div>
                {errors.venue && (
                  <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1 font-semibold animate-in fade-in duration-150">
                    <AlertCircle size={13} className="shrink-0" />
                    {errors.venue}
                  </p>
                )}
              </div>

              {/* Deskripsi Acara */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Deskripsi Acara</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  rows="4" 
                  placeholder="Tuliskan gambaran acara, pemateri, benefit tiket, dan hal-hal yang perlu dipersiapkan oleh peserta..." 
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#5953C7] focus:ring-2 focus:ring-[#5953C7]/15 bg-white resize-y text-sm transition-all"
                ></textarea>
              </div>
            </div>
          )}

          {/* ========== LANGKAH 2: KATEGORI TIKET ========== */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Toggle Gratis / Berbayar */}
              <div className="flex items-center justify-between p-4 bg-[#EEEDFA]/30 rounded-2xl border border-[#5953C7]/15">
                <div>
                  <div className="font-bold text-gray-900 text-sm">Jenis Tiket Event</div>
                  <div className="text-xs text-gray-500">Tentukan apakah tiket ini gratis atau berbayar.</div>
                </div>
                <div className="flex bg-white rounded-xl p-1 border border-gray-200 shadow-2xs">
                  <button 
                    type="button"
                    onClick={() => setIsFree(true)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      isFree ? 'bg-[#5953C7] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Gratis
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsFree(false)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      !isFree ? 'bg-[#5953C7] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Berbayar
                  </button>
                </div>
              </div>

              {/* Daftar Kategori Tiket */}
              {ticketTypes.map((ticket, index) => {
                const ticketErr = (errors.tickets && errors.tickets[index]) || {};
                return (
                  <div key={index} className="border border-gray-200 rounded-2xl p-6 relative bg-gray-50/50 space-y-4">
                    {ticketTypes.length > 1 && (
                      <button 
                        type="button"
                        onClick={() => removeTicket(index)} 
                        className="absolute top-5 right-5 text-gray-400 hover:text-red-600 transition-colors cursor-pointer p-1 rounded-lg hover:bg-red-50"
                        title="Hapus Kategori Tiket"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                    
                    <h3 className="text-xs font-black text-[#5953C7] tracking-wider uppercase bg-[#EEEDFA] px-2.5 py-1 rounded-md inline-block">
                      Kategori Tiket #{index + 1}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Nama Tiket */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                          Nama Tiket <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="text" 
                          value={ticket.name} 
                          onChange={(e) => handleTicketChange(index, 'name', e.target.value)} 
                          placeholder="Contoh: Reguler / VIP"
                          className={`w-full px-4 py-3 rounded-xl border bg-white text-sm font-medium focus:outline-none transition-all ${
                            ticketErr.name 
                              ? 'border-red-500 bg-red-50/20 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                              : 'border-gray-300 focus:border-[#5953C7]'
                          }`}
                        />
                        {ticketErr.name && (
                          <p className="text-xs text-red-600 mt-1 flex items-center gap-1 font-semibold animate-in fade-in duration-150">
                            <AlertCircle size={12} className="shrink-0" />
                            {ticketErr.name}
                          </p>
                        )}
                      </div>

                      {/* Harga Tiket */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                          Harga Tiket (Rp)
                        </label>
                        <input 
                          type="number" 
                          min="0"
                          placeholder="0"
                          value={isFree ? 0 : (ticket.price_idr === 0 ? '0' : (ticket.price_idr || ''))} 
                          disabled={isFree} 
                          onChange={(e) => handleTicketChange(index, 'price_idr', e.target.value)} 
                          className={`w-full px-4 py-3 rounded-xl border text-sm font-bold ${
                            isFree 
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' 
                              : ticketErr.price_idr
                              ? 'bg-white text-gray-900 border-red-500 focus:border-red-500'
                              : 'bg-white text-gray-900 border-gray-300 focus:border-[#5953C7]'
                          }`} 
                        />
                        {ticketErr.price_idr && (
                          <p className="text-xs text-red-600 mt-1 flex items-center gap-1 font-semibold animate-in fade-in duration-150">
                            <AlertCircle size={12} className="shrink-0" />
                            {ticketErr.price_idr}
                          </p>
                        )}
                      </div>

                      {/* Total Kuota */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                          Total Kuota <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="number" 
                          min="1"
                          placeholder="0"
                          value={ticket.quota === 0 ? '0' : (ticket.quota || '')} 
                          onChange={(e) => handleTicketChange(index, 'quota', e.target.value)} 
                          className={`w-full px-4 py-3 rounded-xl border bg-white text-sm font-bold focus:outline-none transition-all ${
                            ticketErr.quota 
                              ? 'border-red-500 bg-red-50/20 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                              : 'border-gray-300 focus:border-[#5953C7]'
                          }`} 
                        />
                        {ticketErr.quota && (
                          <p className="text-xs text-red-600 mt-1 flex items-center gap-1 font-semibold animate-in fade-in duration-150">
                            <AlertCircle size={12} className="shrink-0" />
                            {ticketErr.quota}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              <button 
                type="button"
                onClick={addTicket}
                className="w-full py-3.5 border-2 border-dashed border-[#5953C7]/30 text-[#5953C7] rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#EEEDFA]/30 transition-colors cursor-pointer text-sm"
              >
                <Plus size={18} /> Tambah Kategori Tiket Lainnya
              </button>
            </div>
          )}

          {/* ========== LANGKAH 3: TINJAU & PUBLIKASI ========== */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="bg-[#0a0f1c] rounded-2xl h-44 flex flex-col items-center justify-center text-white/40 p-4 border border-gray-800 relative overflow-hidden">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white/60 mb-2">
                  <ImageIcon size={24} />
                </div>
                <span className="text-xs font-bold text-white/70">EVENT 2 GO • Siap Dipublikasikan</span>
                <span className="text-[11px] text-white/40 mt-0.5">Sistem Tiket & Check-in QR Terintegrasi</span>
              </div>

              <div className="border border-gray-200 rounded-2xl p-6 bg-white space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-[#EEEDFA] text-[#5953C7] px-2.5 py-1 rounded-md">
                      {getCategoryLabel(formData.category)}
                    </span>
                    <h2 className="text-2xl font-black text-gray-900 mt-2">{formData.title || 'Judul Belum Diisi'}</h2>
                  </div>
                  <button 
                    onClick={() => setStep(1)} 
                    className="text-[#5953C7] text-xs font-bold hover:underline cursor-pointer bg-[#EEEDFA] px-3 py-1.5 rounded-lg"
                  >
                    Ubah Info
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600 pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <Calendar size={15} className="text-[#5953C7] shrink-0" />
                    <span>{formatDisplayDate()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={15} className="text-[#5953C7] shrink-0" />
                    <span className="truncate">{formData.venue || 'Lokasi belum diisi'}</span>
                  </div>
                </div>

                {formData.description && (
                  <p className="text-xs text-gray-500 pt-2 border-t border-gray-100 line-clamp-3">
                    {formData.description}
                  </p>
                )}
              </div>

              {/* Tinjauan Tiket */}
              <div className="border border-gray-200 rounded-2xl p-6 bg-white">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-900 text-sm">Kategori Tiket Terdaftar</h3>
                  <button 
                    onClick={() => setStep(2)} 
                    className="text-[#5953C7] text-xs font-bold hover:underline cursor-pointer bg-[#EEEDFA] px-3 py-1.5 rounded-lg"
                  >
                    Ubah Tiket
                  </button>
                </div>

                <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
                  {ticketTypes.map((t, i) => (
                    <div key={i} className="flex justify-between items-center p-3.5 bg-white hover:bg-gray-50/50 text-xs">
                      <div>
                        <div className="font-bold text-gray-900">{t.name}</div>
                        <div className="text-[11px] text-gray-500">{parseInt(t.quota, 10) || 0} Kuota Tiket Tersedia</div>
                      </div>
                      <span className={`font-black text-xs ${isFree || !t.price_idr || parseInt(t.price_idr, 10) === 0 ? 'text-emerald-600' : 'text-gray-900'}`}>
                        {isFree || !t.price_idr || parseInt(t.price_idr, 10) === 0 ? 'Gratis' : `Rp ${(parseInt(t.price_idr, 10) || 0).toLocaleString('id-ID')}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Info Panduan Status Draft & Publikasi */}
              <div className="p-4 rounded-2xl bg-[#EEEDFA]/70 border border-[#5953C7]/20 text-xs text-gray-700 flex items-start gap-3">
                <span className="text-base select-none">💡</span>
                <div className="space-y-1">
                  <p className="font-bold text-[#5953C7]">Opsi Penyimpanan Event:</p>
                  <p className="text-gray-600">
                    • <strong>Simpan sebagai Draft</strong>: Event tersimpan aman di akun Anda, belum terlihat oleh pengunjung di katalog publik, dan tiket belum bisa dipesan. Anda dapat mempublikasikannya nanti dari halaman Kelola Event.
                  </p>
                  <p className="text-gray-600">
                    • <strong>Publikasikan Sekarang</strong>: Event langsung ditayangkan di katalog publik dan siap menerima pendaftaran tiket.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer Navigasi Bawah */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 py-4 px-6 md:px-12 flex justify-between items-center z-20 shadow-lg">
        <button 
          onClick={step === 1 ? () => navigate('/dashboard') : () => setStep(step - 1)} 
          className="px-6 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors cursor-pointer text-sm"
        >
          {step === 1 ? 'Batal' : 'Kembali'}
        </button>

        {step === 3 ? (
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button 
              onClick={() => handleSubmit(false)} 
              disabled={loading}
              className="px-4 sm:px-6 py-2.5 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-100 hover:border-gray-400 transition-colors shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-xs sm:text-sm flex items-center gap-1.5"
            >
              {loading && publishActionType === 'draft' ? 'Menyimpan...' : 'Simpan sebagai Draft'}
            </button>
            <button 
              onClick={() => handleSubmit(true)} 
              disabled={loading}
              className="px-5 sm:px-8 py-2.5 bg-[#5953C7] text-white font-bold rounded-xl hover:bg-[#4842b0] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer text-xs sm:text-sm"
            >
              {loading && publishActionType === 'publish' ? 'Mempublikasikan...' : 'Publikasikan Sekarang'}
            </button>
          </div>
        ) : (
          <button 
            onClick={handleNextStep} 
            className="px-8 py-2.5 bg-[#5953C7] text-white font-bold rounded-xl hover:bg-[#4842b0] transition-colors shadow-sm cursor-pointer text-sm"
          >
            Lanjut ke Langkah Berikutnya
          </button>
        )}
      </div>

      {/* Modal Sukses Modern */}
      {showSuccessModal && createdEvent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center shadow-2xl animate-in zoom-in-95 duration-200 space-y-5">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-xs ${
              publishActionType === 'draft' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
            }`}>
              {publishActionType === 'draft' ? <FileText size={34} /> : <CheckCircle2 size={36} />}
            </div>

            <div>
              <span className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${
                publishActionType === 'draft' 
                  ? 'bg-amber-50 text-amber-700 border-amber-200' 
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                {publishActionType === 'draft' ? 'Tersimpan sebagai Draft' : 'Publikasi Berhasil'}
              </span>
              <h3 className="text-2xl font-black text-gray-900 mt-2">
                {publishActionType === 'draft' ? 'Draft Event Berhasil Disimpan!' : 'Event Berhasil Dipublikasikan!'}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {publishActionType === 'draft' 
                  ? `Event "${createdEvent.title || formData.title}" tersimpan aman di akun Anda dan belum tampil di katalog publik. Anda dapat mempublikasikannya kapan saja saat siap.` 
                  : `Event "${createdEvent.title || formData.title}" telah aktif dan siap menerima pendaftaran tiket dari peserta.`}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-left text-xs space-y-1.5 text-gray-600">
              <div className="flex justify-between">
                <span className="text-gray-400">Status Event:</span>
                <span className={`font-bold ${publishActionType === 'draft' ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {publishActionType === 'draft' ? 'Draft (Belum Publik)' : 'Aktif & Dipublikasikan'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Kategori:</span>
                <span className="font-bold text-gray-900">{getCategoryLabel(formData.category)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tanggal:</span>
                <span className="font-bold text-gray-900">{formData.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Lokasi:</span>
                <span className="font-bold text-gray-900">{formData.venue}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              <button 
                onClick={() => navigate(`/manage-event/${createdEvent.id}`)}
                className="w-full py-3 bg-[#5953C7] text-white rounded-xl font-bold text-sm hover:bg-[#4842b0] transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2"
              >
                Buka Kelola Event Sekarang <ExternalLink size={15} />
              </button>
              <button 
                onClick={() => navigate('/dashboard')}
                className="w-full py-2.5 text-gray-600 font-bold text-xs hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
              >
                Kembali ke Beranda Panitia
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuatEvent;