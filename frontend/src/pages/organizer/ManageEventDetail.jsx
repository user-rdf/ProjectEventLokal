import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Copy, ExternalLink } from 'lucide-react';

// Import semua file tab yang sudah disiapkan temanmu
import InfoTab from './tabs/InfoTab';
import AttendeesTab from './tabs/AttendeesTab';
import ScanTab from './tabs/ScanTab';
import WaitlistTab from './tabs/WaitlistTab';
import ReportTab from './tabs/ReportTab';

const ManageEventDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Mengambil ID dari URL jika ada
  
  // State untuk melacak tab mana yang sedang aktif
  const [activeTab, setActiveTab] = useState('info');

  // Fungsi pembantu untuk style tombol tab
  const getTabClass = (tabName) => {
    return activeTab === tabName
      ? "pb-3 border-b-2 border-[#014860] font-bold text-[#014860] whitespace-nowrap"
      : "pb-3 text-gray-500 font-medium hover:text-gray-700 whitespace-nowrap";
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      {/* Navbar Atas */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-[#014860] text-white p-1.5 rounded-md font-bold text-sm">EL</div>
          <span className="font-bold text-lg text-[#014860]">EventLokal</span>
          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md font-medium ml-2">Panitia</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <div className="text-sm font-bold text-gray-900">Nabila Putri</div>
            <div className="text-xs text-gray-500">HIMAKOM UGM</div>
          </div>
          <div className="bg-purple-100 text-purple-700 w-10 h-10 rounded-full flex items-center justify-center font-bold">NP</div>
        </div>
      </nav>

      {/* Konten Utama */}
      <main className="max-w-6xl mx-auto mt-6 px-6">
        <button 
          onClick={() => navigate('/dashboard')}
          className="text-gray-500 text-sm font-medium flex items-center gap-1 mb-6 hover:text-[#014860] transition-colors"
        >
          <ChevronLeft size={16} /> Beranda Panitia
        </button>

        {/* Header Event (Judul, Tanggal, Tombol Salin) */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
          <div className="flex items-start gap-4">
            <img 
              src="https://placehold.co/100x100/e2e8f0/a1a1aa?text=Img" 
              alt="Thumbnail" 
              className="w-16 h-16 rounded-xl object-cover"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-xs text-green-600 font-semibold">Sedang berlangsung</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Workshop UI/UX: Dari Wireframe ke Prototipe</h1>
              <p className="text-sm text-gray-500">Sabtu, 14 November 2026 • 09.00-15.00 WIB</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">
              <Copy size={16} /> Salin tautan
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">
              <ExternalLink size={16} /> Halaman publik
            </button>
          </div>
        </div>

        {/* Menu Tabs Navigasi */}
        <div className="flex gap-8 border-b border-gray-200 mb-6 overflow-x-auto">
          <button onClick={() => setActiveTab('info')} className={getTabClass('info')}>Info</button>
          <button onClick={() => setActiveTab('peserta')} className={`${getTabClass('peserta')} flex items-center gap-2`}>
            Peserta <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">30</span>
          </button>
          <button onClick={() => setActiveTab('scan')} className={getTabClass('scan')}>Scan</button>
          <button onClick={() => setActiveTab('waitlist')} className={`${getTabClass('waitlist')} flex items-center gap-2`}>
            Daftar Tunggu <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">5</span>
          </button>
          <button onClick={() => setActiveTab('laporan')} className={getTabClass('laporan')}>Laporan</button>
        </div>

        {/* AREA RENDER TAB DINAMIS */}
        <div className="mt-6">
          {activeTab === 'info' && <InfoTab />}
          {activeTab === 'peserta' && <AttendeesTab />}
          {activeTab === 'scan' && <ScanTab />}
          {activeTab === 'waitlist' && <WaitlistTab eventId={id || 1} />} {/* Melempar eventId karena WaitlistTab membutuhkannya */}
          {activeTab === 'laporan' && <ReportTab />}
        </div>
        
      </main>
    </div>
  );
};

export default ManageEventDetail;