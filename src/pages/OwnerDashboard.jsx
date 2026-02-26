import React, { useState } from 'react';
import { useApp } from '../context';
import { Card, Button, Modal, Input } from '../components/ui/Components';
import Logo from '../components/ui/Logo';
import { ShieldCheck, Activity, CalendarClock, Gift, ChevronRight, AlertTriangle, Plus, Copy, Check, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const OwnerDashboard = () => {
  const { user, pets, campaigns, addPet } = useApp();
  const [showAddPetModal, setShowAddPetModal] = useState(false);
  const [newPet, setNewPet] = useState({ name: '', species: '', breed: '', age: '', weight: '', photo: '' });

  const handleAddPet = (e) => {
    e.preventDefault();
    addPet({
      ...newPet,
      photo: newPet.photo || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=500&q=80"
    });
    setShowAddPetModal(false);
    setNewPet({ name: '', species: '', breed: '', age: '', weight: '', photo: '' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-50 tracking-tight">
            Hola, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-zinc-400 mt-2 text-lg">Control total sobre la salud de tus mascotas.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center space-x-2 bg-emerald-500/10 text-emerald-400 px-4 py-2.5 rounded-full border border-emerald-500/20 shadow-lg shadow-emerald-900/20">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-sm font-bold tracking-wide">TODO AL DÍA</span>
          </div>
          <Button onClick={() => setShowAddPetModal(true)} className="bg-teal-600 hover:bg-teal-500 text-white font-bold border-none shadow-lg shadow-teal-900/30 flex items-center gap-2 px-6">
            <Plus className="w-5 h-5" /> Nueva Mascota
          </Button>
        </div>
      </div>

      {/* Pet ID Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {pets.map(pet => (
          <PetIDCard key={pet.id} pet={pet} />
        ))}
      </div>

      {/* Active Campaigns / Benefits Section */}
      <div className="mt-16 pt-8 border-t border-zinc-800/50">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/20 shadow-inner">
              <Gift className="w-6 h-6 text-teal-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-50">Beneficios Premium</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {campaigns.filter(c => c.active).map(campaign => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      </div>

      {/* Add Pet Modal */}
      <Modal isOpen={showAddPetModal} onClose={() => setShowAddPetModal(false)} title="Registrar Nueva Mascota">
        <form onSubmit={handleAddPet} className="space-y-4">
             <Input label="Nombre de la Mascota" placeholder="Ej: Max" value={newPet.name} onChange={e => setNewPet({...newPet, name: e.target.value})} required className="bg-zinc-900 border-zinc-700 text-white" />
             <div className="grid grid-cols-2 gap-4">
                 <Input label="Especie" placeholder="Ej: Perro" value={newPet.species} onChange={e => setNewPet({...newPet, species: e.target.value})} required className="bg-zinc-900 border-zinc-700 text-white" />
                 <Input label="Raza" placeholder="Ej: Beagle" value={newPet.breed} onChange={e => setNewPet({...newPet, breed: e.target.value})} required className="bg-zinc-900 border-zinc-700 text-white" />
             </div>
             <div className="grid grid-cols-2 gap-4">
                 <Input label="Edad (Años)" type="number" placeholder="Ej: 2" value={newPet.age} onChange={e => setNewPet({...newPet, age: e.target.value})} required className="bg-zinc-900 border-zinc-700 text-white" />
                 <Input label="Peso (Aprox)" placeholder="Ej: 12kg" value={newPet.weight} onChange={e => setNewPet({...newPet, weight: e.target.value})} required className="bg-zinc-900 border-zinc-700 text-white" />
             </div>
             <Input label="URL de Foto (Opcional)" placeholder="https://..." value={newPet.photo} onChange={e => setNewPet({...newPet, photo: e.target.value})} className="bg-zinc-900 border-zinc-700 text-white" />
             <Button type="submit" className="w-full mt-6 bg-teal-600 hover:bg-teal-500 py-3 text-lg font-bold border-none shadow-lg shadow-teal-900/30">
                 Crear Ficha Digital
             </Button>
        </form>
      </Modal>

    </div>
  );
};

const PetIDCard = ({ pet }) => {
  const { togglePetStatus } = useApp();
  const compliance = pet.compliance || 100;
  const isLost = pet.status === 'lost';
  const [copied, setCopied] = useState(false);
  const [showBitacora, setShowBitacora] = useState(false);

  const publicUrl = `${window.location.origin}/p/${pet.slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Card className={`bg-zinc-900/60 backdrop-blur-xl transition-all duration-500 border overflow-hidden relative group p-0 ${isLost ? 'border-red-500/50 shadow-lg shadow-red-900/20' : 'border-zinc-800 hover:border-teal-500/30'}`}>
        
        {isLost && <div className="absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none" />}

        {/* Top Banner Photo */}
        <div className="h-32 w-full relative">
          <img src={pet.photo} alt={pet.name} className="w-full h-full object-cover opacity-50 sepia-[.2]" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/80 to-transparent" />
        </div>

        <div className="px-8 pb-8 pt-0 relative -mt-16">
          <div className="flex justify-between items-end mb-6 relative z-10 w-full">
            <img 
              src={pet.photo} 
              alt={pet.name} 
              className={`w-32 h-32 rounded-2xl object-cover border-4 shadow-2xl transition-all duration-300 ${isLost ? 'border-red-500 shadow-red-500/50' : 'border-zinc-900 cursor-pointer hover:scale-105'}`}
              onClick={() => setShowBitacora(true)}
            />
            
            <Button 
              onClick={() => togglePetStatus(pet.id)}
              variant={isLost ? "primary" : "outline"}
              className={`flex items-center gap-2 rounded-xl text-xs font-bold py-2 px-4 shadow-lg transition-all ${isLost ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-none' : 'border-red-500/50 text-red-500 hover:bg-red-500/10'}`}
            >
              {isLost ? <ShieldCheck className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              {isLost ? "Reportar Localizada" : "Reportar Extravío"}
            </Button>
          </div>

          <div className="mb-6 flex justify-between items-start">
              <div>
                <h3 className="text-3xl font-bold text-slate-50 tracking-tight flex items-center gap-2 cursor-pointer hover:text-teal-400 transition-colors" onClick={() => setShowBitacora(true)}>
                  {pet.name} <ChevronRight className="w-6 h-6 text-zinc-600" />
                </h3>
                <p className="text-zinc-400 font-medium text-sm mt-1">{pet.breed} • {pet.age} años • {pet.weight}</p>
              </div>
              {!isLost && (
                <div className="bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-lg border border-emerald-500/20 flex flex-col items-center justify-center min-w-[80px]">
                  <Activity className="w-5 h-5 mb-0.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Perfecto</span>
                </div>
              )}
          </div>

          <div className="mb-8 p-4 bg-zinc-950/50 rounded-xl border border-zinc-800 flex items-center justify-between group/qr hover:border-zinc-700 transition-colors">
              <div className="overflow-hidden">
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1 flex items-center gap-1.5"><Logo className="w-3 h-3 grayscale opacity-50" /> QR Ficha Pública</p>
                  <p className="text-sm text-zinc-300 truncate w-48 opacity-70">/p/{pet.slug}</p>
              </div>
              <div className="flex gap-2">
                  <button onClick={handleCopy} className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors border border-zinc-700">
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <Link to={`/p/${pet.slug}`} target="_blank" className="p-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition-colors border border-teal-500 shadow-md">
                      <ChevronRight className="w-4 h-4" />
                  </Link>
              </div>
          </div>

          <div className={`p-5 rounded-2xl border transition-colors ${compliance >= 100 ? 'bg-teal-900/10 border-teal-900/50' : 'bg-yellow-900/10 border-yellow-900/50'}`}>
            <div className="flex justify-between items-center mb-3 cursor-pointer group/bit" onClick={() => setShowBitacora(true)}>
              <span className="text-sm font-semibold text-zinc-300 flex items-center gap-2 group-hover/bit:text-teal-400 transition-colors">
                <FileText className="w-4 h-4" /> 
                Bitácora y Cumplimiento
              </span>
              <span className={`text-sm font-bold ${compliance >= 100 ? 'text-teal-400' : 'text-yellow-400'}`}>{compliance}%</span>
            </div>
            <div className="w-full bg-zinc-950 rounded-full h-2.5 mb-5 shadow-inner overflow-hidden border border-zinc-800">
              <div className={`h-full rounded-full transition-all duration-1000 ${compliance >= 100 ? 'bg-gradient-to-r from-teal-500 to-emerald-400' : 'bg-gradient-to-r from-yellow-500 to-orange-400'}`} style={{ width: `${compliance}%` }}></div>
            </div>
            
            {pet.upcomingEvents && pet.upcomingEvents.length > 0 ? (
              <div className="flex items-center gap-4 pt-4 border-t border-zinc-800/50">
                <div className="p-2.5 bg-zinc-950 rounded-xl border border-zinc-800 shadow-inner">
                  <CalendarClock className="w-5 h-5 text-teal-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-200">{pet.upcomingEvents[0].type}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">{pet.upcomingEvents[0].date} en {pet.upcomingEvents[0].provider}</p>
                </div>
              </div>
            ) : (
              <div className="pt-4 border-t border-zinc-800/50 text-xs font-medium text-emerald-500 flex items-center gap-2">
                  <Check className="w-4 h-4" /> Mascota al día. Ninguna visita pendiente.
              </div>
            )}
          </div>
        </div>
      </Card>
      
      {showBitacora && <BitacoraModal pet={pet} onClose={() => setShowBitacora(false)} />}
    </>
  );
};

const BitacoraModal = ({ pet, onClose }) => {
  const { addLog } = useApp();
  const [newNote, setNewNote] = useState('');

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    addLog(pet.id, { type: 'Nota', content: newNote });
    setNewNote('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-zinc-950/80 backdrop-blur-sm p-0 md:p-4 animate-in fade-in duration-300">
       <div className="bg-zinc-900 border border-zinc-800 rounded-t-3xl md:rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 md:zoom-in-95 duration-300">
          
          <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50">
             <div className="flex items-center gap-3">
               <img src={pet.photo} className="w-10 h-10 rounded-full object-cover border border-zinc-700" alt={pet.name} />
               <div>
                  <h3 className="font-bold text-lg text-white">Bitácora Médica: {pet.name}</h3>
                  <p className="text-xs text-teal-400 flex items-center gap-1 font-medium"><ShieldCheck className="w-3 h-3" /> Ficha Protegida</p>
               </div>
             </div>
             <button onClick={onClose} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-full text-zinc-400 hover:text-white transition-colors">
               ✕
             </button>
          </div>

          <div className="p-6 overflow-y-auto flex-grow bg-zinc-950/30 space-y-8">
             {/* Feed Form */}
             <form onSubmit={handleAddNote} className="flex gap-3">
               <div className="w-10 h-10 rounded-full bg-zinc-800 shrink-0 flex items-center justify-center border border-zinc-700">
                  <UserAvatarIcon className="w-5 h-5 text-zinc-500" />
               </div>
               <div className="flex-grow flex flex-col gap-2">
                 <textarea 
                    placeholder="Agrega una nota u observación a la bitácora..." 
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500 resize-none min-h-[80px]"
                 />
                 <div className="flex justify-end">
                    <Button type="submit" disabled={!newNote.trim()} className="bg-teal-600 hover:bg-teal-500 text-white text-xs py-2 px-4 border-none shadow-lg">
                      Publicar Observación
                    </Button>
                 </div>
               </div>
             </form>

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
                             {log.authorRole === 'veterinary' ? 'Clínica' : 'Dueño'}
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
                    No hay registros en la bitácora aún.
                  </div>
                )}
             </div>
          </div>
       </div>
    </div>
  );
}

const UserAvatarIcon = ({className}) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const CampaignCard = ({ campaign }) => (
  <Card className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800 flex overflow-hidden group hover:border-teal-500/40 hover:bg-zinc-800/50 transition-all duration-300 cursor-pointer shadow-lg p-0">
    <div className="w-2/5 overflow-hidden">
      <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
    </div>
    <div className="w-3/5 p-6 flex flex-col justify-center relative">
      <p className="text-[10px] font-bold tracking-widest text-teal-300 mb-2 uppercase">{campaign.partner}</p>
      <h4 className="text-lg font-bold text-slate-50 mb-3 leading-snug">{campaign.title}</h4>
      <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2">{campaign.description}</p>
      <div className="mt-5 flex items-center text-xs font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors">
        Canjear Beneficio <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  </Card>
);

export default OwnerDashboard;
