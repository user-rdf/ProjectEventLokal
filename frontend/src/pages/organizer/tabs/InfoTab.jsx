import React from 'react';
import { Calendar, Clock, MapPin, Users, Ticket, Tag } from 'lucide-react';
import { formatRupiah, formatDateTime } from '../../../utils/format';

const InfoTab = ({ event }) => {
  if (!event) {
    return <div className="p-8 text-center text-gray-500">Memuat data info event...</div>;
  }

  // Format Tanggal
  const formatEventDate = (dateStr) => {
    if (!dateStr) return 'TBA';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  // Format Jam
  const formatEventTime = (startsStr, endsStr) => {
    if (!startsStr) return 'TBA';
    try {
      const s = new Date(startsStr);
      const startTime = s.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace(':', '.');
      if (!endsStr) return `${startTime} WIB`;
      const e = new Date(endsStr);
      const endTime = e.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace(':', '.');
      return `${startTime} - ${endTime} WIB`;
    } catch {
      return 'TBA';
    }
  };

  const ticketTypes = Array.isArray(event.ticket_types) ? event.ticket_types : [];
  const totalQuota = ticketTypes.reduce((acc, t) => acc + (t.quota || 0), 0);
  const totalSold = ticketTypes.reduce((acc, t) => acc + (t.sold || 0), 0);
  const totalRemaining = Math.max(0, totalQuota - totalSold);
  const percentageSold = totalQuota > 0 ? Math.round((totalSold / totalQuota) * 100) : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
      
      {/* Kolom Kiri: Detail Informasi & Deskripsi */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">
            Informasi Pelaksanaan
          </h2>

          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#EEEDFA] text-[#5953C7] flex items-center justify-center shrink-0">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Tanggal Pelaksanaan</p>
                <p className="font-bold text-gray-900 text-base mt-0.5">{formatEventDate(event.starts_at)}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#EEEDFA] text-[#5953C7] flex items-center justify-center shrink-0">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Waktu Acara</p>
                <p className="font-bold text-gray-900 text-base mt-0.5">{formatEventTime(event.starts_at, event.ends_at)}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#EEEDFA] text-[#5953C7] flex items-center justify-center shrink-0">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Lokasi / Venue</p>
                <p className="font-bold text-gray-900 text-base mt-0.5">{event.venue || 'Lokasi belum ditentukan'}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#EEEDFA] text-[#5953C7] flex items-center justify-center shrink-0">
                <Tag size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Kategori & Slug URL</p>
                <p className="font-bold text-gray-900 text-base mt-0.5">
                  <span className="capitalize">{event.category || 'Umum'}</span> • <code className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono">/events/{event.slug}</code>
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Deskripsi Event</h3>
            <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line bg-gray-50 p-4 rounded-2xl border border-gray-100">
              {event.description || 'Tidak ada deskripsi detail untuk event ini.'}
            </p>
          </div>
        </div>
      </div>

      {/* Kolom Kanan: Statistik Ringkas & Kuota Per Kategori */}
      <div className="space-y-6">
        {/* Box Statistik Terdaftar & Kuota */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Users size={18} className="text-[#5953C7]" />
            <span className="text-xs font-bold uppercase tracking-wider">Kapasitas Keseluruhan</span>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-black text-gray-900">{totalSold}</span>
            <span className="text-gray-400 font-semibold">/ {totalQuota} Tiket</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
            <div 
              className="bg-[#5953C7] h-2 rounded-full transition-all duration-500" 
              style={{ width: `${percentageSold}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 font-medium">
            {totalRemaining === 0 ? '⚠️ Kuota tiket telah penuh' : `Sisa ${totalRemaining} tiket tersedia untuk pendaftar`}
          </p>
        </div>

        {/* Box Kuota Per Kategori Tiket */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Ticket size={18} className="text-[#5953C7]" />
            <h3 className="font-bold text-gray-900">Kategori Tiket</h3>
          </div>
          
          <div className="space-y-5">
            {ticketTypes.length === 0 ? (
              <p className="text-sm text-gray-400 py-2">Belum ada kategori tiket.</p>
            ) : (
              ticketTypes.map((t) => {
                const sold = t.sold || 0;
                const quota = t.quota || 0;
                const remaining = Math.max(0, quota - sold);
                const percent = quota > 0 ? Math.round((sold / quota) * 100) : 0;
                const isFull = remaining === 0;

                return (
                  <div key={t.id || t.name} className="border-b border-gray-100 pb-4 last:border-none last:pb-0">
                    <div className="flex justify-between items-start text-sm mb-1.5">
                      <div>
                        <div className="font-bold text-gray-900">{t.name}</div>
                        <div className="text-xs text-indigo-600 font-semibold">{formatRupiah(t.price_idr)}</div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-gray-900 text-sm">{sold} / {quota}</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 mb-1.5">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${isFull ? 'bg-red-500' : 'bg-[#5953C7]'}`} 
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className={isFull ? 'text-red-500 font-bold' : 'text-gray-500'}>
                        {isFull ? 'Kuota Habis' : `Sisa ${remaining} tiket`}
                      </span>
                      <span className="text-gray-400 font-medium">{percent}%</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default InfoTab;