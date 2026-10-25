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
  
  // Gunakan ID dari URL atau fallback ke ID event Workshop Python Dasar yang memiliki waitlist di database
  const defaultEventId = 'd5f1bde7-7265-463d-a68c-d5923f0c56b7';
  const effectiveEventId = (id && id.length > 20) ? id : defaultEventId;

  // State untuk melacak tab mana yang sedang aktif
  const [activeTab, setActiveTab] = useState('waitlist');

  // Fungsi pembantu untuk style tombol tab
  const getTabClass = (tabName) => {
    return activeTab === tabName
      ? "pb-3 border-b-2 border-[#5953C7] font-bold text-[#5953C7] whitespace-nowrap"
      : "pb-3 text-gray-500 font-medium hover:text-gray-700 whitespace-nowrap";
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      {/* Navbar Atas */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img 
            src="/images/Logo logo_EVENT2 GO.png" 
            alt="EVENT 2 GO" 
            className="h-7 w-auto object-contain cursor-pointer" 
            onClick={() => navigate('/dashboard')}
          />
          <span className="bg-[#EEEDFA] text-[#5953C7] text-xs px-2.5 py-1 rounded-full font-bold ml-2">Panitia Resmi</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <div className="text-sm font-bold text-gray-900">Panitia EventLokal</div>
            <div className="text-xs text-gray-500">organizer@eventlokal.test</div>
          </div>
          <div className="bg-[#EEEDFA] text-[#5953C7] w-10 h-10 rounded-full flex items-center justify-center font-bold">PE</div>
        </div>
      </nav>

      {/* Konten Utama */}
      <main className="max-w-6xl mx-auto mt-6 px-6">
        <button 
          onClick={() => navigate('/dashboard')}
          className="text-gray-500 text-sm font-medium flex items-center gap-1 mb-6 hover:text-[#5953C7] transition-colors cursor-pointer"
        >
          <ChevronLeft size={16} /> Beranda Panitia
        </button>

        {/* Header Event (Judul, Tanggal, Tombol Salin) */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#EEEDFA] flex items-center justify-center text-[#5953C7] font-black text-xl shrink-0">
              PY
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-xs text-emerald-600 font-semibold">Aktif • Kuota Penuh</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Workshop Python Dasar</h1>
              <p className="text-sm text-gray-500">Lab Komputer A, Gedung Fasilkom • ID: {effectiveEventId.slice(0, 8)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/events/workshop-python-dasar/waitlist')}
              className="flex items-center gap-2 px-4 py-2 bg-[#5953C7] text-white rounded-lg text-sm font-semibold hover:bg-[#473ebf] shadow-xs cursor-pointer"
            >
              <ExternalLink size={16} /> Lihat Halaman Waitlist
            </button>
          </div>
        </div>

        {/* Menu Tabs Navigasi */}
        <div className="flex gap-8 border-b border-gray-200 mb-6 overflow-x-auto">
          <button onClick={() => setActiveTab('waitlist')} className={`${getTabClass('waitlist')} flex items-center gap-2 cursor-pointer`}>
            Daftar Tunggu (Waitlist) <span className="bg-[#EEEDFA] text-[#5953C7] text-xs px-2 py-0.5 rounded-full font-bold">Realtime DB</span>
          </button>
          <button onClick={() => setActiveTab('peserta')} className={`${getTabClass('peserta')} flex items-center gap-2 cursor-pointer`}>
            Peserta
          </button>
          <button onClick={() => setActiveTab('scan')} className={`${getTabClass('scan')} cursor-pointer`}>Scan</button>
          <button onClick={() => setActiveTab('info')} className={`${getTabClass('info')} cursor-pointer`}>Info</button>
          <button onClick={() => setActiveTab('laporan')} className={`${getTabClass('laporan')} cursor-pointer`}>Laporan</button>
        </div>

        {/* AREA RENDER TAB DINAMIS */}
        <div className="mt-6">
          {activeTab === 'waitlist' && <WaitlistTab eventId={effectiveEventId} />}
          {activeTab === 'peserta' && <AttendeesTab eventId={effectiveEventId} />}
          {activeTab === 'scan' && <ScanTab />}
          {activeTab === 'info' && <InfoTab />}
          {activeTab === 'laporan' && <ReportTab />}
        </div>
        
      </main>
    </div>
  );
};

export default ManageEventDetail;