import React, { useState } from 'react';
import { useApp } from '../context';
import { Card, Button, Input } from '../components/ui/Components';
import Logo from '../components/ui/Logo';
import { 
  BarChart3, 
  QrCode, 
  Users, 
  Activity, 
  Search, 
  Download, 
  Plus,
  ShieldCheck,
  MoreVertical,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { MOCK_QR_CODES } from '../data/mockData';

const SuperAdminDashboard = () => {
  const { profile, addToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Stats
  const stats = [
    { title: 'Usuarios Totales', value: '1,284', icon: <Users className="w-6 h-6 text-blue-600" />, trend: '+12%' },
    { title: 'Mascotas Activas', value: '856', icon: <Activity className="w-6 h-6 text-teal-600" />, trend: '+5.4%' },
    { title: 'QR Generados', value: '5,000', icon: <QrCode className="w-6 h-6 text-blue-900" />, trend: 'Target Q1' },
    { title: 'Tasa de Adopción', value: '42%', icon: <ShieldCheck className="w-6 h-6 text-blue-700" />, trend: '+2%' },
  ];

  const handleGenerateQR = () => {
    addToast('[DEMO] Generando lote de 100 códigos QR (simulado)', 'success');
  };

  const filteredQR = MOCK_QR_CODES.filter(qr => 
    qr.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (qr.status === 'claimed' ? 'reclamado' : 'huérfano').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Logo className="w-12 h-12" />
          <div>
            <h1 className="text-3xl font-black text-blue-900 tracking-tight">Consola de Administración</h1>
            <p className="text-slate-500 font-medium">Control Global • {profile?.name || 'Admin Sistema'}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
            <Button onClick={handleGenerateQR} className="bg-blue-900 hover:bg-slate-800 text-white font-black flex items-center gap-2 px-6 py-4 h-auto rounded-2xl shadow-xl shadow-blue-900/10 active:scale-95 transition-all text-sm uppercase tracking-widest">
               <Plus className="w-5 h-5" /> Nuevo Lote QR
            </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, idx) => (
          <Card key={idx} className="bg-white border-slate-50 p-6 flex flex-col hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 shadow-xl shadow-slate-100/50 rounded-[2rem] relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 group-hover:scale-110 transition-transform">
                {s.icon}
              </div>
              <span className="text-[10px] font-black text-teal-600 bg-teal-50 px-2 py-1 rounded-full uppercase tracking-widest">{s.trend}</span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.title}</p>
            <h3 className="text-3xl font-black text-blue-900">{s.value}</h3>
          </Card>
        ))}
      </div>

      {/* QR Inventory */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-6 bg-slate-50/30">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-900 rounded-xl text-white">
                    <QrCode className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-black text-blue-900">Inventario de Códigos</h2>
            </div>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Buscar slug o estado..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm text-slate-800 shadow-sm focus:ring-4 focus:ring-blue-900/5 focus:border-blue-900/20 transition-all outline-none"
              />
            </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">CÓDIGO (SLUG)</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">ESTADO</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">VINCULACIÓN</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredQR.map(qr => (
                <tr key={qr.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6 font-black text-blue-900 font-mono tracking-widest">
                      {qr.slug}
                  </td>
                  <td className="px-8 py-6">
                    {qr.status === 'claimed' ? (
                      <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest bg-teal-50 text-teal-700 border border-teal-100">
                        <CheckCircle2 className="w-3.5 h-3.5" /> RECLAMADO
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest bg-blue-50 text-blue-700 border border-blue-100">
                        <Clock className="w-3.5 h-3.5" /> HUÉRFANO
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-sm font-medium text-slate-500">
                      {qr.petId ? `Mascota ID: ${qr.petId}` : 'Pendiente de activación'}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 bg-slate-50/50 border-t border-slate-50 text-center">
            <button className="text-xs font-black text-blue-900 flex items-center gap-2 mx-auto hover:gap-3 transition-all uppercase tracking-widest group">
                Descargar reporte completo <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </button>
        </div>
      </div>

    </div>
  );
};

export default SuperAdminDashboard;
