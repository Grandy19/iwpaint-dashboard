import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck } from 'lucide-react';
import clsx from 'clsx';

export const AuthenticatorPage = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(60); // 1 minute
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const navigate = useNavigate();
  const { user, verifyOTP } = useAuth();

  // If no user object in context (e.g. bypassed login), kick them back to login
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (index: number, value: string) => {
    // allow only numbers
    if (value && !/^[0-9]+$/.test(value)) return;

    const newOtp = [...otp];
    // take only last char if pasted/typed multiple
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    setError('');

    // move focus to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (!pastedData) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      if (i < 6) newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    if (pastedData.length < 6) {
      inputRefs.current[pastedData.length]?.focus();
    } else {
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      setError('Masukkan 6 digit kode OTP');
      return;
    }

    setIsLoading(true);

    // Mock API Delay
    setTimeout(() => {
      setIsLoading(false);
      
      // Accept '123456' as valid mock OTP
      if (code !== '123456') {
        setError('Kode OTP salah. Gunakan 123456');
        return;
      }

      verifyOTP(); // marks as fully authenticated

      // Redirect based on role
      if (user?.role === 'admin') navigate('/');
      else if (user?.role === 'sales') navigate('/sales-dashboard');
      else if (user?.role === 'supervisor') navigate('/supervisor-dashboard');
      else if (user?.role === 'distributor') navigate('/distributor-dashboard');
      else navigate('/'); // fallback
      
    }, 800);
  };

  const handleResend = () => {
    setCountdown(60);
    setOtp(['', '', '', '', '', '']);
    setError('');
    inputRefs.current[0]?.focus();
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[440px] bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-gray-100 text-center">
        
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#f3e8ff] rounded-2xl flex items-center justify-center text-[#3b0764]">
            <ShieldCheck size={32} />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">Verifikasi Login</h2>
        <p className="text-gray-500 mb-8 text-sm">
          Masukkan 6 digit kode verifikasi yang telah dikirim ke email Anda. (Gunakan <strong>123456</strong>)
        </p>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-between gap-2 sm:gap-3 mb-8">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => { inputRefs.current[idx] = el; }}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={handlePaste}
                className={clsx(
                  "w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold rounded-xl border outline-none transition-all",
                  error ? "border-red-500 bg-red-50 focus:border-red-500" : "border-gray-200 focus:border-[#3b0764] focus:ring-1 focus:ring-[#3b0764] bg-gray-50 focus:bg-white"
                )}
              />
            ))}
          </div>

          {error && <p className="text-red-500 text-sm font-medium mb-4">{error}</p>}

          <button
            type="submit"
            disabled={isLoading || countdown === 0}
            className="w-full bg-[#3b0764] hover:bg-[#2e054e] disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-semibold transition-colors flex items-center justify-center shadow-sm mb-6"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Verifikasi'
            )}
          </button>
        </form>

        <div className="text-sm font-medium text-gray-500">
          {countdown > 0 ? (
            <p>Kirim ulang kode dalam <span className="text-[#3b0764]">{formatTime(countdown)}</span></p>
          ) : (
            <button 
              onClick={handleResend}
              className="text-[#3b0764] hover:underline"
            >
              Kirim Ulang Kode
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
