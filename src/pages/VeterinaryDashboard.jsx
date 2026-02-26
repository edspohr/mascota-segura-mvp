import React, { useState } from 'react';
import { useApp } from '../context';
import { Card, Button, Modal, Input } from '../components/ui/Components';
import Logo from '../components/ui/Logo';
import { Users, BellRing, TrendingUp, CheckCircle2, AlertCircle, PlusCircle, Activity, FileText } from 'lucide-react';

const VeterinaryDashboard = () => {
  const { user, veterinaryData, registerVisit, getPetById } = useApp();
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [showBitacoraModal, setShowBitacoraModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  const [visitData, setVisitData] = useState({
     type: 'Vacuna',
     description: '',
     nextDueDate: ''
  });

  const handleOpenVisitModal = (patient) => {
      setSelectedPatient(patient);
      const date = new Date();
      date.setMonth(date.getMonth() + 6);
      
      setVisitData({
          type: 'Control',
          description: 'Control sano general',
          nextDueDate: date.toISOString().split('T')[0]
      });
      setShowVisitModal(true);
  };

  const handleOpenBitacoraModal = (patient) => {
    // Needs full pet data to read logs
    const fullPet = getPetById(patient.id) || getPetById('p1'); // default to p1 for mock matching
    setSelectedPatient(fullPet);
    setShowBitacoraModal(true);
  }

  const handleRegisterVisit = (e) => {
      e.preventDefault();
      if(selectedPatient) {
          registerVisit(selectedPatient.id, visitData);
          setShowVisitModal(false);
      }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-50 tracking-tight flex items-center gap-3">
            <Logo className="w-10 h-10" /> Portal Clínico
          </h1>
          <p className="text-zinc-400 mt-2 text-lg">{user?.name} | Retención & Compliance Automatizado</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard 
          title="Tasa de Retención" 
          value={`${veterinaryData.retentionRate}%`} 
          trend="+5.2% vs mes anterior"
          icon={<TrendingUp className="w-7 h-7 text-emerald-400" />}
        />
        <MetricCard 
          title="Recordatorios Automatizados" 
          value={veterinaryData.upcomingReminders} 
          trend="Próximos 30 días"
          icon={<BellRing className="w-7 h-7 text-teal-400" />}
        />
        <MetricCard 
          title="Pacientes Activos (App)" 
          value="1,248" 
          trend="Estable"
          icon={<Users className="w-7 h-7 text-cyan-400" />}
        />
      </div>

      {/* Patients Table */}
      <div className="mt-12">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-50">Lista de Pacientes Activos</h2>
            <div className="text-sm font-semibold text-teal-400 bg-teal-500/10 px-4 py-2 rounded-lg border border-teal-500/20 cursor-pointer hover:bg-teal-500/20 transition-colors">Buscar / Filtrar...</div>
        </div>
        <Card className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800 shadow-xl overflow-x-auto p-0 rounded-3xl">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/50">
                <th className="p-6 text-xs font-bold text-zinc-500 uppercase tracking-widest">Mascota</th>
                <th className="p-6 text-xs font-bold text-zinc-500 uppercase tracking-widest">Dueño</th>
                <th className="p-6 text-xs font-bold text-zinc-500 uppercase tracking-widest">Última Visita</th>
                <th className="p-6 text-xs font-bold text-zinc-500 uppercase tracking-widest">Próximo Venc.</th>
                <th className="p-6 text-xs font-bold text-zinc-500 uppercase tracking-widest">Estado</th>
                <th className="p-6 text-xs font-bold text-zinc-500 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {veterinaryData.recentPatients.map(patient => (
                <tr key={patient.id} className="hover:bg-zinc-800/40 transition-colors group">
                  <td className="p-6 font-bold text-white text-base">
                      <span className="cursor-pointer hover:text-teal-400 transition-colors flex items-center gap-2" onClick={() => handleOpenBitacoraModal(patient)}>
                          {patient.petName}
                      </span>
                  </td>
                  <td className="p-6 text-zinc-400">{patient.ownerName}</td>
                  <td className="p-6 text-zinc-400 font-medium">{patient.lastVisit}</td>
                  <td className="p-6 text-zinc-300 font-bold">{patient.nextDue}</td>
                  <td className="p-6">
                    {patient.status === 'ok' && <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><CheckCircle2 className="w-3.5 h-3.5" /> AL DÍA</span>}
                    {patient.status === 'pending' && <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"><AlertCircle className="w-3.5 h-3.5 animate-pulse" /> POR VENCER</span>}
                    {patient.status === 'overdue' && <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20"><AlertCircle className="w-3.5 h-3.5" /> VENCIDO</span>}
                  </td>
                  <td className="p-6 text-right flex gap-2 justify-end">
                    <Button onClick={() => handleOpenBitacoraModal(patient)} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 text-xs py-2 px-3 rounded-lg flex items-center gap-2 font-bold opacity-70 group-hover:opacity-100 transition-opacity">
                      <FileText className="w-4 h-4" /> Bitácora
                    </Button>
                    <Button onClick={() => handleOpenVisitModal(patient)} className="bg-teal-600/10 hover:bg-teal-600/20 text-teal-400 border border-teal-600/30 text-xs py-2 px-3 rounded-lg flex items-center gap-2 font-bold opacity-80 group-hover:opacity-100 transition-all">
                      <PlusCircle className="w-4 h-4" /> Registrar Visita
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* Modal: Registrar Visita */}
      <Modal isOpen={showVisitModal} onClose={() => setShowVisitModal(false)} title={`Registrar Atención: ${selectedPatient?.petName}`}>
        <form onSubmit={handleRegisterVisit} className="space-y-6">
             <div className="bg-teal-500/10 border border-teal-500/20 p-5 rounded-xl text-sm text-teal-200/90 leading-relaxed font-medium">
                Al registrar esta visita, la Bitácora de {selectedPatient?.petName} y la App de {selectedPatient?.ownerName} se actualizarán al instante. Se programará un recordatorio automático.
             </div>

             <div className="flex flex-col gap-1 w-full">
               <label className="text-sm font-bold text-zinc-300">Tipo de Atención</label>
               <select 
                 className="px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-900 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all font-medium"
                 value={visitData.type}
                 onChange={(e) => setVisitData({...visitData, type: e.target.value})}
               >
                 <option value="Vacuna">Vacuna</option>
                 <option value="Control">Control Médico</option>
                 <option value="Desparasitación">Desparasitación</option>
                 <option value="Cirugía">Cirugía / Procedimiento</option>
               </select>
             </div>

             <Input 
                label="Descripción Médica (Opcional)" 
                placeholder="Ej: Quíntuple, todo OK" 
                value={visitData.description} 
                onChange={e => setVisitData({...visitData, description: e.target.value})} 
                className="bg-zinc-900 border-zinc-700 text-white" 
             />

             <Input 
                label="Fecha de Próximo Vencimiento/Visita (Genera un push automático)" 
                type="date"
                value={visitData.nextDueDate} 
                onChange={e => setVisitData({...visitData, nextDueDate: e.target.value})} 
                required
                className="bg-zinc-900 border-zinc-700 text-white font-mono" 
             />

             <div className="pt-2">
                 <Button type="submit" className="w-full py-4 text-lg font-bold bg-teal-600 hover:bg-teal-500 text-white border-none shadow-lg shadow-teal-900/40 rounded-xl">
                     Guardar en Bitácora y Notificar Dueño
                 </Button>
             </div>
        </form>
      </Modal>

      {/* Vet View: Bitacora Modal */}
      {showBitacoraModal && selectedPatient && (
          <VetBitacoraModal pet={selectedPatient} onClose={() => setShowBitacoraModal(false)} />
      )}

    </div>
  );
};

const VetBitacoraModal = ({ pet, onClose }) => {
    return (
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-zinc-950/80 backdrop-blur-sm p-0 md:p-4 animate-in fade-in duration-300">
         <div className="bg-zinc-900 border border-zinc-800 rounded-t-3xl md:rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 md:zoom-in-95 duration-300">
            
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50">
               <div className="flex items-center gap-3">
                 <img src={pet.photo || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=150&q=80"} className="w-10 h-10 rounded-full object-cover border border-zinc-700" alt={pet.name} />
                 <div>
                    <h3 className="font-bold text-lg text-white">Historia Clínica Colaborativa: {pet.name}</h3>
                    <p className="text-xs text-teal-400 flex items-center gap-1 font-medium"><Activity className="w-3 h-3" /> Ficha Verificada</p>
                 </div>
               </div>
               <button onClick={onClose} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-full text-zinc-400 hover:text-white transition-colors">
                 ✕
               </button>
            </div>
  
            <div className="p-6 overflow-y-auto flex-grow bg-zinc-950/30 space-y-8">
               
               {/* Vet Note: They can't post notes directly here in the MVP, only visits, so we only read logs. */}
               <div className="bg-blue-900/10 border border-blue-500/20 p-4 rounded-xl text-sm text-blue-300/80 mb-6 flex items-start gap-3">
                   <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-blue-500" />
                   <div>
                       <span className="font-bold">Vista de Perfil Médico.</span> Aquí puedes leer los comentarios y notas rápidas que el dueño de {pet.name} ha dejado, e interactuar de forma preventiva. Para agregar eventos clínicos legales, usa el botón "Registrar Visita".
                   </div>
               </div>
  
               {/* Timeline Feed */}
               <div className="relative pl-5 space-y-6 before:absolute before:inset-y-0 before:left-5 before:w-px before:bg-zinc-800">
                  {pet.logs?.length > 0 ? pet.logs.map(log => (
                    <div key={log.id} className="relative z-10 flex gap-4 animate-in slide-in-from-left-4 fade-in duration-500">
                      {/* Timeline Dot icon */}
                      <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center border-4 border-zinc-900 shadow-md ${log.type === 'Nota' ? 'bg-blue-500' : 'bg-emerald-500'}`}>
                         {log.type === 'Nota' ? <FileText className="w-3.5 h-3.5 text-white" /> : <Activity className="w-3.5 h-3.5 text-white" />}
                      </div>
                      {/* Content */}
                      <Card className="flex-grow p-4 bg-zinc-900/80 border-zinc-800 rounded-xl rounded-tl-none -mt-2">
                         <div className="flex justify-between items-start mb-2">
                           <div className="flex items-center gap-2">
                             <span className="font-bold text-sm text-slate-200">{log.authorName}</span>
                             <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${log.authorRole === 'veterinary' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
                               {log.authorRole === 'veterinary' ? 'Equipo Clínico' : 'Dueño/Familiar'}
                             </span>
                           </div>
                           <span className="text-xs text-zinc-500">{log.date}</span>
                         </div>
                         <p className="text-sm font-semibold text-teal-400 mb-1">{log.type}</p>
                         <p className="text-zinc-400 text-sm leading-relaxed">{log.content}</p>
                      </Card>
                    </div>
                  )) : (
                    <div className="text-center text-zinc-500 py-8 text-sm">
                      No hay eventos registrados para este paciente.
                    </div>
                  )}
               </div>
            </div>
         </div>
      </div>
    );
}

const MetricCard = ({ title, value, trend, icon }) => (
  <Card className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 p-8 flex flex-col hover:border-teal-500/30 transition-all duration-300 shadow-lg relative overflow-hidden group cursor-default">
    <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl group-hover:bg-teal-500/10 transition-colors" />
    <div className="flex justify-between items-start mb-6 relative z-10">
      <div className="p-3.5 bg-zinc-950 rounded-2xl border border-zinc-800/80 shadow-inner group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
      <span className="text-[10px] font-bold tracking-widest uppercase bg-zinc-950/80 text-zinc-500 px-3 py-1.5 rounded border border-zinc-800">{trend}</span>
    </div>
    <div className="mt-auto relative z-10">
      <p className="text-sm font-bold text-zinc-500 mb-2 uppercase tracking-wide">{title}</p>
      <h3 className="text-4xl font-extrabold text-white tracking-tight">{value}</h3>
    </div>
  </Card>
);

export default VeterinaryDashboard;
