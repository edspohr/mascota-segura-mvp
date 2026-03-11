import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginWithEmail, loginWithGoogle, registerWithEmail } from '../services/auth.service';
import { useApp } from '../context';
import Logo from '../components/ui/Logo';
import { Button, Input } from '../components/ui/Components';
import { DEMO_MODE } from '../config/demo';
import { DEV_LOGIN_ROLES } from '../data/mockData';
import { isDemoUnlocked, unlockDemo } from '../hooks/useMockAuth';

const colorMap = {
  teal:   { bg: 'bg-teal-500/10',   border: 'border-teal-500/30',   text: 'text-teal-600',   hover: 'hover:bg-teal-500/20'   },
  blue:   { bg: 'bg-blue-500/10',   border: 'border-blue-500/30',   text: 'text-blue-600',   hover: 'hover:bg-blue-500/20'   },
  violet: { bg: 'bg-violet-500/10', border: 'border-violet-500/30', text: 'text-violet-600', hover: 'hover:bg-violet-500/20' },
  amber:  { bg: 'bg-amber-500/10',  border: 'border-amber-500/30',  text: 'text-amber-600',  hover: 'hover:bg-amber-500/20'  },
  red:    { bg: 'bg-red-500/10',    border: 'border-red-500/30',    text: 'text-red-600',    hover: 'hover:bg-red-500/20'    },
};

const roleRoutes = {
  owner: '/dashboard',
  veterinary: '/veterinary',
  clinic_admin: '/veterinary',
  partner: '/partner',
  super_admin: '/dashboard',
};

export const DevLoginPanel = () => {
  const { demoLoginAs, addToast } = useApp();
  const navigate = useNavigate();

  const handleDevLogin = (role) => {
    demoLoginAs(role);
    addToast(`Sesión demo: ${role}`, 'success');
    navigate(roleRoutes[role]);
  };

  return (
    <div className="w-full max-w-md mt-6">
      {/* Badge */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-3
                         bg-white border border-slate-100 rounded-full py-1 shadow-sm">
          🛠 Acceso Demo
        </span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      {/* Role buttons */}
      <div className="flex flex-col gap-2">
        {DEV_LOGIN_ROLES.map(({ role, label, description, emoji, color }) => {
          const c = colorMap[color];
          return (
            <button
              key={role}
              onClick={() => handleDevLogin(role)}
              className={`flex items-center gap-4 w-full px-4 py-3.5 rounded-2xl border
                          ${c.bg} ${c.border} ${c.hover} transition-all text-left group active:scale-[0.98]`}
            >
              <span className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">{emoji}</span>
              <div className="flex-1 min-w-0">
                <p className={`font-bold text-sm ${c.text}`}>{label}</p>
                <p className="text-slate-500 text-[11px] mt-0.5 truncate font-medium">{description}</p>
              </div>
              <svg className="w-4 h-4 text-slate-400 flex-shrink-0 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          );
        })}
      </div>

      <p className="text-center text-[10px] font-bold text-slate-300 mt-4 uppercase tracking-widest">
        Modo demo activo — No se requiere cuenta real
      </p>
    </div>
  );
};

/**
 * DemoGate — renders a hidden trigger on the login page.
 * Three invisible dots at the bottom of the page open a password field.
 * Correct code → DevLoginPanel appears. Wrong code → red error message.
 * Unlocked state persists for the duration of the browser session.
 */
const DemoGate = () => {
  const [unlocked, setUnlocked] = useState(isDemoUnlocked());
  const [showInput, setShowInput] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleUnlock = (e) => {
    e.preventDefault();
    if (unlockDemo(code)) {
      setUnlocked(true);
      setError(false);
      setShowInput(false);
    } else {
      setError(true);
      setCode('');
      // Brief shake animation to signal wrong code
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowInput(false);
      setCode('');
      setError(false);
    }
  };

  // Already unlocked → show the full role panel
  if (unlocked) return <DevLoginPanel />;

  return (
    <div className="mt-8 flex flex-col items-center gap-3">
      {!showInput ? (
        // Hidden trigger — three dots, nearly invisible on dark background
        <button
          onClick={() => setShowInput(true)}
          aria-label="Acceso especial"
          className="text-slate-200 hover:text-slate-300 text-sm transition-colors
                     select-none tracking-widest px-4 py-2 opacity-50"
        >
          · · ·
        </button>
      ) : (
        <form
          onSubmit={handleUnlock}
          onKeyDown={handleKeyDown}
          className={`flex gap-2 transition-transform ${shake ? 'animate-bounce' : ''}`}
        >
          <input
            autoFocus
            type="password"
            value={code}
            onChange={(e) => { setCode(e.target.value); setError(false); }}
            placeholder="Código de acceso"
            className={`bg-white border rounded-xl px-4 py-2.5 text-slate-900 text-sm
                        w-44 focus:outline-none focus:ring-2 transition-colors
                        ${error
                          ? 'border-red-500/60 focus:ring-red-500/40'
                          : 'border-slate-200 focus:ring-teal-500/40'
                        }`}
          />
          <button
            type="submit"
            className="bg-slate-900 hover:bg-slate-800 border border-slate-900
                       text-white text-sm px-4 py-2.5 rounded-xl transition-colors"
          >
            Entrar
          </button>
        </form>
      )}

      {error && (
        <p className="text-red-400 text-xs animate-pulse">
          Código incorrecto. Intenta de nuevo.
        </p>
      )}
    </div>
  );
};

const Login = () => {
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { addToast } = useApp();

  // Login form state
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  // Register form state
  const [registerForm, setRegisterForm] = useState({
    name: '', email: '', phone: '', password: '', confirm: '',
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginWithEmail(loginForm.email, loginForm.password);
      addToast('¡Bienvenido de vuelta!', 'success');
      setTimeout(() => navigate('/dashboard'), 300);
    } catch {
      setError('Correo o contraseña incorrectos. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (registerForm.password !== registerForm.confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (registerForm.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    setLoading(true);
    try {
      await registerWithEmail(registerForm);
      addToast('¡Cuenta creada! Bienvenido a Pakuna.', 'success');
      navigate('/dashboard');
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Este correo ya está registrado. Inicia sesión.');
      } else {
        setError('Error al crear la cuenta. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      addToast('¡Bienvenido!', 'success');
      setTimeout(() => navigate('/dashboard'), 300);
    } catch {
      setError('No se pudo iniciar sesión con Google. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-12 animate-in fade-in zoom-in duration-700">
          <Logo className="h-14 mb-4" />
          <h1 className="text-3xl font-extrabold text-[#00457C] tracking-tight">PAKUNA</h1>
          <p className="text-slate-500 text-sm font-semibold tracking-wide uppercase mt-1">Pet Health Hub</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-2xl shadow-slate-200/50 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">

          {/* Tabs */}
          <div className="flex rounded-2xl bg-slate-50 p-1.5 mb-8 border border-slate-100">
            {[['login', 'Iniciar sesión'], ['register', 'Crear cuenta']].map(([key, label]) => (
              <button
                key={key}
                onClick={() => { setTab(key); setError(''); }}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
                  tab === key
                    ? 'bg-white text-teal-600 shadow-lg shadow-teal-900/5 ring-1 ring-slate-100'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-100 rounded-2xl text-sm text-amber-700 font-medium animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          {/* Login Form */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-5">
              <Input
                label="Correo electrónico"
                type="email"
                required
                placeholder="tu@correo.com"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              />
              <Input
                label="Contraseña"
                type="password"
                required
                placeholder="••••••••"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              />
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-4 text-lg bg-[#00457C] hover:bg-slate-800 mt-2"
              >
                {loading ? 'Validando...' : 'Entrar ahora'}
              </Button>
              <p className="text-center text-xs font-semibold text-slate-400 mt-4 leading-relaxed">
                ¿Olvidaste tu acceso?{' '}
                <Link to="/reset-password" className="text-teal-600 hover:underline">
                  Recupéralo aquí
                </Link>
              </p>
            </form>
          )}

          {/* Register Form */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <Input 
                label="Nombre completo"
                placeholder="Ej. Juan Pérez"
                required
                value={registerForm.name}
                onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
              />
              <Input 
                label="Correo electrónico"
                type="email"
                placeholder="tu@correo.com"
                required
                value={registerForm.email}
                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
              />
              <Input 
                label="Teléfono"
                type="tel"
                placeholder="+56 9 ..."
                required
                value={registerForm.phone}
                onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
              />
              <Input 
                label="Contraseña"
                type="password"
                placeholder="Mínimo 6 caracteres"
                required
                value={registerForm.password}
                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
              />
              <Input 
                label="Confirmar contraseña"
                type="password"
                placeholder="Repite tu contraseña"
                required
                value={registerForm.confirm}
                onChange={(e) => setRegisterForm({ ...registerForm, confirm: e.target.value })}
              />
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-4 text-lg bg-teal-600 hover:bg-teal-700 mt-2 shadow-xl shadow-teal-100"
              >
                {loading ? 'Creando perfil...' : 'Crear cuenta gratis'}
              </Button>
            </form>
          )}

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-xs text-slate-300 font-bold uppercase tracking-widest">o</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full bg-white hover:bg-slate-50 disabled:opacity-50 border border-slate-200 text-slate-700 font-bold py-4 rounded-xl transition-all shadow-sm flex items-center justify-center gap-3 active:scale-95"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar con Google
          </button>
        </div>

        {/* Demo Gate — always present, unlocked via password */}
        {DEMO_MODE && <DemoGate />}

        <p className="text-center text-xs text-slate-400 mt-8 font-medium">
          Al unirte aceptas nuestros{' '}
          <span className="text-slate-500 font-bold border-b border-slate-200">Términos y Privacidad</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
