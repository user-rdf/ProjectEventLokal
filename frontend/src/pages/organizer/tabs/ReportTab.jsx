import React, { useState, useEffect } from 'react';
import { DollarSign, Ticket, UserCheck, TrendingUp, RotateCw, AlertCircle } from 'lucide-react';
import { getReport } from '../../../api/events';
import { formatRupiah } from '../../../utils/format';

const ReportTab = ({ eventId }) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReport = async () => {
    if (!eventId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getReport(eventId);
      setReport(data);
    } catch (err) {
      console.warn('Gagal memuat laporan:', err);
      setError(err.message || 'Gagal memuat laporan ringkasan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [eventId]);

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center text-gray-400">
        <div className="w-8 h-8 border-2 border-[#5953C7] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm font-semibold">Mengambil ringkasan laporan dari database...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="bg-white border border-gray-200 rounded-3xl p-8 text-center text-gray-500">
        <AlertCircle size={32} className="mx-auto text-amber-500 mb-2" />
        <p className="font-semibold text-gray-800">Gagal Memuat Laporan</p>
        <p className="text-xs text-gray-400 mt-1 mb-4">{error}</p>
        <button 
          onClick={fetchReport} 
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-bold text-gray-700 cursor-pointer"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  const registered = report.registered || 0;
  const attended = report.attended || 0;
  const attendanceRate = report.attendance_rate || 0;
  const revenueList = Array.isArray(report.revenue_by_ticket_type) ? report.revenue_by_ticket_type : [];
  const totalRevenue = revenueList.reduce((acc, r) => acc + (r.revenue || 0), 0);

  return (
    <div className="animate-in fade-in duration-300 space-y-6">
      
      {/* 3 Kartu Metrik Utama */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Omzet Penjualan</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              💰
            </div>
          </div>
          <div className="text-3xl font-black text-gray-900 mb-1">{formatRupiah(totalRevenue)}</div>
          <p className="text-xs text-gray-500">Dari {registered} tiket terkonfirmasi</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Tiket Terdaftar</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-[#5953C7] flex items-center justify-center font-bold">
              🎟️
            </div>
          </div>
          <div className="text-3xl font-black text-gray-900 mb-1">{registered}</div>
          <p className="text-xs text-gray-500">Total peserta terdaftar saat ini</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Tingkat Kehadiran</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              ✅
            </div>
          </div>
          <div className="text-3xl font-black text-gray-900 mb-1">{attendanceRate}%</div>
          <p className="text-xs text-gray-500">{attended} dari {registered} peserta telah hadir</p>
        </div>
      </div>

      {/* Rincian Visualisasi & Tabel Omzet */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Kehadiran */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <h3 className="font-bold text-gray-900 mb-4">Persentase Kehadiran</h3>
          <div className="flex-1 flex items-center justify-center my-4">
            <div className="w-36 h-36 rounded-full border-[12px] border-gray-100 flex items-center justify-center relative">
               <svg className="absolute top-[-12px] left-[-12px] w-[168px] h-[168px] transform -rotate-90">
                 <circle 
                   cx="84" 
                   cy="84" 
                   r="72" 
                   stroke="#10b981" 
                   strokeWidth="12" 
                   fill="none" 
                   strokeDasharray="452" 
                   strokeDashoffset={452 - (452 * (attendanceRate / 100))} 
                   strokeLinecap="round" 
                 />
               </svg>
               <div className="text-center">
                 <div className="text-3xl font-black text-gray-900">{attendanceRate}%</div>
                 <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Hadir</div>
               </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center border-t border-gray-100 pt-4 text-xs">
            <div>
              <div className="font-bold text-emerald-600 text-base">{attended}</div>
              <div className="text-gray-500">Telah Scan QR</div>
            </div>
            <div>
              <div className="font-bold text-gray-700 text-base">{Math.max(0, registered - attended)}</div>
              <div className="text-gray-500">Belum Hadir</div>
            </div>
          </div>
        </div>

        {/* Tabel Pendapatan Per Kategori */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm flex flex-col">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Rincian Penjualan per Kategori Tiket</h3>
            <button 
              onClick={fetchReport} 
              title="Refresh Laporan"
              className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <RotateCw size={15} />
            </button>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500 text-xs font-bold uppercase tracking-wider bg-gray-50/50">
                  <th className="py-4 px-6">Kategori Tiket</th>
                  <th className="py-4 px-6 text-center">Terjual</th>
                  <th className="py-4 px-6 text-right">Total Pendapatan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {revenueList.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-gray-400 text-xs">
                      Belum ada penjualan tiket untuk kategori manapun.
                    </td>
                  </tr>
                ) : (
                  revenueList.map((r, i) => (
                    <tr key={i} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-4 px-6 font-bold text-gray-900">{r.name}</td>
                      <td className="py-4 px-6 text-center font-semibold text-gray-700">{r.sold} tiket</td>
                      <td className="py-4 px-6 text-right font-black text-gray-900">{formatRupiah(r.revenue)}</td>
                    </tr>
                  ))
                )}
                {revenueList.length > 0 && (
                  <tr className="bg-gray-50 font-bold border-t-2 border-gray-200">
                    <td className="py-4 px-6 text-gray-900 font-extrabold uppercase text-xs">Total Keseluruhan</td>
                    <td className="py-4 px-6 text-center text-gray-900">{registered} tiket</td>
                    <td className="py-4 px-6 text-right text-emerald-700 font-black text-base">{formatRupiah(totalRevenue)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ReportTab;