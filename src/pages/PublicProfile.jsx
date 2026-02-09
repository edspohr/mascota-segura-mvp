import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useApp } from '../context/Context';
import { AlertTriangle, Phone, MessageCircle, ShieldCheck, MapPin, Heart } from 'lucide-react';
import { Button, Card, Input, Modal } from '../components/ui/Components';

const PublicProfile = () => {
  const { slug } = useParams();
  const { getPetBySlug, triggerEmergency } = useApp();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reporterData, setReporterData] = useState({ name: '', phone: '' });

  useEffect(() => {
    // Simulate API fetch delay
    setTimeout(() => {
        const foundPet = getPetBySlug(slug);
        setPet(foundPet);
        setLoading(false);
    }, 500);
  }, [slug, getPetBySlug]);

  const handleReport = (e) => {
    e.preventDefault();
    if (pet) {
        triggerEmergency(pet.id, reporterData);
        setShowReportModal(false);
        alert("¡Reporte enviado! El dueño ha sido notificado con tu contacto y ubicación aproximada.");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-teal-600">Cargando perfil...</div>;

  if (!pet) return <div className="min-h-screen flex items-center justify-center text-slate-500">Mascota no encontrada o enlace inválido.</div>;

  const isLost = pet.status === 'lost';

  return (
    <div className={`min-h-screen ${isLost ? 'bg-red-50' : 'bg-slate-50'} pb-20`}>
      {/* Privacy Shield Header */}
      <div className={`w-full py-4 text-center font-bold text-white shadow-md ${isLost ? 'bg-red-600 animate-pulse' : 'bg-teal-600'}`}>
        <div className="flex items-center justify-center gap-2">
            {isLost ? <AlertTriangle className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
            <span>{isLost ? "¡ESTOY PERDIDO! AYÚDAME A VOLVER A CASA" : "Mascota Protegida y Segura"}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-lg">
        {/* Main Photo Card */}
        <div className="relative mb-8 text-center">
            <div className={`inline-block p-1 rounded-full ${isLost ? 'bg-red-200' : 'bg-teal-200'}`}>
                <img src={pet.photo} alt={pet.name} className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-lg mx-auto" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mt-4">{pet.name}</h1>
            <p className="text-slate-500 font-medium text-lg">{pet.species} - {pet.breed}</p>
            
            {!isLost && (
                <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                    <Heart className="w-3 h-3 fill-current" />
                    SALUDABLE Y VACUNADO
                </div>
            )}
        </div>

        {/* Action Components based on Status */}
        {isLost ? (
            <div className="space-y-4 animate-in slide-in-from-bottom-8 duration-500">
                <Card className="border-red-200 shadow-red-100">
                    <h2 className="text-xl font-bold text-red-700 mb-2 flex items-center gap-2">
                        <Phone className="w-5 h-5" /> Contacto de Emergencia
                    </h2>
                    <p className="text-slate-600 mb-4 text-sm">Por favor, contacta a mi familia inmediatamente.</p>
                    
                    <div className="space-y-3">
                        <a href={`tel:${pet.ownerContact.phone}`} className="block w-full">
                            <Button className="w-full bg-red-600 hover:bg-red-700 text-white py-4 h-auto text-lg">
                                <Phone className="w-6 h-6 mr-2" />
                                Llamar a {pet.ownerContact.name}
                            </Button>
                        </a>
                        <a href={`https://wa.me/${pet.ownerContact.phone.replace(/-/g, '')}`} target="_blank" rel="noreferrer" className="block w-full">
                            <Button className="w-full bg-green-500 hover:bg-green-600 text-white py-4 h-auto text-lg">
                                <MessageCircle className="w-6 h-6 mr-2" />
                                Enviar WhatsApp
                            </Button>
                        </a>
                    </div>

                    <div className="mt-6 pt-4 border-t border-red-100">
                         <h3 className="font-bold text-slate-700 text-xs uppercase mb-2">Contacto Alternativo</h3>
                         <div className="flex justify-between items-center text-sm">
                             <span className="text-slate-600">{pet.emergencyContact.name}</span>
                             <a href={`tel:${pet.emergencyContact.phone}`} className="font-bold text-red-600 underline">
                                {pet.emergencyContact.phone}
                             </a>
                         </div>
                    </div>
                </Card>

                <div className="text-center text-xs text-slate-400 mt-8">
                     <p>Ubicación reportada al escanear este QR.</p>
                </div>
            </div>
        ) : (
            <div className="space-y-6">
                 {/* Report Found Option - Always Visible but subtle when safe */}
                 <Card className="bg-orange-50 border-orange-100">
                    <h3 className="font-bold text-orange-800 mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        ¿Me encontraste solo?
                    </h3>
                    <p className="text-sm text-orange-700 mb-4">
                        Si ves que estoy sin mi dueño, por favor repórtalo aquí.
                    </p>
                    <Button onClick={() => setShowReportModal(true)} className="w-full bg-orange-500 hover:bg-orange-600 text-white border-none">
                        Reportar Mascota Encontrada
                    </Button>
                 </Card>

                 {/* Marketing / Secondary Action */}
                 <div className="mt-8 p-6 bg-white rounded-xl shadow-sm border border-slate-100 text-center">
                    <ShieldCheck className="w-12 h-12 text-teal-500 mx-auto mb-3" />
                    <h3 className="font-bold text-slate-800">Protege a tu mascota</h3>
                    <p className="text-slate-500 text-sm mt-2 mb-4">
                        Consigue una placa inteligente como esta para tu mejor amigo.
                    </p>
                    <Button variant="outline" className="w-full">
                        Obtener Placa QR
                    </Button>
                 </div>
            </div>
        )}
      </div>

      {/* Report Modal */}
      <Modal isOpen={showReportModal} onClose={() => setShowReportModal(false)} title="Reportar Hallazgo">
        <form onSubmit={handleReport} className="space-y-4">
             <div className="bg-slate-50 p-4 rounded-lg mb-4 text-sm text-slate-600">
                Gracias por ayudarnos. Al enviar este reporte, notificaremos al dueño inmediatamente con tus datos.
             </div>
             <Input 
                label="Tu Nombre" 
                placeholder="Ej: Buen Samaritano" 
                value={reporterData.name} 
                onChange={e => setReporterData({...reporterData, name: e.target.value})} 
                required 
             />
             <Input 
                label="Tu Teléfono de Contacto" 
                placeholder="Ej: 999 000 000" 
                type="tel"
                value={reporterData.phone} 
                onChange={e => setReporterData({...reporterData, phone: e.target.value})} 
                required 
             />
             <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white mt-2">
                 Enviar Alerta al Dueño
             </Button>
        </form>
      </Modal>
    </div>
  );
};

export default PublicProfile;
