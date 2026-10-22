import React from 'react';
import { Calendar, Clock, MapPin, Share2 } from 'lucide-react';

const EventDetail = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header sama seperti EventList bisa ditaruh di layout utama nanti */}
      
      <div className="max-w-5xl mx-auto py-8 px-4 flex flex-col md:flex-row gap-8">
        {/* Kiri: Detail Informasi */}
        <div className="flex-1">
          <div className="w-full h-80 bg-gray-300 rounded-3xl mb-8"></div>
          
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[#014860] font-semibold">Workshop</span>
            <span className="text-gray-400">oleh</span>
            <span className="font-semibold text-gray-700">HIMAKOM UGM</span>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-8 leading-tight">Workshop UI/UX: Dari Wireframe ke Prototipe</h1>
          
          <div className="grid grid-cols-3 gap-4 mb-10">
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-3">
              <Calendar className="text-[#014860] w-6 h-6 mt-1" />
              <div>
                <p className="text-xs text-gray-400 mb-1">Tanggal</p>
                <p className="font-semibold text-sm">Sabtu, 14 November 2026</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-3">
              <Clock className="text-[#014860] w-6 h-6 mt-1" />
              <div>
                <p className="text-xs text-gray-400 mb-1">Waktu</p>
                <p className="font-semibold text-sm">09.00-15.00 WIB</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-3">
              <MapPin className="text-[#014860] w-6 h-6 mt-1" />
              <div>
                <p className="text-xs text-gray-400 mb-1">Lokasi</p>
                <p className="font-semibold text-sm">Lab Multimedia Gedung C, Universitas Gadjah Mada</p>
              </div>
            </div>
          </div>

          <h3 className="font-bold text-xl mb-4">Tentang event</h3>
          <p className="text-gray-600 leading-relaxed mb-4">
            Belajar alur kerja desain produk digital dari nol: riset singkat, wireframe, hingga prototipe interaktif yang siap diuji ke pengguna.
          </p>
          <p className="text-gray-600 leading-relaxed text-sm">
            Peserta membawa laptop masing-masing. Akun Figma gratis sudah cukup. Tersedia makan siang dan sertifikat elektronik.
          </p>
        </div>

        {/* Kanan: Card Tiket */}
        <div className="w-full md:w-96">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm sticky top-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">Kategori tiket</h3>
              <button className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600">
                <Share2 className="w-4 h-4" /> Bagikan
              </button>
            </div>

            <div className="space-y-3 mb-6">
              {/* Kategori 1 - Selected */}
              <label className="block border-2 border-[#014860] rounded-xl p-4 cursor-pointer bg-blue-50/30">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    <input type="radio" name="ticket" defaultChecked className="w-4 h-4 text-[#014860]" />
                    <span className="font-bold">Mahasiswa</span>
                  </div>
                  <span className="font-bold">Rp35.000</span>
                </div>
                <p className="text-xs text-gray-500 ml-6 mb-2">Wajib tunjukkan KTM</p>
                <p className="text-xs text-gray-500 ml-6 flex items-center gap-1">
                   Sisa 18 dari 80
                </p>
              </label>

              {/* Kategori 2 */}
              <label className="block border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-[#014860]">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <input type="radio" name="ticket" className="w-4 h-4" />
                    <span className="font-bold text-gray-600">Umum</span>
                  </div>
                  <span className="font-bold text-gray-600">Rp60.000</span>
                </div>
              </label>
            </div>

            <button className="w-full bg-[#014860] text-white py-3 rounded-xl font-bold hover:bg-teal-900 transition-colors">
              Daftar
            </button>
            <p className="text-xs text-center text-gray-400 mt-4">Tanpa akun. Tiket QR dikirim ke email.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;