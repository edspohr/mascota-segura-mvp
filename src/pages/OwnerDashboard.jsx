import React, { useState } from 'react';
import { useApp } from '../context';
import { QrCode, Calendar, ChevronRight, Share2, Plus, Activity } from 'lucide-react';
import { Button, Card, Modal } from '../components/ui/Components';
import { Link } from 'react-router-dom';

const OwnerDashboard = () => {
  const { user, pets, togglePetStatus } = useApp();
  const [showQrModal, setShowQrModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);

  const handleShowQr = (pet) => {
    setSelectedPet(pet);
    setShowQrModal(true);
  };

  const handleToggleStatus = (petId) => {
      // In a real app, confirm modal first
      if(window.confirm("¿Cambiar estado de mascota? Si activas 'Perdido', tus datos de contacto serán públicos.")){
          togglePetStatus(petId);
      }
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-2xl font-bold text-slate-800">Hola, {user.name.split(' ')[0]} 👋</h1>
            <p className="text-slate-500 text-sm">Aquí están tus engreídos</p>
         </div>
         <Button variant="outline" className="text-xs">
            <Plus className="w-4 h-4 mr-1" /> Nueva Mascota
         </Button>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-4 text-white shadow-lg shadow-teal-100">
              <span className="text-teal-100 text-xs font-medium">Mascotas Protegidas</span>
              <p className="text-3xl font-bold mt-1">{pets.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
             <span className="text-slate-400 text-xs font-medium">Backup de Emergencia</span>
             <p className="text-slate-800 font-bold mt-1 text-sm">{user.emergencyContact?.name || "Sin asignar"}</p>
          </div>
      </div>

      {/* Pet List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800">Mis Mascotas</h2>
        {pets.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border-dashed border-2 border-slate-200">
                <p className="text-slate-400">Aún no registras mascotas</p>
                <Button className="mt-4">Registrar Mascota</Button>
            </div>
        ) : (
            pets.filter(p => p.ownerId === user.id).map(pet => (
            <Card key={pet.id} className={`overflow-hidden transition-all ${pet.status === 'lost' ? 'border-red-500 shadow-md ring-1 ring-red-100' : 'hover:shadow-md'}`}>
                {pet.status === 'lost' && (
                    <div className="bg-red-500 text-white text-center text-xs font-bold py-1 uppercase tracking-wider">
                        🚨 Modo Perdido Activado
                    </div>
                )}
                <div className="flex gap-4 p-4 md:p-6">
                <div className="relative">
                    <img src={pet.photo} alt={pet.name} className="w-20 h-20 rounded-xl object-cover shadow-sm" />
                    <button 
                        onClick={() => handleShowQr(pet)}
                        className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-full shadow-md text-slate-700 hover:text-teal-600 transition-colors"
                    >
                        <QrCode className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">{pet.name}</h3>
                            <p className="text-slate-500 text-xs">{pet.breed} • {pet.age} años</p>
                        </div>
                        {/* Status Toggle Switch */}
                        <div className="flex flex-col items-end">
                             <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={pet.status === 'lost'} onChange={() => handleToggleStatus(pet.id)} className="sr-only peer" />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                             </label>
                             <span className={`text-[10px] font-bold mt-1 ${pet.status === 'lost' ? 'text-red-500' : 'text-slate-400'}`}>
                                 {pet.status === 'lost' ? 'PERDIDO' : 'Seguro'}
                             </span>
                        </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                        <Link to={`/p/${pet.slug}`} target="_blank" className="flex-1">
                            <Button variant="outline" className="w-full text-xs h-9">
                                Ver Perfil Público
                            </Button>
                        </Link>
                        <Button className="flex-1 text-xs h-9 bg-slate-800 text-white hover:bg-slate-900">
                           <Activity className="w-3 h-3 mr-1" /> Historial
                        </Button>
                    </div>
                </div>
                </div>
            </Card>
            ))
        )}
      </div>

      <div className="h-10"></div> {/* Spacer for bottom nav */}

      {/* QR Modal */}
      <Modal isOpen={showQrModal} onClose={() => setShowQrModal(false)} title="Tu Código QR">
          <div className="flex flex-col items-center justify-center space-y-4">
              {selectedPet && (
                  <>
                    <div className="bg-white p-4 rounded-xl shadow-inner border border-slate-200">
                        {/* QR Placeholder */}
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${window.location.origin}/p/${selectedPet.slug}`} 
                          alt="QR Code" 
                          className="w-48 h-48"
                        />
                    </div>
                    <p className="text-center text-slate-500 text-sm">
                        Escanea para ver el perfil público de <strong>{selectedPet.name}</strong>
                    </p>
                    <div className="flex gap-2 w-full">
                         <Button variant="outline" className="flex-1" onClick={() => window.open(`/p/${selectedPet.slug}`, '_blank')}>
                             Ver Perfil
                         </Button>
                         <Button className="flex-1">
                             <Share2 className="w-4 h-4 mr-2" />
                             Compartir
                         </Button>
                    </div>
                  </>
              )}
          </div>
      </Modal>
    </div>
  );
};

export default OwnerDashboard;
