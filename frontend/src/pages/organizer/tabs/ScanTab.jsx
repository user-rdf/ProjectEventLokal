import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Camera, CameraOff, ScanLine, Search, CheckCircle2, AlertTriangle, XCircle, RotateCw, Users, ShieldAlert } from 'lucide-react';
import { checkIn, searchTickets } from '../../../api/checkins';
import { getReport } from '../../../api/events';

const ScanTab = ({ eventId, eventTitle }) => {
  const [scanMode, setScanMode] = useState('manual'); // 'manual' | 'camera'
  const [ticketCode, setTicketCode] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  // Live summary stats
  const [report, setReport] = useState(null);
  const [loadingReport, setLoadingReport] = useState(false);

  // Camera state & refs
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  // Ambil ringkasan kehadiran aktual
  const fetchReport = useCallback(async () => {
    if (!eventId) return;
    try {
      const data = await getReport(eventId);
      setReport(data);
    } catch (err) {
      console.warn('Gagal memuat status kehadiran:', err);
    }
  }, [eventId]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  // Kontrol Kamera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      if (!navigator?.mediaDevices?.getUserMedia) {
        throw new Error('Browser Anda tidak mendukung akses kamera langsung.');
      }
      stopCamera();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err) {
      console.warn('Gagal mengaktifkan kamera:', err);
      setCameraError(
        err.name === 'NotAllowedError'
          ? 'Izin kamera ditolak. Berikan izin di browser atau gunakan input kode manual di bawah.'
          : (err.message || 'Kamera tidak ditemukan atau sedang digunakan aplikasi lain.')
      );
      setCameraActive(false);
    }
  }, [stopCamera]);

  useEffect(() => {
    if (scanMode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [scanMode, startCamera, stopCamera]);

  // Proses scan/check-in kode tiket
  const handleCheckIn = async (codeToScan) => {
    const code = (codeToScan || ticketCode).trim();
    if (!code) {
      alert('Masukkan atau scan kode tiket terlebih dahulu.');
      return;
    }

    setLoading(true);
    setScanResult(null);

    try {
      const res = await checkIn({ event_id: eventId, code });
      setScanResult({
        type: 'success',
        status: res.status,
        message: res.message || 'Tiket berhasil divalidasi!',
        attendee_name: res.attendee_name,
        ticket_type: res.ticket_type,
        checked_at: new Date().toLocaleTimeString('id-ID')
      });
      setTicketCode('');
      // Refresh ringkasan kehadiran
      fetchReport();
    } catch (err) {
      const body = err.body || {};
      const statusType = body.status === 'already_used' ? 'warning' : 'error';
      setScanResult({
        type: statusType,
        status: body.status || 'invalid',
        message: err.message || body.message || 'Tiket tidak valid.',
        attendee_name: body.attendee_name,
        ticket_type: body.ticket_type,
        first_checked_in_at: body.first_checked_in_at
      });
    } finally {
      setLoading(false);
    }
  };

  // QR Barcode Detector loop jika browser mendukung Web BarcodeDetector API
  useEffect(() => {
    if (scanMode !== 'camera' || !cameraActive) return;

    let isScanning = true;
    let detector = null;

    if ('BarcodeDetector' in window) {
      try {
        detector = new window.BarcodeDetector({ formats: ['qr_code', 'code_128', 'code_39'] });
      } catch (e) {
        detector = null;
      }
    }

    const interval = setInterval(async () => {
      if (!isScanning || !videoRef.current || videoRef.current.readyState < 2 || !detector || loading) {
        return;
      }
      try {
        const barcodes = await detector.detect(videoRef.current);
        if (barcodes && barcodes.length > 0) {
          const raw = barcodes[0].rawValue;
          if (raw && !loading) {
            handleCheckIn(raw);
          }
        }
      } catch (e) {
        // Pass silently per frame
      }
    }, 700);

    return () => {
      isScanning = false;
      clearInterval(interval);
    };
  }, [scanMode, cameraActive, loading]);

  // Pencarian manual tiket berdasarkan nama, email, nomor HP atau kode
  const handleSearchTickets = async (e) => {
    e.preventDefault();
    if (!searchQuery || searchQuery.trim().length < 2) {
      alert('Ketik minimal 2 karakter untuk mencari tiket.');
      return;
    }

    setSearching(true);
    try {
      const res = await searchTickets(eventId, searchQuery.trim());
      setSearchResults(Array.isArray(res) ? res : []);
    } catch (err) {
      console.warn('Gagal mencari tiket:', err);
      alert(`Pencarian gagal: ${err.message}`);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-300 space-y-6">
      {/* Live Check-in Stats Bar */}
      <div className="bg-gradient-to-r from-[#5953C7]/10 via-purple-50 to-indigo-50 border border-[#5953C7]/20 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#5953C7] text-white flex items-center justify-center shadow-sm">
            <Users size={20} />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-semibold">Kehadiran Aktual di Lokasi</div>
            <div className="text-base font-black text-gray-900">
              {report ? `${report.attended || 0} / ${report.registered || 0} Peserta Hadir` : 'Memuat data...'}
              {report && report.registered > 0 && (
                <span className="ml-2 text-xs font-bold text-[#5953C7] bg-[#5953C7]/15 px-2 py-0.5 rounded-full">
                  {report.attendance_rate || 0}%
                </span>
              )}
            </div>
          </div>
        </div>

        <button 
          onClick={fetchReport}
          className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#5953C7] bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-xs cursor-pointer transition-colors"
          title="Segarkan statistik kehadiran"
        >
          <RotateCw size={13} />
          Segarkan
        </button>
      </div>

      {/* Switch Mode Tab */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-3">
        <div className="flex gap-4">
          <button 
            onClick={() => setScanMode('manual')}
            className={`pb-2 text-sm font-bold transition-colors cursor-pointer ${scanMode === 'manual' ? 'border-b-2 border-[#5953C7] text-[#5953C7]' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Input Kode & Cari Manual
          </button>
          <button 
            onClick={() => setScanMode('camera')}
            className={`pb-2 text-sm font-bold transition-colors cursor-pointer ${scanMode === 'camera' ? 'border-b-2 border-[#5953C7] text-[#5953C7]' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Kamera QR Scanner
          </button>
        </div>
        <div className="text-xs text-gray-500 font-medium">
          Event: <span className="font-bold text-gray-800">{eventTitle || 'Event Terpilih'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sisi Kiri: Scanner Kamera atau Form Input Manual */}
        <div className="lg:col-span-7 space-y-6">
          {scanMode === 'camera' ? (
            <div className="bg-[#0a0f1c] rounded-3xl min-h-[440px] relative overflow-hidden flex flex-col items-center justify-center p-6 text-center shadow-lg">
              
              {/* Video Element untuk Real Camera Stream */}
              <video 
                ref={videoRef}
                autoPlay 
                playsInline 
                muted
                className={`absolute inset-0 w-full h-full object-cover ${cameraActive ? 'opacity-100' : 'opacity-0'}`}
              />

              {/* Status Badge */}
              <div className="absolute top-4 left-4 text-white/90 flex items-center gap-2 text-xs bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 z-10">
                {cameraActive ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <Camera size={14} /> Kamera Aktif
                  </>
                ) : (
                  <>
                    <CameraOff size={14} className="text-amber-400" /> Menghubungkan Kamera...
                  </>
                )}
              </div>

              {cameraError ? (
                <div className="relative z-10 bg-black/80 backdrop-blur-md border border-red-500/30 p-6 rounded-2xl max-w-sm text-center">
                  <ShieldAlert size={36} className="text-amber-400 mx-auto mb-2" />
                  <p className="text-white text-sm font-semibold mb-2">Akses Kamera Terkendala</p>
                  <p className="text-white/70 text-xs mb-4">{cameraError}</p>
                  <div className="flex gap-2 justify-center">
                    <button 
                      onClick={startCamera}
                      className="px-4 py-2 bg-[#5953C7] text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-[#4842b0]"
                    >
                      Coba Lagi
                    </button>
                    <button 
                      onClick={() => setScanMode('manual')}
                      className="px-4 py-2 bg-white/20 text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-white/30"
                    >
                      Pindah ke Manual
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Overlay Bingkai Scan */}
                  <div className="relative w-64 h-64 mb-6 z-10 pointer-events-none">
                    <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-indigo-400 rounded-tl-2xl"></div>
                    <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-indigo-400 rounded-tr-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-indigo-400 rounded-bl-2xl"></div>
                    <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-indigo-400 rounded-br-2xl"></div>
                    
                    {/* Garis Scan Animasi */}
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-[#5953C7] shadow-[0_0_16px_rgba(89,83,199,1)] animate-pulse"></div>
                  </div>
                  
                  <div className="relative z-10 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                    <p className="text-white/90 text-xs font-medium">Arahkan kamera ke QR Code e-tiket peserta</p>
                    <p className="text-white/50 text-[11px] mt-0.5">Sistem akan otomatis mendeteksi dan memvalidasi tiket</p>
                  </div>

                  {/* Manual Code input fallback directly below camera */}
                  <div className="relative z-10 mt-4 w-full max-w-sm flex gap-2">
                    <input 
                      type="text"
                      value={ticketCode}
                      onChange={(e) => setTicketCode(e.target.value)}
                      placeholder="Atau ketik kode tiket..."
                      className="flex-1 px-3 py-2 bg-black/60 backdrop-blur-md border border-white/20 rounded-xl text-xs font-mono text-white placeholder-white/40 focus:outline-none focus:border-[#5953C7]"
                    />
                    <button 
                      onClick={() => handleCheckIn()}
                      disabled={loading || !ticketCode.trim()}
                      className="px-4 py-2 bg-[#5953C7] text-white rounded-xl text-xs font-bold hover:bg-[#4842b0] transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {loading ? 'Validasi...' : 'Check-in'}
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-1">Check-in Cepat (Input Kode)</h3>
                <p className="text-xs text-gray-500 mb-4">Gunakan scanner barcode USB/Bluetooth atau ketik kode tiket alfanumerik peserta.</p>
                
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleCheckIn(); }}
                  className="flex gap-2"
                >
                  <input 
                    type="text"
                    value={ticketCode}
                    onChange={(e) => setTicketCode(e.target.value)}
                    placeholder="Contoh: TKT-XXXX-XXXX atau TIK-..."
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm font-mono uppercase tracking-wider focus:outline-none focus:border-[#5953C7] focus:bg-white"
                  />
                  <button 
                    type="submit"
                    disabled={loading || !ticketCode.trim()}
                    className="px-6 py-3 bg-[#5953C7] text-white rounded-xl text-sm font-bold hover:bg-[#4842b0] transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {loading ? 'Validasi...' : 'Check-in'}
                  </button>
                </form>
              </div>

              {/* Pencarian Tiket Manual */}
              <div className="pt-6 border-t border-gray-100">
                <h3 className="text-base font-bold text-gray-900 mb-1">Pencarian Tiket Peserta di Meja Registrasi</h3>
                <p className="text-xs text-gray-500 mb-4">Cari berdasarkan nama, email, nomor HP, atau potongan kode tiket jika peserta tidak membawa tiket.</p>
                
                <form onSubmit={handleSearchTickets} className="flex gap-2 mb-4">
                  <div className="relative flex-1">
                    <Search size={18} className="absolute left-3.5 top-3 text-gray-400" />
                    <input 
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Ketik nama peserta atau email..."
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#5953C7] focus:bg-white"
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={searching}
                    className="px-5 py-2.5 bg-gray-800 text-white rounded-xl text-sm font-bold hover:bg-gray-900 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {searching ? 'Mencari...' : 'Cari'}
                  </button>
                </form>

                {/* Hasil Pencarian */}
                {searchResults.length > 0 && (
                  <div className="border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-100 max-h-64 overflow-y-auto">
                    {searchResults.map((t) => (
                      <div key={t.id || t.code} className="p-3.5 flex items-center justify-between hover:bg-gray-50 text-sm">
                        <div>
                          <div className="font-bold text-gray-900">{t.attendee_name}</div>
                          <div className="text-xs text-gray-500">{t.attendee_email} • <span className="font-mono">{t.code}</span></div>
                          <div className="text-xs font-semibold text-indigo-600 mt-0.5">{t.ticket_type}</div>
                        </div>
                        <button
                          onClick={() => handleCheckIn(t.code)}
                          disabled={t.status === 'used'}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                            t.status === 'used'
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700'
                          }`}
                        >
                          {t.status === 'used' ? 'Sudah Check-in' : 'Check-in Sekarang'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sisi Kanan: Status & Hasil Verifikasi Tiket */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 text-center shadow-sm min-h-[360px] flex flex-col justify-center items-center">
            {!scanResult ? (
              <div className="space-y-3">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto text-gray-400 border border-gray-100">
                  <ScanLine size={32} />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Siap Memindai Tiket</h3>
                <p className="text-sm text-gray-500 max-w-xs mx-auto">
                  Arahkan kamera ke QR code tiket atau masukkan kode tiket peserta untuk memeriksa keabsahan dan mencatat kehadiran.
                </p>
              </div>
            ) : scanResult.type === 'success' ? (
              <div className="space-y-4 animate-in zoom-in-95 duration-200 w-full">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-4 border-emerald-100">
                  <CheckCircle2 size={44} />
                </div>
                <div>
                  <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider rounded-full mb-2">
                    TIKET VALID • BERHASIL
                  </span>
                  <h3 className="text-2xl font-black text-gray-900">{scanResult.attendee_name || 'Peserta'}</h3>
                  <p className="text-sm text-indigo-700 font-bold mt-1">{scanResult.ticket_type || 'Tiket Masuk'}</p>
                  <p className="text-xs text-gray-400 mt-2">Diverifikasi pukul {scanResult.checked_at}</p>
                </div>
              </div>
            ) : scanResult.type === 'warning' ? (
              <div className="space-y-4 animate-in zoom-in-95 duration-200 w-full">
                <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto border-4 border-amber-100">
                  <AlertTriangle size={44} />
                </div>
                <div>
                  <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-black uppercase tracking-wider rounded-full mb-2">
                    SUDAH CHECK-IN
                  </span>
                  <h3 className="text-xl font-black text-gray-900">{scanResult.attendee_name || 'Peserta'}</h3>
                  <p className="text-sm text-amber-700 font-medium mt-1">{scanResult.message}</p>
                  {scanResult.first_checked_in_at && (
                    <p className="text-xs text-gray-400 mt-2 font-mono">Pertama scan: {new Date(scanResult.first_checked_in_at).toLocaleTimeString('id-ID')}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-in zoom-in-95 duration-200 w-full">
                <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto border-4 border-red-100">
                  <XCircle size={44} />
                </div>
                <div>
                  <span className="inline-block px-3 py-1 bg-red-100 text-red-800 text-xs font-black uppercase tracking-wider rounded-full mb-2">
                    TIKET TIDAK VALID
                  </span>
                  <h3 className="text-lg font-black text-gray-900">Akses Ditolak</h3>
                  <p className="text-sm text-red-600 mt-1">{scanResult.message || 'Kode tiket tidak ditemukan dalam database event ini.'}</p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ScanTab;