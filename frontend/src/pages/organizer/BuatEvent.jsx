import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, UploadCloud, Check, Image as ImageIcon, Calendar, MapPin, Target, Plus, Trash2 } from 'lucide-react';

const BuatEvent = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isFree, setIsFree] = useState(true);
  const [loading, setLoading] = useState(false);
  const [organizerName, setOrganizerName] = useState('Panitia');

  // 1. STATE UNTUK FORM DATA
  const [formData, setFormData] = useState({
    title: '',
    category: 'workshop', // Default valid
    description: '',
    venue: '',
    date: '',
    startTime: '',
    endTime: ''
  });

  // 2. STATE UNTUK TIKET
  const [ticketTypes, setTicketTypes] = useState([
    { name: 'Reguler', price_idr: 0, quota: 100 }
  ]);

  useEffect(() => {
    // Ambil nama organizer dari localStorage atau backend (sesuaikan dengan key login)
    const name = localStorage.getItem('organizer_name') || 'Panitia Event';
    setOrganizerName(name);
  }, []);

  // Handle perubahan input teks/tanggal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle perubahan input tiket
  const handleTicketChange = (index, field, value) => {
    const newTickets = [...ticketTypes];
    newTickets[index][field] = field === 'price_idr' || field === 'quota' ? (parseInt(value) || 0) : value;
    setTicketTypes(newTickets);
  };

  const addTicket = () => {
    setTicketTypes([...ticketTypes, { name: 'VIP', price_idr: 0, quota: 50 }]);
  };

  const removeTicket = (index) => {
    if (ticketTypes.length > 1) {
      setTicketTypes(ticketTypes.filter((_, i) => i !== index));
    }
  };

  // 3. FUNGSI SUBMIT KE BACKEND
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      
      // Validasi dasar
      if (!formData.title || !formData.date || !formData.startTime) {
        alert('Mohon lengkapi Judul, Tanggal, dan Jam Mulai event.');
        setLoading(false);
        return;
      }

      // Gabungkan tanggal dan waktu menjadi format ISO 8601 untuk backend
      const starts_at = new Date(`${formData.date}T${formData.startTime}`).toISOString();
      const ends_at = formData.endTime ? new Date(`${formData.date}T${formData.endTime}`).toISOString() : starts_at;

      const payload = {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        venue: formData.venue,
        starts_at: starts_at,
        ends_at: ends_at,
        ticket_types: ticketTypes.map(t => ({
          name: t.name,
          price_idr: isFree ? 0 : t.price_idr, // Paksa 0 jika gratis
          quota: t.quota
        }))
      };

      const response = await fetch('http://localhost:8000/api/v1/manage/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert('Event berhasil dibuat dan dipublikasikan!');
        navigate('/dashboard');
      } else {
        const errorData = await response.json();
        alert(`Gagal membuat event: ${errorData.detail || 'Cek konsol browser'}`);
        console.error("Backend Error:", errorData);
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert('Terjadi kesalahan jaringan. Pastikan backend berjalan.');
    } finally {
      setLoading(false);
    }
  };

  // Helper untuk format tampilan di Langkah 3
  const formatDisplayDate = () => {
    if (!formData.date) return 'Tanggal belum diisi';
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const d = new Date(formData.date);
    return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}, ${formData.startTime} WIB`;
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      {/* Navbar Atas */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-[#014860] text-white p-1.5 rounded-md font-bold text-sm">EL</div>
          <span className="font-bold text-lg text-[#014860]">EventLokal</span>
          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md font-medium ml-2">Panitia</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <div className="text-sm font-bold text-gray-900">{organizerName}</div>
            <div className="text-xs text-gray-500">Organizer</div>
          </div>
          <div className="bg-purple-100 text-purple-700 w-10 h-10 rounded-full flex items-center justify-center font-bold">
            {organizerName.charAt(0).toUpperCase()}
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto mt-8 px-6">
        <button onClick={() => navigate('/dashboard')} className="text-[#014860] text-sm font-medium flex items-center gap-1 mb-6 hover:underline">
          <ChevronLeft size={16} /> Beranda Panitia
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Buat Event</h1>

        {/* Stepper Indikator */}
        <div className="flex items-center justify-between mb-10 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-gray-200 -z-10"></div>
          <div className="flex items-center gap-2 bg-gray-50 pr-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-[#014860] text-white' : 'bg-gray-200 text-gray-500'}`}>
              {step > 1 ? <Check size={16} /> : '1'}
            </div>
            <span className={`text-sm ${step >= 1 ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>Info event</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 px-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-[#014860] text-white' : 'bg-gray-200 text-gray-500'}`}>
              {step > 2 ? <Check size={16} /> : '2'}
            </div>
            <span className={`text-sm ${step >= 2 ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>Kategori tiket</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 pl-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 3 ? 'bg-[#014860] text-white' : 'bg-gray-200 text-gray-500'}`}>3</div>
            <span className={`text-sm ${step === 3 ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>Tinjau & publikasi</span>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm mb-24">
          
          {/* ========== LANGKAH 1: INFO EVENT ========== */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Judul event *</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="Contoh: Workshop UI/UX untuk Pemula" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#014860]" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Kategori *</label>
                <select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#014860] text-gray-900 appearance-none bg-white">
                  <option value="workshop">Workshop</option>
                  <option value="seminar">Seminar</option>
                  <option value="himpunan">Himpunan</option>
                  <option value="kampus">Kampus</option>
                  <option value="komunitas">Komunitas</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-semibold text-gray-700">Poster</label>
                  <span className="text-xs text-gray-400">Opsional (Belum diimplementasi di backend v1.3)</span>
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center bg-gray-50 text-center">
                  <UploadCloud className="text-gray-400 w-10 h-10 mb-3" />
                  <p className="text-sm font-semibold text-gray-700 mb-1">Unggah poster</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tanggal *</label>
                  <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#014860] text-gray-900 bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Jam mulai *</label>
                  <input type="time" name="startTime" value={formData.startTime} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#014860] text-gray-900 bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Jam selesai</label>
                  <input type="time" name="endTime" value={formData.endTime} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#014860] text-gray-900 bg-white" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Lokasi *</label>
                  <div className="relative">
                    <Target size={20} className="absolute left-4 top-3.5 text-gray-400" />
                    <input type="text" name="venue" value={formData.venue} onChange={handleInputChange} placeholder="Gedung, ruangan, atau alamat" className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#014860] bg-white" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="4" placeholder="Ceritakan agenda, pembicara, dan apa yang perlu dibawa peserta..." className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#014860] bg-white resize-y"></textarea>
              </div>
            </div>
          )}

          {/* ========== LANGKAH 2: KATEGORI TIKET ========== */}
          {step === 2 && (
            <div className="space-y-6">
              {ticketTypes.map((ticket, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-6 relative">
                  {ticketTypes.length > 1 && (
                    <button onClick={() => removeTicket(index)} className="absolute top-4 right-4 text-red-500 hover:text-red-700">
                      <Trash2 size={20} />
                    </button>
                  )}
                  <h3 className="text-xs font-bold text-gray-400 tracking-wider mb-4 uppercase">Tiket {index + 1}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Nama tiket</label>
                      <input type="text" value={ticket.name} onChange={(e) => handleTicketChange(index, 'name', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#014860]" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Harga (Rp)</label>
                      <input type="number" value={isFree ? 0 : ticket.price_idr} disabled={isFree} onChange={(e) => handleTicketChange(index, 'price_idr', e.target.value)} className={`w-full px-4 py-3 rounded-xl border border-gray-200 ${isFree ? 'bg-gray-100 text-gray-400' : 'bg-white'}`} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Kuota</label>
                      <input type="number" value={ticket.quota} onChange={(e) => handleTicketChange(index, 'quota', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#014860]" />
                    </div>
                  </div>
                  {index === 0 && (
                    <div className="flex items-center gap-3">
                      <div onClick={() => setIsFree(!isFree)} className={`w-12 h-6 rounded-full cursor-pointer relative transition-colors ${isFree ? 'bg-[#014860]' : 'bg-gray-300'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${isFree ? 'translate-x-7' : 'translate-x-1'}`}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700">Event gratis (Harga Rp 0 untuk semua tiket)</span>
                    </div>
                  )}
                </div>
              ))}
              <button type="button" onClick={addTicket} className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-semibold hover:bg-gray-50 hover:text-gray-700 transition-colors flex items-center justify-center gap-2">
                <Plus size={20} /> Tambah kategori tiket
              </button>
            </div>
          )}

          {/* ========== LANGKAH 3: TINJAU & PUBLIKASI ========== */}
          {step === 3 && (
            <div className="space-y-8">
              <div>
                <div className="w-full h-48 bg-teal-50/50 rounded-xl border border-teal-100 flex flex-col items-center justify-center text-teal-700 mb-6">
                  <ImageIcon size={32} className="mb-2 opacity-50" />
                  <span className="text-sm font-medium">Tanpa poster</span>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-semibold text-[#014860] bg-teal-50 px-2 py-1 rounded mb-2 inline-block capitalize">{formData.category || 'Kategori'}</span>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{formData.title || 'Judul Event Belum Diisi'}</h2>
                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>{formatDisplayDate()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        <span>{formData.venue || 'Lokasi belum diisi'}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setStep(1)} className="text-[#014860] text-sm font-semibold hover:underline">Ubah</button>
                </div>
              </div>
              <hr className="border-gray-200" />
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-900">Kategori tiket</h3>
                  <button onClick={() => setStep(2)} className="text-[#014860] text-sm font-semibold hover:underline">Ubah</button>
                </div>
                {ticketTypes.map((t, i) => (
                  <div key={i} className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="font-semibold text-gray-900">{t.name}</span>
                    <span className="text-gray-500 text-sm">{t.quota} kuota</span>
                    <span className={`font-bold text-sm ${isFree || t.price_idr === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                      {isFree || t.price_idr === 0 ? 'Gratis' : `Rp ${t.price_idr.toLocaleString('id-ID')}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer Navigasi Bawah */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 py-4 px-6 md:px-12 flex justify-between items-center z-10">
        <button onClick={step === 1 ? () => navigate('/dashboard') : () => setStep(step - 1)} className="px-6 py-2.5 text-gray-600 font-semibold hover:bg-gray-100 rounded-lg transition-colors">
          {step === 1 ? 'Batal' : 'Kembali'}
        </button>
        <button 
          onClick={step === 3 ? handleSubmit : () => setStep(step + 1)} 
          disabled={loading}
          className="px-8 py-2.5 bg-[#014860] text-white font-semibold rounded-lg hover:bg-teal-900 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? 'Memproses...' : (step === 3 ? 'Publikasikan' : 'Lanjut')}
        </button>
      </div>
    </div>
  );
};

export default BuatEvent;