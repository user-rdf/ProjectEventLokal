import React from 'react';
import { Calendar, Clock, MapPin, Users, UserCheck } from 'lucide-react';

const InfoTab = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
      
      {/* Kolom Kiri (Poster & Detail) */}
      <div className="lg:col-span-2 space-y-6">
        <img 
          src="https://placehold.co/800x400/e2e8f0/a1a1aa?text=Poster+Event" 
          alt="Poster Event" 
          className="w-full h-auto md:h-80 object-cover rounded-2xl"
        />
        
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <Calendar className="text-gray-400 mt-1" size={20} />
            <div>
              <p className="text-xs text-gray-500">Tanggal</p>
              <p className="font-medium text-gray-900">Sabtu, 14 November 2026</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Clock className="text-gray-400 mt-1" size={20} />
            <div>
              <p className="text-xs text-gray-500">Waktu</p>
              <p className="font-medium text-gray-900">09.00-15.00 WIB</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <MapPin className="text-gray-400 mt-1" size={20} />
            <div>
              <p className="text-xs text-gray-500">Lokasi</p>
              <p className="font-medium text-gray-900">Lab Multimedia Gedung C, Universitas Gadjah Mada,<br/>Yogyakarta</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-gray-600 leading-relaxed text-sm">
            Belajar alur kerja desain produk digital dari nol: riset singkat, wireframe, hingga prototipe interaktif yang siap diuji ke pengguna.
          </p>
        </div>
      </div>

      {/* Kolom Kanan (Statistik & Kuota) */}
      <div className="space-y-6">
        {/* Box Statistik Terdaftar & Hadir */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <Users size={18} />
              <span className="text-sm font-medium">Terdaftar</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">92</div>
            <p className="text-xs text-gray-500">dari 130 kuota</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <UserCheck size={18} />
              <span className="text-sm font-medium">Hadir</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">54</div>
            <p className="text-xs text-gray-500">58% dari terdaftar</p>
          </div>
        </div>

        {/* Box Kuota Per Kategori */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6">Kuota per kategori tiket</h3>
          
          <div className="space-y-5">
            {/* Tiket Mahasiswa */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-900">Mahasiswa <span className="text-gray-400 font-normal">Rp35.000</span></span>
                <span className="font-bold text-gray-900">62 / 80</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 mb-1">
                <div className="bg-[#014860] h-2 rounded-full" style={{ width: '77%' }}></div>
              </div>
              <p className="text-xs text-gray-500">Sisa 18 tiket</p>
            </div>

            {/* Tiket Umum */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-900">Umum <span className="text-gray-400 font-normal">Rp60.000</span></span>
                <span className="font-bold text-gray-900">21 / 40</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 mb-1">
                <div className="bg-[#014860] h-2 rounded-full" style={{ width: '52%' }}></div>
              </div>
              <p className="text-xs text-gray-500">Sisa 19 tiket</p>
            </div>

            {/* Tiket VIP */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-900">VIP + Mentoring <span className="text-gray-400 font-normal">Rp150.000</span></span>
                <span className="font-bold text-gray-900">9 / 10</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 mb-1">
                <div className="bg-orange-400 h-2 rounded-full" style={{ width: '90%' }}></div>
              </div>
              <p className="text-xs text-orange-500 font-medium">Sisa 1 tiket</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default InfoTab;