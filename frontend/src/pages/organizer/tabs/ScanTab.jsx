import React, { useEffect, useRef, useState } from "react";
import { Camera, ScanLine, Search } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";
import { checkIn, searchTickets } from "../../../api/checkins";

export default function ScanTab({ eventId }) {
  const [activeSubTab, setActiveSubTab] = useState("scan");
  const [result, setResult] = useState(null);
  const [cameraError, setCameraError] = useState("");
  const [q, setQ] = useState("");
  const [found, setFound] = useState([]);
  const scannerRef = useRef(null);
  const busy = useRef(false);

  const submitCode = async (code) => {
    try { 
      const res = await checkIn(eventId, code);
      setResult(res); 
    } catch (e) { 
      setResult({ status: "invalid", message: e.message }); 
    }
  };

  useEffect(() => {
    let isMounted = true;

    if (activeSubTab === "scan") {
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      scanner
        .start(
          { facingMode: "environment" }, 
          { fps: 10, qrbox: 240 }, 
          (text) => {
            if (busy.current) return;
            busy.current = true;
            submitCode(text);
          }, 
          () => {}
        )
        .catch((e) => {
          if (isMounted) setCameraError(`Kamera tidak bisa dibuka: ${e}`);
        });

      return () => {
        isMounted = false;
        if (scanner && scanner.isScanning) {
          scanner.stop().then(() => scanner.clear()).catch(() => {});
        } else {
          try { scanner.clear(); } catch (err) {}
        }
      };
    }
  }, [activeSubTab, eventId]);

  const closeSheet = () => { 
    setResult(null); 
    busy.current = false; 
  };

  const search = async (e) => {
    e.preventDefault();
    try { 
      setFound(await searchTickets(eventId, q)); 
    } catch (ex) { 
      setFound([]); 
      alert(ex.message); 
    }
  };

  return (
    <div className="animate-in fade-in duration-300">
      {/* Header Sub-Tab */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-200">
        <div className="flex gap-6">
          <button 
            onClick={() => setActiveSubTab("scan")}
            className={`pb-3 font-bold text-sm transition-colors ${activeSubTab === "scan" ? "border-b-2 border-gray-900 text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
          >
            Scan QR
          </button>
          <button 
            onClick={() => setActiveSubTab("manual")}
            className={`pb-3 font-bold text-sm transition-colors ${activeSubTab === "manual" ? "border-b-2 border-gray-900 text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
          >
            Cari manual
          </button>
        </div>
        <div className="flex items-center gap-2 text-sm pb-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="font-bold text-gray-900">Peserta sudah hadir</span>
        </div>
      </div>

      {activeSubTab === "scan" ? (
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Area Kamera */}
          <div className="lg:w-2/3 bg-[#0a0f1c] rounded-2xl h-[450px] relative overflow-hidden flex flex-col items-center justify-center">
            
            <div className="absolute top-4 left-4 text-white flex items-center gap-2 text-sm bg-black/50 px-4 py-2 rounded-xl z-20 backdrop-blur-md">
              <Camera size={16} /> Kamera belakang
            </div>
            
            {/* Kontainer QR Reader */}
            <div id="qr-reader" className="absolute inset-0 w-full h-full [&_video]:w-full [&_video]:h-full [&_video]:object-cover"></div>
            
            {cameraError && (
              <div className="absolute z-30 bg-red-500/90 text-white p-4 rounded-xl text-center text-sm max-w-sm mx-4 shadow-lg">
                {cameraError}
              </div>
            )}

            {/* Bingkai Scan dengan Animasi */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <div className="relative w-64 h-64">
                
                {/* Style Custom untuk Animasi Naik-Turun */}
                <style>{`
                  @keyframes scanner {
                    0%, 100% { top: 0%; }
                    50% { top: 100%; }
                  }
                  .animate-scanner {
                    animation: scanner 2.5s ease-in-out infinite;
                  }
                `}</style>

                {/* 4 Sudut Bingkai */}
                <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-white/90 rounded-tl-2xl"></div>
                <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-white/90 rounded-tr-2xl"></div>
                <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-white/90 rounded-bl-2xl"></div>
                <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-white/90 rounded-br-2xl"></div>
                
                {/* Garis Scan Cyan Bergerak Naik Turun */}
                <div className="absolute left-0 w-full h-0.5 bg-cyan-400 shadow-[0_0_15px_3px_rgba(34,211,238,0.8)] animate-scanner"></div>
                
              </div>
            </div>
            
            {/* Teks Instruksi */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center z-20 pointer-events-none">
              <p className="text-white/90 text-sm bg-black/60 px-6 py-2.5 rounded-full backdrop-blur-md border border-white/10">
                Arahkan kamera ke QR di tiket peserta
              </p>
            </div>

          </div>

          {/* Area Hasil */}
          <div className="lg:w-1/3">
            <div className="border border-gray-200 rounded-2xl h-full p-8 flex flex-col items-center justify-center text-center bg-white shadow-sm min-h-[200px]">
              {result ? (
                <div className="space-y-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${result.status === 'valid' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    <ScanLine size={24} />
                  </div>
                  <h4 className="font-bold text-gray-900 capitalize">{result.status || 'Hasil Scan'}</h4>
                  <p className="text-sm text-gray-600">{result.message || 'Tiket berhasil diverifikasi.'}</p>
                  <button 
                    onClick={closeSheet}
                    className="mt-4 px-4 py-2 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-gray-800"
                  >
                    Scan Tiket Lainnya
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-4 border border-gray-100">
                    <ScanLine className="text-gray-400" size={24} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">Menunggu scan</h3>
                  <p className="text-sm text-gray-500">Hasil pemeriksaan tiket akan muncul di sini.</p>
                </>
              )}
            </div>
          </div>
          
        </div>
      ) : (
        /* Sub-Tab Cari Manual */
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <form onSubmit={search} className="flex gap-3">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-3 text-gray-400" />
              <input 
                placeholder="Nama, email, telepon, atau kode tiket" 
                value={q} 
                onChange={(e) => setQ(e.target.value)} 
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#014860]"
              />
            </div>
            <button className="px-6 py-2.5 bg-[#014860] text-white font-semibold rounded-xl text-sm hover:bg-teal-900">
              Cari
            </button>
          </form>

          <div className="space-y-3">
            {found.map((t) => (
              <div key={t.code} className="p-4 border border-gray-100 rounded-xl flex items-center justify-between hover:bg-gray-50">
                <div>
                  <div className="font-bold text-gray-900">{t.attendee_name}</div>
                  <div className="text-xs text-gray-500">{t.attendee_email} · Status: <span className="font-semibold">{t.status}</span></div>
                </div>
                <button 
                  className="px-4 py-2 bg-teal-50 text-[#014860] text-xs font-bold rounded-lg hover:bg-teal-100"
                  onClick={() => window.confirm("Check-in manual?") && submitCode(t.code)}
                >
                  Check-in manual
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}