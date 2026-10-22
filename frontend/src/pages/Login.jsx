import React from 'react';
import { EyeOff } from 'lucide-react';

const Login = () => {
  return (
    <div className="min-h-screen flex">
      {/* Kiri: Branding */}
      <div className="hidden lg:flex w-1/2 bg-[#014860] text-white p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-24">
             <div className="bg-white text-[#014860] p-1.5 rounded-md font-bold">EL</div>
             <span className="font-bold text-xl">EventLokal</span>
          </div>
          
          {/* Ilustrasi Kotak Placeholder */}
          <div className="w-48 h-32 bg-teal-700/50 rounded-2xl mb-12 flex items-center justify-center">
            [Ilustrasi Icon]
          </div>
          
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Kelola event dari<br/>pendaftaran sampai pintu<br/>masuk.
          </h1>
          <p className="text-teal-100 max-w-md">
            Publikasikan event, pantau kuota per kategori tiket, dan scan QR peserta langsung dari HP panitia.
          </p>
        </div>

        <div className="flex gap-12">
          <div>
            <div className="text-2xl font-bold">1.200+</div>
            <div className="text-teal-200 text-sm">event kampus</div>
          </div>
          <div>
            <div className="text-2xl font-bold">86 rb</div>
            <div className="text-teal-200 text-sm">tiket terkirim</div>
          </div>
          <div>
            <div className="text-2xl font-bold">2 dtk</div>
            <div className="text-teal-200 text-sm">per check-in</div>
          </div>
        </div>
      </div>

      {/* Kanan: Form */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center px-12 md:px-24">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Masuk ke Kelola Event</h2>
        <p className="text-gray-500 mb-8">Khusus panitia. Peserta tidak perlu akun.</p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input 
              type="email" 
              placeholder="panitia@himpunan.id" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#014860]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Kata sandi</label>
            <div className="relative">
              <input 
                type="password" 
                placeholder="Minimal 8 karakter" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#014860]"
              />
              <EyeOff className="absolute right-4 top-3.5 text-gray-400 w-5 h-5 cursor-pointer" />
            </div>
            <div className="flex justify-end mt-2">
              <a href="#" className="text-sm text-[#014860] font-medium">Lupa kata sandi?</a>
            </div>
          </div>

          <button className="w-full bg-[#014860] text-white py-3 rounded-xl font-bold hover:bg-teal-900 transition-colors mt-4">
            Masuk
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          Belum punya akun panitia? <a href="#" className="text-[#014860] font-bold">Daftar sebagai panitia</a>
        </p>
      </div>
    </div>
  );
};

export default Login;