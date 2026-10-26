import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Ticket, 
  ChevronDown, 
  Flame, 
  Sparkles, 
  ArrowRight, 
  ChevronRight,
  Compass
} from 'lucide-react';
import { listEvents } from '../api/events';
import { EVENT_CATEGORIES, getCategoryLabel } from '../utils/categories';

const EventList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [backendEvents, setBackendEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  const categoryFilters = [
    { label: 'Semua Event', value: '' },
    ...EVENT_CATEGORIES.map(c => ({ label: c.label, value: c.value }))
  ];

  useEffect(() => {
    let isMounted = true;
    setLoadingEvents(true);
    listEvents({ q: searchQuery, category: selectedCategory })
      .then((data) => {
        if (!isMounted) return;
        setBackendEvents(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.warn('Gagal memuat event dari API:', err.message);
      })
      .finally(() => {
        if (isMounted) setLoadingEvents(false);
      });
    return () => { isMounted = false; };
  }, [searchQuery, selectedCategory]);

  // Featured Event untuk Banner Hero atas
  const featuredEvent = backendEvents.find((e) => e.remaining > 0) || backendEvents[0] || null;
  const trendingEvents = backendEvents.slice(0, 3);

  // Kategori foto tematik untuk kartu event
  const getEventImage = (category, idx) => {
    const images = {
      workshop: [
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80'
      ],
      seminar: [
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=600&q=80'
      ],
      konser: [
        'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80'
      ],
      kompetisi: [
        'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80'
      ],
      seni: [
        'https://images.unsplash.com/photo-1508997449629-303059a039c0?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=600&q=80'
      ],
      kampus: [
        'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80'
      ],
      komunitas: [
        'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=600&q=80'
      ]
    };
    const list = images[category?.toLowerCase()] || images.workshop;
    return list[idx % list.length];
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-neutral-900 font-sans selection:bg-[#5953C7] selection:text-white">
      
      {/* ================= TOP NAVBAR ================= */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Category Dropdown */}
          <div className="flex items-center gap-6">
            <div 
              onClick={() => navigate('/')} 
              className="flex items-center cursor-pointer group select-none"
            >
              <img
                src="/images/Logo logo_EVENT2 GO.png"
                alt="EVENT 2 GO"
                className="h-8 sm:h-9 w-auto object-contain group-hover:scale-105 transition-transform"
              />
            </div>

            <button 
              onClick={() => setSelectedCategory('Semua Event')}
              className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-neutral-700 hover:text-[#5953C7] py-2 px-3 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <Compass className="w-4 h-4 text-[#5953C7]" />
              <span>Jelajahi Event</span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari workshop, seminar, konser kampus, kompetisi..."
              className="w-full bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-full border border-neutral-200 focus:border-[#5953C7] focus:outline-none transition-all placeholder-neutral-400"
            />
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={() => navigate('/login')}
              className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-neutral-800 hover:text-[#5953C7] py-2 px-3 transition-colors"
            >
              <span>Kelola Eventmu</span>
            </button>

            <button 
              onClick={() => navigate('/login')}
              className="bg-[#5953C7] hover:bg-[#4a44b5] text-white text-xs font-bold px-4 sm:px-5 py-2.5 rounded-full shadow-sm hover:shadow transition-all active:scale-95"
            >
              Masuk Panitia
            </button>
          </div>

        </div>
      </header>

      {/* ================= HERO BILLBOARD (DYNAMIC DARI DATABASE) ================= */}
      {featuredEvent && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-6">
          <div 
            onClick={() => navigate(`/events/${featuredEvent.slug}`)}
            className="w-full bg-[#EFC936] rounded-3xl relative overflow-hidden cursor-pointer shadow-md group transition-all duration-300 hover:shadow-xl"
          >
            {/* Corner Stars */}
            <span className="absolute top-4 left-4 text-black text-2xl font-black select-none">★</span>
            <span className="absolute top-4 right-4 text-black text-2xl font-black select-none">★</span>
            <span className="absolute bottom-4 left-4 text-black text-2xl font-black select-none">★</span>
            <span className="absolute bottom-4 right-4 text-black text-2xl font-black select-none">★</span>

            <div className="py-10 sm:py-14 md:py-16 px-6 sm:px-12 grid grid-cols-1 md:grid-cols-12 items-center gap-6 relative z-10">
              
              {/* Left Column: Big Letters & Badge */}
              <div className="md:col-span-5 flex flex-col items-start justify-center">
                <div className="bg-white/95 px-4 py-1.5 rounded-full border border-black/10 text-[11px] font-black text-neutral-900 tracking-wider uppercase flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>EVENT UNGGULAN: {featuredEvent.category}</span>
                </div>
                <h1 className="font-black text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight uppercase text-neutral-950">
                  {featuredEvent.title}
                </h1>
                <p className="text-xs sm:text-sm font-medium text-neutral-800 mt-2 line-clamp-2">
                  {featuredEvent.venue}
                </p>
              </div>

              {/* Center Column: Official EVENT 2 GO Badge / Logo */}
              <div className="md:col-span-3 hidden md:flex flex-col items-center justify-center">
                <div className="w-28 h-28 rounded-3xl bg-neutral-950 flex items-center justify-center p-3 shadow-xl group-hover:scale-105 transition-transform">
                  <img
                    src="/images/Logo logo_EVENT2 GO.png"
                    alt="EVENT 2 GO"
                    className="w-full h-auto object-contain filter brightness-110 drop-shadow"
                  />
                </div>
                <span className="text-[10px] tracking-[0.2em] font-extrabold uppercase text-neutral-900 mt-2.5 bg-black/10 px-3 py-1 rounded-full">
                  {featuredEvent.min_price === 0 ? 'TIKET GRATIS' : `MULAI RP ${featuredEvent.min_price?.toLocaleString('id-ID')}`}
                </span>
              </div>

              {/* Right Column: Schedule & Action Button */}
              <div className="md:col-span-4 flex flex-col items-start md:items-end justify-center text-left md:text-right text-neutral-950">
                <span className="text-[10px] tracking-widest text-neutral-700 font-extrabold uppercase block mb-1">
                  JADWAL PELAKSANAAN
                </span>
                <div className="text-lg sm:text-xl font-black tracking-wide bg-neutral-950 text-[#EFC936] px-4 py-2 rounded-xl shadow-md">
                  {new Date(featuredEvent.starts_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
                <button className="mt-4 bg-[#5953C7] text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider group-hover:bg-[#473ebf] transition-colors shadow">
                  Lihat Tiket & Detail &rarr;
                </button>
              </div>

            </div>

            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          </div>
        </section>
      )}

      {/* ================= CATEGORY HORIZONTAL PILLS ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs font-semibold">
          {categoryFilters.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(cat.value)}
              className={`whitespace-nowrap px-4 py-2 rounded-full transition-all cursor-pointer ${
                selectedCategory === cat.value 
                  ? 'bg-neutral-950 text-white font-bold shadow-sm' 
                  : 'bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* ================= SECTION: KATALOG EVENT DARI DATABASE ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-purple-100 text-[#5953C7] flex items-center justify-center text-xs font-bold">
              🟣
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-neutral-950 tracking-tight">
              Katalog Event Terdaftar
            </h2>
            <span className="text-xs bg-neutral-100 text-neutral-600 font-bold px-2.5 py-1 rounded-full ml-1">
              {backendEvents.length} Event
            </span>
          </div>
        </div>

        {loadingEvents ? (
          <div className="py-20 text-center text-neutral-400">
            <div className="w-8 h-8 border-2 border-[#5953C7] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs font-bold">Memuat event dari database...</p>
          </div>
        ) : backendEvents.length === 0 ? (
          <div className="py-16 text-center text-neutral-500 bg-white rounded-3xl border border-dashed border-neutral-200 p-8">
            <Calendar className="w-12 h-12 mx-auto text-neutral-300 mb-3" />
            <h3 className="font-black text-base text-neutral-800">Tidak ada event ditemukan</h3>
            <p className="text-xs text-neutral-500 mt-1">Coba gunakan kata kunci pencarian lain atau pilih kategori Semua Event.</p>
            <button
              onClick={() => { setSelectedCategory(''); setSearchQuery(''); }}
              className="mt-4 px-4 py-2 bg-neutral-900 text-white text-xs font-bold rounded-full hover:bg-neutral-800 cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {backendEvents.map((item, idx) => (
              <div 
                key={item.id}
                onClick={() => navigate(`/events/${item.slug}`)}
                className="bg-white rounded-2xl border border-neutral-200/80 overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col"
              >
                <div className="aspect-[16/10] bg-neutral-100 relative overflow-hidden">
                  <img 
                    src={getEventImage(item.category, idx)} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wider uppercase ${
                    item.remaining === 0 ? 'bg-red-600 text-white' : 'bg-neutral-950/80 backdrop-blur-sm text-white'
                  }`}>
                    {item.remaining === 0 ? 'KUOTA HABIS' : 'TERSEDIA'}
                  </span>
                  <span className="absolute top-3 right-3 bg-white/90 text-neutral-900 text-[10px] font-bold px-2 py-0.5 rounded shadow">
                    {getCategoryLabel(item.category).toUpperCase()}
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-neutral-950 line-clamp-2 leading-snug group-hover:text-[#5953C7] transition-colors mb-3">
                      {item.title}
                    </h3>
                    <div className="space-y-1.5 text-xs text-neutral-500 mb-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        <span>{new Date(item.starts_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        <span className="truncate">{item.venue}</span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-neutral-400 block">Biaya Masuk</span>
                      <span className="font-extrabold text-sm sm:text-base text-neutral-950">
                        {item.min_price === 0 ? 'Gratis' : `Rp ${item.min_price?.toLocaleString('id-ID')}`}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-[#5953C7] group-hover:translate-x-1 transition-transform">
                      {item.remaining === 0 ? 'Waitlist' : 'Beli Tiket'} &rarr;
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ================= SECTION: LAGI TRENDING ================= */}
      {trendingEvents.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-neutral-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="text-xl">🔥</span>
              <h2 className="text-xl sm:text-2xl font-black text-neutral-950 tracking-tight">
                Lagi Trending
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trendingEvents.map((item, idx) => (
              <div 
                key={item.id}
                onClick={() => navigate(`/events/${item.slug}`)}
                className="bg-white rounded-2xl border border-neutral-200/80 overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col"
              >
                <div className="aspect-[16/9] bg-neutral-100 relative overflow-hidden">
                  <img 
                    src={getEventImage(item.category, idx + 1)} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                    HOT EVENT
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-black text-base text-neutral-950 group-hover:text-[#5953C7] transition-colors line-clamp-1 mb-2">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-neutral-600 mb-3">
                      <span className="font-semibold text-neutral-800">
                        {new Date(item.starts_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                      </span>
                      <span>&bull;</span>
                      <span className="truncate">{item.venue}</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                    <span className="font-extrabold text-neutral-900 text-sm">
                      {item.min_price === 0 ? 'Gratis' : `Rp ${item.min_price?.toLocaleString('id-ID')}`}
                    </span>
                    <button className="bg-neutral-950 group-hover:bg-[#5953C7] text-white text-[11px] font-bold px-4 py-1.5 rounded-full transition-colors">
                      Lihat Tiket
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= EVENT 2 GO ON-AIR / RETRO TV SPOTLIGHT ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="w-full bg-[#18181B] rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl border border-neutral-800 grid grid-cols-1 lg:grid-cols-12 items-center gap-8">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 px-3 py-1 rounded-full text-xs font-bold text-purple-300">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span>LIVE AGENDA &bull; EVENT 2 GO BROADCAST</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Pantau Agenda Kampus Terkini Langsung dari Layar EVENT 2 GO!
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed max-w-xl">
              Dari seminar teknologi, workshop keahlian, konser kampus hingga turnamen e-sport. Temukan tiket resmi dengan garansi verifikasi QR instan tanpa calo.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setSelectedCategory('Semua Event')}
                className="bg-[#EFC936] hover:bg-[#e2bd2b] text-neutral-950 font-black text-xs uppercase tracking-wider px-6 py-3 rounded-full transition-all shadow cursor-pointer"
              >
                Eksplor Semua Event &rarr;
              </button>
              <button
                onClick={() => navigate('/login')}
                className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-full transition-all border border-white/20 cursor-pointer"
              >
                Login Panitia
              </button>
            </div>
          </div>
          <div className="lg:col-span-5 flex items-center justify-center relative">
            <div className="relative group max-w-[320px] sm:max-w-[380px]">
              <img
                src="/images/tvevent2go.png"
                alt="EVENT 2 GO Retro Screen"
                className="w-full h-auto object-contain drop-shadow-[0_20px_35px_rgba(89,83,199,0.35)] group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= PROMO BANNER PANITIA ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full bg-gradient-to-r from-[#5953C7] via-[#473ebf] to-[#3a32a6] rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg relative overflow-hidden">
          <div className="flex items-center gap-5 text-left relative z-10">
            <div className="hidden sm:block w-20 h-20 shrink-0">
              <img
                src="/images/megaphone_hand.png"
                alt="Announcement Megaphone"
                className="w-full h-full object-contain drop-shadow"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#EFC936]" />
                <span>PORTAL RESMI PENYELENGGARA</span>
              </div>
              <h3 className="font-black text-xl sm:text-2xl text-white">
                Kelola Event Kampusmu Lebih Mudah Bareng EVENT 2 GO!
              </h3>
              <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-xl">
                Buka pendaftaran online, pantau kuota tiket real-time, dan lakukan check-in scan QR code langsung di pintu masuk.
              </p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/login')}
            className="relative z-10 whitespace-nowrap bg-[#EFC936] hover:bg-[#e0bb2d] text-neutral-950 font-black text-xs uppercase tracking-wider px-8 py-3.5 rounded-full shadow-md transition-all active:scale-95 cursor-pointer"
          >
            Buka Event Sekarang &rarr;
          </button>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-white border-t border-neutral-200 mt-16 pt-12 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
            <div className="flex items-center gap-3">
              <img src="/images/Logo logo_EVENT2 GO.png" alt="EVENT 2 GO" className="h-7 w-auto object-contain" />
              <span className="font-extrabold text-neutral-900">EVENT 2 GO</span>
              <span className="hidden sm:inline">— Platform Pendaftaran & Manajemen Event Kampus</span>
            </div>
            <p>&copy; {new Date().getFullYear()} EVENT 2 GO. Proyek Basis Data & Rekayasa Perangkat Lunak.</p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default EventList;