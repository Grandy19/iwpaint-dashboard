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
  const [isMounted, setIsMounted] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const { user, verifyOTP } = useAuth();

  // If no user object in context (e.g. bypassed login), kick them back to login
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 2500); // 2.5 seconds before it disappears automatically
      return () => clearTimeout(timer);
    }
  }, [error]);

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
      
      // Accept '123456' as valid mock OTP
      if (code !== '123456') {
        setIsLoading(false);
        setError('Kode OTP salah. Gunakan 123456');
        return;
      }

      setIsExiting(true);

      setTimeout(() => {
        verifyOTP(); // marks as fully authenticated

        // Redirect based on role
        if (user?.role === 'admin') navigate('/');
        else if (user?.role === 'sales') navigate('/sales-dashboard');
        else if (user?.role === 'supervisor') navigate('/supervisor-dashboard');
        else if (user?.role === 'distributor') navigate('/distributor-dashboard');
        else navigate('/'); // fallback
      }, 600); // Wait for exit animation
      
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
    <>
      <style>{`
        /* Ambient Background Animations */
        @keyframes aura-spin {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }

        /* Staggered Load Animations */
        .bg-reveal {
          animation: fadeReveal 1.5s ease-out forwards;
        }
        .card-reveal {
          animation: cardReveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: 0.2s;
        }
        .item-reveal-1 {
          animation: slideUpReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: 0.4s;
        }
        .item-reveal-2 {
          animation: slideUpReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: 0.5s;
        }
        .item-reveal-3 {
          animation: slideUpReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: 0.6s;
        }
        .item-reveal-4 {
          animation: slideUpReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: 0.7s;
        }

        /* Initial States */
        .start-hidden {
          opacity: 0;
        }
        .start-card-hidden {
          opacity: 0;
          transform: scale(0.96);
          filter: blur(10px);
        }
        .start-item-hidden {
          opacity: 0;
          transform: translateY(10px);
        }

        /* Keyframes */
        @keyframes fadeReveal {
          to { opacity: 1; }
        }
        @keyframes cardReveal {
          to { 
            opacity: 1; 
            transform: scale(1);
            filter: blur(0px);
          }
        }
        @keyframes slideUpReveal {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes toastSlideDown {
          0% { transform: translateY(-10px) scale(0.95); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        .toast-enter {
          animation: toastSlideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Exit Animation */
        .page-exit {
          animation: pageExit 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes pageExit {
          to {
            opacity: 0;
            transform: scale(0.98);
            filter: blur(5px);
          }
        }
      `}</style>

      <div 
        ref={containerRef}
        className={clsx(
          "min-h-screen relative flex items-center justify-center bg-[#FAFAFC] font-sans overflow-hidden selection:bg-[#3b0764]/20 selection:text-[#3b0764]",
          isExiting && "page-exit"
        )}
      >
        
        {/* =========================================
            BACKGROUND - EXACT IMAGE REPLICA
        ========================================= */}
        <div className={clsx("absolute inset-0 start-hidden", isMounted && "bg-reveal")}>
          
          {/* Base Background Color (Matches Dashboard) */}
          <div className="absolute inset-0 bg-[#FAFAFC]"></div>
          
          {/* Static Wrapper */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            {/* Diagonal Mask Container */}
            <div 
              className="absolute top-1/2 left-1/2 w-[140vw] max-w-[1200px] h-[200vh] -translate-x-1/2 -translate-y-1/2 rotate-[-35deg]"
              style={{
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 30%, black 70%, transparent 100%)',
                maskImage: 'linear-gradient(to right, transparent 0%, black 30%, black 70%, transparent 100%)'
              }}
            >
              {/* Spinning Colors */}
              <div 
                className="absolute top-1/2 left-1/2 w-[250vh] h-[250vh]"
                style={{
                  background: 'conic-gradient(from 180deg, #93c5fd 0%, #fde047 15%, #fb923c 30%, #f43f5e 50%, #a855f7 75%, #93c5fd 100%)',
                  filter: 'blur(100px)',
                  opacity: 0.9,
                  animation: 'aura-spin 10s linear infinite'
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* =========================================
            TOP LEFT LOGO
        ========================================= */}
        <div className={clsx("absolute top-6 left-6 sm:top-8 sm:left-8 z-30 start-hidden w-20 h-20 flex items-center justify-center bg-white/50 backdrop-blur-xl border border-white/40 rounded-[20px] shadow-sm transition-transform hover:scale-105 cursor-default", isMounted && "bg-reveal")}>
          <img src="/logo.png" alt="IW Paint" className="h-11 object-contain" />
        </div>

        {/* =========================================
            MAIN AUTH CARD (CENTERED)
        ========================================= */}
        <div 
          className={clsx(
            "relative z-20 w-full max-w-[500px] px-6 sm:px-0 start-card-hidden",
            isMounted && "card-reveal"
          )}
        >
          <div 
            className="bg-white/95 backdrop-blur-2xl rounded-[15px] p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04),_0_0_1px_rgba(0,0,0,0.05)] border border-white/60 relative overflow-hidden transition-shadow duration-300 hover:shadow-[0_20px_40px_rgb(0,0,0,0.06),_0_0_1px_rgba(0,0,0,0.05)]"
          >
            {/* IN-CARD ERROR OVERLAY */}
            {error && (
              <div className="absolute inset-0 z-[100] flex items-center justify-center p-6 bg-white/40 backdrop-blur-[2px] rounded-[15px] toast-enter pointer-events-none">
                <div className="w-full max-w-[90%] bg-red-50/95 backdrop-blur-md text-red-600 px-5 py-4 rounded-2xl text-[14px] font-bold border border-red-200 shadow-[0_15px_40px_rgba(239,68,68,0.2)] flex items-center gap-3">
                  <div className="flex-shrink-0 w-7 h-7 bg-red-200/80 text-red-700 rounded-full flex items-center justify-center text-[14px] font-black shadow-sm">!</div>
                  <p className="whitespace-normal leading-tight">{error}</p>
                </div>
              </div>
            )}

            {/* Very faint glass reflection on top edge */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-100 pointer-events-none"></div>
            <div className="absolute top-0 inset-x-0 h-[200px] bg-gradient-to-b from-white/40 to-transparent pointer-events-none rounded-t-[15px]"></div>

            <div className="relative z-10 flex flex-col items-center">
              
              {/* Form Header */}
              <div className={clsx("flex flex-col items-center text-center w-full mb-8 start-item-hidden", isMounted && "item-reveal-1")}>
                <div className="w-16 h-16 bg-[#f3e8ff] rounded-2xl flex items-center justify-center text-[#3b0764] mb-5 shadow-inner">
                  <ShieldCheck size={32} />
                </div>
                <h1 className="text-2xl sm:text-[28px] font-semibold tracking-tight mb-2" style={{ color: '#464255' }}>
                  Verifikasi Login
                </h1>
                <p className="text-[14px] text-gray-500 font-medium">
                  Masukkan 6 digit kode OTP yang telah dikirim ke email Anda. (Gunakan <strong>123456</strong>)
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="w-full space-y-6">
                
                {/* OTP Inputs */}
                <div className={clsx("flex justify-between gap-2 sm:gap-3 start-item-hidden w-full", isMounted && "item-reveal-2")}>
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
                        "w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold rounded-2xl border outline-none transition-all duration-300",
                        error 
                          ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 text-red-900" 
                          : "border-gray-200 focus:border-[#3b0764] focus:ring-[3px] focus:ring-[#3b0764]/15 bg-gray-50 focus:bg-white text-gray-900 hover:border-gray-300"
                      )}
                    />
                  ))}
                </div>

                <div className={clsx("start-item-hidden w-full", isMounted && "item-reveal-3")}>
                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading || countdown === 0}
                    className="w-full relative overflow-hidden bg-gradient-to-r from-[#3b0764] to-[#581c87] hover:from-[#2e054e] hover:to-[#4c1d95] disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed active:from-[#20033b] text-white py-4 rounded-2xl text-[14.5px] font-bold shadow-[0_4px_14px_rgba(59,7,100,0.25)] hover:shadow-[0_6px_20px_rgba(59,7,100,0.35)] disabled:hover:shadow-none hover:-translate-y-[1px] disabled:hover:-translate-y-0 transition-all duration-300 flex items-center justify-center mb-6 group/btn active:scale-[0.98] disabled:active:scale-100"
                  >
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                    {isLoading ? (
                      <div className="flex items-center gap-2.5 relative z-10">
                        <div className="w-4.5 h-4.5 border-[2.5px] border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Memverifikasi...</span>
                      </div>
                    ) : (
                      <div className="relative z-10">
                        Verifikasi
                      </div>
                    )}
                  </button>
                  
                  <div className="text-sm font-medium text-center text-gray-500">
                    {countdown > 0 ? (
                      <p>Kirim ulang kode dalam <span className="text-[#3b0764] font-bold">{formatTime(countdown)}</span></p>
                    ) : (
                      <button 
                        type="button"
                        onClick={handleResend}
                        className="text-[#3b0764] font-bold hover:text-purple-700 transition-colors"
                      >
                        Kirim Ulang Kode
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* =========================================
            ABSOLUTE BOTTOM FOOTER
        ========================================= */}
        <div className={clsx("absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 w-full text-center z-30 start-item-hidden", isMounted && "item-reveal-4")}>
          <p className="text-[13px] font-semibold tracking-wide" style={{ color: '#464255' }}>
            &copy; 2026 IW Paint Indonesia
          </p>
        </div>

      </div>
    </>
  );
};
