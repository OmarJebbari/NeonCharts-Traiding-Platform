import React, { useEffect, useRef, useState } from 'react';
import { X, Mail, ChevronDown, ChevronLeft, Eye, EyeOff, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import astronautHero from '../assets/get-started-hero.png';
import NeonChartsLogo from '../assets/NeonCharts_logo_160x40.svg';

interface GetStartedModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

type ViewState = 'options' | 'email-login' | 'email-signup';

export const GetStartedModal: React.FC<GetStartedModalProps> = ({ onClose, onSuccess }) => {
  const { loginWithEmail, registerWithEmail, loginWithGoogle } = useAuth();

  const [view, setView] = useState<ViewState>('options');
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
const googleBtnRef = useRef<HTMLDivElement>(null);
  // Render the official Google button (returns an ID token credential)
  useEffect(() => {
    if (view !== 'options') return;

    const clientId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID as string;
    if (!clientId) return;

    const google = window.google?.accounts?.id;
    if (!google) return;

    try {
      google.initialize({
        client_id: clientId,
        callback: async (resp: any) => {
          try {
            setError(null);
            setBusy(true);
            await loginWithGoogle(resp.credential);
            onSuccess();
          } catch (e: any) {
            setError(e?.message || 'Google sign-in failed.');
          } finally {
            setBusy(false);
          }
        },
      });

      if (googleBtnRef.current) {
        googleBtnRef.current.innerHTML = '';
        google.renderButton(googleBtnRef.current, {
          theme: 'filled_black',
          size: 'large',
          shape: 'pill',
          text: 'continue_with',
          width: 340,
          logo_alignment: 'left',
        });
      }
    } catch (e: any) {
      console.warn('Google button init warning:', e);
    }
  }, [view, loginWithGoogle, onSuccess]);

  const submitEmailLogin = async () => {
    try {
      setError(null);
      setBusy(true);
      await loginWithEmail(email, password);
      onSuccess();
    } catch (e: any) {
      setError(e?.message || 'Sign-in failed.');
    } finally {
      setBusy(false);
    }
  };

  const submitEmailSignup = async () => {
    try {
      setError(null);
      setBusy(true);
      await registerWithEmail({
        email,
        username: username.trim() || undefined,
        fullName: fullName.trim() || undefined,
        password,
      });
      onSuccess();
    } catch (e: any) {
      setError(e?.message || 'Sign-up failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex bg-black animate-in fade-in duration-200 font-sans">
      {/* Left Panel - Image (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-[#000000] items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={astronautHero}
            alt="Astronaut"
            className="w-full h-full object-cover object-center opacity-90"
            loading="eager"
          />
{/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>

          {/* Color Accents matching TradingView brand feel */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-900/30 via-transparent to-emerald-900/30 mix-blend-overlay"></div>
        </div>

        
      </div>

      {/* Right Panel - Content */}
      <div className="w-full lg:w-1/2 bg-black flex flex-col relative text-white z-10">
        {/* Top Bar */}
        <div className="flex justify-between items-center p-6 h-20">
          {/* Left Side: Back Button or Spacer */}
          <div className="w-10">
            {view !== 'options' ? (
              <button
                onClick={() => {
                  setError(null);
                  setView('options');
                }}
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <ChevronLeft size={24} />
              </button>
            ) : (
              <div className="lg:hidden w-6"></div>
            )}
          </div>

          {/* Center: Logo */}
          <div className="flex items-center justify-center">
            <img src={NeonChartsLogo} alt="NeonCharts" className="h-5 w-auto" />
          </div>

          {/* Right Side: Close Button */}
          <div className="w-10 flex justify-end">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Brand Logo */}
        <div className="px-6 sm:px-12 md:px-24 pt-3 pb-10">
          <div className="flex justify-center">
            <img src={NeonChartsLogo} alt="NeonCharts" className="h-20 w-auto" />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col justify-center items-center px-6 sm:px-12 md:px-24">
          {view === 'options' ? (
            <div className="w-full max-w-[340px] space-y-6 text-center animate-in fade-in slide-in-from-right-4 duration-300">
              <h1 className="text-4xl font-bold text-white tracking-tight">Sign in</h1>

              {error ? (
                <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2">
                  {error}
                </div>
              ) : null}

              <div className="space-y-3">
                {/* Official Google button will render here */}
                <div className="flex justify-center">
                  <div ref={googleBtnRef} />
                </div>

                <button className="text-[#2962ff] hover:text-[#1e53e5] text-sm font-semibold transition-colors flex items-center justify-center gap-1 w-full py-2">
                  Show more options <ChevronDown size={16} strokeWidth={2.5} />
                </button>

                <div className="flex items-center gap-3 w-full py-2">
                  <div className="h-px bg-[#2a2e39] flex-1"></div>
                  <span className="text-gray-500 text-sm pb-0.5">or</span>
                  <div className="h-px bg-[#2a2e39] flex-1"></div>
                </div>

                <button
                  onClick={() => {
                    setError(null);
                    setView('email-login');
                  }}
                  className="w-full h-12 bg-transparent border border-[#434651] hover:border-white/60 hover:bg-[#2a2e39]/30 text-white font-bold rounded-full flex items-center justify-center gap-3 transition-all active:scale-[0.98] group"
                  disabled={busy}
                >
                  <div className="relative">
                    <Mail size={20} className="text-white group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-[15px]">Email</span>
                </button>

                {!((import.meta as any).env?.VITE_GOOGLE_CLIENT_ID) ? (
                  <p className="text-xs text-gray-500 pt-2">
                    Google sign-in is disabled until you set <span className="text-gray-300">VITE_GOOGLE_CLIENT_ID</span>{' '}
                    in <span className="text-gray-300">.env.local</span>.
                  </p>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="w-full max-w-[340px] space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h1 className="text-2xl font-bold text-white tracking-tight text-center mb-2">
                {view === 'email-login' ? 'Sign in with email' : 'Create your account'}
              </h1>

              {error ? (
                <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2">
                  {error}
                </div>
              ) : null}

              {view === 'email-signup' ? (
                <>
                  <div className="group space-y-1.5">
                    <label className="block text-xs text-gray-400 group-focus-within:text-[#2962ff] transition-colors font-medium">
                      Full name (optional)
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-transparent border border-[#434651] rounded-md px-3 py-2.5 outline-none focus:border-[#2962ff] transition-colors text-white text-sm"
                    />
                  </div>

                  <div className="group space-y-1.5">
                    <label className="block text-xs text-gray-400 group-focus-within:text-[#2962ff] transition-colors font-medium">
                      Username (optional)
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-transparent border border-[#434651] rounded-md px-3 py-2.5 outline-none focus:border-[#2962ff] transition-colors text-white text-sm"
                    />
                  </div>
                </>
              ) : null}

              {/* Email */}
              <div className="group space-y-1.5">
                <label className="block text-xs text-gray-400 group-focus-within:text-[#2962ff] transition-colors font-medium">
                  Email {view === 'email-login' ? 'or Username' : ''}
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border border-[#434651] rounded-md px-3 py-2.5 outline-none focus:border-[#2962ff] transition-colors text-white text-sm"
                />
              </div>

              {/* Password */}
              <div className="group space-y-1.5">
                <label className="block text-xs text-gray-400 group-focus-within:text-[#2962ff] transition-colors font-medium">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent border border-[#434651] rounded-md px-3 py-2.5 outline-none focus:border-[#2962ff] transition-colors text-white text-sm pr-10"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    type="button"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2.5 mt-2">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="peer h-4 w-4 appearance-none rounded border border-[#434651] bg-transparent checked:border-white checked:bg-white transition-all cursor-pointer"
                    defaultChecked
                  />
                  <Check
                    size={12}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-black opacity-0 peer-checked:opacity-100 pointer-events-none"
                    strokeWidth={3}
                  />
                </div>
                <label
                  htmlFor="remember"
                  className="text-sm text-gray-300 select-none cursor-pointer hover:text-white transition-colors"
                >
                  Remember me
                </label>
              </div>

              {/* Submit */}
              <button
                className="w-full h-12 bg-white text-black font-bold rounded-md hover:bg-gray-200 transition-colors mt-2 text-sm transform active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={view === 'email-login' ? submitEmailLogin : submitEmailSignup}
                disabled={busy}
              >
                {busy ? 'Please wait…' : view === 'email-login' ? 'Sign in' : 'Sign up'}
              </button>

              <div className="text-center text-sm text-gray-400">
                {view === 'email-login' ? (
                  <button
                    className="text-[#2962ff] hover:text-blue-400 font-medium"
                    onClick={() => {
                      setError(null);
                      setView('email-signup');
                    }}
                  >
                    Create an account
                  </button>
                ) : (
                  <button
                    className="text-[#2962ff] hover:text-blue-400 font-medium"
                    onClick={() => {
                      setError(null);
                      setView('email-login');
                    }}
                  >
                    I already have an account
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 text-center border-t border-[#2a2e39]">
          <p className="text-gray-400 text-sm">
            Symbol Detail is <span className="text-gray-200 font-semibold">Premium-only</span>.
            <br />
            After sign-in, you will be redirected to <span className="text-gray-200">Home</span>.
          </p>
        </div>
      </div>
    </div>
  );
};
