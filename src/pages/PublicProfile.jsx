import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPetBySlug } from '../services/pets.service';
import { recordScan, getGeolocation } from '../services/scans.service';
import { AlertTriangle, Phone, ShieldCheck, Heart, HeartPulse } from 'lucide-react';
import { Button, Card, Input, Modal } from '../components/ui/Components';
import Logo from '../components/ui/Logo';

const PublicProfile = () => {
  const { slug } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reporterData, setReporterData] = useState({ name: '', phone: '' });
  const [submittingScan, setSubmittingScan] = useState(false);

  useEffect(() => {
    const loadPet = async () => {
      try {
        const foundPet = await getPetBySlug(slug.toUpperCase());
        setPet(foundPet);
        if (foundPet) {
          const location = await getGeolocation();
          await recordScan({
            petId: foundPet.id,
            petSlug: foundPet.slug,
            location,
            type: 'normal'
          });
        }
      } catch (err) {
        console.error("Error loading pet:", err);
      } finally {
        setLoading(false);
      }
    };
    loadPet();
  }, [slug]);

  const handleReport = async (e) => {
    e.preventDefault();
    if (!pet) return;
    setSubmittingScan(true);
    try {
      const location = await getGeolocation();
      await recordScan({
        petId: pet.id,
        petSlug: pet.slug,
        location,
        type: 'emergency',
        reporter: reporterData
      });
      setShowReportModal(false);
      alert("¡Reporte enviado! El dueño ha sido notificado con tu contacto y ubicación.");
    } catch {
      alert("Error al enviar el reporte. Por favor intenta de nuevo.");
    } finally {
      setSubmittingScan(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-teal-600">
      <HeartPulse className="w-12 h-12 animate-pulse mb-4" />
      <p className="font-bold tracking-tight">Verificando Credencial Pakuna...</p>
    </div>
  );

  if (!pet) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-500 text-center px-6">
       <AlertTriangle className="w-16 h-16 mb-4 text-amber-500" />
       <h2 className="text-2xl font-bold text-slate-800 mb-2">Credencial no encontrada</h2>
       <p className="font-medium">No existe ninguna mascota vinculada a este código.</p>
       <Link to="/" className="mt-8">
         <Button variant="outline">Volver al Inicio</Button>
       </Link>
    </div>
  );

  const isLost = pet.status === 'lost';

  return (
    <div className={`min-h-screen bg-slate-50 pb-24 font-sans selection:bg-teal-500/10`}>
      {/* Dynamic Header */}
      <div className={`w-full py-4 px-6 text-center font-bold shadow-md sticky top-0 z-40 backdrop-blur-md ${isLost ? 'bg-amber-500 text-white' : 'bg-white/80 border-b border-slate-100 text-teal-700'}`}>
        <div className="flex items-center justify-center gap-2 text-sm md:text-base">
            {isLost ? <AlertTriangle className="w-5 h-5 animate-bounce" /> : <ShieldCheck className="w-5 h-5" />}
            <span>{isLost ? "¡ESTOY PERDIDO! AYÚDAME A VOLVER A CASA" : "Mascota Protegida por Pakuna"}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-lg relative z-10">
        {/* Main Photo Card */}
        <div className="relative mb-12 text-center animate-in zoom-in-95 duration-500">
            <div className={`inline-block p-2 rounded-full ${isLost ? 'bg-amber-100 animate-pulse' : 'bg-teal-50'} border-4 ${isLost ? 'border-amber-500' : 'border-white'} shadow-xl`}>
                <img src={pet.photoURL || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=500&q=80"} alt={pet.name} className="w-48 h-48 rounded-full object-cover shadow-inner mx-auto" />
            </div>
            <h1 className="text-4xl font-extrabold text-blue-900 mt-6 mb-1 tracking-tight">{pet.name}</h1>
            <p className="text-slate-500 font-bold text-lg uppercase tracking-wider">{pet.species} • {pet.breed}</p>
            
            {!isLost && (
                <div className="mt-6 inline-flex items-center gap-2 px-6 py-2 bg-teal-50 text-teal-700 border border-teal-100 text-xs font-extrabold rounded-full shadow-sm">
                    <Heart className="w-4 h-4 fill-teal-500 animate-pulse" />
                    SALUDABLE Y PROTEGIDO
                </div>
            )}
        </div>

        {isLost ? (
            <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-700">
                <Card className="bg-white border-amber-100 shadow-2xl shadow-amber-900/5">
                    <h2 className="text-2xl font-black text-amber-600 mb-2 flex items-center gap-3">
                        <Phone className="w-6 h-6" /> Regresar a casa
                    </h2>
                    <p className="text-slate-600 mb-8 font-medium">Por favor, contacta a mi familia inmediatamente. Me están buscando y están muy preocupados.</p>
                    
                    <div className="space-y-4">
                        <a href={`tel:${pet.ownerPhone}`} className="block">
                          <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white py-5 h-auto text-xl rounded-2xl shadow-xl shadow-amber-500/20 border-none transition-all active:scale-95">
                              <span className="flex items-center justify-center gap-4">
                                <Phone className="w-7 h-7" />
                                <span className="flex flex-col items-start leading-tight">
                                  <span className="text-[10px] uppercase font-black opacity-80">Llamada de Emergencia</span>
                                  <span>Llamar al Dueño</span>
                                </span>
                              </span>
                          </Button>
                        </a>
                    </div>

                    <div className="mt-10 pt-8 border-t border-slate-50 text-center">
                        <p className="text-amber-500 text-xs uppercase mb-3 tracking-[0.2em] font-black">Información de Seguridad</p>
                        <p className="text-slate-400 text-xs font-semibold leading-relaxed">
                          La ubicación GPS ha sido compartida con mi familia. Por favor mantente conmigo si es posible. ¡Gracias por ayudarme!
                        </p>
                    </div>
                </Card>
            </div>
        ) : (
            <div className="space-y-6">
                 {/* Report Found Option */}
                 <Card className="bg-white border-slate-100 shadow shadow-slate-200/50">
                    <div className="flex flex-col items-center text-center py-4">
                        <div className="p-4 bg-amber-50 rounded-full mb-6 ring-8 ring-amber-50/50">
                            <AlertTriangle className="w-8 h-8 text-amber-500" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">¿Me encontraste solo?</h3>
                        <p className="text-slate-500 text-sm font-medium mb-6 leading-relaxed px-4">
                            Si ves que estoy sin supervisión, repórtalo para avisar a mi familia de inmediato con tu ubicación actual.
                        </p>
                        <Button onClick={() => setShowReportModal(true)} variant="secondary" className="w-full py-4 font-bold border-amber-200 text-amber-600 hover:bg-amber-50">
                            Reportar Mascota Perdida
                        </Button>
                    </div>
                 </Card>

                 {/* Marketing for Pakuna */}
                 <div className="mt-12 p-10 bg-gradient-to-br from-blue-900 to-slate-800 rounded-[2.5rem] text-center shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-teal-500/10 opacity-20 pointer-events-none" />
                    <Logo light className="h-16 mx-auto mb-6" />
                    <h3 className="text-3xl font-black text-white px-2">Protege a tu mascota con Pakuna</h3>
                    <p className="text-teal-100/60 text-sm mt-4 mb-8 leading-relaxed max-w-xs mx-auto font-medium">
                        La credencial médica inteligente que salva vidas. Únete a la red de salud más grande.
                    </p>
                    <Link to="/" className="block">
                       <Button className="w-full bg-white text-blue-900 hover:bg-teal-50 font-black py-4 border-none shadow-xl transition-all">
                           Conocer Pakuna
                       </Button>
                    </Link>
                 </div>
            </div>
        )}
      </div>

      <Modal isOpen={showReportModal} onClose={() => setShowReportModal(false)} title="Reportar Hallazgo">
        <form onSubmit={handleReport} className="space-y-6">
             <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl text-sm text-amber-700 font-medium leading-relaxed flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p>Tu ubicación GPS y teléfono serán compartidos únicamente con el dueño para facilitar el rescate.</p>
             </div>

             <div className="space-y-4">
                 <Input 
                    label="Tu Nombre" 
                    placeholder="Ej: Sofía Rojas" 
                    value={reporterData.name} 
                    onChange={e => setReporterData({...reporterData, name: e.target.value})} 
                    required
                 />
                 <Input 
                    label="Tu Teléfono" 
                    placeholder="Ej: +56 9 ..." 
                    type="tel"
                    value={reporterData.phone} 
                    onChange={e => setReporterData({...reporterData, phone: e.target.value})} 
                    required 
                 />
             </div>

             <Button type="submit" disabled={submittingScan} className="w-full py-4 text-lg bg-blue-900 hover:bg-slate-800 mt-4 shadow-xl">
                 {submittingScan ? 'Notificando...' : 'Enviar Alerta de Rescate'}
             </Button>
        </form>
      </Modal>
    </div>
  );
};

export default PublicProfile;
