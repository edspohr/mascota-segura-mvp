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
      addToast(`¡${newPet.name} registrado con éxito!`, 'success');
      setShowAddPetModal(false);
      setNewPet({ name: '', species: 'Perro', breed: '', age: '', weight: '', funFact: '', medicalAlerts: '' });
      setPhotoFile(null);
    } catch (err) {
      addToast('Error al registrar mascota: ' + err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingPets && !isDemo) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-[#00457C] tracking-tight">
            Hola, {profile?.name?.split(' ')[0] || 'Dueño'} 👋
          </h1>
          <p className="text-slate-500 mt-2 text-lg font-medium">Gestiona la salud preventiva de tus amigos.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center space-x-2 bg-teal-50 text-teal-700 px-5 py-2.5 rounded-full border border-teal-100 shadow-sm">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-sm font-black tracking-widest uppercase">Protegidos</span>
          </div>
          <Button onClick={() => setShowAddPetModal(true)} className="bg-[#00457C] hover:bg-slate-800 text-white font-bold flex items-center gap-2 px-6 py-6 h-auto rounded-2xl shadow-xl shadow-blue-900/10">
            <Plus className="w-6 h-6" /> Nueva Mascota
          </Button>
        </div>
      </div>

      {/* Pet ID Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {(pets && pets.length > 0) ? (
          pets.map(pet => (
            <PetIDCard key={pet.id} pet={pet} />
          ))
        ) : (
          <div className="col-span-full py-24 text-center bg-white rounded-[2rem] border-2 border-dashed border-slate-200 shadow-inner">
             <div className="p-6 bg-slate-50 rounded-full w-max mx-auto mb-8">
                <ShieldCheck className="w-12 h-12 text-slate-300" />
             </div>
             <h3 className="text-2xl font-bold text-slate-800 mb-2">Comienza el viaje</h3>
             <p className="text-slate-500 mb-8 font-medium max-w-sm mx-auto">Registra tu primera mascota para activar su Credencial Médica Inteligente.</p>
             <Button onClick={() => setShowAddPetModal(true)} className="bg-teal-600 hover:bg-teal-700 px-10">
               Empezar ahora
             </Button>
          </div>
        )}
      </div>

      {/* Benefits Section */}
      <div className="mt-16 pt-12 border-t border-slate-100">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-[1.25rem] bg-amber-50 border border-amber-100 shadow-sm">
              <Gift className="w-8 h-8 text-amber-500" />
            </div>
            <h2 className="text-3xl font-extrabold text-[#00457C]">Beneficios Pakuna</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {(campaigns || []).map(campaign => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      </div>

      {/* Add Pet Modal */}
      <Modal isOpen={showAddPetModal} onClose={() => setShowAddPetModal(false)} title="Registrar Mascota">
        <form onSubmit={handleAddPet} className="space-y-6">
             <Input label="Nombre de la Mascota" placeholder="Ej: Max" value={newPet.name} onChange={e => setNewPet({...newPet, name: e.target.value})} required />
             <div className="grid grid-cols-2 gap-4">
                 <Input label="Especie" placeholder="Ej: Perro" value={newPet.species} onChange={e => setNewPet({...newPet, species: e.target.value})} required />
                 <Input label="Raza" placeholder="Ej: Beagle" value={newPet.breed} onChange={e => setNewPet({...newPet, breed: e.target.value})} required />
             </div>
             <div className="grid grid-cols-2 gap-4">
                 <Input label="Edad (Media)" type="number" placeholder="Ej: 2" value={newPet.age} onChange={e => setNewPet({...newPet, age: e.target.value})} required />
                 <Input label="Peso (Aprox)" placeholder="Ej: 12kg" value={newPet.weight} onChange={e => setNewPet({...newPet, weight: e.target.value})} required />
             </div>
             <div>
               <Input 
                 label="Dato curioso" 
                 placeholder="Ej: Le encanta perseguir palomas" 
                 value={newPet.funFact} 
                 onChange={e => setNewPet({...newPet, funFact: e.target.value.slice(0, 120)})} 
               />
               <p className="text-[10px] text-slate-400 mt-1 ml-1 font-medium">Max 120 caracteres. Visible en el perfil público.</p>
             </div>
             <div>
                <label className="text-sm font-bold text-slate-600 ml-1 mb-2 block">Alertas médicas</label>
                <textarea 
                  placeholder="Ej: Alérgico a ibuprofeno. Solo para uso veterinario/emergencias." 
                  value={newPet.medicalAlerts} 
                  onChange={e => setNewPet({...newPet, medicalAlerts: e.target.value.slice(0, 300)})} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 active:border-teal-500 transition-all min-h-[100px]"
                />
                <p className="text-[10px] text-slate-400 mt-1 ml-1 font-medium italic">⚠️ Solo visible cuando la mascota está en Modo Perdido.</p>
             </div>
             <div>
               <label className="text-sm font-bold text-slate-600 ml-1 mb-2 block">Foto del Perfil</label>
               <input 
                 type="file" 
                 accept="image/*" 
                 onChange={e => setPhotoFile(e.target.files[0] || null)}
                 className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-500 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-teal-600 file:text-white file:font-bold"
               />
             </div>
             <Button type="submit" disabled={submitting} className="w-full mt-6 bg-[#00457C] hover:bg-slate-800 py-4 text-xl font-bold shadow-xl shadow-blue-900/10">
                 {submitting ? 'Creando Ficha...' : 'Activar Credencial Pakuna'}
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
    addToast('Enlace copiado al portapapeles', 'info');
  };

  const handleToggleStatus = async () => {
    if (isDemo) {
      addToast(`[DEMO] Estado cambiado a: ${isLost ? 'Seguro' : 'Extraviado'} (simulado)`, 'info');
      return;
    }
    try {
      const newStatus = isLost ? 'safe' : 'lost';
      await updatePetStatus(pet.id, newStatus);
      addToast(isLost ? 'Mascota reportada como segura' : 'Alerta de extravío activada', isLost ? 'success' : 'warning');
    } catch {
      addToast('Error al actualizar el estado', 'error');
    }
  };

  return (
    <>
      <Card className={`bg-white transition-all duration-500 border-2 overflow-hidden relative group p-0 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 ${isLost ? 'border-amber-500' : 'border-white hover:border-teal-100 hover:shadow-teal-900/5'}`}>
        
        {isLost && <div className="absolute inset-0 bg-amber-500/5 animate-pulse pointer-events-none" />}

        {/* Top Header Card */}
        <div className="h-32 w-full relative bg-slate-50">
          <img src={pet.photoURL || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=500&q=80"} alt={pet.name} className="w-full h-full object-cover opacity-20 blur-sm grayscale" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
        </div>

        <div className="px-8 pb-8 pt-0 relative -mt-20">
          <div className="flex justify-between items-end mb-6 relative z-10 w-full">
            <div className={`p-1 rounded-[1.75rem] ${isLost ? 'bg-amber-100' : 'bg-white shadow-xl'}`}>
                <img 
                src={pet.photoURL || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=500&q=80"} 
                alt={pet.name} 
                className="w-32 h-32 rounded-2xl object-cover cursor-pointer hover:scale-105 transition-transform"
                onClick={() => setShowBitacora(true)}
                />
            </div>
            
            <Button 
                onClick={handleToggleStatus}
                variant={isLost ? "primary" : "outline"}
                className={`flex items-center gap-2 rounded-2xl text-[10px] font-black uppercase tracking-widest h-10 px-4 transition-all ${isLost ? 'bg-teal-600 hover:bg-teal-700 text-white' : 'border-amber-500 text-amber-600 hover:bg-amber-50 border-2'}`}
              >
                {isLost ? <ShieldCheck className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                {isLost ? "Recuperado" : "Reportar Extravío"}
            </Button>
          </div>

          <div className="mb-6 flex justify-between items-start">
              <div>
                <h3 className="text-3xl font-black text-blue-900 tracking-tight flex items-center gap-2 cursor-pointer hover:text-teal-600 transition-colors" onClick={() => setShowBitacora(true)}>
                  {pet.name} <ChevronRight className="w-6 h-6 text-slate-200" />
                </h3>
                <p className="text-slate-400 font-bold text-sm tracking-wide mt-1 uppercase">{pet.species} • {pet.breed}</p>
              </div>
              {!isLost && (
                <div className="bg-teal-50 text-teal-700 px-4 py-2 rounded-xl border border-teal-100 flex flex-col items-center justify-center">
                  <Activity className="w-6 h-6 mb-1" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Óptimo</span>
                </div>
              )}
          </div>

          {/* QR Area */}
          <div className="mb-8 p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group/qr hover:bg-white hover:shadow-lg transition-all">
              <div className="overflow-hidden">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 flex items-center gap-2">
                    <Logo className="w-3.5 h-3.5 blur-[0.3px]" /> Acceso Público
                  </p>
                  <p className="text-sm text-teal-700 font-bold truncate w-40">pakuna.health/p/{pet.slug}</p>
              </div>
              <div className="flex gap-2">
                  <button onClick={handleCopy} className="p-3 bg-white text-slate-400 hover:text-blue-900 rounded-xl transition-all border border-slate-100 shadow-sm active:scale-90">
                      {copied ? <Check className="w-5 h-5 text-teal-600" /> : <Copy className="w-5 h-5" />}
                  </button>
                  <Link to={`/p/${pet.slug}`} target="_blank" className="p-3 bg-blue-900 hover:bg-slate-800 text-white rounded-xl shadow-xl transition-all active:scale-95">
                      <ChevronRight className="w-5 h-5" />
                  </Link>
              </div>
          </div>

          {/* Compliance Bar */}
          <div className={`p-6 rounded-3xl border-2 transition-all ${compliance >= 100 ? 'bg-teal-50/30 border-teal-50' : 'bg-amber-50/30 border-amber-50'}`}>
            <div className="flex justify-between items-center mb-4 cursor-pointer group/bit" onClick={() => setShowBitacora(true)}>
              <span className="text-xs font-black text-slate-400 uppercase tracking-[0.15em] flex items-center gap-2 group-hover/bit:text-teal-700 transition-colors">
                <FileText className="w-4 h-4" /> 
                Esquema de Salud
              </span>
              <span className={`text-sm font-black ${compliance >= 100 ? 'text-teal-600' : 'text-amber-600'}`}>{compliance}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 mb-1 overflow-hidden shadow-inner">
              <div className={`h-full rounded-full transition-all duration-1000 ${compliance >= 100 ? 'bg-teal-500' : 'bg-amber-500'}`} style={{ width: `${compliance}%` }}></div>
            </div>
          </div>
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
      addToast(`[DEMO] Nota publicada (simulada)`, 'success');
      setNewNote('');
      return;
    }

    if (!firebaseUser) return;
    setSubmitting(true);
    try {
      await addLog(pet.id, { type: 'Nota', content: newNote }, { uid: firebaseUser.uid, name: profile.name, role: profile.role });
      setNewNote('');
      addToast('Observación publicada', 'success');
    } catch {
      addToast('Error al publicar nota', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-blue-900/20 backdrop-blur-md p-0 md:p-4 animate-in fade-in duration-300">
       <div className="bg-white rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 md:zoom-in-95 duration-300">
          
          <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
             <div className="flex items-center gap-4">
               <img src={pet.photoURL || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=500&q=80"} className="w-12 h-12 rounded-2xl object-cover shadow-sm" alt={pet.name} />
               <div>
                  <h3 className="font-black text-xl text-blue-900">Bitácora Médica: {pet.name}</h3>
                  <p className="text-[10px] text-teal-600 flex items-center gap-1 font-black uppercase tracking-widest"><ShieldCheck className="w-3.5 h-3.5" /> Ficha Certificada</p>
               </div>
             </div>
             <button onClick={onClose} className="p-3 bg-white hover:bg-slate-100 rounded-full text-slate-400 hover:text-blue-900 transition-all shadow-sm">
               ✕
             </button>
          </div>

          <div className="p-8 overflow-y-auto flex-grow space-y-10">
             <form onSubmit={handleAddNote} className="flex gap-4">
               <div className="w-12 h-12 rounded-2xl bg-slate-100 shrink-0 flex items-center justify-center overflow-hidden border border-slate-200">
                  {profile?.avatar ? <img src={profile.avatar} className="w-full h-full object-cover" /> : <div className="text-slate-300">🐶</div>}
               </div>
               <div className="flex-grow flex flex-col gap-3">
                 <textarea 
                    placeholder="Agrega una nota u observación importante..." 
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500/30 transition-all resize-none min-h-[100px]"
                 />
                 <div className="flex justify-end">
                    <Button type="submit" disabled={!newNote.trim() || submitting} className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 shadow-xl shadow-teal-100">
                      {submitting ? 'Guardando...' : 'Publicar Nota'}
                    </Button>
                 </div>
               </div>
             </form>

             <div className="relative pl-6 space-y-8 before:absolute before:inset-y-0 before:left-6 before:w-[2px] before:bg-slate-100">
                {logs && logs.length > 0 ? logs.map(log => (
                  <div key={log.id} className="relative z-10 flex gap-6 animate-in slide-in-from-left-4 fade-in duration-500">
                    <div className={`w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center shadow-lg ring-4 ring-white ${log.authorRole === 'veterinary' ? 'bg-teal-500' : 'bg-blue-900'}`}>
                       {log.authorRole === 'veterinary' ? <Activity className="w-5 h-5 text-white" /> : <FileText className="w-5 h-5 text-white" />}
                    </div>
                    <div className="flex-grow p-6 bg-slate-50 rounded-[1.5rem] rounded-tl-none border border-slate-100">
                       <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-4">
                         <div className="flex flex-col">
                           <span className="font-black text-blue-900 text-sm tracking-tight">{log.authorName}</span>
                           <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest w-fit mt-1 ${log.authorRole === 'veterinary' ? 'bg-teal-100 text-teal-700' : 'bg-blue-100 text-blue-900'}`}>
                             {log.authorRole === 'veterinary' ? 'Veterinario Certificado' : 'Propietario'}
                           </span>
                         </div>
                         <span className="text-[10px] font-bold text-slate-400 capitalize">
                           {log.date || (log.createdAt?.seconds ? new Date(log.createdAt.seconds * 1000).toLocaleDateString('es-ES', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Reciente')}
                         </span>
                       </div>
                       <p className="text-xs font-black text-teal-600 mb-2 uppercase tracking-wide">{log.type}</p>
                       <p className="text-slate-600 text-sm leading-relaxed font-medium">{log.content}</p>
                    </div>
                  </div>
                )) : (
                  <div className="text-center text-slate-300 py-12 font-bold italic">
                    Sin registros médicos aún.
                  </div>
                )}
             </div>
          </div>
       </div>
    </div>
  );
}

const CampaignCard = ({ campaign }) => (
  <Card className="bg-white border-slate-100 flex overflow-hidden group hover:border-teal-100 hover:shadow-2xl hover:shadow-teal-900/5 transition-all duration-500 cursor-pointer p-0 rounded-3xl shadow-xl shadow-slate-200/50">
    <div className="w-1/3 overflow-hidden">
      <img src={campaign.imageURL || "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80"} alt={campaign.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
    </div>
    <div className="w-2/3 p-6 flex flex-col justify-center">
      <p className="text-[9px] font-black tracking-[0.2em] text-teal-600 mb-2 uppercase">{campaign.partnerName}</p>
      <h4 className="text-xl font-black text-blue-900 mb-2 leading-tight">{campaign.title}</h4>
      <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-2">{campaign.description}</p>
      <div className="mt-6 flex items-center text-xs font-black text-blue-900 group-hover:text-teal-600 transition-colors uppercase tracking-widest">
        Ver Detalle <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  </Card>
);

export default OwnerDashboard;

