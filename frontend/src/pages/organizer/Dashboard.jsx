import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ScanLine, ChevronRight } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  // State untuk melacak tab aktif di bawah (akan-datang atau selesai)
  const [activeTab, setActiveTab] = useState('akan-datang');

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-12">
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
      <main className="max-w-5xl mx-auto mt-8 px-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <p className="text-gray-500 mb-1">Halo, Nabila</p>
            <h1 className="text-3xl font-bold text-gray-900">Beranda Panitia</h1>
          </div>
          {/* Tombol Navigasi ke Halaman Buat Event */}
          <button 
            onClick={() => navigate('/buat-event')}
            className="mt-4 md:mt-0 flex items-center gap-2 bg-[#014860] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-teal-900 transition-colors"
          >
            <Plus size={20} />
            Buat Event
          </button>
        </div>

        {/* Section: Sedang Berlangsung */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <h2 className="font-bold text-lg text-gray-900">Sedang Berlangsung</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card Event Live 1 */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex gap-4 mb-4">
                <div className="w-20 h-20 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                   <img src="https://placehold.co/150x150/e2e8f0/a1a1aa?text=Img" alt="event" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    <span className="text-xs text-green-600 font-semibold">Live</span>
                  </div>
                  <h3 className="font-bold text-gray-900 leading-tight">Workshop UI/UX: Dari Wireframe ke Prototipe</h3>
                  <p className="text-xs text-gray-500 mt-1">Hari ini, 09.00-15.00 WIB</p>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-bold text-gray-900">54 <span className="text-gray-500 font-normal">dari 92 hadir</span></span>
                  <span className="font-bold text-[#014860]">59%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-[#014860] h-2 rounded-full" style={{ width: '59%' }}></div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold text-sm hover:bg-gray-50">
                  <ScanLine size={16} /> Scan tiket
                </button>
                <button 
                  onClick={() => navigate('/manage-event/101')}
                  className="flex-1 bg-[#014860] text-white py-2 rounded-lg font-semibold text-sm hover:bg-teal-900"
                >
                  Buka
                </button>
              </div>
            </div>
            
            {/* Card Event Live 2 */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex gap-4 mb-4">
                <div className="w-20 h-20 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                   <img src="https://placehold.co/150x150/e2e8f0/a1a1aa?text=Img" alt="event" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    <span className="text-xs text-green-600 font-semibold">Live</span>
                  </div>
                  <h3 className="font-bold text-gray-900 leading-tight">Seminar Nasional: AI untuk Pendidikan Indonesia</h3>
                  <p className="text-xs text-gray-500 mt-1">Hari ini, 08.30-12.00 WIB</p>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-bold text-gray-900">120 <span className="text-gray-500 font-normal">dari 300 hadir</span></span>
                  <span className="font-bold text-[#014860]">40%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-[#014860] h-2 rounded-full" style={{ width: '40%' }}></div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold text-sm hover:bg-gray-50">
                  <ScanLine size={16} /> Scan tiket
                </button>
                <button 
                  onClick={() => navigate('/manage-event/102')}
                  className="flex-1 bg-[#014860] text-white py-2 rounded-lg font-semibold text-sm hover:bg-teal-900"
                >
                  Buka
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Tab Daftar Event (Akan Datang & Selesai) */}
        <div>
          <div className="flex gap-6 border-b border-gray-200 mb-4">
            <button 
              onClick={() => setActiveTab('akan-datang')}
              className={`pb-3 font-bold flex items-center gap-2 transition-colors ${activeTab === 'akan-datang' ? 'border-b-2 border-[#014860] text-[#014860]' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Akan Datang <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">4</span>
            </button>
            <button 
              onClick={() => setActiveTab('selesai')}
              className={`pb-3 font-bold flex items-center gap-2 transition-colors ${activeTab === 'selesai' ? 'border-b-2 border-[#014860] text-[#014860]' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Selesai <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">2</span>
            </button>
          </div>

          {/* Konten Berdasarkan Tab yang Dipilih */}
          {activeTab === 'akan-datang' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              {/* List Item 1 */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between hover:shadow-sm cursor-pointer transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-50 border border-gray-100 rounded-lg p-2 text-center w-16">
                    <div className="text-xs text-gray-500 font-semibold uppercase">Nov</div>
                    <div className="text-xl font-bold text-gray-900">22</div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Malam Keakraban Himpunan Teknik Sipil 2026</h4>
                    <p className="text-sm text-gray-500">📍 Min, 22 Nov • Lapangan Saraga</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-sm flex justify-between mb-1 gap-4">
                      <span className="text-gray-500 text-xs">Terdaftar</span>
                      <span className="font-bold text-gray-900 text-xs">180 / 180</span>
                    </div>
                    <div className="w-32 bg-gray-100 rounded-full h-1.5 mb-1">
                      <div className="bg-red-500 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                    <span className="text-red-500 text-xs font-bold">Habis</span>
                  </div>
                  <ChevronRight className="text-gray-400" />
                </div>
              </div>

              {/* List Item 2 */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between hover:shadow-sm cursor-pointer transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-50 border border-gray-100 rounded-lg p-2 text-center w-16">
                    <div className="text-xs text-gray-500 font-semibold uppercase">Nov</div>
                    <div className="text-xl font-bold text-gray-900">27</div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Pitching Day Startup Kampus</h4>
                    <p className="text-sm text-gray-500">📍 Jum, 27 Nov • Innovation Hub</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-sm flex justify-between mb-1 gap-4">
                      <span className="text-gray-500 text-xs">Terdaftar</span>
                      <span className="font-bold text-gray-900 text-xs">59 / 160</span>
                    </div>
                    <div className="w-32 bg-gray-100 rounded-full h-1.5 mb-1">
                      <div className="bg-[#014860] h-1.5 rounded-full" style={{ width: '35%' }}></div>
                    </div>
                    <span className="text-[#014860] text-xs font-bold">Dibuka</span>
                  </div>
                  <ChevronRight className="text-gray-400" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'selesai' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              {/* List Item Selesai 1 */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between hover:shadow-sm cursor-pointer transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-50 border border-gray-100 rounded-lg p-2 text-center w-16">
                    <div className="text-xs text-gray-500 font-semibold uppercase">Okt</div>
                    <div className="text-xl font-bold text-gray-900">11</div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Pentas Musik Akustik FIB</h4>
                    <p className="text-sm text-gray-500">📍 Min, 11 Okt • Amfiteater FIB Universitas Airlangga</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-sm flex justify-between mb-1 gap-4">
                      <span className="text-gray-500 text-xs">Hadir</span>
                      <span className="font-bold text-gray-900 text-xs">212 / 241</span>
                    </div>
                    <div className="w-32 bg-gray-100 rounded-full h-1.5 mb-1">
                      <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '88%' }}></div>
                    </div>
                    <span className="text-gray-500 text-xs font-bold">Selesai</span>
                  </div>
                  <ChevronRight className="text-gray-400" />
                </div>
              </div>

              {/* List Item Selesai 2 */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between hover:shadow-sm cursor-pointer transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-50 border border-gray-100 rounded-lg p-2 text-center w-16">
                    <div className="text-xs text-gray-500 font-semibold uppercase">Sep</div>
                    <div className="text-xl font-bold text-gray-900">28</div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Kirab Budaya & Bazar UMKM Kampung</h4>
                    <p className="text-sm text-gray-500">📍 Sen, 28 Sep • Alun-alun Kidul</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-sm flex justify-between mb-1 gap-4">
                      <span className="text-gray-500 text-xs">Hadir</span>
                      <span className="font-bold text-gray-900 text-xs">371 / 432</span>
                    </div>
                    <div className="w-32 bg-gray-100 rounded-full h-1.5 mb-1">
                      <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <span className="text-gray-500 text-xs font-bold">Selesai</span>
                  </div>
                  <ChevronRight className="text-gray-400" />
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Dashboard;