import React from 'react';
import { Camera, ScanLine } from 'lucide-react';

const ScanTab = () => {
  return (
    <div className="animate-in fade-in duration-300">
      {/* Header Tabs Scan */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4 border-b border-gray-200">
          <button className="pb-2 border-b-2 border-gray-900 font-bold text-gray-900 text-sm">Scan QR</button>
          <button className="pb-2 text-gray-500 font-medium text-sm hover:text-gray-700">Cari manual</button>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="font-bold text-gray-900">54 <span className="font-normal text-gray-500">peserta sudah hadir</span></span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Area Kamera */}
        <div className="lg:w-2/3 bg-[#0a0f1c] rounded-2xl h-[450px] relative overflow-hidden flex flex-col items-center justify-center">
          <div className="absolute top-4 left-4 text-white/70 flex items-center gap-2 text-sm bg-black/30 px-3 py-1.5 rounded-lg">
            <Camera size={16} /> Kamera belakang
          </div>
          
          {/* Overlay Bingkai Scan */}
          <div className="relative w-64 h-64 mb-8">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white/80 rounded-tl-xl"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white/80 rounded-tr-xl"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white/80 rounded-bl-xl"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white/80 rounded-br-xl"></div>
            
            {/* Garis Scan Animasi (Dummy) */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
          </div>
          
          <p className="text-white/70 text-sm">Arahkan kamera ke QR di tiket peserta</p>

          <div className="absolute bottom-4 left-4 text-white/40 text-xs flex items-center gap-2">
             <ScanLine size={14} /> SIMULASI
          </div>
        </div>

        {/* Area Hasil */}
        <div className="lg:w-1/3">
          <div className="border border-gray-200 rounded-2xl h-full p-8 flex flex-col items-center justify-center text-center bg-white shadow-sm min-h-[200px]">
            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-4 border border-gray-100">
               <ScanLine className="text-gray-400" size={24} />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Menunggu scan</h3>
            <p className="text-sm text-gray-500">Hasil pemeriksaan tiket akan muncul di sini.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanTab;