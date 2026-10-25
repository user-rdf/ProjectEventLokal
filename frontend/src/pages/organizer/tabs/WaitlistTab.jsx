import React from 'react';
import { Info } from 'lucide-react';

const WaitlistTab = () => {
  return (
    <div className="animate-in fade-in duration-300 space-y-6">
      {/* Alert Info */}
      <div className="bg-[#f8fafc] border border-blue-100 rounded-xl p-4 flex gap-3 text-sm text-[#014860]">
        <Info className="text-[#014860] flex-shrink-0" size={20} />
        <p>Saat ada peserta yang dibatalkan, orang <strong>pertama</strong> di antrean otomatis mendapat tiket dan email "Kamu mendapat tiket!". Tidak perlu tindakan dari panitia.</p>
      </div>

      {/* List Antrean */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        
        {/* Item 1 (Berikutnya) */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between hover:bg-gray-50">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-[#014860] text-white flex items-center justify-center font-bold text-sm">1</div>
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">BA</div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-gray-900">Bimo Aditya</h4>
                <span className="text-[10px] font-bold text-[#014860] bg-blue-50 px-2 py-0.5 rounded">Berikutnya</span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">bimo.aditya@gmail.com • 081234561111</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-gray-900">VIP + Mentoring</div>
            <div className="text-xs text-gray-500">Masuk 12 Okt, 10.21</div>
          </div>
        </div>

        {/* Item 2 */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between hover:bg-gray-50">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center font-bold text-sm">2</div>
            <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm">KA</div>
            <div>
              <h4 className="font-bold text-gray-900">Kirana Ayuningtyas</h4>
              <p className="text-xs text-gray-500 mt-0.5">kirana.ayu@mail.ugm.ac.id • 085712349876</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-gray-900">Mahasiswa</div>
            <div className="text-xs text-gray-500">Masuk 12 Okt, 14.05</div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default WaitlistTab;