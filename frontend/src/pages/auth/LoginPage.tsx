import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, ShieldCheck, Lock, Activity, Zap } from 'lucide-react';
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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [delayedMousePos, setDelayedMousePos] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Staggered mount animation trigger
    const timer = setTimeout(() => setIsMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Smooth delayed mouse following effect for background orbs
  useEffect(() => {
    let animationFrameId: number;
    
    const updateDelayedMouse = () => {
      setDelayedMousePos(prev => {
        // LERP (Linear Interpolation) for extremely smooth delay
        const dx = mousePos.x - prev.x;
        const dy = mousePos.y - prev.y;
        return {
          x: prev.x + dx * 0.05,
          y: prev.y + dy * 0.05
        };
      });
      animationFrameId = requestAnimationFrame(updateDelayedMouse);
    };
    
    animationFrameId = requestAnimationFrame(updateDelayedMouse);
    return () => cancelAnimationFrame(animationFrameId);
  }, [mousePos]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    
    // Normalized coordinates between -1 and 1
    const x = (clientX - innerWidth / 2) / (innerWidth / 2);
    const y = (clientY - innerHeight / 2) / (innerHeight / 2);
    
    setMousePos({ x, y });
  };

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
        /* Ambient Background Animations */
        @keyframes drift {
          0% { transform: translate(0, 0) rotate(-15deg); }
          50% { transform: translate(-2%, 2%) rotate(-14deg); }
          100% { transform: translate(0, 0) rotate(-15deg); }
        }
        @keyframes drift2 {
          0% { transform: translate(0, 0) rotate(-25deg); }
          50% { transform: translate(2%, -2%) rotate(-26deg); }
          100% { transform: translate(0, 0) rotate(-25deg); }
        }
        @keyframes floatOrb1 {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(3%, -5%); }
          66% { transform: translate(-2%, 4%); }
        }
        @keyframes floatOrb2 {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(-4%, 3%); }
          66% { transform: translate(2%, -5%); }
        }
        
        /* Floating Badges Animation (different timings) */
        @keyframes badgeFloat1 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes badgeFloat2 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(12px); }
        }
        @keyframes badgeFloat3 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
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

        /* Utility Classes */
        .animate-ribbon-1 { animation: drift 35s ease-in-out infinite; }
        .animate-ribbon-2 { animation: drift2 40s ease-in-out infinite; }
        .animate-orb-1 { animation: floatOrb1 25s ease-in-out infinite; }
        .animate-orb-2 { animation: floatOrb2 30s ease-in-out infinite; }
        
        .animate-badge-1 { animation: badgeFloat1 7s ease-in-out infinite; }
        .animate-badge-2 { animation: badgeFloat2 9s ease-in-out infinite; }
        .animate-badge-3 { animation: badgeFloat3 8s ease-in-out infinite; }
      `}</style>

      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className={clsx(
          "min-h-screen relative flex items-center justify-center bg-[#FAFAFC] font-sans overflow-hidden selection:bg-[#3b0764]/20 selection:text-[#3b0764]",
          isExiting && "page-exit"
        )}
      >
        
        {/* =========================================
            BACKGROUND - STRIPE-STYLE DIAGONAL MESH & ORBS
        ========================================= */}
        <div className={clsx("absolute inset-0 start-hidden", isMounted && "bg-reveal")}>
          
          {/* Very Subtle Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
          
          {/* Diagonal Ribbon Aurora 1 - Purple/Pink */}
          <div 
            className="absolute top-[-20%] left-[10%] w-[120vw] h-[40vh] bg-gradient-to-r from-purple-400/25 via-fuchsia-400/15 to-transparent blur-[120px] animate-ribbon-1 pointer-events-none origin-left"
            style={{ 
              transform: `rotate(-15deg) translate(${delayedMousePos.x * -15}px, ${delayedMousePos.y * -15}px)` 
            }}
          ></div>
          
          {/* Diagonal Ribbon Aurora 2 - Cyan/Emerald */}
          <div 
            className="absolute top-[20%] right-[-20%] w-[120vw] h-[50vh] bg-gradient-to-l from-cyan-400/20 via-emerald-400/10 to-transparent blur-[140px] animate-ribbon-2 pointer-events-none origin-right"
            style={{ 
              transform: `rotate(-25deg) translate(${delayedMousePos.x * 20}px, ${delayedMousePos.y * 20}px)` 
            }}
          ></div>

          {/* GLOWING ORBS (Massive Blur, Slow Movement) */}
          
          {/* Purple Orb */}
          <div 
            className="absolute top-[10%] left-[20%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] bg-purple-500/10 rounded-full blur-[200px] animate-orb-1 pointer-events-none mix-blend-multiply"
            style={{ transform: `translate(${delayedMousePos.x * -30}px, ${delayedMousePos.y * -30}px)` }}
          ></div>

          {/* Cyan Orb */}
          <div 
            className="absolute bottom-[-10%] right-[15%] w-[45vw] h-[45vw] max-w-[650px] max-h-[650px] bg-cyan-400/15 rounded-full blur-[200px] animate-orb-2 pointer-events-none mix-blend-multiply"
            style={{ transform: `translate(${delayedMousePos.x * 35}px, ${delayedMousePos.y * 35}px)` }}
          ></div>

          {/* Soft Blue Center Glow */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-blue-100/40 rounded-full blur-[150px] pointer-events-none"
            style={{ transform: `translate(calc(-50% + ${delayedMousePos.x * 10}px), calc(-50% + ${delayedMousePos.y * 10}px))` }}
          ></div>

          {/* Extremely Subtle Noise Texture placed ABOVE orbs to texturize the light */}
          <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

        </div>

        {/* =========================================
            FLOATING BADGES (MAX 3, SMALL, TASTEFUL)
        ========================================= */}
        <div className={clsx("hidden lg:block absolute inset-0 pointer-events-none z-10 transition-opacity duration-1000", isMounted ? "opacity-100" : "opacity-0")}>
          
          {/* Enterprise Badge */}
          <div 
            className="absolute top-[25%] left-[18%] xl:left-[28%] bg-white/70 backdrop-blur-md border border-white/50 px-3 py-1.5 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.03)] animate-badge-1 flex items-center gap-1.5 transition-transform duration-300"
            style={{ transform: `translate(${mousePos.x * 10}px, ${mousePos.y * 10}px)` }}
          >
            <ShieldCheck size={13} className="text-[#3b0764]" />
            <span className="text-[11px] font-bold text-gray-700 tracking-wide">Enterprise</span>
          </div>

          {/* Encrypted Badge */}
          <div 
            className="absolute bottom-[28%] left-[22%] xl:left-[30%] bg-white/70 backdrop-blur-md border border-white/50 px-3 py-1.5 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.03)] animate-badge-2 flex items-center gap-1.5 transition-transform duration-300"
            style={{ transform: `translate(${mousePos.x * -12}px, ${mousePos.y * -12}px)` }}
          >
            <Lock size={13} className="text-emerald-600" />
            <span className="text-[11px] font-bold text-gray-700 tracking-wide">Encrypted</span>
          </div>

          {/* Live Monitoring Badge */}
          <div 
            className="absolute top-[42%] right-[15%] xl:right-[26%] bg-white/70 backdrop-blur-md border border-white/50 px-3 py-1.5 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.03)] animate-badge-3 flex items-center gap-1.5 transition-transform duration-300"
            style={{ transform: `translate(${mousePos.x * 15}px, ${mousePos.y * -8}px)` }}
          >
            <Activity size={13} className="text-cyan-600" />
            <span className="text-[11px] font-bold text-gray-700 tracking-wide">Live Monitoring</span>
          </div>
          
        </div>


        {/* =========================================
            MAIN LOGIN CARD (CENTERED)
        ========================================= */}
        <div 
          className={clsx(
            "relative z-20 w-full max-w-[460px] px-6 sm:px-0 start-card-hidden",
            isMounted && "card-reveal"
          )}
        >
          <div 
            className="bg-white/95 backdrop-blur-2xl rounded-[32px] p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04),_0_0_1px_rgba(0,0,0,0.05)] border border-white/60 relative overflow-hidden transition-shadow duration-300 hover:shadow-[0_20px_40px_rgb(0,0,0,0.06),_0_0_1px_rgba(0,0,0,0.05)]"
            style={{
              transform: `translate(${mousePos.x * -4}px, ${mousePos.y * -4}px)` // Extremely subtle card parallax
            }}
          >
            
            {/* Very faint glass reflection on top edge */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-100 pointer-events-none"></div>
            <div className="absolute top-0 inset-x-0 h-[200px] bg-gradient-to-b from-white/40 to-transparent pointer-events-none rounded-t-[32px]"></div>

            <div className="relative z-10 flex flex-col items-center">
              
              {/* Branding Header */}
              <div className={clsx("flex flex-col items-center text-center mb-10 start-item-hidden w-full", isMounted && "item-reveal-1")}>
                {/* Logo and Badges in a single column */}
                <div className="w-14 h-14 bg-[#3b0764] rounded-2xl flex items-center justify-center shadow-[0_4px_12px_rgba(59,7,100,0.2)] mb-6 border border-white/10">
                  <img src="/logo.png" alt="IW Paint" className="h-7 brightness-0 invert object-contain" />
                </div>
                
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
                  IW Paint Enterprise
                </h1>
                
                <p className="text-[14px] text-gray-500 font-medium mb-6">
                  Sales Monitoring Dashboard
                </p>

                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200/60 text-[11px] font-bold text-gray-600 uppercase tracking-widest shadow-sm">
                  <Zap size={12} className="text-[#3b0764]" />
                  Internal Access Only
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleLogin} className="w-full space-y-5">
                
                {/* Email Input */}
                <div className={clsx("space-y-1.5 start-item-hidden w-full", isMounted && "item-reveal-2")}>
                  <label className="text-[13px] font-bold text-gray-700 ml-1">Email address</label>
                  <div className="relative group/input">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@iwpaint.com"
                      className={clsx(
                        "w-full px-4 py-3.5 bg-white border rounded-2xl outline-none transition-all duration-300 font-medium text-[14px]",
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
                    <label className="text-[13px] font-bold text-gray-700">Password</label>
                    <a href="#" className="text-[12px] text-[#3b0764] hover:text-purple-700 font-bold transition-colors">
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative group/input">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={clsx(
                        "w-full pl-4 pr-11 py-3.5 bg-white border rounded-2xl outline-none transition-all duration-300 font-medium text-[14px]",
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
                      Remember this device
                    </label>
                  </div>

                  {error && (
                    <div className="bg-red-50/80 text-red-600 px-4 py-3 rounded-xl text-[13px] font-bold border border-red-100/50 flex items-start gap-2 mt-3 shadow-sm">
                      <div className="min-w-[14px] mt-0.5">!</div>
                      <p>{error}</p>
                    </div>
                  )}

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
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      <div className="relative z-10">
                        Sign In to Dashboard
                      </div>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
          
        </div>
      </div>
    </>
  );
};
