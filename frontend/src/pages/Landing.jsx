import React from 'react';
import { Ticket, ClipboardList, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50 p-6">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="bg-[#014860] text-white p-2 rounded-lg">
            <Ticket className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-[#014860]">EventLokal</h1>
        </div>
        <p className="text-gray-500 max-w-sm mx-auto">
          Daftar event kampus dan komunitas di sekitarmu.<br/>
          Tanpa akun, tiket langsung ke email.
        </p>
      </div>

      <div className="w-full max-w-2xl space-y-4">
        {/* Card Daftar Event - onClick disatukan di sini */}
        <div 
          onClick={() => navigate('/events')} 
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-6">
            <div className="w-16 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <Ticket className="text-[#014860] w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Daftar Event</h3>
              <p className="text-gray-500">Cari event yang ingin kamu ikuti.</p>
            </div>
          </div>
          <div className="bg-[#014860] text-white p-3 rounded-xl">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>

        {/* Card Kelola Event - onClick disatukan di sini */}
        <div 
          onClick={() => navigate('/login')} 
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-6">
            <div className="w-16 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <ClipboardList className="text-[#014860] w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Kelola Event</h3>
              <p className="text-gray-500">Buat event, pantau peserta, dan scan tiket.</p>
            </div>
          </div>
          <div className="bg-[#014860] text-white p-3 rounded-xl">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="mt-12 flex gap-6 text-sm text-gray-400 font-medium">
        <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Tanpa daftar akun</span>
        <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> QR tiket via email</span>
        <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></span> Check-in cepat di pintu masuk</span>
      </div>
    </div>
  );
};

export default Landing;