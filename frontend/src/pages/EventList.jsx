import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Ticket, 
  ChevronDown, 
  Flame, 
  GraduationCap, 
  Sparkles, 
  ArrowRight, 
  Star, 
  Clapperboard, 
  Music,
  Share2,
  Heart,
  Compass,
  CheckCircle2,
  ChevronRight,
  Monitor
} from 'lucide-react';

const EventList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua Event');
  const [event2GoTab, setEvent2GoTab] = useState('Konser');

  const categories = [
    'Semua Event', 
    'Musik', 
    'Festival', 
    'Stand Up Comedy', 
    'Pameran', 
    'Olahraga', 
    'Workshop', 
    'Teater & Seni', 
    'Kuliner', 
    'Konferensi'
  ];

  const eventSeruList = [
    {
      id: 'bca-expo-2024',
      title: 'BCA Expoversary 2024 - Jakarta',
      category: 'Pameran & Lifestyle',
      date: '28 Okt - 03 Nov 2024',
      location: 'ICE BSD, Tangerang',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80',
      badge: 'TERPOPULER'
    },
    {
      id: 'indonesian-artists-tour',
      title: 'All Indonesian Artists Tour 2024',
      category: 'Festival Musik',
      date: '15 - 17 Nov 2024',
      location: 'Stadion Madya GBK, Jakarta',
      price: 'Rp 150.000',
      image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80',
      badge: 'PRESALE'
    },
    {
      id: 'soundrenaline-2024',
      title: 'Soundrenaline Fest 2024',
      category: 'Festival Musik',
      date: '23 - 24 Nov 2024',
      location: 'Carnaval Ancol, Jakarta',
      price: 'Rp 250.000',
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
      badge: 'BEST SELLER'
    },
    {
      id: 'indie-fest-4',
      title: 'Indonesian Indie Fest #4',
      category: 'Musik Indie',
      date: '30 Nov 2024',
      location: 'Senayan Park, Jakarta',
      price: 'Rp 75.000',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
      badge: 'PROMO'
    }
  ];

  const trendingList = [
    {
      id: 'the-script-jakarta',
      title: 'The Script - Satellites World Tour 2024',
      date: '14 Feb 2025',
      location: 'Indonesia Arena, Jakarta',
      price: 'Rp 650.000',
      organizer: 'Color Asia Live',
      image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'festival-pasar-musik',
      title: 'Festival Pasar Musik 2024',
      date: '08 - 10 Des 2024',
      location: 'Gambir Expo Kemayoran',
      price: 'Rp 195.000',
      organizer: 'Pasar Musik Media',
      image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'dewa-19-all-stars',
      title: 'Dewa 19 Featuring All Stars Stadium Tour',
      date: '18 Jan 2025',
      location: 'Stadion Utama Gelora Bung Karno',
      price: 'Rp 450.000',
      organizer: 'Otello Asia',
      image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80'
    }
  ];

  const belajarList = [
    {
      id: 'web-dev-online',
      title: 'Fullstack Web Development Bootcamp 2024',
      instructor: 'Dimas Aditya (Senior Lead Tech)',
      date: 'Sabtu, 09 Nov 2024 • 09.00 WIB',
      location: 'Online Zoom Meeting',
      price: 'Rp 149.000',
      image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'uiux-masterclass',
      title: 'UI/UX Masterclass: Wireframe ke High-Fi Prototype',
      instructor: 'Clarissa Maharani (Product Design)',
      date: 'Minggu, 17 Nov 2024 • 13.00 WIB',
      location: 'Online Zoom Meeting',
      price: 'Rp 99.000',
      image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'data-science-ai',
      title: 'Data Science & Generative AI for Beginners',
      instructor: 'Dr. Hendra Wijaya',
      date: 'Sabtu, 23 Nov 2024 • 10.00 WIB',
      location: 'Online Zoom Meeting',
      price: 'Rp 189.000',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'digital-marketing-mastery',
      title: 'Digital Marketing & Performance Ads Strategy 2024',
      instructor: 'Reza Pratama',
      date: 'Sabtu, 30 Nov 2024 • 14.00 WIB',
      location: 'Online Zoom Meeting',
      price: 'Rp 129.000',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80'
    }
  ];

  const event2GoItems = [
    {
      date: '28 OKT',
      title: 'SPW Superstar Series: Tokyo Popline',
      desc: 'Live Tour Jakarta Series • Hall A JIEXPO Kemayoran',
      id: 'spw-superstar'
    },
    {
      date: '02 NOV',
      title: 'ROSETOPIA ASIA TOUR 2024 IN JAKARTA',
      desc: 'Beach City International Stadium Ancol, Jakarta',
      id: 'rosetopia-tour'
    },
    {
      date: '15 NOV',
      title: 'Indonesian Podcast Fest #4',
      desc: 'Festival Podcast Terbesar se-Indonesia • Senayan Park',
      id: 'podcast-fest-4'
    },
    {
      date: '21 NOV',
      title: 'NEO KPOP FEST 2024',
      desc: 'Special Lineup Idols Showcase • JIEXPO Grand Ballroom',
      id: 'neo-kpop-fest'
    },
    {
      date: '05 DES',
      title: '2024 JUNG HAE IN "OUR TIME" FAN MEETING IN JAKARTA',
      desc: 'The Kasablanka Hall, Jakarta Selatan',
      id: 'jung-hae-in-fanmeeting'
    }
  ];

  const cityDestinations = [
    { name: 'Jakarta', landmark: 'Monas', count: '140+ Event', icon: '🏛️' },
    { name: 'Bali', landmark: 'Pura Ulun Danu', count: '85+ Event', icon: '⛩️' },
    { name: 'Bandung', landmark: 'Gedung Sate', count: '62+ Event', icon: '🏢' },
    { name: 'Yogyakarta', landmark: 'Tugu Jogja', count: '54+ Event', icon: '🗼' },
    { name: 'Surabaya', landmark: 'Suramadu', count: '48+ Event', icon: '🌉' }
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-neutral-900 font-sans selection:bg-[#5953C7] selection:text-white">
      
      {/* ================= TOP NAVBAR ================= */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Category Dropdown */}
          <div className="flex items-center gap-6">
            <div 
              onClick={() => navigate('/')} 
              className="flex items-center gap-2 cursor-pointer group select-none"
            >
              <img 
                src="/images/platform_logo_badge.png" 
                alt="EventLokal" 
                className="w-8 h-8 rounded-lg object-contain shadow-xs group-hover:scale-105 transition-transform" 
              />
              <span className="font-black text-xl tracking-tight text-neutral-950">
                EVENT<span className="text-[#5953C7]">R</span>
              </span>
            </div>

            <button className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-neutral-700 hover:text-[#5953C7] py-2 px-3 rounded-lg hover:bg-neutral-100 transition-colors">
              <Compass className="w-4 h-4 text-[#5953C7]" />
              <span>Jelajahi</span>
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
              placeholder="Cari event, konser, workshop, atau festival seru..."
              className="w-full bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-full border border-neutral-200 focus:border-[#5953C7] focus:outline-none transition-all placeholder-neutral-400"
            />
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={() => navigate('/login')}
              className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-neutral-800 hover:text-[#5953C7] py-2 px-3 transition-colors"
            >
              <span>Buka eventmu sendiri</span>
            </button>

            <button 
              onClick={() => navigate('/events/detail')}
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-neutral-700 hover:text-[#5953C7] py-2 px-3 rounded-lg hover:bg-neutral-50"
            >
              <Ticket className="w-4 h-4 text-neutral-500" />
              <span>Tiket Saya</span>
            </button>

            <button 
              onClick={() => navigate('/login')}
              className="bg-[#5953C7] hover:bg-[#4a44b5] text-white text-xs font-bold px-4 sm:px-5 py-2.5 rounded-full shadow-sm hover:shadow transition-all active:scale-95"
            >
              Masuk / Daftar
            </button>
          </div>

        </div>
      </header>

      {/* ================= HERO BILLBOARD (YF GBK STADIUM) ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-8">
        <div 
          onClick={() => navigate('/events/detail')}
          className="w-full bg-[#EFC936] rounded-2xl relative overflow-hidden cursor-pointer shadow-md group transition-all duration-300 hover:shadow-xl"
        >
          {/* Corner Stars */}
          <span className="absolute top-4 left-4 text-black text-2xl font-black select-none">★</span>
          <span className="absolute top-4 right-4 text-black text-2xl font-black select-none">★</span>
          <span className="absolute bottom-4 left-4 text-black text-2xl font-black select-none">★</span>
          <span className="absolute bottom-4 right-4 text-black text-2xl font-black select-none">★</span>

          <div className="py-12 sm:py-16 md:py-20 px-8 sm:px-14 grid grid-cols-1 md:grid-cols-12 items-center gap-8 relative z-10">
            
            {/* Left Column: Big Letters YF */}
            <div className="md:col-span-4 flex flex-col items-start justify-center">
              <span className="text-black font-black text-6xl sm:text-7xl lg:text-9xl tracking-tighter leading-none select-none">
                YF
              </span>
              <div className="mt-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full border border-black/10 text-[11px] font-bold text-neutral-900 tracking-wider uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Konser Spesial Terbesar 2024</span>
              </div>
            </div>

            {/* Center Column: Silhouette / Performer Graphic */}
            <div className="md:col-span-4 flex flex-col items-center justify-center">
              <div className="relative w-40 sm:w-48 lg:w-56 h-56 sm:h-64 flex items-center justify-center">
                {/* Silhouette Character Artwork */}
                <div className="w-full h-full flex flex-col items-center justify-end">
                  <div className="w-16 h-16 bg-neutral-950 rounded-full mb-1 relative">
                    <div className="w-10 h-3 bg-neutral-800 rounded-full mx-auto mt-7"></div>
                  </div>
                  <div className="w-32 h-36 bg-neutral-950 rounded-t-3xl relative flex flex-col items-center">
                    <div className="w-10 h-10 bg-neutral-900 rounded-lg mt-4 border border-neutral-800"></div>
                  </div>
                  <div className="flex gap-4 w-32 justify-center">
                    <div className="w-8 h-20 bg-neutral-950 rounded-b-md"></div>
                    <div className="w-8 h-20 bg-neutral-950 rounded-b-md"></div>
                  </div>
                </div>
              </div>
              <span className="text-[10px] tracking-[0.25em] font-extrabold uppercase text-neutral-900 mt-2 bg-black/10 px-3 py-1 rounded">
                SPECIAL PERFORMANCE
              </span>
            </div>

            {/* Right Column: Live in Jakarta Typography */}
            <div className="md:col-span-4 flex flex-col items-start md:items-end justify-center text-left md:text-right text-neutral-950">
              <h2 className="font-black text-3xl sm:text-4xl lg:text-5xl leading-[0.95] tracking-tight uppercase">
                LIVE IN<br />
                JAKARTA<br />
                GBK STADIUM
              </h2>
              <div className="mt-3 text-2xl sm:text-3xl font-black tracking-widest bg-black text-[#EFC936] px-4 py-1 rounded-lg">
                24.10.26
              </div>
            </div>

          </div>

          {/* Hover Overlay Tag */}
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
        </div>
      </section>

      {/* ================= CATEGORY HORIZONTAL PILLS ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs font-semibold">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-full transition-all ${
                selectedCategory === cat 
                  ? 'bg-neutral-950 text-white font-bold shadow-sm' 
                  : 'bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ================= SECTION: EVENT SERU UNTUKMU ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-purple-100 text-[#5953C7] flex items-center justify-center text-xs font-bold">
              🟣
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-neutral-950 tracking-tight">
              Event Seru Untukmu
            </h2>
          </div>
          <button 
            onClick={() => navigate('/events/detail')}
            className="text-xs sm:text-sm font-bold text-[#5953C7] hover:underline flex items-center gap-1"
          >
            <span>Lihat Semua</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {eventSeruList.map((item) => (
            <div 
              key={item.id}
              onClick={() => navigate('/events/detail')}
              className="bg-white rounded-2xl border border-neutral-200/80 overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col"
            >
              <div className="aspect-[16/10] bg-neutral-100 relative overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-neutral-950/80 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wider uppercase">
                  {item.badge}
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-[11px] font-bold text-[#5953C7] uppercase tracking-wider mb-1">
                    {item.category}
                  </p>
                  <h3 className="font-bold text-sm sm:text-base text-neutral-950 line-clamp-2 leading-snug group-hover:text-[#5953C7] transition-colors mb-3">
                    {item.title}
                  </h3>
                  <div className="space-y-1.5 text-xs text-neutral-500 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{item.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                      <span className="truncate">{item.location}</span>
                    </div>
                  </div>
                </div>
                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-neutral-400 block">Mulai dari</span>
                    <span className="font-extrabold text-sm sm:text-base text-neutral-950">
                      {item.price}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#5953C7] group-hover:translate-x-1 transition-transform">
                    Beli &rarr;
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= SECTION: LAGI TRENDING ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-neutral-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔥</span>
            <h2 className="text-xl sm:text-2xl font-black text-neutral-950 tracking-tight">
              Lagi Trending
            </h2>
          </div>
          <button 
            onClick={() => navigate('/events/detail')}
            className="text-xs sm:text-sm font-bold text-[#5953C7] hover:underline flex items-center gap-1"
          >
            <span>Lihat Semua</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Wide Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trendingList.map((item) => (
            <div 
              key={item.id}
              onClick={() => navigate('/events/detail')}
              className="bg-white rounded-2xl border border-neutral-200/80 overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col"
            >
              <div className="aspect-[16/9] bg-neutral-100 relative overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                  HOT TOUR
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-black text-base text-neutral-950 group-hover:text-[#5953C7] transition-colors line-clamp-1 mb-2">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-neutral-600 mb-3">
                    <span className="font-semibold text-neutral-800">{item.date}</span>
                    <span>&bull;</span>
                    <span className="truncate">{item.location}</span>
                  </div>
                </div>
                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                  <span className="font-extrabold text-neutral-900 text-sm">
                    {item.price}
                  </span>
                  <button className="bg-neutral-950 group-hover:bg-[#5953C7] text-white text-[11px] font-bold px-4 py-1.5 rounded-full transition-colors">
                    Dapatkan Tiket
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= SECTION: PROGRAM BELAJAR TERPOPULER ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-neutral-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎓</span>
            <h2 className="text-xl sm:text-2xl font-black text-neutral-950 tracking-tight">
              Program Belajar Terpopuler
            </h2>
          </div>
          <button 
            onClick={() => navigate('/events/detail')}
            className="text-xs sm:text-sm font-bold text-[#5953C7] hover:underline flex items-center gap-1"
          >
            <span>Lihat Semua</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {belajarList.map((item) => (
            <div 
              key={item.id}
              onClick={() => navigate('/events/detail')}
              className="bg-white rounded-2xl border border-neutral-200/80 overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col"
            >
              <div className="aspect-[16/10] bg-neutral-100 relative overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm text-neutral-900 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                  CERTIFICATE
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-neutral-950 line-clamp-2 leading-snug group-hover:text-[#5953C7] transition-colors mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-neutral-500 mb-2 truncate">
                    Pemateri: {item.instructor}
                  </p>
                  <p className="text-[11px] text-neutral-600 mb-4 font-medium">
                    {item.date}
                  </p>
                </div>
                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                  <span className="font-extrabold text-sm text-neutral-950">
                    {item.price}
                  </span>
                  <span className="text-xs font-bold text-[#5953C7] group-hover:translate-x-1 transition-transform">
                    Daftar &rarr;
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= SECTION: EVENT 2GO (RETRO TERMINAL & TIMELINE) ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: 3D Retro TV Terminal Artwork (tvevent2go.png) */}
          <div className="lg:col-span-5 rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center bg-[#5151ba]">
            <img 
              src="/images/tvevent2go.png" 
              alt="Event 2Go Retro PC" 
              className="w-full h-auto object-cover rounded-3xl select-none"
            />
          </div>

          {/* Right Column: Event List (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-8 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-100">
                <div className="flex items-center gap-3">
                  <h3 className="font-black text-xl text-neutral-950">
                    Event 2Go
                  </h3>
                  <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-full text-xs font-bold">
                    <button 
                      onClick={() => setEvent2GoTab('Konser')}
                      className={`px-3 py-1 rounded-full transition-all ${event2GoTab === 'Konser' ? 'bg-[#5953C7] text-white' : 'text-neutral-600'}`}
                    >
                      Konser
                    </button>
                    <button 
                      onClick={() => setEvent2GoTab('Festival')}
                      className={`px-3 py-1 rounded-full transition-all ${event2GoTab === 'Festival' ? 'bg-[#5953C7] text-white' : 'text-neutral-600'}`}
                    >
                      Festival
                    </button>
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/events/detail')}
                  className="text-xs font-bold text-[#5953C7] hover:underline"
                >
                  Lihat Semua &gt;
                </button>
              </div>

              {/* Items List */}
              <div className="divide-y divide-neutral-100">
                {event2GoItems.map((item, idx) => (
                  <div 
                    key={idx}
                    onClick={() => navigate('/events/detail')}
                    className="py-3.5 flex items-start gap-4 hover:bg-neutral-50 px-3 rounded-xl transition-colors cursor-pointer group"
                  >
                    <div className="w-16 shrink-0 bg-neutral-100 group-hover:bg-[#5953C7] group-hover:text-white transition-colors rounded-xl p-2 text-center font-black text-xs text-neutral-900 leading-tight">
                      {item.date}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-neutral-950 group-hover:text-[#5953C7] transition-colors leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 group-hover:text-[#5953C7] transition-all self-center" />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
              <span>*Tiket resmi dengan proteksi e-ticket terverifikasi.</span>
              <button 
                onClick={() => navigate('/events/detail')}
                className="font-bold text-[#5953C7] hover:underline"
              >
                Cek Ketersediaan &rarr;
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ================= PROMO BANNER ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-2xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-black text-lg sm:text-xl text-white">
                Apapun Event-mu, Jadi Next Level Bareng EVENTLOKAL!
              </h3>
              <p className="text-xs sm:text-sm text-white/90 mt-0.5">
                Kelola penjualan tiket, absensi QR code, dan laporan real-time langsung dari handphone.
              </p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/login')}
            className="whitespace-nowrap bg-neutral-950 hover:bg-neutral-900 text-white font-extrabold text-xs uppercase tracking-wider px-6 py-3 rounded-full shadow-md transition-all active:scale-95"
          >
            Buat Event Sekarang &rarr;
          </button>
        </div>
      </section>

      {/* ================= SECTION: LAYAR LEBAR & BIOSKOP ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎬</span>
            <h2 className="text-xl sm:text-2xl font-black text-neutral-950 tracking-tight">
              Layar Lebar & Teater Pilihan
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Movie 1 */}
          <div 
            onClick={() => navigate('/events/detail')}
            className="group cursor-pointer rounded-2xl overflow-hidden border border-neutral-200/80 hover:shadow-lg transition-all"
          >
            <div className="aspect-[3/4] bg-neutral-900 relative overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80" 
                alt="Agak Laen" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">KOMEDI NASIONAL</span>
                <h4 className="font-bold text-base">Agak Laen: The Phenomenon</h4>
                <p className="text-xs text-neutral-300">Tiket Bioskop & Teater</p>
              </div>
            </div>
          </div>

          {/* Movie 2 */}
          <div 
            onClick={() => navigate('/events/detail')}
            className="group cursor-pointer rounded-2xl overflow-hidden border border-neutral-200/80 hover:shadow-lg transition-all"
          >
            <div className="aspect-[3/4] bg-neutral-900 relative overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=600&q=80" 
                alt="Rumah Masa Depan" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">DRAMA KELUARGA</span>
                <h4 className="font-bold text-base">Rumah Masa Depan / Bapak Jujur</h4>
                <p className="text-xs text-neutral-300">Panggung Teater Terbuka</p>
              </div>
            </div>
          </div>

          {/* Movie 3 */}
          <div 
            onClick={() => navigate('/events/detail')}
            className="group cursor-pointer rounded-2xl overflow-hidden border border-neutral-200/80 hover:shadow-lg transition-all"
          >
            <div className="aspect-[3/4] bg-neutral-900 relative overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80" 
                alt="Action Series" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">ACTION & MARTIAL ARTS</span>
                <h4 className="font-bold text-base">Satria Nusantara Live Showcase</h4>
                <p className="text-xs text-neutral-300">Auditorium Taman Ismail Marzuki</p>
              </div>
            </div>
          </div>

          {/* Promo Box (4th block) */}
          <div className="bg-[#4338CA] rounded-2xl p-6 text-white flex flex-col justify-between shadow-md">
            <div>
              <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm mb-4">
                🍿
              </span>
              <h3 className="font-black text-xl leading-tight mb-2">
                Temukan tontonan berikutnya di layar lebar.
              </h3>
              <p className="text-xs text-indigo-200 leading-relaxed">
                Dapatkan kursi terbaik untuk pemutaran film spesial, teater broadway lokal, dan panggung musikal favoritmu!
              </p>
            </div>
            <button 
              onClick={() => navigate('/events/detail')}
              className="mt-6 bg-white hover:bg-neutral-100 text-[#4338CA] font-extrabold text-xs uppercase tracking-wider px-5 py-2.5 rounded-full shadow transition-all text-center"
            >
              Lihat Jadwal
            </button>
          </div>
        </div>
      </section>

      {/* ================= SECTION: JELAJAHI EVENT DI KOTAMU ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-neutral-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xl">📍</span>
            <h2 className="text-xl sm:text-2xl font-black text-neutral-950 tracking-tight">
              Jelajahi Event di Kotamu
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {cityDestinations.map((city, idx) => (
            <div 
              key={idx}
              onClick={() => navigate('/events/detail')}
              className="bg-white rounded-2xl border border-neutral-200/80 p-5 hover:border-[#5953C7] hover:shadow-md transition-all text-center cursor-pointer group"
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                {city.icon}
              </div>
              <h4 className="font-extrabold text-sm text-neutral-950 group-hover:text-[#5953C7]">
                {city.name}
              </h4>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                {city.count}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-white border-t border-neutral-200 mt-16 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-neutral-200">
            
            {/* Brand Info (4 cols) */}
            <div className="md:col-span-4">
              <div 
                onClick={() => navigate('/')} 
                className="flex items-center gap-2 cursor-pointer mb-4"
              >
                <img 
                  src="/images/platform_logo_badge.png" 
                  alt="EventLokal" 
                  className="w-8 h-8 rounded-lg object-contain shadow-xs" 
                />
                <span className="font-black text-xl text-neutral-950">EVENTR<span className="text-[#5953C7]">.ID</span></span>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed max-w-sm mb-6">
                Platform ticketing dan manajemen event terlengkap di Indonesia. Temukan acara kampus, konser megah, hingga festival komunitas dalam satu sentuhan.
              </p>
              <div className="flex items-center gap-2 text-xs text-neutral-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Terdaftar & Terverifikasi di Indonesia</span>
              </div>
            </div>

            {/* Links 1 */}
            <div className="md:col-span-2 col-span-6">
              <h4 className="text-xs font-black uppercase tracking-wider text-neutral-950 mb-4">
                Tentang Kami
              </h4>
              <ul className="space-y-2.5 text-xs text-neutral-600">
                <li><a href="#" className="hover:text-[#5953C7]">Profil Perusahaan</a></li>
                <li><a href="#" className="hover:text-[#5953C7]">Karir & Budaya</a></li>
                <li><a href="#" className="hover:text-[#5953C7]">Blog & Berita</a></li>
                <li><a href="#" className="hover:text-[#5953C7]">Kebijakan Privasi</a></li>
              </ul>
            </div>

            {/* Links 2 */}
            <div className="md:col-span-2 col-span-6">
              <h4 className="text-xs font-black uppercase tracking-wider text-neutral-950 mb-4">
                Penyelenggara
              </h4>
              <ul className="space-y-2.5 text-xs text-neutral-600">
                <li><a href="#" className="hover:text-[#5953C7]">Buka Event</a></li>
                <li><a href="#" className="hover:text-[#5953C7]">QR Scanner App</a></li>
                <li><a href="#" className="hover:text-[#5953C7]">Biaya Layanan</a></li>
                <li><a href="#" className="hover:text-[#5953C7]">Panduan Promosi</a></li>
              </ul>
            </div>

            {/* Links 3 */}
            <div className="md:col-span-2 col-span-6">
              <h4 className="text-xs font-black uppercase tracking-wider text-neutral-950 mb-4">
                Kategori
              </h4>
              <ul className="space-y-2.5 text-xs text-neutral-600">
                <li><a href="#" className="hover:text-[#5953C7]">Konser Musik</a></li>
                <li><a href="#" className="hover:text-[#5953C7]">Workshop & Edukasi</a></li>
                <li><a href="#" className="hover:text-[#5953C7]">Turnamen Game</a></li>
                <li><a href="#" className="hover:text-[#5953C7]">Teater & Bioskop</a></li>
              </ul>
            </div>

            {/* Links 4 */}
            <div className="md:col-span-2 col-span-6">
              <h4 className="text-xs font-black uppercase tracking-wider text-neutral-950 mb-4">
                Metode Pembayaran
              </h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-neutral-100 rounded px-2 py-1 text-[10px] font-bold text-center">BCA</div>
                <div className="bg-neutral-100 rounded px-2 py-1 text-[10px] font-bold text-center">Mandiri</div>
                <div className="bg-neutral-100 rounded px-2 py-1 text-[10px] font-bold text-center">BRI</div>
                <div className="bg-neutral-100 rounded px-2 py-1 text-[10px] font-bold text-center">QRIS</div>
                <div className="bg-neutral-100 rounded px-2 py-1 text-[10px] font-bold text-center">GoPay</div>
                <div className="bg-neutral-100 rounded px-2 py-1 text-[10px] font-bold text-center">OVO</div>
              </div>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
            <p>&copy; {new Date().getFullYear()} EVENTR / EVENTLOKAL. Seluruh hak cipta dilindungi.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-neutral-700">Syarat & Ketentuan</a>
              <a href="#" className="hover:text-neutral-700">Bantuan 24/7</a>
              <a href="#" className="hover:text-neutral-700">Pusat Keamanan</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default EventList;