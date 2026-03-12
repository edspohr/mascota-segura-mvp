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
    { title: 'Usuarios Totales', value: '1,284', icon: <Users className="w-6 h-6 text-[#00457C]" />, trend: '+12%' },
    { title: 'Mascotas Activas', value: '856', icon: <Activity className="w-6 h-6 text-[#008894]" />, trend: '+5.4%' },
    { title: 'QR Generados', value: '5,000', icon: <QrCode className="w-6 h-6 text-[#00457C]" />, trend: 'Target Q1' },
    { title: 'Protección Red', value: '42%', icon: <ShieldCheck className="w-6 h-6 text-[#008894]" />, trend: '+2%' },
  ];

  const handleGenerateQR = () => {
    addToast('[DEMO] Generando lote de 100 códigos QR (simulado)', 'success');
  };

  const filteredQR = MOCK_QR_CODES.filter(qr => 
    qr.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (qr.status === 'claimed' ? 'reclamado' : 'huérfano').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 pt-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <Logo className="w-14 h-14" />
          <div className="space-y-1 text-left">
            <h1 className="text-3xl lg:text-4xl font-black text-[#00457C] tracking-tight leading-none">Global Console</h1>
            <p className="text-slate-500 font-medium text-lg leading-none">Administración Maestra • {profile?.name || 'Admin Sistema'}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
            <Button onClick={handleGenerateQR} className="bg-[#00457C] hover:bg-slate-800 text-white font-black flex items-center gap-3 px-8 py-5 h-auto rounded-[1.5rem] shadow-2xl shadow-blue-900/20 active:scale-95 transition-all text-xs uppercase tracking-[0.2em]">
               <Plus className="w-5 h-5" /> Generar Lote QR
            </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((s, idx) => (
          <MetricCard key={idx} title={s.title} value={s.value} trend={s.trend} icon={s.icon} />
        ))}
      </div>

      {/* QR Inventory */}
      <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-950/[0.03] border border-slate-100 overflow-hidden">
        <div className="p-10 border-b border-slate-50 flex flex-col lg:flex-row justify-between lg:items-center gap-8 bg-slate-50/10">
            <div className="flex items-center gap-5">
                <div className="p-4 bg-[#00457C] rounded-2xl shadow-lg shadow-blue-900/10 text-white">
                    <QrCode className="w-7 h-7" />
                </div>
                <div>
                   <h2 className="text-2xl font-black text-[#00457C] tracking-tight leading-none">Inventario QR</h2>
                   <p className="text-slate-400 font-bold text-[10px] mt-1.5 uppercase tracking-widest leading-none">Control de Emisión y Activación</p>
                </div>
            </div>
            <div className="relative w-full lg:w-96 group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#008894] transition-colors" />
              <input 
                type="text" 
                placeholder="Buscar por slug o estado..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl pl-16 pr-6 py-4 text-sm text-[#00457C] shadow-sm focus:ring-8 focus:ring-blue-900/5 focus:border-[#00457C]/20 transition-all outline-none font-medium"
              />
            </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/30">
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Identificador (Slug)</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Estado Actual</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Vinculación</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredQR.map(qr => (
                <tr key={qr.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-10 py-8 font-black text-[#00457C] font-mono tracking-[0.2em] text-base">
                      {qr.slug}
                  </td>
                  <td className="px-10 py-8">
                    {qr.status === 'claimed' ? (
                      <span className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full text-[9px] font-black tracking-widest bg-teal-50 text-[#008894] border border-teal-100 shadow-sm">
                        <CheckCircle2 className="w-4 h-4 fill-current" /> ACTIVADO
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full text-[9px] font-black tracking-widest bg-blue-50 text-[#00457C] border border-blue-100 shadow-sm">
                        <Clock className="w-4 h-4" /> DISPONIBLE
                      </span>
                    )}
                  </td>
                  <td className="px-10 py-8 text-sm font-semibold text-slate-400">
                      {qr.petId ? (
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#008894]" />
                          <span>Mascota ID: {qr.petId.slice(0, 8)}...</span>
                        </div>
                      ) : 'Sin activación pendiente'}
                  </td>
                  <td className="px-10 py-8 text-right">
                    <button className="p-3 hover:bg-slate-100 rounded-xl transition-all text-slate-300 hover:text-[#00457C] active:scale-90 border border-transparent hover:border-slate-100">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-10 bg-slate-50/20 border-t border-slate-50 text-center">
            <button className="text-[10px] font-black text-[#00457C] flex items-center gap-3 mx-auto hover:gap-4 transition-all uppercase tracking-[0.2em] group">
                Descargar Reporte Operativo <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </button>
        </div>
      </div>

    </div>
  );
};

const MetricCard = ({ title, value, icon, trend }) => (
  <Card className="bg-white border-slate-100 p-10 flex flex-col hover:shadow-2xl hover:shadow-slate-950/[0.04] transition-all duration-700 shadow-xl shadow-slate-950/[0.02] rounded-[3rem] relative overflow-hidden group cursor-default">
    <div className="absolute top-0 right-0 w-40 h-40 bg-slate-50 rounded-full blur-3xl group-hover:bg-[#008894]/5 transition-colors duration-700" />
    <div className="flex justify-between items-start mb-10 relative z-10">
      <div className="p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 shadow-inner group-hover:scale-110 group-hover:bg-white transition-all duration-700">
        {icon}
      </div>
      <div className="px-4 py-2 bg-teal-50 border border-teal-50 rounded-full shadow-sm">
         <span className="text-[9px] font-black tracking-[0.2em] uppercase text-[#008894]">{trend}</span>
      </div>
    </div>
    <div className="mt-auto relative z-10 text-left">
      <p className="text-[10px] font-black text-slate-400 mb-2 uppercase tracking-[0.3em] leading-none">{title}</p>
      <h3 className="text-4xl lg:text-5xl font-black text-[#00457C] tracking-tight leading-none">{value}</h3>
    </div>
  </Card>
);

export default SuperAdminDashboard;
