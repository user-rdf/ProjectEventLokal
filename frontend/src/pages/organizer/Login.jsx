import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ClipboardList, Ticket, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulasi login sukses, langsung arahkan ke Dashboard panitia
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 font-sans bg-white">
      
      {/* Sisi Kiri (Background Biru Gelap & Ilustrasi - Konsisten dengan Daftar) */}
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

      {/* Sisi Kanan (Formulir Masuk) */}
      <div className="p-8 lg:p-24 flex flex-col justify-center bg-white">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Masuk ke Kelola Event</h2>
          <p className="text-sm text-gray-500 mb-8">Khusus panitia. Peserta tidak perlu akun.</p>

          <form onSubmit={handleLogin} className="space-y-5">
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
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-semibold text-gray-700">Kata sandi</label>
                <span className="text-xs text-[#014860] font-semibold cursor-pointer hover:underline">Lupa kata sandi?</span>
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Minimal 8 karakter" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#014860] text-sm pr-12"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-3.5 bg-[#014860] text-white font-semibold rounded-xl hover:bg-teal-900 transition-colors shadow-sm text-sm mt-2"
            >
              Masuk
            </button>
          </form>

          {/* Footer Link yang Terhubung ke Halaman Daftar Panitia */}
          <div className="mt-8 text-center text-xs text-gray-500 space-y-2">
            <p>
              Belum punya akun panitia? <Link to="/daftar-panitia" className="text-[#014860] font-semibold hover:underline">Daftar sebagai panitia</Link>
            </p>
            <p className="text-gray-400">
              Mau ikut event? <Link to="/" className="text-gray-600 font-medium hover:underline">Lihat Daftar Event</Link>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Login;