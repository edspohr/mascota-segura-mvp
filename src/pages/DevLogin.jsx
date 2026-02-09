import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/Context';
import { User, Stethoscope, ShieldCheck } from 'lucide-react';
import { Card } from '../components/ui/Components';

const DevLogin = () => {
  const { login, user, loading } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'owner') navigate('/dashboard');
      else if (user.role === 'partner') navigate('/partner');
      else if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'superadmin') navigate('/superadmin');
    }
  }, [user, navigate]);

  const handleLogin = (role) => {
    login(role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
            Mascota Segura <span className="text-teal-600">MVP</span>
          </h1>
          <p className="text-slate-500">Selecciona un rol para simular la experiencia</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <RoleCard
            title="Soy Dueño"
            description="Gestiona tus mascotas y ver su historial."
            icon={<User className="w-12 h-12 text-teal-600" />}
            onClick={() => handleLogin('owner')}
            loading={loading}
          />
          <RoleCard
            title="Soy Veterinaria"
            description="Registra vacunas y atenciones médicas."
            icon={<Stethoscope className="w-12 h-12 text-blue-600" />}
            onClick={() => handleLogin('partner')}
            loading={loading}
          />
          <RoleCard
            title="Soy Admin"
            description="Monitorea métricas y alertas globales."
            icon={<ShieldCheck className="w-12 h-12 text-slate-800" />}
            onClick={() => handleLogin('admin')}
            loading={loading}
          />
          <RoleCard
            title="Soy Admin Veterinaria"
            description="Gestión de negocio y staff."
            icon={<Activity className="w-12 h-12 text-teal-700" />}
            onClick={() => handleLogin('partner_admin')}
            loading={loading}
          />
          <RoleCard
            title="Soy Staff Interno"
            description="Soporte y visualización global."
            icon={<Users className="w-12 h-12 text-indigo-500" />}
            onClick={() => handleLogin('staff')}
            loading={loading}
          />
          <RoleCard
            title="Soy Super Admin"
            description="Gestión global de organizaciones."
            icon={<ShieldCheck className="w-12 h-12 text-purple-600" />}
            onClick={() => handleLogin('superadmin')}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

const RoleCard = ({ title, description, icon, onClick, loading }) => (
  <button 
    onClick={onClick} 
    disabled={loading}
    className="group text-left w-full disabled:opacity-50 disabled:cursor-not-allowed transform transition-all hover:-translate-y-1"
  >
    <Card className="h-full border-2 border-transparent hover:border-teal-500 hover:shadow-lg transition-all">
      <div className="flex flex-col items-center text-center gap-4 py-8">
        <div className="p-4 bg-slate-50 rounded-full group-hover:bg-teal-50 transition-colors">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-teal-700 transition-colors">{title}</h3>
          <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
        </div>
      </div>
    </Card>
  </button>
);

export default DevLogin;
