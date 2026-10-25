import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowUpRight,
  ArrowRight,
  Mail,
  Award,
  Phone,
  Sparkles,
  CheckCircle2,
  ArrowDown
} from 'lucide-react';
import { listEvents } from '../api/events';

const InstagramIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const TwitterIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedinIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const FacebookIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
  </svg>
);

const Landing = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [activeHighlight, setActiveHighlight] = useState(0);
  const [dbEvents, setDbEvents] = useState([]);

  useEffect(() => {
    let isMounted = true;
    listEvents()
      .then((data) => {
        if (isMounted && Array.isArray(data)) {
          setDbEvents(data);
        }
      })
      .catch((err) => console.warn('Gagal memuat event Landing:', err.message));
    return () => { isMounted = false; };
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  // 1. Layanan / Card Aksi Utama
  const serviceCards = [
    {
      id: 'service-daftar-event',
      title: 'DAFTAR EVENT',
      description: 'Online atau offline, gratis atau berbayar. Temukan musik, pesta, workshop hingga seminar yang cocok untuk kamu. Dapatkan tiket langsung tanpa ribet daftar akun.',
      buttonText: 'JELAJAHI EVENT',
      actionPath: '/events',
      variant: 'outline'
    },
    {
      id: 'service-kelola-event',
      title: 'KELOLA EVENT',
      description: 'Dari event kampus, komunitas lokal sampai festival besar. Buat event dalam hitungan menit, pantau penjualan tiket real-time, dan scan QR tiket langsung di pintu masuk.',
      buttonText: 'BUAT EVENT SEKARANG',
      actionPath: '/login',
      variant: 'solid'
    }
  ];

  // 2. Mitra Komunitas & Kampus Terpercaya
  const trustedPartners = [
    {
      id: 'partner-bem',
      name: 'BEM Universitas',
      type: 'text',
      textClass: 'font-extrabold text-sm sm:text-base tracking-tight text-neutral-800'
    },
    {
      id: 'partner-himpunan',
      name: 'Himpunan Mahasiswa',
      type: 'text',
      textClass: 'font-bold text-base sm:text-lg tracking-tight text-neutral-800'
    },
    {
      id: 'partner-ukm-musik',
      name: 'UKM Seni & Musik',
      type: 'text',
      textClass: 'font-bold text-sm sm:text-base tracking-tight text-neutral-800'
    },
    {
      id: 'partner-tech-hub',
      name: 'Tech Community Hub',
      type: 'text',
      textClass: 'font-extrabold text-xs sm:text-sm tracking-wider uppercase text-neutral-800'
    },
    {
      id: 'partner-kreasi',
      name: 'Kreasi Lokal Studio',
      type: 'text',
      textClass: 'font-serif italic font-bold text-base sm:text-lg tracking-tight text-neutral-800'
    },
    {
      id: 'partner-incubator',
      name: 'Campus Startup Lab',
      type: 'text',
      textClass: 'font-extrabold text-sm sm:text-base tracking-tight text-neutral-800'
    }
  ];

  // 3. Sorotan Event Nyata dari Database
  const highlights = dbEvents.length > 0
    ? dbEvents.slice(0, 5).map((e) => ({
        id: e.id,
        slug: e.slug,
        date: new Date(e.starts_at).toLocaleDateString('id-ID', { month: '2-digit', day: '2-digit' }),
        title: e.title,
        desc: `${e.venue} • ${e.min_price === 0 ? 'Gratis' : 'Mulai Rp ' + e.min_price?.toLocaleString('id-ID')}`,
        category: e.category?.toUpperCase() || 'EVENT',
        image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=600&q=80'
      }))
    : [
        {
          id: 'evt-1',
          slug: 'workshop-python-dasar',
          date: '02.11',
          title: 'Workshop Python Dasar',
          desc: 'Lab Komputer A, Gedung Fasilkom • Gratis',
          category: 'WORKSHOP',
          image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80'
        },
        {
          id: 'evt-2',
          slug: 'seminar-karier-teknologi',
          date: '07.11',
          title: 'Seminar Karier Teknologi & Startup',
          desc: 'Aula Utama Gedung Rektorat Lt. 3 • Mulai Rp 25.000',
          category: 'SEMINAR',
          image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80'
        }
      ];

  // 4. Data Dummy: Card Galeri / Media Sosial ("FOLLOW US!")
  const galleryCards = [
    {
      id: 'gallery-cabana-structure',
      title: 'Event Cabana Structure',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      linkUrl: 'https://instagram.com',
      hasQuote: false,
      quoteText: null
    },
    {
      id: 'gallery-poolside-atmosphere',
      title: 'Poolside Cabana Atmosphere',
      image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80',
      linkUrl: 'https://instagram.com',
      hasQuote: false,
      quoteText: null
    },
    {
      id: 'gallery-summer-resort',
      title: 'Summer Resort Inspiration',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      linkUrl: 'https://instagram.com',
      hasQuote: true,
      quoteText: ['MAGIC', 'DOES NOT LIVE', 'IN THE', 'COMFORT ZONE']
    }
  ];

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-[#5953C7] selection:text-white">
      {/* ================= HEADER / NAVBAR ================= */}
      <header className="w-full bg-white border-b border-neutral-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo: EVENT 2 GO */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="cursor-pointer group select-none flex items-center"
          >
            <img
              src="/images/Logo logo_EVENT2 GO.png"
              alt="EVENT 2 GO"
              className="h-9 sm:h-10 w-auto object-contain group-hover:scale-105 transition-transform"
            />
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-[11px] font-bold tracking-[0.2em] uppercase text-neutral-800">
            <button onClick={() => navigate('/events')} className="hover:text-[#5953C7] transition-colors py-1 cursor-pointer font-bold tracking-[0.2em] uppercase">DAFTAR EVENT</button>
            <button onClick={() => navigate('/login')} className="hover:text-[#5953C7] transition-colors py-1 cursor-pointer font-bold tracking-[0.2em] uppercase">KELOLA EVENT</button>
            <a href="#why" className="hover:text-[#5953C7] transition-colors py-1">FITUR</a>
            <a href="#services" className="hover:text-[#5953C7] transition-colors py-1">LAYANAN</a>
            <a href="#highlights" className="hover:text-[#5953C7] transition-colors py-1">SOROTAN</a>
          </nav>

          {/* Right Badges / Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Scalloped Red Stamp: BEST OF 2024 */}
            <div className="relative group cursor-pointer" title="Best of 2024 Award Winner">
              <svg
                className="w-10 h-10 sm:w-11 sm:h-11 text-[#CC3333] transition-transform duration-300 group-hover:rotate-12"
                viewBox="0 0 100 100"
                fill="currentColor"
              >
                <path d="M50 0 L58 12 L72 8 L76 22 L90 24 L88 38 L100 45 L92 56 L100 68 L88 74 L90 88 L76 88 L70 100 L56 94 L48 100 L38 92 L26 98 L24 84 L10 84 L14 70 L2 62 L10 50 L2 38 L14 30 L10 16 L24 16 L28 2 L42 8 Z" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-[7px] font-black uppercase text-white tracking-tighter leading-[0.9]">
                <span>BEST</span>
                <span>OF</span>
                <span>2024</span>
              </div>
            </div>

            {/* Divider */}
            <span className="text-neutral-300 font-light text-xl select-none">/</span>

            {/* Laurel Ribbon Icon */}
            <div className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-800 hover:border-neutral-900 transition-colors" title="Accredited Event Designer">
              <Award className="w-4 h-4 text-neutral-700" />
            </div>

            {/* Divider */}
            <span className="text-neutral-300 font-light text-xl select-none">/</span>

            {/* Yellow Circle Badge */}
            <a
              href="#contact"
              className="w-8 h-8 sm:w-9 sm:h-9 bg-[#F5DE5D] hover:bg-[#ebd347] rounded-full border border-neutral-800/20 flex items-center justify-center text-[10px] font-bold text-neutral-900 shadow-sm transition-transform active:scale-95"
              title="Let's Talk"
            >
              <Phone className="w-3.5 h-3.5 text-neutral-900" />
            </a>
          </div>
        </div>
      </header>

      {/* ================= HERO SECTION ================= */}
      <section className="relative w-full overflow-hidden bg-[#CCD1E8] border-b border-neutral-100">
        <div className="w-full min-h-[500px] sm:min-h-[580px] lg:min-h-[660px] grid grid-cols-1 lg:grid-cols-12 relative items-stretch">

          {/* Left Column: Hand holding slice of blue cake (40% width on desktop) */}
          <div className="lg:col-span-5 flex items-end justify-start px-2 sm:px-8 lg:pl-10 relative bg-[#CCD1E8] min-h-[340px] lg:min-h-full overflow-hidden">
            <div className="relative z-10 w-[240px] sm:w-[290px] lg:w-[350px] -ml-4 sm:-ml-8 lg:-ml-12 -mb-4 lg:-mb-8 flex items-end">
              <img
                src="/images/hero_hand.png"
                alt="Hand with slice of cake"
                className="w-full h-auto object-contain object-bottom select-none pointer-events-none drop-shadow-md"
              />
            </div>
          </div>

          {/* Right Column: Solid Vibrant Periwinkle Block (60% width on desktop) */}
          <div className="lg:col-span-7 bg-[#5953C7] relative flex flex-col justify-end p-8 sm:p-12 lg:p-16 min-h-[300px] lg:min-h-full">
            {/* Scroll Indicator Arrow on right edge */}
            <div className="hidden lg:flex flex-col absolute right-6 bottom-10 items-center gap-2 text-white/50 text-[10px] tracking-[0.3em] uppercase select-none">
              <div className="rotate-90 origin-center mb-6">
                <span>SCROLL</span>
              </div>
              <div className="w-px h-10 bg-white/40"></div>
              <ArrowDown className="w-4 h-4 text-white/70 animate-bounce" />
            </div>
          </div>

          {/* Overlay Big Typography: Placed across split boundary */}
          <div className="absolute inset-0 pointer-events-none flex items-center">
            <div className="w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-16">
              <div className="lg:ml-[32%] xl:ml-[31%] text-neutral-950 font-black tracking-[-0.035em] leading-[0.92] text-4xl sm:text-6xl md:text-7xl lg:text-8xl select-none">
                <h1 className="drop-shadow-sm">EVERY EVENT</h1>
                <h1 className="drop-shadow-sm">STARTS +</h1>
                <h1 className="drop-shadow-sm">HERE</h1>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================= MANIFESTO / SUBHEADING ================= */}
      <section id="manifesto" className="py-20 sm:py-28 px-6 bg-white border-b border-neutral-100">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-normal tracking-tight text-neutral-800 leading-[1.4] sm:leading-[1.45]">
            <span className="text-[#5953C7] font-extrabold">Great events</span> need two things:{' '}
            <span className="text-[#5953C7] font-extrabold">people who make</span> them and{' '}
            <span className="text-[#5953C7] font-extrabold">people who show up</span>.
          </p>
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-normal tracking-tight text-neutral-800 leading-[1.4]">
            We built one place for both. No chaos, no spreadsheets, no missed tickets.
          </p>
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-extrabold tracking-tight text-[#5953C7] leading-[1.4] pt-2">
            Make it. Find it. Be there
          </p>
        </div>
      </section>

      {/* ================= DAFTAR EVENT & KELOLA EVENT (TWO COLUMNS) ================= */}
      <section id="services" className="py-16 sm:py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 relative">

            {serviceCards.map((service, idx) => (
              <div 
                key={service.id} 
                className={`flex flex-col items-start justify-between ${idx === 1 ? 'md:pl-8' : ''}`}
              >
                <div>
                  <h2 className="text-base sm:text-lg font-black tracking-[0.2em] uppercase text-neutral-950 mb-4">
                    {service.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-md mb-8">
                    {service.description}
                  </p>
                </div>
                <button
                  onClick={() => navigate(service.actionPath)}
                  className={`group inline-flex items-center gap-2 rounded-full py-2.5 text-[11px] font-bold tracking-[0.15em] uppercase transition-all active:scale-95 ${
                    service.variant === 'solid'
                      ? 'bg-neutral-950 hover:bg-neutral-800 text-white px-7 hover:shadow-md'
                      : 'border border-neutral-300 hover:border-neutral-900 text-neutral-800 hover:text-neutral-950 px-6 hover:shadow-sm'
                  }`}
                >
                  <span>{service.buttonText}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            ))}

            {/* Slanted Dashed Divider Line (visible on md+) */}
            <div className="hidden md:block absolute left-1/2 top-4 bottom-4 -translate-x-1/2 pointer-events-none">
              <div className="h-full w-px border-l-2 border-dashed border-neutral-300 rotate-6 transform origin-center"></div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= LIHAT EVENT YANG MENARIK (SPLIT CARD) ================= */}
      <section id="why" className="pt-20 pb-16 px-4 sm:px-6 bg-white overflow-visible">
        <div className="max-w-5xl mx-auto rounded-none overflow-visible relative">
          <div className="grid grid-cols-1 md:grid-cols-2 relative items-stretch">

            {/* Left Half: Lavender */}
            <div className="bg-[#B8A2E8] p-8 sm:p-12 lg:p-14 flex flex-col justify-between min-h-[260px] sm:min-h-[290px] lg:min-h-[310px] z-10">
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-black tracking-tight leading-[1.08] uppercase mb-3">
                  LIHAT<br />EVENT YANG MENARIK
                </h2>
                <p className="text-xs sm:text-[13px] text-neutral-800 mb-8 font-normal">
                  Let us show you.
                </p>
              </div>
              <div>
                <button
                  onClick={() => navigate('/events')}
                  className="group inline-flex items-center gap-2 border border-neutral-900/60 hover:border-black hover:bg-neutral-900 hover:text-white rounded-full px-5 py-2 text-[10.5px] font-bold tracking-[0.12em] uppercase text-neutral-900 transition-all"
                >
                  <span>EKSPLORASI EVENT</span>
                  <span className="text-xs transition-transform group-hover:translate-x-1">&rarr;</span>
                </button>
              </div>
            </div>

            {/* Right Half: Solid Royal Periwinkle Purple with Overflowing Megaphone */}
            <div className="bg-[#514DC4] relative min-h-[240px] sm:min-h-[290px] lg:min-h-[310px] overflow-visible">
              <div className="absolute -top-16 sm:-top-20 lg:-top-24 right-0 bottom-0 w-[230px] sm:w-[290px] lg:w-[340px] flex items-end justify-end pointer-events-none select-none z-20">
                <img
                  src="/images/megaphone_hand.png"
                  alt="Megaphone Hand"
                  className="w-full h-auto object-contain object-bottom drop-shadow-md"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= DIPERCAYA PENYELENGGARA (DISCO BALL CARD) ================= */}
      <section id="clients" className="py-16 sm:py-24 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-14 items-center">

            {/* Left: Disco Ball Hand Box (5 cols) */}
            <div className="md:col-span-5 bg-[#C9D1FB] aspect-square relative flex items-center justify-center overflow-hidden shadow-sm">
              <img
                src="/images/disco_ball.jpg"
                alt="Disco Ball Celebration"
                className="w-full h-full object-contain p-3 object-center transition-transform duration-700 hover:scale-105"
              />
            </div>

            {/* Right: Client Details & Brand Logos (7 cols) */}
            <div className="md:col-span-7 flex flex-col justify-center">
              <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 tracking-tight uppercase mb-4">
                DIPERCAYA<br />PENYELENGGARA
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-8 max-w-lg">
                Dari komunitas kampus, kreator lokal hingga brand ternama yang mempercayakan pengalaman acara mereka bersama kami.
              </p>

              {/* Brand Logos Grid */}
              <div className="grid grid-cols-3 gap-y-8 gap-x-6 items-center mb-10 text-neutral-800">
                {trustedPartners.map((partner) => (
                  <div key={partner.id} className="flex items-center gap-1.5 sm:gap-2 group cursor-default">
                    {partner.type === 'icon' && partner.svgPath && (
                      <svg 
                        className="w-5 h-5 sm:w-6 sm:h-6 fill-current text-neutral-800 group-hover:text-[#5953C7] transition-colors shrink-0" 
                        viewBox={partner.viewBox || "0 0 24 24"}
                      >
                        <path d={partner.svgPath} />
                      </svg>
                    )}
                    <span className={`${partner.textClass} group-hover:text-[#5953C7] transition-colors`}>
                      {partner.name}
                    </span>
                  </div>
                ))}
              </div>

              <div>
                <button
                  onClick={() => navigate('/events')}
                  className="group inline-flex items-center gap-2 border border-neutral-300 hover:border-neutral-900 rounded-full px-6 py-2.5 text-[11px] font-bold tracking-[0.15em] uppercase text-neutral-800 transition-all"
                >
                  <span>LIHAT PARTNER</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 23 LAYERS IN YOUR INBOX / DROP US A NOTE ================= */}
      <section id="contact" className="py-14 sm:py-20 px-6 bg-[#FCFCFD] border-t border-b border-neutral-100">
        <div className="max-w-5xl mx-auto relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left: Newsletter Sign-up */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h2 className="text-sm sm:text-base font-black tracking-[0.2em] uppercase text-neutral-950 mb-1">
                EVENT2 GO IN YOUR INBOX
              </h2>
              <p className="text-xs text-neutral-500 mb-6">
                Daftar untuk update & info event kampus terbaru
              </p>

              <form onSubmit={handleSubscribe} className="w-full max-w-sm flex items-center border-b border-neutral-950 pb-1.5">
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none pr-3"
                />
                <button
                  type="submit"
                  className="text-neutral-900 hover:text-[#5953C7] transition-colors p-1"
                  title="Subscribe"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
              {subscribed && (
                <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Terima kasih! Kami telah mencatat email Anda.
                </p>
              )}
            </div>

            {/* Diagonal Slash Divider */}
            <div className="hidden md:block absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none">
              <span className="text-neutral-300 text-4xl font-thin transform rotate-12 inline-block select-none">/</span>
            </div>

            {/* Right: Drop Us A Note */}
            <div className="flex flex-col items-center justify-center text-center">
              <h2 className="text-sm sm:text-base font-black tracking-[0.2em] uppercase text-neutral-950 mb-6">
                HUBUNGI KAMI
              </h2>
              <button
                onClick={() => navigate('/login')}
                className="bg-[#BAC6FB] hover:bg-[#a6b5fa] text-[#2b2575] font-black text-xs uppercase tracking-[0.2em] px-10 py-3 rounded-full shadow-sm hover:shadow transition-all active:scale-95"
              >
                CONTACT US
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ================= HIGHLIGHTS SECTION (LILAC / LAVENDER) ================= */}
      <section id="highlights" className="bg-[#DFD7F5] py-20 px-6">
        <div className="max-w-4xl mx-auto">

          {/* Centered Section Heading with Top Divider */}
          <div className="border-t border-neutral-900/15 pt-8 mb-12 text-center">
            <h2 className="text-sm sm:text-base font-black tracking-[0.25em] uppercase text-neutral-950">
              HIGHLIGHTS
            </h2>
          </div>

          {/* Highlights List / Timeline */}
          <div className="divide-y divide-neutral-900/15 border-t border-b border-neutral-900/15 relative">
            {highlights.map((item, index) => (
              <div
                key={index}
                onClick={() => item.slug && navigate('/events/' + item.slug)}
                onMouseEnter={() => setActiveHighlight(index)}
                className={`py-5 sm:py-6 transition-colors duration-200 cursor-pointer relative group flex items-start gap-6 sm:gap-12 ${activeHighlight === index ? 'bg-white/20' : 'hover:bg-white/10'
                  }`}
              >
                {/* Date */}
                <div className="w-14 sm:w-16 shrink-0 text-xs sm:text-sm font-bold text-neutral-700 tracking-wider">
                  {item.date}
                </div>

                {/* Content */}
                <div className="flex-1 pr-4">
                  <h3 className="text-sm sm:text-base font-bold text-neutral-950 group-hover:text-[#4a3ec8] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-neutral-700 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Hover Floating Thumbnail Preview */}
                {activeHighlight === index && (
                  <div className="hidden sm:block absolute right-8 -top-8 w-32 h-24 rounded-lg overflow-hidden shadow-xl border-2 border-white pointer-events-none z-20 animate-in fade-in zoom-in-95 duration-200">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom Area: OUR TEAM & Lightbulb Visual */}
          <div className="mt-16 pt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Team Info */}
            <div>
              <h3 className="text-sm font-black tracking-[0.2em] uppercase text-neutral-950 mb-1">
                OUR TEAM
              </h3>
              <p className="text-xs text-neutral-700 mb-6">
                Meet the dreamers & makers
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => navigate('/events')}
                  className="border border-neutral-900/30 hover:border-neutral-950 hover:bg-neutral-900 hover:text-white rounded-full px-5 py-2 text-[10px] font-bold tracking-[0.15em] uppercase text-neutral-900 transition-all"
                >
                  JOIN OUR TEAM
                </button>
                <button
                  onClick={() => navigate('/events')}
                  className="border border-neutral-900/30 hover:border-neutral-950 hover:bg-neutral-900 hover:text-white rounded-full px-5 py-2 text-[10px] font-bold tracking-[0.15em] uppercase text-neutral-900 transition-all"
                >
                  ABOUT US
                </button>
              </div>
            </div>

            {/* Lightbulb Visual */}
            <div className="flex justify-center md:justify-end">
              <div className="relative w-32 sm:w-40 aspect-[3/4] flex items-center justify-center opacity-85 hover:opacity-100 transition-opacity">
                {/* Minimalist frosted bulb graphic matching screenshot */}
                <div className="w-24 sm:w-28 h-32 sm:h-36 bg-gradient-to-t from-white/90 via-white/80 to-white/95 rounded-t-full shadow-lg border border-white/60 relative flex flex-col items-center justify-end p-2">
                  <div className="w-12 h-8 bg-neutral-300 rounded-b-md border-t-2 border-neutral-400 shadow-inner flex flex-col justify-evenly">
                    <div className="w-full h-0.5 bg-neutral-400"></div>
                    <div className="w-full h-0.5 bg-neutral-400"></div>
                  </div>
                  <Sparkles className="absolute top-6 text-amber-300/80 w-6 h-6 animate-pulse" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================= FOLLOW US! GALLERY ================= */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-base sm:text-lg font-black tracking-[0.25em] uppercase text-neutral-950">
              FOLLOW US!
            </h2>
          </div>

          {/* 3 Photos Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {galleryCards.map((item) => (
              <div 
                key={item.id} 
                className="group relative aspect-square overflow-hidden bg-neutral-100 shadow-sm cursor-pointer"
                onClick={() => window.open(item.linkUrl, '_blank')}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${item.hasQuote ? 'filter brightness-95' : ''}`}
                />
                {item.hasQuote ? (
                  <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
                    <p className="text-amber-300 font-black tracking-tight text-center text-xs sm:text-sm uppercase leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                      {item.quoteText.map((line, idx) => (
                        <span key={idx} className="block">
                          {line}
                        </span>
                      ))}
                    </p>
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <InstagramIcon className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-right mt-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-[#5953C7] hover:underline"
            >
              @23layers
            </a>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="pt-16 pb-12 px-6 bg-white border-t border-neutral-100 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center">

          {/* EVENT 2 GO Logo in Footer */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="cursor-pointer mb-6 select-none flex items-center justify-center"
          >
            <img
              src="/images/Logo logo_EVENT2 GO.png"
              alt="EVENT 2 GO"
              className="h-9 sm:h-11 w-auto object-contain hover:scale-105 transition-transform"
            />
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-5 text-neutral-800 mb-8">
            <a href="#" className="hover:text-[#5953C7] transition-colors"><InstagramIcon className="w-4 h-4" /></a>
            <a href="#" className="hover:text-[#5953C7] transition-colors"><TwitterIcon className="w-4 h-4" /></a>
            <a href="#" className="hover:text-[#5953C7] transition-colors"><LinkedinIcon className="w-4 h-4" /></a>
            <a href="#" className="hover:text-[#5953C7] transition-colors"><FacebookIcon className="w-4 h-4" /></a>
            <a href="#" className="hover:text-[#5953C7] transition-colors"><Mail className="w-4 h-4" /></a>
          </div>

          {/* City Roster */}
          <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-neutral-700 uppercase mb-4">
            SAN FRANCISCO &bull; NEW YORK &bull; JAKARTA &bull; BEYOND
          </p>

          {/* Copyright */}
          <p className="text-[9px] sm:text-[10px] text-neutral-400 uppercase tracking-widest">
            &copy; {new Date().getFullYear()} EVENT 2 GO. ALL RIGHTS RESERVED.
          </p>

        </div>
      </footer>
    </div>
  );
};

export default Landing;