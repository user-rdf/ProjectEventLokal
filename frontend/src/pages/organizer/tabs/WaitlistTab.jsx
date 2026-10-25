import React, { useState, useEffect } from 'react';
import { Info, User, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { listWaitlist } from '../../../api/bookings';

const WaitlistTab = ({ eventId }) => {
  const [waitlist, setWaitlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!eventId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    listWaitlist(eventId)
      .then((data) => {
        setWaitlist(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.warn('Gagal memuat waitlist:', err.message);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [eventId]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) + ' WIB';
    } catch {
      return dateStr;
    }
  };

  const getInitials = (name) => {
    if (!name) return '??';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  };

  return (
    <div className="animate-in fade-in duration-300 space-y-6">
      {/* Alert Info */}
      <div className="bg-[#f8fafc] border border-indigo-100 rounded-2xl p-4 flex gap-3 text-sm text-[#5953C7]">
        <Info className="text-[#5953C7] flex-shrink-0 mt-0.5" size={20} />
        <p className="leading-relaxed">
          Saat ada pendaftaran yang dibatalkan oleh panitia, peserta <strong>nomor pertama</strong> di antrean otomatis dipromosikan mendapat tiket resmi dan dikirimi email "Kamu mendapat tiket!". Tidak perlu tindakan manual.
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-neutral-400">
          <div className="w-8 h-8 border-2 border-[#5953C7] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs font-bold">Memuat daftar antrean dari database...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-center text-red-700 text-xs">
          <AlertCircle className="w-6 h-6 text-red-500 mx-auto mb-2" />
          <p className="font-bold">Gagal memuat data waitlist</p>
          <p className="mt-1 text-neutral-600">{error}</p>
          {(error.toLowerCase().includes('auth') || error.toLowerCase().includes('token') || error.toLowerCase().includes('login') || error.toLowerCase().includes('forbidden') || error.toLowerCase().includes('unauthorized')) && (
            <div className="mt-3">
              <button
                type="button"
                onClick={() => window.location.href = '/login'}
                className="inline-flex items-center gap-1.5 bg-[#5953C7] text-white px-4 py-2 rounded-full font-bold text-xs hover:bg-[#473ebf] shadow-xs cursor-pointer"
              >
                Masuk sebagai Panitia (Login)
              </button>
            </div>
          )}
        </div>
      ) : waitlist.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-10 text-center">
          <Clock className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
          <h4 className="font-bold text-sm text-neutral-800">Belum Ada Antrean</h4>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            Daftar tunggu akan terisi otomatis saat calon peserta mendaftar pada tiket yang kuotanya sudah habis.
          </p>
        </div>
      ) : (
        /* List Antrean dari Database */
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm divide-y divide-gray-100">
          {waitlist.map((item, idx) => {
            const isFirst = item.status === 'waiting' && (item.position === 1 || idx === 0);
            return (
              <div
                key={item.id}
                className="p-4 flex items-center justify-between hover:bg-gray-50/80 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {/* Badge Posisi */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      isFirst
                        ? 'bg-[#5953C7] text-white shadow-xs'
                        : item.status === 'promoted'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {item.position ?? idx + 1}
                  </div>

                  {/* Avatar Inisial */}
                  <div className="w-10 h-10 rounded-full bg-indigo-50 text-[#5953C7] flex items-center justify-center font-bold text-xs">
                    {getInitials(item.name)}
                  </div>

                  {/* Info Peserta */}
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-gray-900">{item.name}</h4>
                      {isFirst && (
                        <span className="text-[10px] font-black text-[#5953C7] bg-[#EEEDFA] px-2 py-0.5 rounded-full border border-indigo-100">
                          Berikutnya
                        </span>
                      )}
                      {item.status === 'promoted' && (
                        <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Sudah Promosi
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.email} • {item.phone || '-'}
                    </p>
                  </div>
                </div>

                {/* Kategori Tiket & Tanggal Masuk */}
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">{item.ticket_type}</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    Masuk {formatDate(item.created_at || item.joined_at)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WaitlistTab;