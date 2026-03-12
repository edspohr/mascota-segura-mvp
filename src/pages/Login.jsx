import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginWithEmail, loginWithGoogle, registerWithEmail } from '../services/auth.service';
import { useApp } from '../context';
import Logo from '../components/ui/Logo';
import { Button, Input } from '../components/ui/Components';
import { DEMO_MODE } from '../config/demo';
import { DEV_LOGIN_ROLES } from '../data/mockData';

const colorMap = {
  teal:   { bg: 'bg-teal-50',   border: 'border-teal-100',   text: 'text-[#008894]',   hover: 'hover:bg-teal-100/50' },
  blue:   { bg: 'bg-blue-50',   border: 'border-blue-100',   text: 'text-[#00457C]',   hover: 'hover:bg-blue-100/50' },
  violet: { bg: 'bg-purple-50', border: 'border-purple-100', text: 'text-purple-600',  hover: 'hover:bg-purple-100/50' },
  amber:  { bg: 'bg-amber-50',  border: 'border-amber-100',  text: 'text-amber-700',   hover: 'hover:bg-amber-100/50' },
  red:    { bg: 'bg-slate-50',  border: 'border-slate-200',  text: 'text-slate-600',   hover: 'hover:bg-slate-100' }, // Avoiding Red
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
    addToast(`Sesión demo iniciada: ${role}`, 'success');
    navigate(roleRoutes[role]);
  };

  return (
    <div className="w-full max-w-md mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
      {/* Badge */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px bg-slate-100" />
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4
                         bg-white border border-slate-100 rounded-full py-1.5 shadow-sm">
          🛠 Acceso Demo
        </span>
        <div className="flex-1 h-px bg-slate-100" />
      </div>

      {/* Role buttons */}
      <div className="flex flex-col gap-3">
        {DEV_LOGIN_ROLES.map(({ role, label, description, emoji, color }) => {
          const c = colorMap[color] || colorMap.blue;
          return (
            <button
              key={role}
              onClick={() => handleDevLogin(role)}
              className={`flex items-center gap-4 w-full px-5 py-4 rounded-[1.5rem] border
                          ${c.bg} ${c.border} ${c.hover} transition-all text-left group active:scale-[0.98] shadow-sm`}
            >
              <span className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">{emoji}</span>
              <div className="flex-1 min-w-0">
                <p className={`font-black text-sm ${c.text} tracking-tight`}>{label}</p>
                <p className="text-slate-500 text-[11px] mt-0.5 truncate font-medium">{description}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
            </button>
          );
        })}
      </div>

      <p className="text-center text-[10px] font-black text-slate-300 mt-6 uppercase tracking-widest leading-loose">
        Portal de Pruebas Activo <br/>
        Explora los flujos sin necesidad de registro real
      </p>
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
      addToast('¡Qué alegría verte de nuevo! Disfruta tu estadía.', 'success');
      setTimeout(() => navigate('/dashboard'), 300);
    } catch {
      setError('Lo sentimos, el correo o la contraseña no coinciden. Por favor, verifica tus datos e intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (registerForm.password !== registerForm.confirm) {
      setError('Las contraseñas no coinciden. Asegúrate de que ambas sean iguales.');
      return;
    }
    if (registerForm.password.length < 6) {
      setError('Por seguridad, tu contraseña debe tener al menos 6 caracteres.');
      return;
    }
    setLoading(true);
    try {
      await registerWithEmail(registerForm);
      addToast('¡Bienvenido a la familia Pakuna! Tu cuenta está lista.', 'success');
      navigate('/dashboard');
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Este correo ya es parte de nuestra comunidad. Puedes iniciar sesión directamente.');
      } else {
        setError('Ocurrió un pequeño inconveniente al crear tu cuenta. ¿Podrías intentar de nuevo en un momento?');
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
      addToast('¡Hola! Qué bueno tenerte aquí.', 'success');
      setTimeout(() => navigate('/dashboard'), 300);
    } catch {
      setError('No pudimos conectar con Google. Por favor, intenta de nuevo o usa tu correo electrónico.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-teal-100/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-blue-100/30 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-12 animate-in fade-in zoom-in duration-700">
          <Logo className="h-14 mb-4" />
          <h1 className="text-3xl font-black text-[#00457C] tracking-tight">PAKUNA</h1>
          <p className="text-[#008894] text-[10px] font-black tracking-[0.2em] uppercase mt-2">Cuidado Preventivo Mascota</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-2xl shadow-blue-950/5 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">

          {/* Tabs */}
          <div className="flex rounded-[1.5rem] bg-slate-50 p-1.5 mb-10 border border-slate-100">
            {[['login', 'Entrar'], ['register', 'Unirse']].map(([key, label]) => (
              <button
                key={key}
                onClick={() => { setTab(key); setError(''); }}
                className={`flex-1 py-3 text-sm font-black uppercase tracking-wider rounded-xl transition-all ${
                  tab === key
                    ? 'bg-white text-[#008894] shadow-lg shadow-teal-900/5 ring-1 ring-slate-100'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-8 p-5 bg-amber-50 border border-amber-100 rounded-[1.5rem] text-sm text-amber-700 font-medium leading-relaxed animate-in fade-in slide-in-from-top-2">
              <p>{error}</p>
            </div>
          )}

          {/* Login Form */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-6">
              <Input
                label="Tu correo"
                type="email"
                required
                placeholder="ejemplo@correo.com"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              />
              <Input
                label="Tu contraseña"
                type="password"
                required
                placeholder="••••••••"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              />
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-5 text-lg bg-[#008894] hover:bg-teal-700 mt-2 rounded-[1.5rem] flex items-center justify-center"
              >
                {loading ? 'Preparando todo...' : 'Entrar ahora'}
              </Button>
              <p className="text-center text-xs font-bold text-slate-400 mt-6 leading-relaxed">
                ¿Olvidaste tu acceso?{' '}
                <Link to="/reset-password" title="Recuperar contraseña" className="text-[#008894] hover:underline">
                  Recupéralo aquí
                </Link>
              </p>
            </form>
          )}

          {/* Register Form */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-5">
              <Input 
                label="Nombre completo"
                placeholder="Como prefieras que te llamemos"
                required
                value={registerForm.name}
                onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
              />
              <Input 
                label="Correo electrónico"
                type="email"
                placeholder="ejemplo@correo.com"
                required
                value={registerForm.email}
                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
              />
              <Input 
                label="Tu teléfono"
                type="tel"
                placeholder="+56 9 ..."
                required
                value={registerForm.phone}
                onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
              />
              <Input 
                label="Elige una contraseña"
                type="password"
                placeholder="Mínimo 6 caracteres"
                required
                value={registerForm.password}
                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
              />
              <Input 
                label="Confirma tu contraseña"
                type="password"
                placeholder="Repite la contraseña"
                required
                value={registerForm.confirm}
                onChange={(e) => setRegisterForm({ ...registerForm, confirm: e.target.value })}
              />
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-5 text-lg bg-[#008894] hover:bg-teal-700 mt-4 rounded-[1.5rem] flex items-center justify-center"
              >
                {loading ? 'Creando cuenta...' : 'Crear mi cuenta gratis'}
              </Button>
            </form>
          )}

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">O continúa con</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full bg-slate-50 hover:bg-slate-100 disabled:opacity-50 border border-slate-100 text-[#00457C] font-bold py-5 rounded-[1.5rem] transition-all flex items-center justify-center gap-4 group active:scale-[0.98]"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-sm">Acceder con Google</span>
          </button>
        </div>

        {/* Demo Mode Trigger */}
        {DEMO_MODE && <DevLoginPanel />}

        <p className="text-center text-[10px] text-slate-400 mt-10 font-medium px-8 leading-relaxed">
          Al entrar o registrarte, confirmas que aceptas nuestros <br/>
          <span className="text-slate-500 font-bold hover:text-[#008894] cursor-pointer cursor-default">Términos y Condiciones</span> y <span className="text-slate-500 font-bold hover:text-[#008894] cursor-pointer">Privacidad</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
