import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  QrCode,
  Landmark,
  Wallet,
  CreditCard,
  Store,
  Shield,
  ArrowRight,
  Lock
} from 'lucide-react';

const PaymentMethodModal = ({
  isOpen = false,
  onClose = () => {},
  totalAmount = 1675000,
  onConfirmPayment = () => {}
}) => {
  // State metode pembayaran yang dipilih (default: 'qris')
  const [selectedMethod, setSelectedMethod] = useState('qris');

  // Timer countdown: 08:13 (493 detik)
  const [timeLeft, setTimeLeft] = useState(493);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Mock data metode pembayaran
  const paymentMethods = [
    {
      id: 'qris',
      name: 'QRIS',
      badge: 'INSTAN',
      desc: 'Semua e-wallet & m-banking (GoPay, OVO, BCA, Dana, dll)',
      icon: QrCode,
      infoName: 'QRIS (Semua E-Wallet)'
    },
    {
      id: 'va',
      name: 'Virtual Account',
      badge: null,
      desc: 'BCA, BNI, BRI, Mandiri, Permata',
      icon: Landmark,
      infoName: 'Virtual Account Bank'
    },
    {
      id: 'ewallet',
      name: 'E-wallet',
      badge: null,
      desc: 'GoPay, OVO, DANA, ShopeePay',
      icon: Wallet,
      infoName: 'E-wallet'
    },
    {
      id: 'card',
      name: 'Kartu kredit/debit',
      badge: null,
      desc: 'Visa, Mastercard, JCB, Amex (3D Secure)',
      icon: CreditCard,
      infoName: 'Kartu Kredit / Debit'
    },
    {
      id: 'cstore',
      name: 'Convenience Store',
      badge: null,
      desc: 'Indomaret, Alfamart, Dan+Dan',
      icon: Store,
      infoName: 'Convenience Store'
    }
  ];

  if (!isOpen) return null;

  const currentItem = paymentMethods.find((m) => m.id === selectedMethod) || paymentMethods[0];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      
      {/* Container Modal */}
      <div className="bg-white w-full max-w-lg rounded-[24px] p-6 sm:p-7 relative shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border-t-4 border-[#5046B8]">
        
        {/* Garis Aksen / Handle Atas */}
        <div className="w-8 h-1 bg-indigo-200 rounded-full mb-3"></div>

        {/* Tombol X Close */}
        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors absolute right-6 top-6 cursor-pointer"
          title="Tutup Modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header & Total */}
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight leading-snug">
            Pilih metode pembayaran
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1 font-medium">
            Total yang dibayar:{' '}
            <span className="text-[#4338CA] font-extrabold text-sm sm:text-base">
              Rp{totalAmount.toLocaleString('id-ID')}
            </span>
          </p>
        </div>

        {/* Box Timer */}
        <div className="bg-[#F9FAFB] rounded-xl px-4 py-3 flex items-center justify-between border border-gray-100 my-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-neutral-500" />
            <span className="text-xs text-neutral-600 font-medium">
              Selesaikan dalam
            </span>
          </div>
          <span className="text-[#4338CA] font-black font-mono text-sm sm:text-base tracking-wider">
            {formatTimer(timeLeft)}
          </span>
        </div>

        {/* Daftar Metode Pembayaran (Radio Group) */}
        <div className="space-y-2.5 max-h-[330px] overflow-y-auto pr-1">
          {paymentMethods.map((method) => {
            const isSelected = selectedMethod === method.id;
            const IconComponent = method.icon;
            return (
              <div
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                  isSelected
                    ? 'border-2 border-[#4338CA] bg-[#F8F7FD] shadow-sm'
                    : 'border border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                {/* Bagian Kiri: Ikon & Teks Info */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-[#EEEDFA] text-[#4338CA]'
                        : 'bg-gray-100 text-neutral-600'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-sm text-neutral-900 leading-tight">
                        {method.name}
                      </h3>
                      {method.badge && (
                        <span className="bg-[#EEEDFA] text-[#4338CA] text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-sm">
                          {method.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug">
                      {method.desc}
                    </p>
                  </div>
                </div>

                {/* Bagian Kanan: Custom Radio Button */}
                <div className="shrink-0 ml-3">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border-2 border-[#4338CA]'
                        : 'border border-gray-300'
                    }`}
                  >
                    {isSelected && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#4338CA]" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer: Kotak Info Metode Terpilih */}
        <div className="bg-[#F9FAFB] rounded-xl p-3 border border-gray-100 flex items-start gap-2.5 text-xs text-neutral-600 mt-4 mb-4">
          <Shield className="w-4 h-4 text-[#4338CA] shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            Metode terpilih:{' '}
            <strong className="text-neutral-900 font-bold">
              {currentItem.infoName}
            </strong>
            . Tidak dikenakan biaya penanganan tambahan.
          </p>
        </div>

        {/* Tombol Aksi: Bayar */}
        <button
          type="button"
          onClick={() => {
            onConfirmPayment(selectedMethod);
          }}
          className="w-full bg-[#3D32A0] hover:bg-[#322886] text-white py-3.5 rounded-full font-black text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.99] cursor-pointer"
        >
          <span>BAYAR RP{totalAmount.toLocaleString('id-ID')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Teks Bawah: Enkripsi & Batalkan Transaksi */}
        <div className="flex items-center justify-between text-[10px] text-neutral-500 pt-3 mt-1">
          <div className="flex items-center gap-1 text-neutral-500">
            <Lock className="w-3.5 h-3.5 text-neutral-400" />
            <span>Enkripsi SSL 256-bit standar Bank Indonesia &amp; OJK</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="font-black uppercase tracking-wider text-neutral-600 hover:text-rose-600 transition-colors cursor-pointer"
          >
            BATALKAN TRANSAKSI
          </button>
        </div>

      </div>

    </div>
  );
};

export default PaymentMethodModal;
