import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context';
import { AlertTriangle, Phone, MessageCircle, ShieldCheck, Heart, MapPin, ActivitySquare, ChevronRight } from 'lucide-react';
import { Button, Card, Input, Modal } from '../components/ui/Components';

const PublicProfile = () => {
  const { slug } = useParams();
  const { getPetBySlug, triggerEmergency } = useApp();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reporterData, setReporterData] = useState({ name: '', phone: '' });

  useEffect(() => {
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
        alert("¡Reporte enviado! El dueño ha sido notificado con tu contacto y ubicación aproximada por GPS.");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-teal-500">
      <ActivitySquare className="w-12 h-12 animate-pulse mb-4" />
      <p>Localizando placa inteligente...</p>
    </div>
  );

  if (!pet) return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-slate-500">
       <AlertTriangle className="w-12 h-12 mb-4" />
       <p>Mascota no encontrada o enlace inválido.</p>
    </div>
  );

  const isLost = pet.status === 'lost';

  return (
    <div className={`min-h-screen ${isLost ? 'bg-red-950 text-red-50' : 'bg-zinc-950 text-slate-50'} pb-24 font-sans selection:bg-teal-500/30`}>
      {/* Dynamic Header */}
      <div className={`w-full py-4 px-6 text-center font-bold shadow-md sticky top-0 z-40 backdrop-blur-md ${isLost ? 'bg-red-600/90 border-b border-red-500' : 'bg-zinc-900/80 border-b border-zinc-800 text-teal-400'}`}>
        <div className="flex items-center justify-center gap-2">
            {isLost ? <AlertTriangle className="w-6 h-6 animate-pulse" /> : <ShieldCheck className="w-6 h-6" />}
            <span>{isLost ? "¡ESTOY PERDIDO! AYÚDAME A VOLVER A CASA" : "Mascota Protegida por Mascota Segura"}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-lg relative z-10">
        {/* Main Photo Card */}
        <div className="relative mb-8 text-center animate-in zoom-in-95 duration-500">
            <div className={`inline-block p-1.5 rounded-full ${isLost ? 'bg-red-500/30 animate-pulse' : 'bg-teal-500/20'} backdrop-blur-sm border ${isLost ? 'border-red-500' : 'border-teal-500/30'}`}>
                <img src={pet.photo} alt={pet.name} className="w-48 h-48 rounded-full object-cover border-4 border-zinc-900 shadow-2xl mx-auto" />
            </div>
            <h1 className="text-4xl font-extrabold text-white mt-6 mb-1 tracking-tight">{pet.name}</h1>
            <p className="text-zinc-400 font-medium text-lg">{pet.species} • {pet.breed}</p>
            
            {!isLost && (
                <div className="mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold rounded-full shadow-lg shadow-emerald-900/20">
                    <Heart className="w-3.5 h-3.5 fill-current animate-pulse" />
                    SALUDABLE Y VACUNADO
                </div>
            )}
        </div>

        {/* Action Components based on Status */}
        {isLost ? (
            <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-700">
                <Card className="bg-red-950 border border-red-800 shadow-xl shadow-red-900/20">
                    <h2 className="text-xl font-bold text-red-500 mb-2 flex items-center gap-2">
                        <Phone className="w-5 h-5" /> Regresar con {pet.ownerContact?.name}
                    </h2>
                    <p className="text-red-200/70 mb-6 text-sm">Por favor, contacta a su familia inmediatamente. Están muy preocupados.</p>
                    
                    <div className="space-y-4">
                        <a href={`tel:${pet.ownerContact?.phone}`} className="block w-full">
                            <Button className="w-full bg-red-600 hover:bg-red-500 text-white py-4 h-auto text-lg rounded-xl shadow-lg border-none">
                                <Phone className="w-6 h-6 mr-2" />
                                Llamar Ahora
                            </Button>
                        </a>
                        <a href={`https://wa.me/${pet.ownerContact?.phone?.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="block w-full">
                            <Button className="w-full bg-green-600 hover:bg-green-500 text-white py-4 h-auto text-lg rounded-xl shadow-lg border-none">
                                <MessageCircle className="w-6 h-6 mr-2" />
                                Enviar WhatsApp
                            </Button>
                        </a>
                    </div>

                    {pet.emergencyContact && (
                      <div className="mt-8 pt-6 border-t border-red-900/50">
                          <h3 className="font-bold text-red-400 text-xs uppercase mb-3 tracking-wider">Contacto Alternativo</h3>
                          <div className="flex justify-between items-center text-sm p-3 bg-red-900/30 rounded-lg border border-red-800/50">
                              <span className="text-red-200">{pet.emergencyContact?.name}</span>
                              <a href={`tel:${pet.emergencyContact?.phone}`} className="font-bold text-red-400 flex items-center gap-1">
                                 <Phone className="w-4 h-4" /> {pet.emergencyContact?.phone}
                              </a>
                          </div>
                      </div>
                    )}
                </Card>

                <div className="text-center text-xs text-red-400/50 flex items-center justify-center gap-2">
                     <MapPin className="w-4 h-4" /> Ubicación GPS reportada al dueño tras el escaneo.
                </div>
            </div>
        ) : (
            <div className="space-y-6">
                 {/* Report Found Option - Always Visible but subtle when safe */}
                 <Card className="bg-orange-500/10 border-orange-500/20 shadow-none">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-orange-500/20 rounded-xl">
                            <AlertTriangle className="w-6 h-6 text-orange-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-orange-400 mb-1">¿Me encontraste solo?</h3>
                            <p className="text-sm text-orange-200/70 mb-4 leading-relaxed">
                                Si ves que estoy sin mi dueño, por favor repórtalo aquí para enviarle una alerta.
                            </p>
                            <Button onClick={() => setShowReportModal(true)} className="bg-orange-500 hover:bg-orange-400 text-zinc-950 font-bold border-none w-full shadow-lg shadow-orange-500/20">
                                Reportar Mascota Perdida
                            </Button>
                        </div>
                    </div>
                 </Card>

                 {/* Marketing / Secondary Action for B2C */}
                 <div className="mt-12 p-8 bg-gradient-to-br from-teal-900/30 to-zinc-900 rounded-3xl border border-teal-500/20 text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <ShieldCheck className="w-16 h-16 text-teal-400 mx-auto mb-4 relative z-10" />
                    <h3 className="text-2xl font-bold text-white relative z-10">Protege a tu mascota</h3>
                    <p className="text-zinc-400 text-sm mt-3 mb-6 relative z-10 leading-relaxed max-w-xs mx-auto">
                        Consigue una Placa Inteligente QR conectada al ecosistema médico veterinario más grande.
                    </p>
                    <Link to="/">
                       <Button className="w-full bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/50 hover:border-teal-400 relative z-10 transition-colors">
                           Conoce Mascota Segura
                       </Button>
                    </Link>
                 </div>
            </div>
        )}
      </div>

      {/* Modern Report Modal */}
      <Modal isOpen={showReportModal} onClose={() => setShowReportModal(false)} title="Alerta de Emergencia">
        <form onSubmit={handleReport} className="space-y-6">
             <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-xl text-sm text-orange-200/80 leading-relaxed flex gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                <p>Al enviar este reporte, enviaremos notificaciones inmediatas al dueño incluyendo tu contacto y la ubicación GPS aproximada de este escaneo.</p>
             </div>

             <div className="space-y-4">
                 <Input 
                    label="Tu Nombre" 
                    placeholder="Ej: Buen Samaritano" 
                    value={reporterData.name} 
                    onChange={e => setReporterData({...reporterData, name: e.target.value})} 
                    required
                    className="bg-zinc-900/50 border-zinc-700 text-white placeholder-zinc-500 focus:ring-orange-500"
                 />
                 <Input 
                    label="Tu Teléfono de Contacto" 
                    placeholder="Ej: 999 000 000" 
                    type="tel"
                    value={reporterData.phone} 
                    onChange={e => setReporterData({...reporterData, phone: e.target.value})} 
                    required 
                    className="bg-zinc-900/50 border-zinc-700 text-white placeholder-zinc-500 focus:ring-orange-500"
                 />
             </div>

             <Button type="submit" className="w-full py-4 text-lg bg-red-600 hover:bg-red-500 text-white border-none shadow-lg shadow-red-900/50 mt-4 rounded-xl">
                 Enviar Alerta SOS al Dueño
             </Button>
        </form>
      </Modal>
    </div>
  );
};

export default PublicProfile;
