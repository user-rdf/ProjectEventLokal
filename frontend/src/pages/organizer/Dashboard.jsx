import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ScanLine, ChevronRight } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('akan-datang');
  
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('access_token'); 
        
        const response = await fetch('http://localhost:8000/api/v1/manage/home', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setDashboardData(data);
        } else {
          console.error("Gagal mengambil data dashboard:", response.status);
        }
      } catch (error) {
        console.error("Error koneksi ke backend:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "TBA";
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }).replace('.', '');
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + " WIB";
  };

  const calculatePercentage = (part, total) => {
    if (!total || total === 0) return 0;
    return Math.round((part / total) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-[#014860] font-semibold">Memuat data dashboard...</div>
      </div>
    );
  }

  const ongoingEvents = dashboardData?.ongoing || [];
  const upcomingEvents = dashboardData?.upcoming || [];
  const finishedEvents = dashboardData?.finished || [];
  const organizerName = dashboardData?.organizer_name || "Panitia Event";

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-12">
      {/* Navbar Atas */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-[#014860] text-white p-1.5 rounded-md font-bold text-sm">EL</div>
          <span className="font-bold text-lg text-[#014860]">EventLokal</span>
          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md font-medium ml-2">Panitia</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <div className="text-sm font-bold text-gray-900">{organizerName}</div>
            <div className="text-xs text-gray-500">Organizer</div>
          </div>
          <div className="bg-purple-100 text-purple-700 w-10 h-10 rounded-full flex items-center justify-center font-bold">
            {organizerName.charAt(0).toUpperCase()}
          </div>
        </div>
      </nav>

      {/* Konten Utama */}
      <main className="max-w-5xl mx-auto mt-8 px-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <p className="text-gray-500 mb-1">Halo, {organizerName.split(' ')[0]}</p>
            <h1 className="text-3xl font-bold text-gray-900">Beranda Panitia</h1>
          </div>
          <button 
            onClick={() => navigate('/buat-event')}
            className="mt-4 md:mt-0 flex items-center gap-2 bg-[#014860] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-teal-900 transition-colors"
          >
            <Plus size={20} />
            Buat Event
          </button>
        </div>

        {/* Section: Sedang Berlangsung */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <h2 className="font-bold text-lg text-gray-900">Sedang Berlangsung</h2>
          </div>
          
          {ongoingEvents.length === 0 ? (
            <p className="text-gray-500 text-sm">Tidak ada event yang sedang berlangsung.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ongoingEvents.map((event) => {
                const percentage = calculatePercentage(event.checked_in, event.total_attendees);
                return (
                  <div key={event.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex gap-4 mb-4">
                      <div className="w-20 h-20 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                        <img src="https://placehold.co/150x150/e2e8f0/a1a1aa?text=Event" alt="event" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                          <span className="text-xs text-green-600 font-semibold">Live</span>
                        </div>
                        <h3 className="font-bold text-gray-900 leading-tight">{event.title}</h3>
                        <p className="text-xs text-gray-500 mt-1">{formatDate(event.date)}, {formatTime(event.date)}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-bold text-gray-900">{event.checked_in} <span className="text-gray-500 font-normal">dari {event.total_attendees} hadir</span></span>
                        <span className="font-bold text-[#014860]">{percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-[#014860] h-2 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <button 
                        onClick={() => navigate(`/manage-event/${event.id}?tab=scan`)}
                        className="flex-1 flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors"
                      >
                        <ScanLine size={16} /> Scan tiket
                      </button>
                      <button 
                        onClick={() => navigate(`/manage-event/${event.id}`)}
                        className="flex-1 bg-[#014860] text-white py-2 rounded-lg font-semibold text-sm hover:bg-teal-900 transition-colors"
                      >
                        Buka
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Section: Tab Daftar Event (Akan Datang & Selesai) */}
        <div>
          <div className="flex gap-6 border-b border-gray-200 mb-4">
            <button 
              onClick={() => setActiveTab('akan-datang')}
              className={`pb-3 font-bold flex items-center gap-2 transition-colors ${activeTab === 'akan-datang' ? 'border-b-2 border-[#014860] text-[#014860]' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Akan Datang <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{upcomingEvents.length}</span>
            </button>
            <button 
              onClick={() => setActiveTab('selesai')}
              className={`pb-3 font-bold flex items-center gap-2 transition-colors ${activeTab === 'selesai' ? 'border-b-2 border-[#014860] text-[#014860]' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Selesai <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">{finishedEvents.length}</span>
            </button>
          </div>

          {/* Konten Tab: Akan Datang */}
          {activeTab === 'akan-datang' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              {upcomingEvents.length === 0 ? (
                <p className="text-gray-500 text-sm py-4">Belum ada event yang akan datang.</p>
              ) : (
                upcomingEvents.map((event) => {
                  const percentage = calculatePercentage(event.registered, event.quota);
                  const isFull = event.registered >= event.quota;
                  return (
                    <div key={event.id} className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between hover:shadow-sm cursor-pointer transition-shadow"
                         onClick={() => navigate(`/manage-event/${event.id}`)}>
                      <div className="flex items-center gap-4">
                        <div className="bg-gray-50 border border-gray-100 rounded-lg p-2 text-center w-16">
                          <div className="text-xs text-gray-500 font-semibold uppercase">{formatDate(event.date).split(' ')[1]}</div>
                          <div className="text-xl font-bold text-gray-900">{formatDate(event.date).split(' ')[0]}</div>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg">{event.title}</h4>
                          <p className="text-sm text-gray-500">📍 {formatDate(event.date)} • {event.venue}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-sm flex justify-between mb-1 gap-4">
                            <span className="text-gray-500 text-xs">Terdaftar</span>
                            <span className="font-bold text-gray-900 text-xs">{event.registered} / {event.quota}</span>
                          </div>
                          <div className="w-32 bg-gray-100 rounded-full h-1.5 mb-1">
                            <div className={`h-1.5 rounded-full ${isFull ? 'bg-red-500' : 'bg-[#014860]'}`} style={{ width: `${percentage}%` }}></div>
                          </div>
                          <span className={`text-xs font-bold ${isFull ? 'text-red-500' : 'text-[#014860]'}`}>
                            {isFull ? 'Habis' : 'Dibuka'}
                          </span>
                        </div>
                        <ChevronRight className="text-gray-400" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Konten Tab: Selesai */}
          {activeTab === 'selesai' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              {finishedEvents.length === 0 ? (
                <p className="text-gray-500 text-sm py-4">Belum ada event yang selesai.</p>
              ) : (
                finishedEvents.map((event) => {
                  const percentage = calculatePercentage(event.checked_in, event.total_attendees);
                  return (
                    <div key={event.id} className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between hover:shadow-sm cursor-pointer transition-shadow"
                         onClick={() => navigate(`/manage-event/${event.id}`)}>
                      <div className="flex items-center gap-4">
                        <div className="bg-gray-50 border border-gray-100 rounded-lg p-2 text-center w-16">
                          <div className="text-xs text-gray-500 font-semibold uppercase">{formatDate(event.date).split(' ')[1]}</div>
                          <div className="text-xl font-bold text-gray-900">{formatDate(event.date).split(' ')[0]}</div>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg">{event.title}</h4>
                          <p className="text-sm text-gray-500">📍 {formatDate(event.date)} • {event.venue}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-sm flex justify-between mb-1 gap-4">
                            <span className="text-gray-500 text-xs">Hadir</span>
                            <span className="font-bold text-gray-900 text-xs">{event.checked_in} / {event.total_attendees}</span>
                          </div>
                          <div className="w-32 bg-gray-100 rounded-full h-1.5 mb-1">
                            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                          </div>
                          <span className="text-gray-500 text-xs font-bold">Selesai</span>
                        </div>
                        <ChevronRight className="text-gray-400" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;