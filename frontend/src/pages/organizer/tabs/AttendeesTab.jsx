import React, { useState, useEffect } from 'react';
import { Search, Download, CheckCircle2, Clock, XCircle, AlertCircle, Trash2, RotateCw } from 'lucide-react';
import { listAttendees, cancelBooking } from '../../../api/bookings';

const AttendeesTab = ({ eventId }) => {
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'hadir' | 'belum_hadir' | 'dibatalkan'
  const [actionLoading, setActionLoading] = useState(null);

  const fetchAttendees = async () => {
    if (!eventId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await listAttendees(eventId);
      setAttendees(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Gagal memuat peserta:', err);
      setError(err.message || 'Gagal memuat daftar peserta.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendees();
  }, [eventId]);

  const handleCancelBooking = async (bookingId, attendeeName) => {
    if (!window.confirm(`Yakin ingin membatalkan pendaftaran ${attendeeName}? Sistem basis data akan otomatis mempromosikan peserta nomor pertama di daftar tunggu (waitlist) jika ada.`)) {
      return;
    }

    setActionLoading(bookingId);
    try {
      await cancelBooking(bookingId);
      alert(`Pendaftaran ${attendeeName} telah dibatalkan. Jika ada antrean waitlist, tiket otomatis dialihkan ke antrean terdepan.`);
      fetchAttendees();
    } catch (err) {
      alert(`Gagal membatalkan: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  // Helper Export CSV
  const handleExportCSV = () => {
    if (attendees.length === 0) {
      alert('Tidak ada data peserta untuk diekspor.');
      return;
    }

    const headers = ['Nama Peserta', 'Email', 'No Telepon', 'Kategori Tiket', 'Kode Tiket', 'Status Booking', 'Status Tiket', 'Waktu Registrasi'];
    const rows = attendees.map(a => [
      `"${a.attendee_name || ''}"`,
      `"${a.attendee_email || ''}"`,
      `"${a.attendee_phone || ''}"`,
      `"${a.ticket_type || ''}"`,
      `"${a.ticket_code || ''}"`,
      `"${a.status || ''}"`,
      `"${a.ticket_status || ''}"`,
      `"${a.created_at || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `peserta_event_${eventId.slice(0, 8)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter & Search Logic
  const filteredAttendees = attendees.filter(a => {
    const q = search.toLowerCase();
    const matchSearch = 
      (a.attendee_name || '').toLowerCase().includes(q) ||
      (a.attendee_email || '').toLowerCase().includes(q) ||
      (a.attendee_phone || '').toLowerCase().includes(q) ||
      (a.ticket_code || '').toLowerCase().includes(q);

    if (!matchSearch) return false;

    if (filterStatus === 'hadir') {
      return a.ticket_status === 'used';
    }
    if (filterStatus === 'belum_hadir') {
      return a.status === 'confirmed' && a.ticket_status !== 'used';
    }
    if (filterStatus === 'dibatalkan') {
      return a.status === 'cancelled';
    }
    return true;
  });

  const countHadir = attendees.filter(a => a.ticket_status === 'used').length;
  const countBelumHadir = attendees.filter(a => a.status === 'confirmed' && a.ticket_status !== 'used').length;
  const countDibatalkan = attendees.filter(a => a.status === 'cancelled').length;

  const getInitials = (name) => {
    if (!name) return '??';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  };

  return (
    <div className="animate-in fade-in duration-300 space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search size={18} className="absolute left-3.5 top-3 text-gray-400" />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, email, atau kode tiket..." 
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#5953C7] shadow-xs"
          />
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={fetchAttendees} 
            title="Muat ulang"
            className="p-2.5 border border-gray-300 bg-white rounded-xl text-gray-600 hover:bg-gray-50 cursor-pointer"
          >
            <RotateCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
          <button 
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 border border-gray-300 bg-white px-4 py-2.5 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 shadow-xs cursor-pointer"
          >
            <Download size={16} /> Ekspor CSV
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
        <button 
          onClick={() => setFilterStatus('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-colors cursor-pointer ${filterStatus === 'all' ? 'bg-[#5953C7] text-white shadow-xs' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
        >
          Semua <span className={`px-2 py-0.5 rounded-full text-[10px] ${filterStatus === 'all' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'}`}>{attendees.length}</span>
        </button>
        <button 
          onClick={() => setFilterStatus('hadir')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-colors cursor-pointer ${filterStatus === 'hadir' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
        >
          Hadir <span className={`px-2 py-0.5 rounded-full text-[10px] ${filterStatus === 'hadir' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'}`}>{countHadir}</span>
        </button>
        <button 
          onClick={() => setFilterStatus('belum_hadir')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-colors cursor-pointer ${filterStatus === 'belum_hadir' ? 'bg-amber-600 text-white shadow-xs' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
        >
          Belum Hadir <span className={`px-2 py-0.5 rounded-full text-[10px] ${filterStatus === 'belum_hadir' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'}`}>{countBelumHadir}</span>
        </button>
        <button 
          onClick={() => setFilterStatus('dibatalkan')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-colors cursor-pointer ${filterStatus === 'dibatalkan' ? 'bg-red-600 text-white shadow-xs' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
        >
          Dibatalkan <span className={`px-2 py-0.5 rounded-full text-[10px] ${filterStatus === 'dibatalkan' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'}`}>{countDibatalkan}</span>
        </button>
      </div>

      {/* Tabel Peserta */}
      {loading ? (
        <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center text-gray-400">
          <div className="w-8 h-8 border-2 border-[#5953C7] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm font-semibold">Memuat daftar peserta...</p>
        </div>
      ) : filteredAttendees.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center text-gray-400">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-300">
            <CheckCircle2 size={32} />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-1">Belum Ada Peserta</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            {attendees.length === 0 
              ? 'Belum ada pendaftaran untuk event ini. Bagikan tautan event ke peserta untuk mulai menerima registrasi!'
              : 'Tidak ada peserta yang cocok dengan kriteria pencarian/filter Anda.'}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/75 text-gray-500 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">Peserta</th>
                  <th className="py-4 px-6">Kategori Tiket</th>
                  <th className="py-4 px-6">Kode Tiket</th>
                  <th className="py-4 px-6">Status Kehadiran</th>
                  <th className="py-4 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredAttendees.map((a) => {
                  const isUsed = a.ticket_status === 'used';
                  const isCancelled = a.status === 'cancelled';

                  return (
                    <tr key={a.id || a.booking_id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-[#5953C7] flex items-center justify-center font-bold text-xs shrink-0 border border-indigo-100">
                            {getInitials(a.attendee_name)}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{a.attendee_name}</div>
                            <div className="text-gray-500 text-xs">{a.attendee_email} • {a.attendee_phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-medium text-gray-700">
                        {a.ticket_type || 'Reguler'}
                      </td>
                      <td className="py-4 px-6 font-mono text-xs font-bold text-gray-600">
                        {a.ticket_code ? (
                          <span className="bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200/80">
                            {a.ticket_code}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic">-</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        {isCancelled ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200/60">
                            <XCircle size={14} /> Dibatalkan
                          </span>
                        ) : isUsed ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                            <CheckCircle2 size={14} /> Hadir
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200/60">
                            <Clock size={14} /> Belum Hadir
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        {!isCancelled && (
                          <button
                            onClick={() => handleCancelBooking(a.booking_id || a.id, a.attendee_name)}
                            disabled={actionLoading === (a.booking_id || a.id)}
                            title="Batalkan pendaftaran & promosikan antrean waitlist terdepan"
                            className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-800 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-40"
                          >
                            <Trash2 size={14} /> Batalkan
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendeesTab;