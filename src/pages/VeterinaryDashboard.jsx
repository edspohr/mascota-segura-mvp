import React, { useState, useEffect } from 'react';
import { useApp } from '../context';
import { collection, query, getDocs, limit } from 'firebase/firestore';
import { db } from '../config/firebase';
import { addLog } from '../services/logs.service';
import { addEvent } from '../services/events.service';
import { Card, Button, Modal, Input } from '../components/ui/Components';
import Logo from '../components/ui/Logo';
import { Users, BellRing, TrendingUp, CheckCircle2, AlertCircle, Search, Calendar } from 'lucide-react';
import { MOCK_PATIENTS } from '../data/mockData';

const VeterinaryDashboard = () => {
  const { firebaseUser, profile, addToast, isDemo } = useApp();
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
      if (isDemo) {
        setPatients(MOCK_PATIENTS);
        setLoading(false);
        return;
      }
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
  }, [profile, isDemo]);

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
      if (!selectedPatient) return;

      if (isDemo) {
        addToast(`[DEMO] Atención certificada para ${selectedPatient.name} (simulado)`, 'success');
        setShowVisitModal(false);
        return;
      }

      if (!firebaseUser) return;
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
      <div className="w-12 h-12 border-4 border-[#008894] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const filteredPatients = patients.filter(p => 
    (p.name || p.petName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.ownerName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 pt-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <Logo className="w-14 h-14" />
          <div className="space-y-1">
            <h1 className="text-3xl lg:text-4xl font-black text-[#00457C] tracking-tight leading-none">Portal Especialista</h1>
            <p className="text-slate-500 font-medium text-lg">{profile?.name || 'Clínica Asociada'} • Verificación Médica</p>
          </div>
        </div>
        <div className="px-6 py-3 bg-teal-50 border border-teal-100 rounded-full flex items-center gap-3 shadow-sm">
            <span className="w-2.5 h-2.5 bg-[#008894] rounded-full animate-pulse shadow-[0_0_8px_rgba(0,136,148,0.5)]" />
            <span className="text-[10px] font-black uppercase text-[#008894] tracking-[0.2em]">Conexión Certificada</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <MetricCard 
          title="Salud Preventiva" 
          value="98.2%" 
          trend="+4.1%"
          icon={<TrendingUp className="w-6 h-6 text-[#008894]" />}
        />
        <MetricCard 
          title="Alertas Activas" 
          value="42" 
          trend="Próximos 7 días"
          icon={<BellRing className="w-6 h-6 text-amber-500" />}
        />
        <MetricCard 
          title="Pacientes Registrados" 
          value={patients.length} 
          trend="Historiales Activos"
          icon={<Users className="w-6 h-6 text-[#00457C]" />}
        />
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-950/[0.03] border border-slate-100 overflow-hidden">
        <div className="p-10 border-b border-slate-50 flex flex-col lg:flex-row justify-between lg:items-center gap-8 bg-slate-50/10">
            <div className="flex items-center gap-5">
                <div className="p-4 bg-[#00457C] rounded-2xl shadow-lg shadow-blue-900/10">
                    <Users className="w-7 h-7 text-white" />
                </div>
                <div>
                   <h2 className="text-2xl font-black text-[#00457C] tracking-tight leading-none">Gestión de Pacientes</h2>
                   <p className="text-slate-400 font-bold text-[10px] mt-1.5 uppercase tracking-widest leading-none">Directorio Clínico Digital</p>
                </div>
            </div>
            <div className="relative w-full lg:w-96 group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#008894] transition-colors" />
              <input 
                type="text" 
                placeholder="Nombre de mascota o propietario..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl pl-16 pr-6 py-4 text-sm text-[#00457C] shadow-sm focus:ring-8 focus:ring-blue-900/5 focus:border-[#00457C]/20 transition-all outline-none placeholder:text-slate-300 font-medium"
              />
            </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/30">
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Paciente</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Última Atención</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Estatus Ficha</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredPatients.length > 0 ? filteredPatients.map(patient => (
                <tr key={patient.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-10 py-8">
                      <div className="flex items-center gap-6">
                        <div className="relative">
                            <img src={patient.photoURL || patient.petPhotoURL || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=80&q=80"} className="w-14 h-14 rounded-2xl object-cover shadow-2xl shadow-blue-900/10 border-2 border-white" />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#008894] border-2 border-white rounded-full shadow-sm" />
                        </div>
                        <div className="flex flex-col space-y-1">
                            <span className="font-black text-[#00457C] text-lg tracking-tight leading-none">{patient.name || patient.petName}</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">{patient.species || patient.petSpecies} • {patient.breed || patient.petBreed}</span>
                        </div>
                      </div>
                  </td>
                  <td className="px-10 py-8 text-slate-600 font-medium">
                      <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-slate-200" />
                          <span className="text-sm font-semibold text-slate-500">
                             {patient.lastVisit || 'Revisión Reciente'}
                          </span>
                      </div>
                  </td>
                  <td className="px-10 py-8">
                    {(patient.status === 'safe' || patient.compliance >= 80) && (
                      <span className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full text-[9px] font-black tracking-widest bg-teal-50 text-[#008894] border border-teal-100 shadow-sm">
                        <CheckCircle2 className="w-4 h-4 fill-current" /> COMPLETADO
                      </span>
                    )}
                    {(patient.status === 'lost' || (patient.compliance < 80 && patient.compliance > 0)) && (
                      <span className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full text-[9px] font-black tracking-widest bg-amber-50 text-amber-600 border border-amber-100 shadow-sm">
                        <AlertCircle className="w-4 h-4" /> PENDIENTE
                      </span>
                    )}
                    {!patient.status && !patient.compliance && (
                      <span className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full text-[9px] font-black tracking-widest bg-slate-50 text-slate-400 border border-slate-100 uppercase">Sin Historial</span>
                    )}
                  </td>
                  <td className="px-10 py-8 text-right">
                    <Button onClick={() => handleOpenVisitModal(patient)} className="bg-[#00457C] hover:bg-slate-800 text-[10px] py-4 px-8 rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-blue-900/10 active:scale-95 transition-all">
                      Nueva Atención
                    </Button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="px-10 py-24 text-center">
                    <p className="text-slate-300 font-black italic uppercase tracking-widest text-sm opacity-50">No hay pacientes que coincidan con la búsqueda.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Visit Modal */}
      <Modal isOpen={showVisitModal} onClose={() => setShowVisitModal(false)} title={`Certificación de Atención`}>
        <form onSubmit={handleRegisterVisit} className="space-y-10">
             <div className="bg-[#00457C] text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-1000" />
                <div className="relative z-10 flex items-center gap-6 mb-4">
                   <div className="w-16 h-16 rounded-[1.5rem] bg-white/10 flex items-center justify-center backdrop-blur-sm">
                      <ShieldCheck className="w-10 h-10 text-white" />
                   </div>
                   <h4 className="text-2xl font-black tracking-tight leading-tight">Certificación Pakuna</h4>
                </div>
                <p className="text-blue-100 text-base font-medium relative z-10 leading-relaxed max-w-sm">
                    Estás por registrar una atención para <span className="font-black text-white">{selectedPatient?.name || selectedPatient?.petName}</span>. 
                    El dueño recibirá una notificación automática.
                </p>
             </div>

             <div className="space-y-8">
                 <div className="flex flex-col gap-3">
                   <label className="text-[10px] font-black text-[#00457C] uppercase tracking-[0.2em] ml-2 opacity-60">Tipo de Prestación Médica</label>
                   <select 
                     className="px-6 py-5 rounded-2xl border-2 border-slate-100 bg-slate-50 text-[#00457C] font-black focus:outline-none focus:border-[#008894] focus:ring-8 focus:ring-teal-500/5 transition-all text-base appearance-none cursor-pointer"
                     value={visitData.type}
                     onChange={(e) => setVisitData({...visitData, type: e.target.value})}
                   >
                     <option value="Vacuna">Vacunación (Anual/Refuerzo)</option>
                     <option value="Control">Prevención y Chequeo</option>
                     <option value="Desparasitación">Profilaxis Parasitaria</option>
                     <option value="Cirugía">Intervención Quirúrgica</option>
                     <option value="Otro">Consulta Especializada</option>
                   </select>
                 </div>

                 <Input 
                    label="Observaciones y Diagnóstico" 
                    placeholder="Describe brevemente la atención realizada..." 
                    value={visitData.description} 
                    onChange={e => setVisitData({...visitData, description: e.target.value})} 
                 />

                 <Input 
                    label="Fecha de Próximo Recordatorio" 
                    type="date"
                    value={visitData.nextDueDate} 
                    onChange={e => setVisitData({...visitData, nextDueDate: e.target.value})} 
                    required
                 />
             </div>

             <Button type="submit" disabled={submittingVisit} className="w-full py-7 text-xl font-black bg-[#008894] hover:bg-teal-700 text-white border-none shadow-2xl shadow-teal-900/30 rounded-[2rem] active:scale-95 transition-all flex justify-center">
                 {submittingVisit ? 'Certificando en Red...' : 'Finalizar y Notificar'}
             </Button>
        </form>
      </Modal>

    </div>
  );
};

const MetricCard = ({ title, value, trend, icon }) => (
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
    <div className="mt-auto relative z-10">
      <p className="text-[10px] font-black text-slate-400 mb-2 uppercase tracking-[0.3em] leading-none">{title}</p>
      <h3 className="text-5xl lg:text-6xl font-black text-[#00457C] tracking-tight leading-none">{value}</h3>
    </div>
  </Card>
);

export default VeterinaryDashboard;
