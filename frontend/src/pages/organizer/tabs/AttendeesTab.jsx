import React from 'react';
import { Search, Download, MoreHorizontal } from 'lucide-react';

const AttendeesTab = () => {
  return (
    <div className="animate-in fade-in duration-300">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative w-full md:w-96">
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Cari nama, email, atau kode tiket" 
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#014860]"
          />
        </div>
        <button className="flex items-center justify-center gap-2 border border-gray-300 px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">
          <Download size={16} /> Ekspor CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        <button className="flex items-center gap-2 px-4 py-2 bg-[#014860] text-white rounded-full text-sm font-medium whitespace-nowrap">
          Semua <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">36</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-200 whitespace-nowrap">
          Hadir <span className="bg-gray-200 px-2 py-0.5 rounded-full text-xs">17</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-200 whitespace-nowrap">
          Belum hadir <span className="bg-gray-200 px-2 py-0.5 rounded-full text-xs">12</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-200 whitespace-nowrap">
          Dibatalkan <span className="bg-gray-200 px-2 py-0.5 rounded-full text-xs">7</span>
        </button>
      </div>

      {/* Tabel */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/50">
              <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Peserta</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Tiket</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Kode</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Check-in</th>
              <th className="py-4 px-6"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {/* Baris 1: Hadir */}
            <tr className="hover:bg-gray-50">
              <td className="py-4 px-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">SS</div>
                  <div>
                    <div className="font-bold text-gray-900">Salsabila Siregar</div>
                    <div className="text-gray-500 text-xs">salsabila.siregar0@gmail.com</div>
                  </div>
                </div>
              </td>
              <td className="py-4 px-6 text-gray-600">VIP + Mentoring</td>
              <td className="py-4 px-6 text-gray-500 font-mono text-xs">EL-101-3S5</td>
              <td className="py-4 px-6">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-green-600 font-medium text-xs">Hadir</span>
                </div>
              </td>
              <td className="py-4 px-6 text-gray-600">08.37</td>
              <td className="py-4 px-6 text-gray-400 cursor-pointer hover:text-gray-700"><MoreHorizontal size={18} /></td>
            </tr>
            {/* Baris 2: Belum Hadir */}
            <tr className="hover:bg-gray-50">
              <td className="py-4 px-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">SW</div>
                  <div>
                    <div className="font-bold text-gray-900">Salsabila Wijaya</div>
                    <div className="text-gray-500 text-xs">salsabila.wijaya3@mail.ugm.ac.id</div>
                  </div>
                </div>
              </td>
              <td className="py-4 px-6 text-gray-600">Mahasiswa</td>
              <td className="py-4 px-6 text-gray-500 font-mono text-xs">EL-101-5SV</td>
              <td className="py-4 px-6">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                  <span className="text-orange-500 font-medium text-xs">Belum hadir</span>
                </div>
              </td>
              <td className="py-4 px-6 text-gray-400">—</td>
              <td className="py-4 px-6 text-gray-400 cursor-pointer hover:text-gray-700"><MoreHorizontal size={18} /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendeesTab;