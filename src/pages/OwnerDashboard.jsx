import React, { useState } from 'react';
import { useApp } from '../context';
import { usePets } from '../hooks/usePets';
import { useActiveCampaigns } from '../hooks/useCampaigns';
import { usePetLogs } from '../hooks/usePetLogs';
import { createPet, updatePetStatus, updatePet } from '../services/pets.service';
import { uploadPetPhoto } from '../services/storage.service';
import { addLog } from '../services/logs.service';
import { Card, Button, Modal, Input } from '../components/ui/Components';
import Logo from '../components/ui/Logo';
import { ShieldCheck, Activity, Gift, ChevronRight, AlertTriangle, Plus, Copy, Check, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MOCK_PETS, MOCK_CAMPAIGNS, MOCK_LOGS } from '../data/mockData';

const OwnerDashboard = () => {
  const { firebaseUser, profile, addToast, isDemo } = useApp();
  const { pets: realPets, loading: loadingPets } = usePets(firebaseUser?.uid);
  const { campaignsValue: realCampaigns } = useActiveCampaigns();
  
  // Use mock data if in demo mode
  const pets = isDemo ? MOCK_PETS : realPets;
  const campaigns = isDemo ? MOCK_CAMPAIGNS : (realCampaigns || []);

  const [showAddPetModal, setShowAddPetModal] = useState(false);
  const [newPet, setNewPet] = useState({ name: '', species: 'Perro', breed: '', age: '', weight: '', funFact: '', medicalAlerts: '' });
  const [photoFile, setPhotoFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleAddPet = async (e) => {
    e.preventDefault();
    if (isDemo) {
      addToast(`[DEMO] ${newPet.name} registrado con éxito (simulado)`, 'success');
      setShowAddPetModal(false);
      return;
    }
    if (!firebaseUser) return;
    setSubmitting(true);
    try {
      const petId = await createPet(firebaseUser.uid, newPet);
      if (photoFile) {
        const photoURL = await uploadPetPhoto(petId, photoFile);
        await updatePet(petId, { photoURL });
      }
      addToast(`¡Bienvenido ${newPet.name}! Su ficha está lista.`, 'success');
      setShowAddPetModal(false);
      setNewPet({ name: '', species: 'Perro', breed: '', age: '', weight: '', funFact: '', medicalAlerts: '' });
      setPhotoFile(null);
    } catch (err) {
      addToast('Tuvimos un problema al registrar la mascota. Intenta de nuevo.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingPets && !isDemo) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-[#008894] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pt-8">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black text-[#00457C] tracking-tight">
            Hola, {profile?.name?.split(' ')[0] || 'Dueño'} 👋
          </h1>
          <p className="text-slate-500 mt-3 text-lg font-medium">Gestionar el bienestar de tus amigos nunca fue tan fácil.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center space-x-3 bg-teal-50 text-[#008894] px-6 py-3 rounded-full border border-teal-100 shadow-sm">
            <ShieldCheck className="w-5 h-5 fill-current" />
            <span className="text-[10px] font-black tracking-[0.2em] uppercase">Mascotas Protegidas</span>
          </div>
          <Button onClick={() => setShowAddPetModal(true)} className="bg-[#00457C] hover:bg-slate-800 text-white font-black flex items-center gap-3 px-8 py-6 h-auto rounded-[1.5rem] shadow-xl shadow-blue-900/10">
            <Plus className="w-6 h-6" /> Registrar Mascota
          </Button>
        </div>
      </div>

      {/* Pet ID Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {(pets && pets.length > 0) ? (
          pets.map(pet => (
            <PetIDCard key={pet.id} pet={pet} />
          ))
        ) : (
          <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm">
             <div className="p-8 bg-slate-50 rounded-full w-max mx-auto mb-8 border border-slate-100">
                <ShieldCheck className="w-16 h-16 text-slate-300" />
             </div>
             <h3 className="text-3xl font-black text-[#00457C] mb-4">Comienza el viaje</h3>
             <p className="text-slate-500 mb-10 font-medium max-w-sm mx-auto leading-relaxed">Registra a tu primer compañero para activar su Ficha Digital Inteligente.</p>
             <Button onClick={() => setShowAddPetModal(true)} className="bg-[#008894] hover:bg-teal-700 px-12 py-5 rounded-[2rem] text-xl">
               Empezar ahora
             </Button>
          </div>
        )}
      </div>

      {/* Benefits Section */}
      <div className="mt-20 pt-16 border-t border-slate-100">
        <div className="flex items-center gap-6 mb-12">
          <div className="p-5 rounded-[1.5rem] bg-amber-50 border border-amber-100 shadow-sm">
            <Gift className="w-8 h-8 text-amber-500" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-[#00457C] tracking-tight">Beneficios Pakuna</h2>
            <p className="text-slate-500 font-medium text-sm mt-1">Acuerdos exclusivos para el cuidado de tu mascota.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {(campaigns || []).map(campaign => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      </div>

      {/* Add Pet Modal */}
      <Modal isOpen={showAddPetModal} onClose={() => setShowAddPetModal(false)} title="Nueva Mascota">
        <form onSubmit={handleAddPet} className="space-y-8">
             <Input label="Nombre" placeholder="¿Cómo se llama tu mascota?" value={newPet.name} onChange={e => setNewPet({...newPet, name: e.target.value})} required />
             <div className="grid grid-cols-2 gap-6">
                 <Input label="Especie" placeholder="Ej: Perro" value={newPet.species} onChange={e => setNewPet({...newPet, species: e.target.value})} required />
                 <Input label="Raza" placeholder="Ej: Beagle" value={newPet.breed} onChange={e => setNewPet({...newPet, breed: e.target.value})} required />
             </div>
             <div className="grid grid-cols-2 gap-6">
                 <Input label="Edad" type="number" placeholder="Años" value={newPet.age} onChange={e => setNewPet({...newPet, age: e.target.value})} required />
                 <Input label="Peso" placeholder="Ej: 12kg" value={newPet.weight} onChange={e => setNewPet({...newPet, weight: e.target.value})} required />
             </div>
             <div>
               <Input 
                 label="Dato curioso" 
                 placeholder="Ej: Le encanta perseguir palomas" 
                 value={newPet.funFact} 
                 onChange={e => setNewPet({...newPet, funFact: e.target.value.slice(0, 120)})} 
               />
               <p className="text-[10px] text-slate-400 mt-2 ml-1 font-bold uppercase tracking-widest opacity-60">Visible en el perfil público</p>
             </div>
             <div>
                <label className="text-sm font-black text-[#00457C] ml-1 mb-2 block uppercase tracking-wider opacity-80">Alertas médicas (Confidencial)</label>
                <textarea 
                  placeholder="Ej: Alérgico a ciertos medicamentos. Esta info solo es visible en casos de emergencia." 
                  value={newPet.medicalAlerts} 
                  onChange={e => setNewPet({...newPet, medicalAlerts: e.target.value.slice(0, 300)})} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] px-5 py-4 text-sm text-[#00457C] focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-[#008894] transition-all min-h-[120px] placeholder:text-slate-300"
                />
                <p className="text-[10px] text-slate-400 mt-2 ml-1 font-bold italic">⚠️ Solo accesible por especialistas médicos certificados.</p>
             </div>
             <div className="p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100">
               <label className="text-sm font-black text-[#00457C] mb-4 block uppercase tracking-wider opacity-80 text-center">Foto del Perfil</label>
               <input 
                 type="file" 
                 accept="image/*" 
                 onChange={e => setPhotoFile(e.target.files[0] || null)}
                 className="w-full text-xs text-slate-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:bg-[#008894] file:text-white file:font-black file:uppercase file:tracking-widest file:cursor-pointer hover:file:bg-teal-700 transition-all font-bold"
               />
             </div>
             <Button type="submit" disabled={submitting} className="w-full mt-10 bg-[#00457C] hover:bg-slate-800 py-6 text-xl font-black rounded-[2rem] shadow-2xl shadow-blue-900/20">
                 {submitting ? 'Creando Ficha...' : 'Activar Ficha Digital'}
             </Button>
        </form>
      </Modal>

    </div>
  );
};

const PetIDCard = ({ pet }) => {
  const { addToast, isDemo } = useApp();
  const compliance = pet.compliance || 100;
  const isLost = pet.status === 'lost';
  const [copied, setCopied] = useState(false);
  const [showBitacora, setShowBitacora] = useState(false);

  const publicUrl = `${window.location.origin}/p/${pet.slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast('Enlace de ficha copiado', 'success');
  };

  const handleToggleStatus = async () => {
    if (isDemo) {
      addToast(`[DEMO] Estado cambiado (simulado)`, 'info');
      return;
    }
    try {
      const newStatus = isLost ? 'safe' : 'lost';
      await updatePetStatus(pet.id, newStatus);
      addToast(isLost ? '¡Qué bueno que está a salvo!' : 'Alerta activa. Tranquilo, estamos contigo.', isLost ? 'success' : 'warning');
    } catch {
      addToast('Error al actualizar el estado', 'error');
    }
  };

  return (
    <>
      <Card className={`bg-white transition-all duration-700 border overflow-hidden relative group p-0 rounded-[3rem] shadow-xl shadow-slate-950/[0.03] ${isLost ? 'border-amber-200' : 'border-slate-100 hover:border-[#008894]/30 hover:shadow-2xl hover:shadow-teal-900/5'}`}>
        
        {isLost && <div className="absolute inset-0 bg-amber-400/5 animate-pulse pointer-events-none" />}

        {/* Top Header Card */}
        <div className="h-32 w-full relative bg-slate-50 overflow-hidden">
          <img src={pet.photoURL || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=500&q=80"} alt={pet.name} className="w-full h-full object-cover opacity-10 blur-md grayscale" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white to-transparent" />
        </div>

        <div className="px-10 pb-10 pt-0 relative -mt-16">
          <div className="flex justify-between items-end mb-8 relative z-10 w-full">
            <div className={`p-1.5 rounded-[2rem] transition-all duration-500 ${isLost ? 'bg-amber-100' : 'bg-white shadow-2xl shadow-blue-900/10'}`}>
                <img 
                src={pet.photoURL || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=500&q=80"} 
                alt={pet.name} 
                className="w-32 h-32 rounded-[1.5rem] object-cover cursor-pointer hover:scale-105 transition-transform"
                onClick={() => setShowBitacora(true)}
                />
            </div>
            
            <button 
                onClick={handleToggleStatus}
                className={`flex items-center gap-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] h-12 px-6 transition-all border-2 ${isLost ? 'bg-[#008894] border-[#008894] text-white shadow-lg shadow-teal-500/30' : 'border-amber-400 text-amber-600 hover:bg-amber-50'}`}
              >
                {isLost ? <ShieldCheck className="w-4 h-4 fill-current" /> : <AlertTriangle className="w-4 h-4" />}
                {isLost ? "Recuperado" : "Reportar Extravío"}
            </button>
          </div>

          <div className="mb-8 flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="text-3xl font-black text-[#00457C] tracking-tight flex items-center gap-3 cursor-pointer hover:text-[#008894] transition-colors" onClick={() => setShowBitacora(true)}>
                  {pet.name} <ChevronRight className="w-5 h-5 text-slate-200 mt-1" />
                </h3>
                <p className="text-slate-400 font-bold text-[10px] tracking-[0.2em] uppercase">{pet.species} • {pet.breed}</p>
              </div>
              {!isLost && (
                <div className="bg-teal-50 text-[#008894] px-5 py-3 rounded-2xl border border-teal-100 flex flex-col items-center justify-center shadow-sm">
                  <Activity className="w-6 h-6 mb-1.5" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em]">Salud Óptima</span>
                </div>
              )}
          </div>

          {/* QR Area */}
          <div className="mb-10 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-between group/qr hover:bg-white hover:shadow-xl transition-all duration-500">
              <div className="overflow-hidden">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5 flex items-center gap-2">
                    <Logo className="w-3.5 h-3.5 opacity-50" /> Ficha Pública
                  </p>
                  <p className="text-[13px] text-[#008894] font-bold truncate w-40">pakuna.health/p/{pet.slug}</p>
              </div>
              <div className="flex gap-3">
                  <button onClick={handleCopy} className="p-4 bg-white text-slate-400 hover:text-[#00457C] rounded-2xl transition-all border border-slate-100 shadow-sm active:scale-90 group-hover/qr:border-[#008894]/20">
                      {copied ? <Check className="w-5 h-5 text-teal-600" /> : <Copy className="w-5 h-5" />}
                  </button>
                  <Link to={`/p/${pet.slug}`} target="_blank" className="p-4 bg-[#00457C] hover:bg-slate-800 text-white rounded-2xl shadow-xl transition-all active:scale-95">
                      <ChevronRight className="w-5 h-5" />
                  </Link>
              </div>
          </div>

          {/* Health Summary Link */}
          <button 
            onClick={() => setShowBitacora(true)}
            className={`w-full p-6 rounded-[2rem] border-2 flex items-center justify-between transition-all group/bit ${compliance >= 100 ? 'bg-teal-50/20 border-teal-50 hover:border-teal-100' : 'bg-amber-50/20 border-amber-50 hover:border-amber-100'}`}
          >
            <div className="flex flex-col items-start gap-3 w-full mr-6">
              <div className="flex justify-between items-center w-full">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 group-hover/bit:text-[#008894]">
                  <FileText className="w-4 h-4" /> 
                  Esquema de Salud
                </span>
                <span className={`text-[10px] font-black tracking-widest ${compliance >= 100 ? 'text-[#008894]' : 'text-amber-600'}`}>
                  {compliance}% COMPLETADO
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden shadow-inner flex">
                <div className={`h-full rounded-full transition-all duration-1000 ${compliance >= 100 ? 'bg-[#008894]' : 'bg-amber-500'}`} style={{ width: `${compliance}%` }}></div>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-slate-200 group-hover/bit:text-[#008894] group-hover/bit:translate-x-1 transition-all" />
          </button>
        </div>
      </Card>
      
      {showBitacora && <BitacoraModal pet={pet} onClose={() => setShowBitacora(false)} />}
    </>
  );
};

const BitacoraModal = ({ pet, onClose }) => {
  const { firebaseUser, profile, addToast, isDemo } = useApp();
  const { logs: realLogs } = usePetLogs(pet.id);
  const [newNote, setNewNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Use mock logs if in demo mode
  const logs = isDemo ? (MOCK_LOGS[pet.id] || []) : realLogs;

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    
    if (isDemo) {
      addToast(`[DEMO] Tu nota ha sido guardada con cariño.`, 'success');
      setNewNote('');
      return;
    }

    if (!firebaseUser) return;
    setSubmitting(true);
    try {
      await addLog(pet.id, { type: 'Nota', content: newNote }, { uid: firebaseUser.uid, name: profile.name, role: profile.role });
      setNewNote('');
      addToast('Nota compartida con éxito', 'success');
    } catch {
      addToast('No pudimos guardar la nota. Intenta de nuevo por favor.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-[#00457C]/20 backdrop-blur-md p-0 md:p-6 animate-in fade-in duration-500">
       <div className="bg-white rounded-t-[3rem] md:rounded-[3.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-12 md:zoom-in-95 duration-500">
          
          <div className="p-8 md:p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
             <div className="flex items-center gap-4 md:gap-6 text-left">
               <img src={pet.photoURL || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=500&q=80"} className="w-16 h-16 rounded-[1.5rem] object-cover shadow-2xl shadow-blue-900/10 border-2 border-white" alt={pet.name} />
               <div>
                  <h3 className="font-black text-2xl text-[#00457C] tracking-tight">Bitácora Médica: {pet.name}</h3>
                  <p className="text-[10px] text-[#008894] flex items-center gap-2 font-black uppercase tracking-[0.2em] mt-1"><ShieldCheck className="w-4 h-4 fill-current" /> Ficha Oficial Protegida</p>
               </div>
             </div>
             <button onClick={onClose} className="p-4 bg-white hover:bg-slate-50 rounded-full text-slate-300 hover:text-[#00457C] transition-all border border-slate-100 shadow-sm">
               <span className="text-2xl leading-none">✕</span>
             </button>
          </div>

          <div className="p-8 md:p-10 overflow-y-auto flex-grow space-y-12">
             <form onSubmit={handleAddNote} className="flex gap-6">
               <div className="w-14 h-14 rounded-2xl bg-slate-100 shrink-0 flex items-center justify-center overflow-hidden border border-slate-200">
                  {profile?.avatar ? <img src={profile.avatar} className="w-full h-full object-cover" /> : <div className="text-slate-300 text-xl font-bold">🐶</div>}
               </div>
               <div className="flex-grow flex flex-col gap-4">
                 <textarea 
                    placeholder="Escribe algo sobre la salud de tu mascota..." 
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] p-6 text-sm text-[#00457C] focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-[#008894] transition-all resize-none min-h-[140px] placeholder:text-slate-300"
                 />
                 <div className="flex justify-end">
                    <Button type="submit" disabled={!newNote.trim() || submitting} className="bg-[#008894] hover:bg-teal-700 text-white font-black py-4 px-10 rounded-[1.5rem] shadow-xl shadow-teal-900/20">
                      {submitting ? 'Guardando...' : 'Publicar Nota'}
                    </Button>
                 </div>
               </div>
             </form>

             <div className="relative pl-6 space-y-10 before:absolute before:inset-y-0 before:left-6 before:w-[2px] before:bg-slate-100">
                {logs && logs.length > 0 ? logs.map(log => (
                  <div key={log.id} className="relative z-10 flex gap-8 animate-in slide-in-from-left-6 fade-in duration-700">
                    <div className={`w-12 h-12 rounded-[1.25rem] shrink-0 flex items-center justify-center shadow-xl ring-8 ring-white ${log.authorRole === 'veterinary' ? 'bg-[#008894]' : 'bg-[#00457C]'}`}>
                       {log.authorRole === 'veterinary' ? <Activity className="w-6 h-6 text-white" /> : <FileText className="w-6 h-6 text-white" />}
                    </div>
                    <div className="flex-grow p-8 bg-slate-50 rounded-[2.5rem] rounded-tl-none border border-slate-100 shadow-sm">
                       <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-6">
                         <div className="flex flex-col">
                           <span className="font-black text-[#00457C] text-lg tracking-tight leading-none">{log.authorName}</span>
                           <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest w-fit mt-2 ${log.authorRole === 'veterinary' ? 'bg-teal-100 text-[#008894]' : 'bg-blue-100 text-[#00457C]'}`}>
                             {log.authorRole === 'veterinary' ? 'Especialista Verificado' : 'Propietario'}
                           </span>
                         </div>
                         <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-slate-50 shadow-sm shrink-0">
                           {log.date || (log.createdAt?.seconds ? new Date(log.createdAt.seconds * 1000).toLocaleDateString('es-ES', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Reciente')}
                         </span>
                       </div>
                       <p className="text-[10px] font-black text-[#008894] mb-3 uppercase tracking-[0.2em]">{log.type}</p>
                       <p className="text-[#00457C] text-[15px] leading-relaxed font-medium">{log.content}</p>
                    </div>
                  </div>
                )) : (
                  <div className="text-center text-slate-300 py-16 font-black italic uppercase tracking-widest text-[10px] opacity-40">
                    Tu bitácora está tranquila hoy.
                  </div>
                )}
             </div>
          </div>
       </div>
    </div>
  );
}

const CampaignCard = ({ campaign }) => (
  <Card className="bg-white border-slate-100 flex overflow-hidden group hover:border-[#008894]/20 hover:shadow-2xl hover:shadow-teal-900/5 transition-all duration-700 cursor-pointer p-0 rounded-[2.5rem] shadow-xl shadow-slate-950/[0.02]">
    <div className="w-1/3 overflow-hidden relative">
      <img src={campaign.imageURL || "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80"} alt={campaign.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
    <div className="w-2/3 p-8 flex flex-col justify-center text-left">
      <p className="text-[9px] font-black tracking-[0.3em] text-[#008894] mb-3 uppercase opacity-60">{campaign.partnerName}</p>
      <h4 className="text-2xl font-black text-[#00457C] mb-3 leading-tight tracking-tight">{campaign.title}</h4>
      <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-2">{campaign.description}</p>
      <div className="mt-8 flex items-center text-[10px] font-black text-[#00457C] group-hover:text-[#008894] transition-colors uppercase tracking-[0.2em]">
        Saber Más <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  </Card>
);

export default OwnerDashboard;
