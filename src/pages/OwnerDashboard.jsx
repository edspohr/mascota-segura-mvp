import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { QrCode, Calendar, ChevronRight, Share2 } from 'lucide-react';
import { Button, Card, Modal } from '../components/ui/Components';

const OwnerDashboard = () => {
  const { user, pets } = useApp();
  const myPets = pets.filter(p => p.ownerId === user.id);
  const [selectedPet, setSelectedPet] = useState(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  const handleOpenQr = (pet) => {
    setSelectedPet(pet);
    setQrModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Mis Mascotas</h1>
        <Button variant="outline" className="text-sm">
          + Nueva Mascota
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {myPets.map(pet => (
          <Card key={pet.id} className="hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <img 
                src={pet.photo} 
                alt={pet.name} 
                className="w-24 h-24 rounded-lg object-cover bg-slate-100"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{pet.name}</h3>
                    <p className="text-slate-500 text-sm">{pet.breed} • {pet.age} años</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    pet.status === 'healthy' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {pet.status === 'healthy' ? 'Saludable' : 'Extraviado'}
                  </span>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button variant="primary" className="flex-1 text-sm py-1.5" onClick={() => handleOpenQr(pet)}>
                    <QrCode className="w-4 h-4 mr-1.5 inline-block" />
                    Ver QR
                  </Button>
                  <Button variant="secondary" className="px-3 py-1.5">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Upcoming Events Preview */}
            {pet.upcomingEvents.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Próximos Eventos</h4>
                {pet.upcomingEvents.map(event => (
                  <div key={event.id} className="flex items-center gap-3 text-sm text-slate-700 bg-slate-50 p-2 rounded-lg">
                    <Calendar className="w-4 h-4 text-teal-600" />
                    <span className="flex-1">{event.description}</span>
                    <span className="font-medium text-slate-500">{event.date}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>

      <Modal 
        isOpen={qrModalOpen} 
        onClose={() => setQrModalOpen(false)}
        title={`Código QR de ${selectedPet?.name}`}
      >
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="bg-white p-4 rounded-xl border-2 border-slate-900 shadow-sm">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${window.location.origin}/p/${selectedPet?.slug}`} 
              alt="QR Code" 
              className="w-48 h-48"
            />
          </div>
          <p className="text-slate-500 text-sm">
            Escanea este código para ver el perfil de emergencia.
            <br />
            Ideal para imprimir en la placa de tu mascota.
          </p>
          <div className="flex gap-2 w-full">
            <Button variant="outline" className="flex-1">Descargar PNG</Button>
            <Button variant="primary" className="flex-1">
              <Share2 className="w-4 h-4 mr-2 inline-block" />
              Compartir
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OwnerDashboard;
