import React, { useState, useEffect } from 'react';
import { useApp } from '../context';
import { collection, query, getDocs, limit } from 'firebase/firestore';
import { db } from '../config/firebase';
import { addLog } from '../services/logs.service';
import { addEvent } from '../services/events.service';
import { Card, Button, Modal, Input } from '../components/ui/Components';
import Logo from '../components/ui/Logo';
import { Users, BellRing, TrendingUp, CheckCircle2, AlertCircle, PlusCircle, Search, Calendar } from 'lucide-react';

const VeterinaryDashboard = () => {
  const { firebaseUser, profile, addToast } = useApp();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [submittingVisit, setSubmittingVisit] = useState(false);
  
  const [visitData, setVisitData] = useState({
     type: 'Vacuna',
     description: '',
     nextDueDate: ''
  });

  useEffect(() => {
    const loadPatients = async () => {
      if (!profile?.clinicId && profile?.role !== 'veterinary') {
        setLoading(false);
        return;
      }
      try {
        const q = query(collection(db, 'pets'), limit(50));
        const snap = await getDocs(q);
        setPatients(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Error loading patients:", err);
      } finally {
        setLoading(false);
      }
    };
    loadPatients();
  }, [profile]);

  const handleOpenVisitModal = (patient) => {
      setSelectedPatient(patient);
      const date = new Date();
      date.setMonth(date.getMonth() + 6);
      
      setVisitData({
          type: 'Control',
          description: 'Revisión preventiva semestral',
          nextDueDate: date.toISOString().split('T')[0]
      });
      setShowVisitModal(true);
  };

  const handleRegisterVisit = async (e) => {
      e.preventDefault();
      if (!selectedPatient || !firebaseUser) return;
      setSubmittingVisit(true);
      try {
          await addLog(selectedPatient.id, {
            type: visitData.type,
            content: visitData.description || `Atención de ${visitData.type}`
          }, { uid: firebaseUser.uid, name: profile.name, role: profile.role });

          await addEvent(selectedPatient.id, {
            type: visitData.type,
            description: `Próxima ${visitData.type}`,
            dueDate: visitData.nextDueDate
          }, { uid: firebaseUser.uid, name: profile.name });

          addToast('Atención registrada con éxito', 'success');
          setShowVisitModal(false);
      } catch (err) {
          addToast('Error al registrar visita: ' + err.message, 'error');
      } finally {
          setSubmittingVisit(false);
      }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Logo className="w-12 h-12" />
          <div>
            <h1 className="text-3xl font-black text-blue-900 tracking-tight">Portal de Especialistas</h1>
            <p className="text-slate-500 font-medium">{profile?.name || 'Clínica Asociada'} • Verificado por Pakuna</p>
          </div>
        </div>
        <div className="px-4 py-2 bg-teal-50 border border-teal-100 rounded-full flex items-center gap-2">
            <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase text-teal-700 tracking-widest">Sincronizado</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard 
          title="Tasa de Compliance" 
          value="98.2%" 
          trend="+4.1%"
          icon={<TrendingUp className="w-6 h-6 text-teal-600" />}
        />
        <MetricCard 
          title="Alertas Activas" 
          value="42" 
          trend="Próximos 7 días"
          icon={<BellRing className="w-6 h-6 text-amber-500" />}
        />
        <MetricCard 
          title="Pacientes en Red" 
          value={patients.length} 
          trend="Total registrados"
          icon={<Users className="w-6 h-6 text-blue-700" />}
        />
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-6 bg-slate-50/30">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-900 rounded-xl">
                    <Users className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-black text-blue-900">Base de Pacientes</h2>
            </div>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Buscar por nombre o dueño..." 
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
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Paciente</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Ficha Clínica</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Estado Pakuna</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Gestión</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {patients.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(patient => (
                <tr key={patient.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                            <img src={patient.photoURL || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=80&q=80"} className="w-12 h-12 rounded-2xl object-cover shadow-sm" />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-teal-500 border-2 border-white rounded-full" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-blue-900 leading-none mb-1">{patient.name}</span>
                            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{patient.species} • {patient.breed}</span>
                        </div>
                      </div>
                  </td>
                  <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-slate-600 font-medium">
                          <Calendar className="w-4 h-4 text-slate-300" />
                          <span>Ult. Visita: Mar 2026</span>
                      </div>
                  </td>
                  <td className="px-8 py-6">
                    {patient.status === 'safe' && <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest bg-teal-50 text-teal-700 border border-teal-100"><CheckCircle2 className="w-3.5 h-3.5" /> CERTIFICADO</span>}
                    {patient.status === 'lost' && <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest bg-amber-50 text-amber-700 border border-amber-100 animate-pulse"><AlertCircle className="w-3.5 h-3.5" /> EXTRAVIADO</span>}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <Button onClick={() => handleOpenVisitModal(patient)} className="bg-blue-900 border-none hover:bg-slate-800 text-xs py-2.5 px-6 rounded-xl font-black uppercase tracking-widest shadow-xl shadow-blue-900/10 active:scale-95 transition-all">
                      Nueva Atención
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Visit Modal */}
      <Modal isOpen={showVisitModal} onClose={() => setShowVisitModal(false)} title={`Atención Preventiva: ${selectedPatient?.name}`}>
        <form onSubmit={handleRegisterVisit} className="space-y-8">
             <div className="bg-blue-900 text-white p-6 rounded-[2rem] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10" />
                <h4 className="text-lg font-black mb-2 relative z-10">Validación Pakuna Health</h4>
                <p className="text-blue-100 text-sm font-medium relative z-10 leading-relaxed">
                    Al certificar esta atención, la credencial inteligente de {selectedPatient?.name} se actualizará globalmente y se programará el recordatorio automático para el dueño.
                </p>
             </div>

             <div className="space-y-6">
                 <div className="flex flex-col gap-2">
                   <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Tipo de Servicio</label>
                   <select 
                     className="px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-blue-900 font-black focus:outline-none focus:border-blue-900/20 focus:ring-4 focus:ring-blue-900/5 transition-all"
                     value={visitData.type}
                     onChange={(e) => setVisitData({...visitData, type: e.target.value})}
                   >
                     <option value="Vacuna">Vacunación Anual</option>
                     <option value="Control">Chequeo Preventivo</option>
                     <option value="Desparasitación">Tratamiento Parasitario</option>
                     <option value="Cirugía">Procedimiento Quirúrgico</option>
                   </select>
                 </div>

                 <Input 
                    label="Observaciones Médicas" 
                    placeholder="Contenido certificado para la bitácora..." 
                    value={visitData.description} 
                    onChange={e => setVisitData({...visitData, description: e.target.value})} 
                 />

                 <Input 
                    label="Próxima Cita Recomendada" 
                    type="date"
                    value={visitData.nextDueDate} 
                    onChange={e => setVisitData({...visitData, nextDueDate: e.target.value})} 
                    required
                 />
             </div>

             <Button type="submit" disabled={submittingVisit} className="w-full py-5 text-xl font-black bg-teal-600 hover:bg-teal-700 text-white border-none shadow-2xl shadow-teal-100 mt-4 h-auto">
                 {submittingVisit ? 'Certificando...' : 'Certificar Atención Médico'}
             </Button>
        </form>
      </Modal>

    </div>
  );
};

const MetricCard = ({ title, value, trend, icon }) => (
  <Card className="bg-white border-slate-50 p-8 flex flex-col hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 shadow-xl shadow-slate-100/50 rounded-[2.5rem] relative overflow-hidden group cursor-default">
    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl group-hover:bg-blue-900/5 transition-colors" />
    <div className="flex justify-between items-start mb-8 relative z-10">
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner group-hover:scale-110 group-hover:bg-white transition-all duration-500">
        {icon}
      </div>
      <div className="px-3 py-1.5 bg-teal-50 border border-teal-100 rounded-full">
         <span className="text-[10px] font-black tracking-widest uppercase text-teal-700">{trend}</span>
      </div>
    </div>
    <div className="mt-auto relative z-10">
      <p className="text-xs font-black text-slate-400 mb-2 uppercase tracking-[0.2em]">{title}</p>
      <h3 className="text-5xl font-black text-blue-900 tracking-tight">{value}</h3>
    </div>
  </Card>
);

export default VeterinaryDashboard;
