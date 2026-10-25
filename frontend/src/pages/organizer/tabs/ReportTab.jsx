import React from 'react';

const ReportTab = () => {
  return (
    <div className="animate-in fade-in duration-300 space-y-6">
      
      {/* 3 Kartu Atas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <span className="text-sm font-medium">💰 Total pendapatan</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">Rp4,8 jt</div>
          <p className="text-xs text-gray-400 line-through">Rp4.780.000</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <span className="text-sm font-medium">🎟️ Tiket terdaftar</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">92</div>
          <p className="text-xs text-gray-500">71% kuota terisi</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <span className="text-sm font-medium">✅ Tingkat kehadiran</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">59%</div>
          <p className="text-xs text-gray-500">54 dari 92 hadir</p>
        </div>
      </div>

      {/* Area Grafik (Dummy Visual) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grafik Pendaftaran vs Kehadiran */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-gray-900">Pendaftaran vs kehadiran</h3>
            <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-teal-200 rounded-sm"></div>Terdaftar</div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-[#014860] rounded-sm"></div>Hadir</div>
            </div>
          </div>
          {/* Bar Chart Ilustrasi */}
          <div className="flex items-end justify-around h-40 pt-4 border-b border-gray-100 pb-2">
            <div className="flex gap-2 items-end">
              <div className="w-8 bg-teal-200 rounded-t-sm h-32 relative"><span className="absolute -top-5 left-2 text-xs text-gray-500">62</span></div>
              <div className="w-8 bg-[#014860] rounded-t-sm h-20 relative"><span className="absolute -top-5 left-2 text-xs text-gray-500">38</span></div>
            </div>
            <div className="flex gap-2 items-end">
              <div className="w-8 bg-teal-200 rounded-t-sm h-12 relative"><span className="absolute -top-5 left-2 text-xs text-gray-500">21</span></div>
              <div className="w-8 bg-[#014860] rounded-t-sm h-6 relative"><span className="absolute -top-5 left-2 text-xs text-gray-500">12</span></div>
            </div>
            <div className="flex gap-2 items-end">
              <div className="w-8 bg-teal-200 rounded-t-sm h-5 relative"><span className="absolute -top-5 left-2 text-xs text-gray-500">9</span></div>
              <div className="w-8 bg-[#014860] rounded-t-sm h-3 relative"><span className="absolute -top-5 left-2 text-xs text-gray-500">5</span></div>
            </div>
          </div>
          <div className="flex justify-around mt-3 text-xs text-gray-500 font-medium">
            <span>Mahasiswa</span>
            <span>Umum</span>
            <span>VIP + Mentoring</span>
          </div>
        </div>

        {/* Donut Chart Kehadiran */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <h3 className="font-bold text-gray-900">Kehadiran</h3>
          <div className="flex-1 flex items-center justify-center my-4">
            <div className="w-32 h-32 rounded-full border-[12px] border-gray-100 flex items-center justify-center relative">
               {/* Circle Progress hijau */}
               <svg className="absolute top-[-12px] left-[-12px] w-[152px] h-[152px] transform -rotate-90">
                 <circle cx="76" cy="76" r="64" stroke="#10b981" strokeWidth="12" fill="none" strokeDasharray="402" strokeDashoffset="160" strokeLinecap="round" />
               </svg>
               <div className="text-center">
                 <div className="text-2xl font-bold text-gray-900">59%</div>
                 <div className="text-xs text-gray-500">hadir</div>
               </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center border-t border-gray-100 pt-4">
            <div>
              <div className="font-bold text-green-600">54</div>
              <div className="text-xs text-gray-500">Hadir</div>
            </div>
            <div>
              <div className="font-bold text-gray-900">38</div>
              <div className="text-xs text-gray-500">Belum/tidak hadir</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabel Pendapatan */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Pendapatan per kategori tiket</h3>
        </div>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-gray-500 text-xs">
              <th className="py-4 px-6 font-semibold uppercase">Kategori</th>
              <th className="py-4 px-6 font-semibold uppercase">Harga</th>
              <th className="py-4 px-6 font-semibold uppercase">Terjual</th>
              <th className="py-4 px-6 font-semibold uppercase">Pendapatan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td className="py-4 px-6 font-medium text-gray-900">Mahasiswa</td>
              <td className="py-4 px-6 text-gray-500">Rp35.000</td>
              <td className="py-4 px-6 text-gray-900">62</td>
              <td className="py-4 px-6 font-bold text-gray-900">Rp2.170.000</td>
            </tr>
            <tr>
              <td className="py-4 px-6 font-medium text-gray-900">Umum</td>
              <td className="py-4 px-6 text-gray-500">Rp60.000</td>
              <td className="py-4 px-6 text-gray-900">21</td>
              <td className="py-4 px-6 font-bold text-gray-900">Rp1.260.000</td>
            </tr>
            <tr>
              <td className="py-4 px-6 font-medium text-gray-900">VIP + Mentoring</td>
              <td className="py-4 px-6 text-gray-500">Rp150.000</td>
              <td className="py-4 px-6 text-gray-900">9</td>
              <td className="py-4 px-6 font-bold text-gray-900">Rp1.350.000</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="py-4 px-6 font-bold text-gray-900">Total</td>
              <td className="py-4 px-6"></td>
              <td className="py-4 px-6 font-bold text-gray-900">92</td>
              <td className="py-4 px-6 font-bold text-gray-900">Rp4.780.000</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportTab;