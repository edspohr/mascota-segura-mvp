import React from 'react';
import { useApp } from '../context/Context';
import { ShieldAlert, BarChart, Users, QrCode } from 'lucide-react';
import { Card } from '../components/ui/Components';

const AdminDashboard = () => {
  const { stats, pets, user } = useApp();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-slate-800">Panel de Control</h1>
           <p className="text-slate-500">Bienvenido, {user?.name}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
           title="Total Mascotas" 
           value={pets.length} 
           icon={<Users className="w-8 h-8 text-blue-500" />} 
           color="bg-blue-50 text-blue-700"
        />
        <StatsCard 
           title="Escaneos QR" 
           value={stats.qrScans} 
           icon={<QrCode className="w-8 h-8 text-teal-500" />} 
           color="bg-teal-50 text-teal-700"
        />
        <StatsCard 
           title="Alertas de Emergencia" 
           value={stats.emergencyContacts} 
           icon={<ShieldAlert className="w-8 h-8 text-red-500" />} 
           color="bg-red-50 text-red-700"
        />
        <StatsCard 
           title="Tasa de Conversión" 
           value="12%" 
           icon={<BarChart className="w-8 h-8 text-purple-500" />} 
           color="bg-purple-50 text-purple-700"
        />
      </div>

      {/* Recent Alerts Table (Mock) */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 mb-4">
           <h3 className="font-bold text-slate-800">Alertas Recientes</h3>
        </div>
        <div className="overflow-x-auto">
           <table className="w-full text-left text-sm">
             <thead>
               <tr className="bg-slate-50 text-slate-500">
                 <th className="px-6 py-3 font-medium">Mascota</th>
                 <th className="px-6 py-3 font-medium">Reportado Por</th>
                 <th className="px-6 py-3 font-medium">Estado</th>
                 <th className="px-6 py-3 font-medium">Fecha</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
               {/* Mock Rows */}
               <tr className="hover:bg-slate-50 transition-colors">
                 <td className="px-6 py-4 font-medium text-slate-800">Bobby</td>
                 <td className="px-6 py-4 text-slate-600">Juan Pérez</td>
                 <td className="px-6 py-4">
                   <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">Crítico</span>
                 </td>
                 <td className="px-6 py-4 text-slate-400">Hace 2 horas</td>
               </tr>
               <tr className="hover:bg-slate-50 transition-colors">
                 <td className="px-6 py-4 font-medium text-slate-800">Luna</td>
                 <td className="px-6 py-4 text-slate-600">María Gomez</td>
                 <td className="px-6 py-4">
                   <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">Resuelto</span>
                 </td>
                 <td className="px-6 py-4 text-slate-400">Ayer</td>
               </tr>
             </tbody>
           </table>
        </div>
      </Card>
    </div>
  );
};

const StatsCard = ({ title, value, icon, color }) => (
  <Card className="flex items-center gap-4 hover:shadow-md transition-shadow">
    <div className={`p-4 rounded-full ${color}`}>
       {icon}
    </div>
    <div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
    </div>
  </Card>
);

export default AdminDashboard;
