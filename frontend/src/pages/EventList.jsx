import React from 'react';
import { Search, Calendar, MapPin } from 'lucide-react';

const EventList = () => {
  return (
    <div className="min-h-screen bg-white max-w-5xl mx-auto p-8">
      {/* Header / Navbar sederhana */}
      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-2">
          <div className="bg-[#014860] text-white p-1.5 rounded-md">
            <Calendar className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl text-[#014860]">EventLokal</span>
        </div>
        <div className="flex gap-6 text-sm font-medium">
          <a href="#" className="text-[#014860]">Daftar Event</a>
          <a href="#" className="text-gray-400 hover:text-gray-600">Kelola Event</a>
        </div>
      </div>

      <h1 className="text-4xl font-bold text-gray-900 mb-2">Daftar Event</h1>
      <p className="text-gray-500 mb-8">Workshop, seminar, dan acara komunitas yang bisa kamu ikuti.</p>

      {/* Search & Filter */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Cari nama event, kampus, atau kota" 
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#014860]"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <button className="px-4 py-2 bg-[#014860] text-white rounded-full text-sm font-medium">Semua</button>
        {['Gratis', 'Berbayar', 'Workshop', 'Seminar', 'Himpunan', 'Kampus', 'Komunitas'].map(tag => (
          <button key={tag} className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-50">
            {tag}
          </button>
        ))}
      </div>

      <p className="text-sm font-semibold text-gray-700 mb-4">6 event ditemukan</p>

      {/* Grid Events */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md cursor-pointer flex flex-col">
          <div className="h-48 bg-gray-200 relative">
            <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-xs font-bold text-gray-700">Workshop</div>
            <div className="absolute bottom-4 right-4 bg-white p-2 rounded-xl text-center shadow-sm">
              <div className="text-xs font-bold text-gray-500 uppercase">Nov</div>
              <div className="text-lg font-black text-gray-900 leading-none">14</div>
            </div>
          </div>
          <div className="p-5 flex-1 flex flex-col">
            <h3 className="font-bold text-lg leading-tight mb-3">Workshop UI/UX: Dari Wireframe ke Prototipe</h3>
            <div className="space-y-2 mb-6">
              <div className="flex items-center text-gray-500 text-sm gap-2">
                <Calendar className="w-4 h-4" /> Sab, 14 Nov • 09.00 WIB
              </div>
              <div className="flex items-center text-gray-500 text-sm gap-2">
                <MapPin className="w-4 h-4" /> Lab Multimedia Gedung C, Yk
              </div>
            </div>
            <div className="mt-auto flex justify-between items-end border-t border-gray-100 pt-4">
              <div>
                <p className="text-xs text-gray-400">Mulai dari</p>
                <p className="font-bold text-gray-900">Rp35.000</p>
              </div>
              <p className="text-xs font-semibold text-orange-500">Sisa 38 kuota</p>
            </div>
          </div>
        </div>
        {/* Tambahkan Card lain di sini untuk demo */}
      </div>
    </div>
  );
};

export default EventList;