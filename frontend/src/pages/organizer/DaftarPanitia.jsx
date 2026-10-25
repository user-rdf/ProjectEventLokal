import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ClipboardList, Ticket } from 'lucide-react';

const DaftarPanitia = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama: 'Nabila Putri',
    organisasi: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulasi daftar berhasil, langsung arahkan ke Dashboard
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 font-sans bg-white">
      
      {/* Sisi Kiri (Background Biru Gelap & Ilustrasi) */}
      <div className="bg-[#014860] p-12 lg:p-16 flex flex-col justify-between text-white relative overflow-hidden">
        {/* Logo Atas */}
        <div className="flex items-center gap-3">
          <div className="bg-white text-[#014860] p-1.5 rounded-md font-bold text-sm">EL</div>
          <span className="font-bold text-lg text-white">EventLokal</span>
        </div>

        {/* Konten Tengah */}
        <div className="my-auto py-12">
          {/* Ilustrasi Kotak & Tiket */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-20 bg-teal-800/60 rounded-xl border border-teal-600/40 flex flex-col items-center justify-center relative shadow-lg">
              <ClipboardList className="text-cyan-400 w-8 h-8" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-white text-xs font-bold">✓</div>
            </div>
            <div className="w-24 h-16 bg-teal-800/40 rounded-xl border border-teal-600/30 flex items-center justify-center shadow-lg transform rotate-6">
              <Ticket className="text-cyan-300 w-8 h-8" />
            </div>
          </div>

          <h1 className="text-3xl lg:text-4xl font-bold leading-snug mb-4">
            Kelola event dari pendaftaran sampai pintu masuk.
          </h1>
          <p className="text-teal-100/80 text-sm leading-relaxed max-w-md">
            Publikasikan event, pantau kuota per kategori tiket, dan scan QR peserta langsung dari HP panitia.
          </p>
        </div>

        {/* Statistik Bawah */}
        <div className="grid grid-cols-3 gap-4 border-t border-teal-900/50 pt-6">
          <div>
            <div className="text-xl font-bold">1.200+</div>
            <div className="text-xs text-teal-200/70">event kampus</div>
          </div>
          <div>
            <div className="text-xl font-bold">86 rb</div>
            <div className="text-xs text-teal-200/70">tiket terkirim</div>
          </div>
          <div>
            <div className="text-xl font-bold">2 dtk</div>
            <div className="text-xs text-teal-200/70">per check-in</div>
          </div>
        </div>
      </div>

      {/* Sisi Kanan (Formulir Pendaftaran) */}
      <div className="p-8 lg:p-24 flex flex-col justify-center bg-white">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Daftar sebagai panitia</h2>
          <p className="text-sm text-gray-500 mb-8">Buat akun untuk organisasi atau himpunanmu.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nama lengkap</label>
              <input 
                type="text" 
                value={formData.nama}
                onChange={(e) => setFormData({...formData, nama: e.target.value})}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#014860] text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Organisasi</label>
              <input 
                type="text" 
                placeholder="Himpunan" 
                value={formData.organisasi}
                onChange={(e) => setFormData({...formData, organisasi: e.target.value})}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#014860] text-sm"
              />
              <p className="text-xs text-gray-400 mt-1">Contoh: HIMAKOM UGM, BEM FT Undip</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
              <input 
                type="email" 
                placeholder="panitia@himpunan.id" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#014860] text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Kata sandi</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#014860] text-sm"
              />
            </div>

            <button 
              type="submit"
              className="w-full py-3.5 bg-[#014860] text-white font-semibold rounded-xl hover:bg-teal-900 transition-colors shadow-sm text-sm mt-2"
            >
              Buat akun panitia
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-8 text-center text-xs text-gray-500 space-y-2">
            <p>
              Sudah punya akun? <Link to="/login" className="text-[#014860] font-semibold hover:underline">Masuk</Link>
            </p>
            <p className="text-gray-400">
              Mau ikut event? <span className="text-gray-600 font-medium cursor-pointer hover:underline">Lihat Daftar Event</span>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default DaftarPanitia;