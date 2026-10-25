import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ClipboardList, Ticket, AlertCircle, RotateCw, Eye, EyeOff, CheckCircle2, User, Mail, Lock, Building } from 'lucide-react';
import { api, setToken } from '../../api/client';

export default function DaftarPanitia({ initialMode }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Tentukan mode awal ('login' atau 'register') berdasarkan prop atau URL
  const determineInitialMode = () => {
    if (initialMode) return initialMode;
    if (location.pathname.includes('login')) return 'login';
    return 'register';
  };

  const [mode, setMode] = useState(determineInitialMode()); // 'login' | 'register'
  
  // State Input Form
  const [nama, setNama] = useState('');
  const [organisasi, setOrganisasi] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // State Status Pengiriman
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Sinkronkan mode jika route URL berubah
  useEffect(() => {
    setMode(determineInitialMode());
    setError('');
  }, [location.pathname, initialMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password;

    try {
      if (mode === 'register') {
        const orgSuffix = organisasi.trim() ? ` (${organisasi.trim()})` : '';
        const fullName = `${nama.trim()}${orgSuffix}`;

        // 1. Registrasi akun panitia baru
        await api('/auth/register', {
          method: 'POST',
          body: {
            name: fullName,
            email: cleanEmail,
            password: cleanPassword
          }
        });

        // 2. Login otomatis setelah registrasi berhasil
        const loginRes = await api('/auth/login', {
          method: 'POST',
          body: {
            email: cleanEmail,
            password: cleanPassword
          }
        });

        if (loginRes?.access_token) {
          setToken(loginRes.access_token);
          localStorage.setItem('organizer_name', fullName);
          navigate('/dashboard');
        } else {
          setMode('login');
          setError('Pendaftaran berhasil! Silakan masuk dengan kata sandi Anda.');
        }
      } else {
        // Mode Login
        const res = await api('/auth/login', {
          method: 'POST',
          body: {
            email: cleanEmail,
            password: cleanPassword
          }
        });

        if (res?.access_token) {
          setToken(res.access_token);
          navigate('/dashboard');
        } else {
          setError('Token otentikasi tidak ditemukan.');
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      if (err.status === 401 || err.message?.toLowerCase().includes('credential') || err.message?.toLowerCase().includes('password')) {
        setError('Email atau kata sandi salah. Silakan periksa kembali.');
      } else if (err.message?.includes('duplicate') || err.message?.includes('already exists') || err.code === 'EL001') {
        setError('Alamat email ini sudah terdaftar. Silakan beralih ke tab Masuk.');
      } else {
        setError(err.message || 'Terjadi kesalahan saat memproses permintaan.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 font-sans bg-white selection:bg-[#5953C7] selection:text-white">
      
      {/* Sisi Kiri (Branding Modern EVENT 2 GO) */}
      <div className="bg-[#5953C7] p-8 sm:p-12 lg:p-16 flex flex-col justify-between text-white relative overflow-hidden">
        {/* Dekorasi Aksen Lingkaran Glow */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl pointer-events-none" />

        {/* Logo Atas */}
        <div className="relative z-10 flex items-center gap-3">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="bg-white px-3.5 py-1.5 rounded-2xl shadow-md group-hover:scale-105 transition-transform">
              <img
                src="/images/Logo logo_EVENT2 GO.png"
                alt="EVENT 2 GO"
                className="h-7 w-auto object-contain"
              />
            </div>
            <span className="bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-bold ml-1">
              Portal Panitia
            </span>
          </Link>
        </div>

        {/* Konten Tengah */}
        <div className="my-auto py-10 relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-20 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex flex-col items-center justify-center relative shadow-lg">
              <ClipboardList className="text-[#EFC936] w-8 h-8" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                ✓
              </div>
            </div>
            <div className="w-24 h-16 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center shadow-lg transform rotate-6">
              <Ticket className="text-white w-8 h-8" />
            </div>
          </div>

          <h1 className="text-3xl lg:text-4xl font-black leading-tight mb-4 tracking-tight">
            Kelola event kampus dari pendaftaran hingga pintu masuk.
          </h1>
          <p className="text-purple-100 text-sm leading-relaxed max-w-md">
            Publikasikan event, kelola sistem antrean otomatis (waitlist), dan pantau kehadiran peserta melalui scanner QR terintegrasi.
          </p>
        </div>

        {/* Statistik Bawah */}
        <div className="grid grid-cols-3 gap-4 border-t border-white/20 pt-6 relative z-10">
          <div>
            <div className="text-xl font-black">1.200+</div>
            <div className="text-xs text-purple-200">event kampus</div>
          </div>
          <div>
            <div className="text-xl font-black">86 rb</div>
            <div className="text-xs text-purple-200">tiket terkirim</div>
          </div>
          <div>
            <div className="text-xl font-black">2 dtk</div>
            <div className="text-xs text-purple-200">per check-in</div>
          </div>
        </div>
      </div>

      {/* Sisi Kanan (Formulir Masuk / Daftar) */}
      <div className="p-8 sm:p-12 lg:p-20 flex flex-col justify-center bg-white">
        <div className="max-w-md w-full mx-auto">
          
          {/* Header Judul */}
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              {mode === 'login' ? 'Masuk ke Portal Panitia' : 'Daftar Akun Panitia'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {mode === 'login' 
                ? 'Kelola event, pantau antrean waitlist, dan scan tiket peserta.' 
                : 'Buat akun untuk organisasi atau himpunanmu di EVENT 2 GO.'}
            </p>
          </div>

          {/* Tab Switcher: Masuk vs Daftar Baru */}
          <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-2xl mb-6 select-none">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); }}
              className={`py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-[#5953C7] shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(''); }}
              className={`py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-white text-[#5953C7] shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Daftar Baru
            </button>
          </div>

          {/* Alert Error / Sukses */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-700 animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1 text-xs">
                <p className="font-bold">{error}</p>
                {error.includes('Masuk') && (
                  <button
                    type="button"
                    onClick={() => { setMode('login'); setError(''); }}
                    className="mt-1 text-[#5953C7] font-bold block hover:underline cursor-pointer"
                  >
                    Beralih ke tab Masuk sekarang &rarr;
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Form Utama */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Input khusus Mode Register: Nama Lengkap */}
            {mode === 'register' && (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Nama Lengkap
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
                  <input 
                    type="text" 
                    placeholder="Contoh: Nabila Putri"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#5953C7] focus:ring-2 focus:ring-[#5953C7]/10 text-sm transition-all"
                  />
                </div>
              </div>
            )}

            {/* Input khusus Mode Register: Organisasi / Himpunan */}
            {mode === 'register' && (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Organisasi / Himpunan
                </label>
                <div className="relative flex items-center">
                  <Building className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
                  <input 
                    type="text" 
                    placeholder="Contoh: HIMAKOM UGM, BEM FT Undip" 
                    value={organisasi}
                    onChange={(e) => setOrganisasi(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#5953C7] focus:ring-2 focus:ring-[#5953C7]/10 text-sm transition-all"
                  />
                </div>
              </div>
            )}

            {/* Input Email (Ada di Mode Login & Register) */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Alamat Email
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
                <input 
                  type="email" 
                  placeholder={mode === 'register' ? 'panitia@himpunan.id' : 'nama@domain.com'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#5953C7] focus:ring-2 focus:ring-[#5953C7]/10 text-sm transition-all"
                />
              </div>
            </div>

            {/* Input Kata Sandi (Ada di Mode Login & Register) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700">
                  Kata Sandi
                </label>
                {mode === 'login' && (
                  <button 
                    type="button" 
                    onClick={() => alert('Untuk demo, gunakan organizer@eventlokal.test dengan sandi password123')}
                    className="text-[11px] text-[#5953C7] font-semibold hover:underline cursor-pointer"
                  >
                    Lupa sandi?
                  </button>
                )}
              </div>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder={mode === 'register' ? 'Minimal 6 karakter' : 'Masukkan kata sandi'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={mode === 'register' ? 6 : undefined}
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#5953C7] focus:ring-2 focus:ring-[#5953C7]/10 text-sm transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-gray-400 hover:text-gray-600 cursor-pointer p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Tombol Submit */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#5953C7] hover:bg-[#473ebf] text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg text-xs sm:text-sm uppercase tracking-wider mt-2 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>{mode === 'register' ? 'Membuat Akun Panitia...' : 'Memverifikasi Akun...'}</span>
                </>
              ) : (
                <span>{mode === 'register' ? 'Buat Akun Panitia Sekarang' : 'Masuk ke Beranda Panitia'}</span>
              )}
            </button>
          </form>

          {/* Quick Demo Hint */}
          <div className="mt-4 p-3 bg-purple-50/70 border border-purple-100 rounded-xl text-[11px] text-purple-900 flex items-center justify-between">
            <span>Akun Demo: <strong>organizer@eventlokal.test</strong> / <strong>password123</strong></span>
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setEmail('organizer@eventlokal.test');
                setPassword('password123');
              }}
              className="text-[#5953C7] font-bold hover:underline cursor-pointer ml-2 shrink-0"
            >
              Isi Otomatis
            </button>
          </div>

          {/* Footer Link Switcher */}
          <div className="mt-6 text-center text-xs text-gray-500 space-y-2">
            <p>
              {mode === 'login' ? 'Belum punya akun panitia?' : 'Sudah punya akun panitia?'}{' '}
              <button
                type="button"
                onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
                className="text-[#5953C7] font-bold hover:underline cursor-pointer"
              >
                {mode === 'login' ? 'Daftar di sini' : 'Masuk di sini'}
              </button>
            </p>
            <p className="text-gray-400">
              Ingin mencari event kampus? <Link to="/events" className="text-gray-600 font-semibold hover:underline">Lihat Katalog Event</Link>
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}