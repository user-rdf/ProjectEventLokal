import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, UploadCloud, Check, Image as ImageIcon, Calendar, MapPin, Target } from 'lucide-react';

const BuatEvent = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isFree, setIsFree] = useState(true);

  const handleNext = () => setStep(step < 3 ? step + 1 : step);
  const handlePrev = () => setStep(step > 1 ? step - 1 : step);

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      {/* Navbar Atas */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-[#014860] text-white p-1.5 rounded-md font-bold text-sm">EL</div>
          <span className="font-bold text-lg text-[#014860]">EventLokal</span>
          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md font-medium ml-2">Panitia</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <div className="text-sm font-bold text-gray-900">Nabila Putri</div>
            <div className="text-xs text-gray-500">HIMAKOM UGM</div>
          </div>
          <div className="bg-purple-100 text-purple-700 w-10 h-10 rounded-full flex items-center justify-center font-bold">
            NP
          </div>
        </div>
      </nav>

      {/* Konten Utama */}
      <main className="max-w-3xl mx-auto mt-8 px-6">
        <button 
          onClick={() => navigate('/dashboard')}
          className="text-[#014860] text-sm font-medium flex items-center gap-1 mb-6 hover:underline"
        >
          <ChevronLeft size={16} /> Beranda Panitia
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Buat Event</h1>

        {/* Stepper Indikator */}
        <div className="flex items-center justify-between mb-10 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-gray-200 -z-10"></div>
          
          <div className="flex items-center gap-2 bg-gray-50 pr-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-[#014860] text-white' : 'bg-gray-200 text-gray-500'}`}>
              {step > 1 ? <Check size={16} /> : '1'}
            </div>
            <span className={`text-sm ${step >= 1 ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>Info event</span>
          </div>

          <div className="flex items-center gap-2 bg-gray-50 px-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-[#014860] text-white' : 'bg-gray-200 text-gray-500'}`}>
              {step > 2 ? <Check size={16} /> : '2'}
            </div>
            <span className={`text-sm ${step >= 2 ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>Kategori tiket</span>
          </div>

          <div className="flex items-center gap-2 bg-gray-50 pl-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 3 ? 'bg-[#014860] text-white' : 'bg-gray-200 text-gray-500'}`}>
              3
            </div>
            <span className={`text-sm ${step === 3 ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>Tinjau & publikasi</span>
          </div>
        </div>

        {/* Area Form Dinamis */}
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm mb-24">
          
          {/* ========== LANGKAH 1: INFO EVENT ========== */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Judul event</label>
                <input 
                  type="text" 
                  placeholder="Contoh: Workshop UI/UX untuk Pemula" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#014860]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Kategori</label>
                <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#014860] text-gray-600 appearance-none bg-white">
                  <option>Pilih kategori</option>
                  <option>Workshop</option>
                  <option>Seminar</option>
                  <option>Hiburan</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-semibold text-gray-700">Poster</label>
                  <span className="text-xs text-gray-400">Opsional</span>
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors text-center">
                  <UploadCloud className="text-gray-400 w-10 h-10 mb-3" />
                  <p className="text-sm font-semibold text-gray-700 mb-1">Unggah poster</p>
                  <p className="text-xs text-gray-500">Seret file ke sini atau klik untuk memilih</p>
                </div>
                <p className="text-xs text-gray-400 mt-2">JPG atau PNG, rasio 16:9, maks. 5 MB</p>
              </div>

              {/* Baris Tanggal dan Waktu */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tanggal</label>
                  <input type="date" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#014860] text-gray-600 bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Jam mulai</label>
                  <input type="time" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#014860] text-gray-600 bg-white" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-semibold text-gray-700">Jam selesai</label>
                    <span className="text-xs text-gray-400">Opsional</span>
                  </div>
                  <input type="time" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#014860] text-gray-600 bg-white" />
                </div>
              </div>

              {/* Baris Lokasi dan Kota */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Lokasi</label>
                  <div className="relative">
                    <Target size={20} className="absolute left-4 top-3.5 text-gray-400" />
                    <input type="text" placeholder="Gedung, ruangan, atau alamat" className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#014860] text-gray-600 bg-white" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-semibold text-gray-700">Kota</label>
                    <span className="text-xs text-gray-400">Opsional</span>
                  </div>
                  <input type="text" placeholder="Yogyakarta" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#014860] text-gray-600 bg-white" />
                </div>
              </div>

              {/* Textarea Deskripsi */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-semibold text-gray-700">Deskripsi</label>
                  <span className="text-xs text-gray-400">Opsional</span>
                </div>
                <textarea 
                  rows="4" 
                  placeholder="Ceritakan agenda, pembicara, dan apa yang perlu dibawa peserta..." 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#014860] text-gray-600 bg-white resize-y"
                ></textarea>
              </div>
            </div>
          )}

          {/* ========== LANGKAH 2: KATEGORI TIKET ========== */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-xl p-6">
                <h3 className="text-xs font-bold text-gray-400 tracking-wider mb-4 uppercase">Tiket 1</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nama tiket</label>
                    <input type="text" defaultValue="Reguler" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#014860]" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Harga</label>
                    <input type="text" value={isFree ? "Rp. Gratis" : ""} disabled={isFree} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Kuota</label>
                    <input type="number" defaultValue="100" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#014860]" />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div 
                    onClick={() => setIsFree(!isFree)}
                    className={`w-12 h-6 rounded-full cursor-pointer relative transition-colors ${isFree ? 'bg-[#014860]' : 'bg-gray-300'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${isFree ? 'translate-x-7' : 'translate-x-1'}`}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Tiket gratis</span>
                </div>
              </div>

              <button className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-semibold hover:bg-gray-50 hover:text-gray-700 transition-colors">
                + Tambah kategori tiket
              </button>
            </div>
          )}

          {/* ========== LANGKAH 3: TINJAU & PUBLIKASI ========== */}
          {step === 3 && (
            <div className="space-y-8">
              <div>
                <div className="w-full h-48 bg-teal-50/50 rounded-xl border border-teal-100 flex flex-col items-center justify-center text-teal-700 mb-6">
                  <ImageIcon size={32} className="mb-2 opacity-50" />
                  <span className="text-sm font-medium">Tanpa poster</span>
                </div>
                
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-semibold text-[#014860] bg-teal-50 px-2 py-1 rounded mb-2 inline-block">Workshop</span>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">adadad</h2>
                    
                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>Sabtu, 24 Oktober 2026, 22:41 WIB</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        <span>dadadada</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setStep(1)} className="text-[#014860] text-sm font-semibold hover:underline">Ubah</button>
                </div>
              </div>

              <hr className="border-gray-200" />

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-900">Kategori tiket</h3>
                  <button onClick={() => setStep(2)} className="text-[#014860] text-sm font-semibold hover:underline">Ubah</button>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="font-semibold text-gray-900">Reguler</span>
                  <span className="text-gray-500 text-sm">100 kuota</span>
                  <span className="font-bold text-green-600 text-sm">Gratis</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer Navigasi Bawah */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 py-4 px-6 md:px-12 flex justify-between items-center z-10">
        <button 
          onClick={step === 1 ? () => navigate('/dashboard') : handlePrev}
          className="px-6 py-2.5 text-gray-600 font-semibold hover:bg-gray-100 rounded-lg transition-colors"
        >
          {step === 1 ? 'Batal' : 'Kembali'}
        </button>
        
        <button 
          onClick={step === 3 ? () => alert('Event berhasil dipublikasikan!') || navigate('/dashboard') : handleNext}
          className="px-8 py-2.5 bg-[#014860] text-white font-semibold rounded-lg hover:bg-teal-900 transition-colors shadow-sm"
        >
          {step === 3 ? 'Publikasikan' : 'Lanjut'}
        </button>
      </div>
    </div>
  );
};

export default BuatEvent;