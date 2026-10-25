import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Calendar, MapPin, QrCode, Ticket } from 'lucide-react';

const TemplateEmail = ({ initialEvent, initialAttendee }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('tiket'); // 'tiket' | 'pengingat' | 'waitlist' | 'dibatalkan'

  // Data event & peserta (bisa memakai data default sesuai desain mockup atau dari props jika diintegrasikan)
  const event = initialEvent || {
    title: 'Workshop UI/UX: Dari Wireframe ke Prototipe',
    dateTime: 'Sabtu, 14 November 2026, 09.00 WIB',
    venue: 'Lab Multimedia Gedung C, Universitas Gadjah Mada, Yogyakarta',
    organizer: 'HIMAKOM UGM'
  };

  const attendee = initialAttendee || {
    name: 'Ayu Lestari',
    firstName: 'Ayu',
    email: 'ayu.lestari@gmail.com',
    ticketCode: 'EL-101-3F7Q',
    ticketType: 'Mahasiswa'
  };

  const templates = {
    tiket: {
      subject: `Tiket kamu: ${event.title}`,
      greeting: `Halo ${attendee.firstName}, tiketmu sudah siap!`,
      desc: 'Simpan email ini. Tunjukkan QR di bawah kepada panitia saat masuk acara.',
      showQr: true
    },
    pengingat: {
      subject: `Pengingat: ${event.title} dimulai besok!`,
      greeting: `Besok acara dimulai, ${attendee.firstName}!`,
      desc: 'Jangan lupa siapkan tiket QR kamu sebelum datang ke lokasi acara. Datang lebih awal untuk mempermudah antrean check-in.',
      showQr: true
    },
    waitlist: {
      subject: `Kamu mendapat tiket! ${event.title}`,
      greeting: `Kabar baik, ${attendee.firstName}! Kamu mendapat tiket.`,
      desc: 'Ada kuota yang terbuka dan kamu adalah antrean pertama. Tiket ini sudah otomatis jadi milikmu.',
      showQr: true
    },
    dibatalkan: {
      subject: `Pendaftaran dibatalkan: ${event.title}`,
      greeting: 'Pendaftaranmu dibatalkan',
      desc: 'Panitia membatalkan pendaftaranmu untuk acara ini. QR sebelumnya tidak berlaku lagi. Hubungi panitia jika ini keliru.',
      showQr: false
    }
  };

  const current = templates[activeTab];

  return (
    <div className="min-h-screen bg-[#F0F4F8] text-neutral-900 font-sans p-6 sm:p-10 selection:bg-[#5953C7] selection:text-white">
      <div className="max-w-3xl mx-auto">
        
        {/* Tombol Navigasi Kembali */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-neutral-600 hover:text-neutral-950 transition-colors mb-4 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Beranda</span>
        </button>

        {/* Judul Halaman */}
        <h1 className="text-2xl sm:text-3xl font-black text-neutral-950 tracking-tight mb-6">
          Template email
        </h1>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none text-xs sm:text-sm">
          <button
            onClick={() => setActiveTab('tiket')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'tiket'
                ? 'bg-white text-[#5953C7] shadow-sm border border-neutral-200/80 ring-1 ring-[#5953C7]/20'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Tiket
          </button>

          <button
            onClick={() => setActiveTab('pengingat')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'pengingat'
                ? 'bg-white text-[#5953C7] shadow-sm border border-neutral-200/80 ring-1 ring-[#5953C7]/20'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Pengingat H-1
          </button>

          <button
            onClick={() => setActiveTab('waitlist')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'waitlist'
                ? 'bg-white text-[#5953C7] shadow-sm border border-neutral-200/80 ring-1 ring-[#5953C7]/20'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Dari daftar tunggu
          </button>

          <button
            onClick={() => setActiveTab('dibatalkan')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'dibatalkan'
                ? 'bg-white text-[#5953C7] shadow-sm border border-neutral-200/80 ring-1 ring-[#5953C7]/20'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Dibatalkan
          </button>
        </div>

        {/* Frame Outer Email Envelope Container */}
        <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-sm overflow-hidden">
          
          {/* Header Strip Envelope Meta */}
          <div className="px-6 sm:px-8 py-5 border-b border-neutral-100 bg-white">
            <h3 className="font-bold text-sm text-neutral-900 leading-snug">
              {current.subject}
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              EVENT 2 GO &lt;tiket@event2go.id&gt; &middot; kepada {attendee.email}
            </p>
          </div>

          {/* Area Latar Belakang Kartu Email */}
          <div className="bg-[#F8FAFC] p-6 sm:p-12 flex justify-center">
            
            {/* The Actual Email Card */}
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-neutral-200/80 overflow-hidden">
              
              {/* Card Top Bar Header (#5953C7 with EVENT 2 GO Logo) */}
              <div className="bg-[#5953C7] px-6 py-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src="/images/Logo logo_EVENT2 GO.png"
                    alt="EVENT 2 GO"
                    className="h-8 w-auto object-contain filter brightness-110 drop-shadow-sm"
                  />
                </div>
                <span className="text-[10px] tracking-widest uppercase font-extrabold text-white/90 bg-white/10 px-2.5 py-1 rounded-full border border-white/20">
                  OFFICIAL TICKET
                </span>
              </div>

              {/* Card Inner Content */}
              <div className="p-6 sm:p-8 space-y-6">
                
                {/* Greeting & Headline */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-neutral-950 tracking-tight leading-tight">
                    {current.greeting}
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-500 mt-2 leading-relaxed">
                    {current.desc}
                  </p>
                </div>

                {/* Event Details Box */}
                <div className="border border-neutral-200 rounded-2xl p-4 sm:p-5 bg-white space-y-2">
                  <h4 className="font-bold text-sm text-neutral-950 leading-snug">
                    {event.title}
                  </h4>
                  <div className="space-y-1.5 pt-1 text-xs text-neutral-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#5953C7] shrink-0" />
                      <span>{event.dateTime}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#5953C7] shrink-0 mt-0.5" />
                      <span className="leading-snug">{event.venue}</span>
                    </div>
                  </div>
                </div>

                {/* QR Code Container (Hanya tampil pada tab yang memiliki QR) */}
                {current.showQr && (
                  <div className="bg-[#F0F3FA] rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center">
                    
                    {/* White QR Code Square */}
                    <div className="bg-white p-3 rounded-2xl shadow-sm border border-neutral-100 flex items-center justify-center">
                      <QrCode className="w-36 h-36 sm:w-40 sm:h-40 text-neutral-950 stroke-[1.5]" />
                    </div>

                    {/* Ticket Code */}
                    <div className="font-mono font-black text-sm tracking-widest text-[#5953C7] mt-4">
                      {attendee.ticketCode}
                    </div>

                    {/* Category & Attendee Name */}
                    <div className="text-xs text-neutral-500 font-medium mt-1">
                      {attendee.ticketType} &middot; {attendee.name}
                    </div>

                  </div>
                )}

                {/* Single-use Security Warning */}
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Tiket ini berlaku untuk satu orang. Jangan bagikan QR ke orang lain &mdash; QR hanya bisa dipakai sekali.
                </p>

                {/* Footer Attribution */}
                <div className="pt-4 border-t border-neutral-100 text-center text-[11px] text-neutral-400">
                  Dikirim oleh EVENT 2 GO atas nama {event.organizer}
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default TemplateEmail;
