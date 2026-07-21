import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import clsx from 'clsx';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Staggered mount animation trigger
    const timer = setTimeout(() => setIsMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 2500); // 2.5 seconds before it disappears automatically
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Email perusahaan tidak boleh kosong');
      return;
    }
    if (!password) {
      setError('Kata sandi tidak boleh kosong');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      
      if (password !== 'password123') {
        setIsLoading(false);
        setError('Kredensial tidak valid. Silakan coba lagi.');
        return;
      }

      let role: any = null;
      if (email === 'admin@iwpaint.com') role = 'admin';
      else if (email === 'sales@iwpaint.com') role = 'sales';
      else if (email === 'supervisor@iwpaint.com') role = 'supervisor';
      else if (email === 'distributor@iwpaint.com') role = 'distributor';
      else {
        setIsLoading(false);
        setError('Akun tidak terdaftar dalam sistem.');
        return;
      }

      // Trigger exit animation
      setIsExiting(true);
      
      setTimeout(() => {
        login(email, role);
        navigate('/authenticator');
      }, 600); // Wait for exit animation to complete

    }, 800);
  };

  return (
    <>
      <style>{`
        /* Hide default browser password eye icon (Edge) */
        input::-ms-reveal,
        input::-ms-clear {
          display: none;
        }
        
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
          <div 
            className="absolute inset-0 z-0 pointer-events-none"
          >
            {/* Diagonal Mask Container - This creates the exact "swath" shape from the image */}
            <div 
              className="absolute top-1/2 left-1/2 w-[140vw] max-w-[1200px] h-[200vh] -translate-x-1/2 -translate-y-1/2 rotate-[-35deg]"
              style={{
                // This mask ensures the gradient doesn't fill the screen, leaving corners clean #FAFAFC
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 30%, black 70%, transparent 100%)',
                maskImage: 'linear-gradient(to right, transparent 0%, black 30%, black 70%, transparent 100%)'
              }}
            >
              {/* Spinning Colors - This provides the "bergerak memutar" effect INSIDE the diagonal swath */}
              <div 
                className="absolute top-1/2 left-1/2 w-[250vh] h-[250vh]"
                style={{
                  // Precise colors extracted from the image reference
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
            MAIN LOGIN CARD (CENTERED)
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
              <div className={clsx("flex flex-col items-start w-full mb-8 start-item-hidden", isMounted && "item-reveal-1")}>
                <h1 className="text-2xl sm:text-[28px] font-semibold tracking-tight mb-2" style={{ color: '#464255' }}>
                  Masuk
                </h1>
                <p className="text-[14px] text-gray-500 font-medium">
                  untuk melanjutkan ke Enterprise Dashboard
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleLogin} className="w-full space-y-5">
                
                {/* Email Input */}
                <div className={clsx("space-y-1.5 start-item-hidden w-full", isMounted && "item-reveal-2")}>
                  <label className="text-[13px] font-semibold ml-1" style={{ color: '#464255' }}>
                    Email
                  </label>
                  <div className="relative group/input">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-colors group-focus-within/input:text-[#3b0764]">
                      <Mail size={18} strokeWidth={2.5} />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@iwpaint.com"
                      className={clsx(
                        "w-full pl-11 pr-4 py-3.5 bg-white border rounded-2xl outline-none transition-all duration-300 font-medium text-[14px]",
                        error && !email 
                          ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 text-red-900 placeholder-red-300" 
                          : "border-gray-200 focus:border-[#3b0764] focus:ring-[3px] focus:ring-[#3b0764]/15 text-gray-900 placeholder-gray-400 hover:border-gray-300 hover:shadow-[0_2px_12px_rgb(0,0,0,0.03)]"
                      )}
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className={clsx("space-y-1.5 start-item-hidden w-full", isMounted && "item-reveal-3")}>
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-[13px] font-semibold" style={{ color: '#464255' }}>
                      Kata Sandi
                    </label>
                    <a href="#" className="text-[12px] text-[#3b0764] hover:text-purple-700 font-bold transition-colors">
                      Lupa kata sandi?
                    </a>
                  </div>
                  <div className="relative group/input">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-colors group-focus-within/input:text-[#3b0764]">
                      <Lock size={18} strokeWidth={2.5} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={clsx(
                        "w-full pl-11 pr-11 py-3.5 bg-white border rounded-2xl outline-none transition-all duration-300 font-medium text-[14px]",
                        error && !password 
                          ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 text-red-900 placeholder-red-300" 
                          : "border-gray-200 focus:border-[#3b0764] focus:ring-[3px] focus:ring-[#3b0764]/15 text-gray-900 placeholder-gray-400 hover:border-gray-300 hover:shadow-[0_2px_12px_rgb(0,0,0,0.03)]"
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors p-1.5 rounded-xl hover:bg-gray-50"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={18} strokeWidth={2.5} /> : <Eye size={18} strokeWidth={2.5} />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Error */}
                <div className={clsx("start-item-hidden w-full", isMounted && "item-reveal-4")}>
                  <div className="flex items-center pt-1 pb-2">
                    <input
                      id="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-[#3b0764] bg-white border-gray-300 rounded focus:ring-[#3b0764] focus:ring-2 cursor-pointer transition-all"
                    />
                    <label htmlFor="remember-me" className="ml-2.5 text-[13.5px] font-semibold text-gray-600 cursor-pointer select-none">
                      Ingat perangkat ini
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full relative overflow-hidden bg-gradient-to-r from-[#3b0764] to-[#581c87] hover:from-[#2e054e] hover:to-[#4c1d95] active:from-[#20033b] text-white py-4 rounded-2xl text-[14.5px] font-bold shadow-[0_4px_14px_rgba(59,7,100,0.25)] hover:shadow-[0_6px_20px_rgba(59,7,100,0.35)] hover:-translate-y-[1px] transition-all duration-300 flex items-center justify-center mt-5 group/btn active:scale-[0.98]"
                  >
                    {/* Hover glow inside button */}
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>

                    {isLoading ? (
                      <div className="flex items-center gap-2.5 relative z-10">
                        <div className="w-4.5 h-4.5 border-[2.5px] border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Memverifikasi...</span>
                      </div>
                    ) : (
                      <div className="relative z-10">
                        Masuk ke Dashboard
                      </div>
                    )}
                  </button>
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
