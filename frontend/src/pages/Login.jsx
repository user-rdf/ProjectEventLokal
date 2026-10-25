import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { api, setToken } from '../api/client';

const Login = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'register') {
        await api('/auth/register', {
          method: 'POST',
          body: { name, email, password }
        });
      }

      const res = await api('/auth/login', {
        method: 'POST',
        body: { email, password }
      });

      if (res?.access_token) {
        setToken(res.access_token);
        navigate('/manage');
      } else {
        setError('Token otentikasi tidak ditemukan.');
      }
    } catch (err) {
      setError(err.message || 'Gagal masuk. Periksa kembali email dan kata sandi Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans">
      {/* Kiri: Branding Modern */}
      <div className="hidden lg:flex w-1/2 bg-[#014860] text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Dekorasi Aksen Lingkaran Glow */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-16 hover:opacity-95 transition-opacity">
            <div className="bg-white px-3.5 py-2 rounded-2xl shadow-md">
              <img
                src="/images/Logo logo_EVENT2 GO.png"
                alt="EVENT 2 GO"
                className="h-7 w-auto object-contain"
              />
            </div>
          </Link>


          <h1 className="text-4xl xl:text-5xl font-black leading-tight mb-5 tracking-tight">
            Kelola event dari<br />pendaftaran sampai<br />pintu masuk.
          </h1>
          <p className="text-teal-100/90 max-w-md text-base leading-relaxed">
            Publikasikan event kampus, pantau kuota tiket real-time, dan scan QR peserta langsung dari smartphone panitia tanpa ribet.
          </p>
        </div>

        <div className="relative z-10 pt-10 border-t border-teal-700/60 flex items-center gap-10">
          <div>
            <div className="text-3xl font-black tracking-tight text-white">100%</div>
            <div className="text-teal-200 text-xs font-medium mt-0.5">Real-time sync</div>
          </div>
          <div>
            <div className="text-3xl font-black tracking-tight text-white">Atomik</div>
            <div className="text-teal-200 text-xs font-medium mt-0.5">Bebas overquota</div>
          </div>
          <div>
            <div className="text-3xl font-black tracking-tight text-white">&lt; 1 dtk</div>
            <div className="text-teal-200 text-xs font-medium mt-0.5">Check-in scanner</div>
          </div>
        </div>
      </div>

      {/* Kanan: Form Login / Register */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center px-8 sm:px-16 md:px-24 py-12 relative">
        <div className="max-w-md w-full mx-auto">
          {/* Tombol Kembali ke Beranda */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>

          <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
            {mode === 'login' ? 'Masuk ke Kelola Event' : 'Daftar Akun Panitia'}
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            {mode === 'login'
              ? 'Khusus panitia dan staf scanner. Peserta tidak perlu login.'
              : 'Daftarkan kepanitiaan atau organisasi Anda untuk mulai membuat event.'}
          </p>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm p-3.5 rounded-xl flex items-start gap-2.5">
              <span className="font-bold shrink-0">Peringatan:</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Nama Lengkap / Nama Panitia
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: BEM Fasilkom / Panitia Seminar"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#014860] focus:ring-2 focus:ring-[#014860]/20 transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Email Akun Panitia
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="organizer@eventlokal.test"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#014860] focus:ring-2 focus:ring-[#014860]/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 8 karakter (password123)"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#014860] focus:ring-2 focus:ring-[#014860]/20 transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#014860] hover:bg-[#013547] text-white py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2"
            >
              {loading
                ? 'Memproses...'
                : mode === 'login'
                ? 'Masuk ke Dashboard'
                : 'Daftar dan Buat Akun'}
            </button>
          </form>

          {/* Toggle Login <-> Register */}
          <div className="mt-8 text-center text-xs text-gray-500">
            {mode === 'login' ? (
              <p>
                Belum punya akun panitia?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setError('');
                  }}
                  className="text-[#014860] font-black hover:underline cursor-pointer ml-1"
                >
                  Daftar di sini
                </button>
              </p>
            ) : (
              <p>
                Sudah memiliki akun?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError('');
                  }}
                  className="text-[#014860] font-black hover:underline cursor-pointer ml-1"
                >
                  Masuk sekarang
                </button>
              </p>
            )}
          </div>

          {/* Demo Credentials Helper */}
          <div className="mt-8 p-3.5 bg-gray-50 border border-gray-200/80 rounded-xl text-[11px] text-gray-500 space-y-1">
            <span className="font-bold text-gray-700 block">Akun Demo (Evaluasi / Ujian):</span>
            <div>Panitia: <code className="bg-gray-200/60 px-1.5 py-0.5 rounded text-gray-800">organizer@eventlokal.test</code> / <code className="bg-gray-200/60 px-1.5 py-0.5 rounded text-gray-800">password123</code></div>
            <div>Staf Scanner: <code className="bg-gray-200/60 px-1.5 py-0.5 rounded text-gray-800">staff@eventlokal.test</code> / <code className="bg-gray-200/60 px-1.5 py-0.5 rounded text-gray-800">password123</code></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;