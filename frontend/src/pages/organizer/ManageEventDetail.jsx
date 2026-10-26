import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  ExternalLink, 
  Copy, 
  Check, 
  Share2, 
  Send, 
  AlertCircle, 
  RotateCw, 
  LogOut, 
  Info as InfoIcon,
  Users,
  ScanLine,
  ListOrdered,
  BarChart3
} from 'lucide-react';

import InfoTab from './tabs/InfoTab';
import AttendeesTab from './tabs/AttendeesTab';
import ScanTab from './tabs/ScanTab';
import WaitlistTab from './tabs/WaitlistTab';
import ReportTab from './tabs/ReportTab';

const ManageEventDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('info'); // Default ke tab 'info' agar melihat detail event baru
  const [copied, setCopied] = useState(false);
  const [publishing, setPublishing] = useState(false);

  // Ambil data profil panitia dari localStorage
  const organizerName = localStorage.getItem('organizer_name') || 'Panitia Event';
  const organizerInitial = organizerName.slice(0, 2).toUpperCase();

  // Ambil detail event berdasarkan ID dari backend
  const fetchEventDetail = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }

      const res = await fetch(`/api/v1/manage/events/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          navigate('/login');
          return;
        }
        if (res.status === 404) {
          throw new Error('Event tidak ditemukan atau bukan milik akun panitia ini.');
        }
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || 'Gagal memuat detail event.');
      }

      const data = await res.json();
      setEvent(data);
    } catch (err) {
      console.error('Error memuat event:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventDetail();
  }, [id]);

  // Handler Publikasikan Event jika status masih draft
  const handlePublish = async () => {
    if (!id) return;
    setPublishing(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      const res = await fetch(`/api/v1/manage/events/${id}/publish`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.ok) {
        alert('Event berhasil dipublikasikan ke katalog publik!');
        fetchEventDetail();
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(`Gagal mempublikasikan: ${errData.detail || 'Terjadi kesalahan'}`);
      }
    } catch (err) {
      alert('Gagal menghubungi server untuk mempublikasikan event.');
    } finally {
      setPublishing(false);
    }
  };

  const handleCopyLink = () => {
    if (!event?.slug) return;
    const url = `${window.location.origin}/events/${event.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  // Helper styling tab
  const getTabClass = (tabName) => {
    return activeTab === tabName
      ? "pb-3 border-b-2 border-[#5953C7] font-bold text-[#5953C7] whitespace-nowrap flex items-center gap-2 text-sm transition-colors"
      : "pb-3 text-gray-500 font-medium hover:text-gray-700 whitespace-nowrap flex items-center gap-2 text-sm transition-colors";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 border-4 border-[#5953C7] border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-lg font-bold text-gray-800">Memuat Detail Event...</h2>
        <p className="text-sm text-gray-500 mt-1">Mengambil data event spesifik dari basis data.</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-4">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Event Tidak Ditemukan</h2>
        <p className="text-sm text-gray-500 max-w-md mb-6">{error || 'ID event tidak valid atau Anda tidak memiliki akses ke event ini.'}</p>
        <button 
          onClick={() => navigate('/dashboard')}
          className="px-5 py-2.5 bg-[#5953C7] text-white rounded-xl text-sm font-bold hover:bg-[#4842b0] transition-colors cursor-pointer"
        >
          Kembali ke Beranda Panitia
        </button>
      </div>
    );
  }

  const initials = (event.title || 'EV').slice(0, 2).toUpperCase();
  const isPublished = event.status === 'published';

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      {/* Navbar Atas */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <img 
            src="/images/Logo logo_EVENT2 GO.png" 
            alt="EVENT 2 GO" 
            className="h-8 w-auto object-contain cursor-pointer hover:opacity-90" 
            onClick={() => navigate('/dashboard')}
          />
          <span className="bg-[#EEEDFA] text-[#5953C7] text-xs px-2.5 py-1 rounded-full font-bold ml-2 hidden sm:inline-block">Portal Panitia</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-bold text-gray-900">{organizerName}</div>
            <div className="text-xs text-emerald-600 font-medium">Panitia Terverifikasi</div>
          </div>
          <div className="bg-[#EEEDFA] text-[#5953C7] w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-sm border border-indigo-100">
            {organizerInitial}
          </div>
          <button
            onClick={handleLogout}
            title="Keluar dari akun"
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      {/* Konten Utama */}
      <main className="max-w-6xl mx-auto mt-6 px-6">
        <button 
          onClick={() => navigate('/dashboard')}
          className="text-gray-500 text-sm font-medium flex items-center gap-1.5 mb-6 hover:text-[#5953C7] transition-colors cursor-pointer"
        >
          <ChevronLeft size={18} /> Beranda Panitia
        </button>

        {/* Header Event Dinamis */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#EEEDFA] flex items-center justify-center text-[#5953C7] font-black text-2xl shrink-0 shadow-inner">
                {initials}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-700">
                    {event.category || 'Event'}
                  </span>
                  {isPublished ? (
                    <span className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200/50">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      Aktif & Dipublikasikan
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs text-amber-700 font-semibold bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200/50">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      Draft (Belum Publik)
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-1">{event.title}</h1>
                <p className="text-sm text-gray-500">
                  📍 {event.venue} • <span className="font-mono text-xs text-gray-400">ID: {event.id?.slice(0, 8)}</span>
                </p>
              </div>
            </div>

            {/* Tombol Aksi Publik / Draft */}
            <div className="flex flex-wrap items-center gap-3">
              {isPublished ? (
                <>
                  <button 
                    onClick={handleCopyLink}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                    {copied ? 'Tersalin!' : 'Salin Link'}
                  </button>
                  <button 
                    onClick={() => navigate(`/events/${event.slug}`)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#5953C7] text-white rounded-xl text-sm font-bold hover:bg-[#4842b0] shadow-sm transition-colors cursor-pointer"
                  >
                    <ExternalLink size={16} /> Lihat Halaman Publik
                  </button>
                </>
              ) : (
                <button 
                  onClick={handlePublish}
                  disabled={publishing}
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Send size={16} /> {publishing ? 'Memproses...' : 'Publikasikan Sekarang'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Menu Tabs Navigasi */}
        <div className="flex gap-8 border-b border-gray-200 mb-6 overflow-x-auto scrollbar-none">
          <button onClick={() => setActiveTab('info')} className={`${getTabClass('info')} cursor-pointer`}>
            <InfoIcon size={16} /> Info & Kuota Tiket
          </button>
          <button onClick={() => setActiveTab('peserta')} className={`${getTabClass('peserta')} cursor-pointer`}>
            <Users size={16} /> Peserta Terdaftar
          </button>
          <button onClick={() => setActiveTab('scan')} className={`${getTabClass('scan')} cursor-pointer`}>
            <ScanLine size={16} /> Scanner QR
          </button>
          <button onClick={() => setActiveTab('waitlist')} className={`${getTabClass('waitlist')} cursor-pointer`}>
            <ListOrdered size={16} /> Daftar Tunggu (Waitlist)
          </button>
          <button onClick={() => setActiveTab('laporan')} className={`${getTabClass('laporan')} cursor-pointer`}>
            <BarChart3 size={16} /> Laporan Penjualan
          </button>
        </div>

        {/* AREA RENDER TAB DINAMIS */}
        <div className="mt-6">
          {activeTab === 'info' && <InfoTab event={event} />}
          {activeTab === 'peserta' && <AttendeesTab eventId={id} />}
          {activeTab === 'scan' && <ScanTab eventId={id} eventTitle={event.title} />}
          {activeTab === 'waitlist' && <WaitlistTab eventId={id} />}
          {activeTab === 'laporan' && <ReportTab eventId={id} />}
        </div>
        
      </main>
    </div>
  );
};

export default ManageEventDetail;