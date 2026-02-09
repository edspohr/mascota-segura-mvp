import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { AlertTriangle, Phone, Calendar, Heart, ShieldAlert } from 'lucide-react';
import { Button, Input, Modal, Card } from '../components/ui/Components';

const PublicProfile = () => {
  const { slug } = useParams();
  const { getPetBySlug, triggerEmergency, recordScan } = useApp();
  const pet = getPetBySlug(slug);

  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Record scan on mount
  React.useEffect(() => {
    if (pet) {
      recordScan(pet.id);
    }
  }, [pet, recordScan]);

  if (!pet) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Mascota no encontrada</h1>
          <p className="text-slate-500">El código QR escaneado no es válido o la mascota no existe.</p>
          <Link to="/" className="mt-4 inline-block text-teal-600 hover:underline">Volver al inicio</Link>
        </div>
      </div>
    );
  }

  const handleEmergencySubmit = (e) => {
    e.preventDefault();
    if (!reporterName || !reporterPhone) return;

    triggerEmergency(pet.id, { name: reporterName, phone: reporterPhone });
    setSubmitted(true);
    
    // Redirect to WhatsApp after short delay
    setTimeout(() => {
       // Mock phone number for owner. In real app, fetch from owner data.
       const ownerPhone = "51999999999"; 
       const message = `Hola, encontré a tu mascota ${pet.name}. Soy ${reporterName}.`;
       window.location.href = `https://wa.me/${ownerPhone}?text=${encodeURIComponent(message)}`;
    }, 1500);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col pb-24 relative bg-slate-50">
      {/* Header Image */}
      <div className="h-64 relative bg-slate-200">
        <img 
          src={pet.photo} 
          alt={pet.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <h1 className="text-3xl font-bold">{pet.name}</h1>
          <p className="text-slate-200 text-lg flex items-center gap-1">
            <Heart className="w-4 h-4 text-red-500 fill-current" /> 
            {pet.breed}
          </p>
        </div>
      </div>

      <div className="p-4 flex-1 space-y-4">
        {/* Status Card */}
        <Card className="bg-white border-green-100 border-l-4 border-l-teal-500">
           <div className="flex items-start gap-3">
             <ShieldAlert className="w-5 h-5 text-teal-600 mt-1" />
             <div>
               <h3 className="font-bold text-slate-800">Estado de Salud</h3>
               <p className="text-sm text-slate-600">Vacunas al día • Esterilizado</p>
               <p className="text-xs text-slate-400 mt-1">Última actualización: Haces 2 días</p>
             </div>
           </div>
        </Card>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3">
           <Card className="p-4 text-center">
             <span className="text-xs text-slate-500 uppercase tracking-wide">Edad</span>
             <p className="font-bold text-lg text-slate-800">{pet.age} años</p>
           </Card>
           <Card className="p-4 text-center">
             <span className="text-xs text-slate-500 uppercase tracking-wide">Peso</span>
             <p className="font-bold text-lg text-slate-800">{pet.weight}</p>
           </Card>
        </div>

        {/* Medical History Preview */}
        <div className="mt-4">
          <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-500" />
            Historial Médico Reciente
          </h3>
          <div className="space-y-2">
            {pet.medicalHistory.length > 0 ? (
               pet.medicalHistory.slice(0, 3).map(record => (
                 <div key={record.id} className="bg-white p-3 rounded-lg border border-slate-100 text-sm flex justify-between items-center">
                   <div>
                     <p className="font-medium text-slate-800">{record.type}</p>
                     <p className="text-slate-500 text-xs">{record.description}</p>
                   </div>
                   <span className="text-xs font-mono text-slate-400">{record.date}</span>
                 </div>
               ))
            ) : (
              <p className="text-sm text-slate-400 italic">No hay registros visibles.</p>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 flex justify-center pb-8 safe-area-pb z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="w-full max-w-md">
          <Button 
            variant="danger" 
            className="w-full text-lg py-4 shadow-xl flex items-center justify-center gap-2 animate-pulse"
            onClick={() => setEmergencyModalOpen(true)}
          >
            <AlertTriangle className="w-6 h-6" />
            🚨 ENCONTRÉ ESTA MASCOTA
          </Button>
        </div>
      </div>

      {/* Emergency Modal */}
      <Modal 
        isOpen={emergencyModalOpen} 
        onClose={() => setEmergencyModalOpen(false)}
        title="Reportar Mascota Encontrada"
      >
        {!submitted ? (
          <form onSubmit={handleEmergencySubmit} className="space-y-4">
            <div className="bg-red-50 text-red-800 p-3 rounded-lg text-sm mb-4 border border-red-100">
               Estás a punto de contactar al dueño. Por favor ingresa tus datos para que puedan devolverte la llamada.
            </div>
            <Input 
              label="Tu Nombre" 
              placeholder="Ej: Juan Pérez" 
              value={reporterName}
              onChange={(e) => setReporterName(e.target.value)}
              required
            />
            <Input 
              label="Tu Celular" 
              placeholder="Ej: 999 999 999" 
              type="tel"
              value={reporterPhone}
              onChange={(e) => setReporterPhone(e.target.value)}
              required
            />
            <Button type="submit" variant="danger" className="w-full mt-2">
              Contactar Dueño por WhatsApp
            </Button>
          </form>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">¡Gracias por ayudar!</h3>
            <p className="text-slate-500">Redirigiendo a WhatsApp...</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PublicProfile;
