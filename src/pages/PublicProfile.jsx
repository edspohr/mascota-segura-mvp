import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  AlertTriangle, Phone, Heart, QrCode,
  MapPin, CheckCircle, Loader2, Send, ChevronRight
} from 'lucide-react';
import { getPetBySlug } from '../services/pets.service';
import { recordScan, getGeolocation } from '../services/scans.service';
import { getUserProfile } from '../services/auth.service';
import { useApp } from '../context';
import { MOCK_PETS, MOCK_USERS } from '../data/mockData';
import Logo from '../components/ui/Logo';
import { Button } from '../components/ui/Components';

const PublicProfile = () => {
  const { slug } = useParams();
  const { isDemo } = useApp();

  const [pet, setPet] = useState(null);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showFoundFlow, setShowFoundFlow] = useState(false);
  const [foundStep, setFoundStep] = useState('confirm'); // 'confirm' | 'gps' | 'sending' | 'done'
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');

  const [reportSent, setReportSent] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (isDemo) {
        const petData = MOCK_PETS.find(p => p.slug === slug);
        if (!petData) { setLoading(false); return; }
        
        const ownerId = petData.ownerId === 'mock-owner-001' ? 'owner' : 'super_admin';
        const ownerData = MOCK_USERS[ownerId];
        setPet(petData);
        setOwner(ownerData);
        setLoading(false);
        return;
      }

      const petData = await getPetBySlug(slug);
      if (!petData) { setLoading(false); return; }

      const ownerData = await getUserProfile(petData.ownerId);
      setPet(petData);
      setOwner(ownerData);
      setLoading(false);

      const location = await getGeolocation();
      await recordScan({
        petId: petData.id,
        petSlug: slug,
        location,
        type: 'normal',
      });
    };
    load();
  }, [slug, isDemo]);

  const handleFoundSafe = async (e) => {
    e.preventDefault();
    setFoundStep('sending');

    const location = await getGeolocation();
    await recordScan({
      petId: pet.id,
      petSlug: slug,
      location,
      type: 'found_safe',
      reporter: { name: reporterName || null, phone: reporterPhone || null },
    });

    setFoundStep('done');
  };

  const buildWhatsAppUrl = (location) => {
    const text = encodeURIComponent(
      `¡Hola! Encontré a tu mascota *${pet.name}* y escaneé su QR de Pakuna. `
      + (location?.lat
        ? `Aquí está mi ubicación actual: https://maps.google.com/?q=${location.lat},${location.lng}`
        : 'Por favor, comunícate conmigo lo antes posible.')
    );
    return `https://wa.me/${owner?.phone?.replace(/\D/g, '')}?text=${text}`;
  };

  const handleSendLocationWhatsApp = async () => {
    const location = await getGeolocation();
    window.open(buildWhatsAppUrl(location), '_blank');
    await recordScan({
      petId: pet.id,
      petSlug: slug,
      location,
      type: 'emergency',
      reporter: null,
    });
    setReportSent(true);
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-[#008894] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!pet) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-center px-10">
      <div className="p-8 bg-white rounded-full mb-8 shadow-xl text-amber-500 border border-amber-100">
         <AlertTriangle className="w-16 h-16" />
      </div>
      <h1 className="text-3xl font-black text-[#00457C] mb-4">Perfil no encontrado</h1>
      <p className="text-slate-500 font-medium max-w-xs">El código QR que escaneaste no parece estar registrado en nuestra comunidad.</p>
      <Link to="/" className="mt-10 text-[#008894] font-black uppercase tracking-widest text-xs hover:underline">Volver al inicio</Link>
    </div>
  );

  const isLost = pet.status === 'lost';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center pb-20 relative overflow-hidden">
      
      {/* Background Orbs */}
      <div className={`absolute top-[-10%] right-[-10%] w-[80vw] h-[80vw] rounded-full blur-[120px] pointer-events-none transition-colors duration-1000 ${isLost ? 'bg-amber-100/30' : 'bg-teal-100/20'}`} />
      <div className={`absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full blur-[100px] pointer-events-none transition-colors duration-1000 ${isLost ? 'bg-blue-100/20' : 'bg-blue-100/30'}`} />

      {/* Persistent Logo Header */}
      <div className="w-full py-8 px-6 flex justify-center relative z-20">
        <div className="flex flex-col items-center">
          <Logo className="h-10 mb-2" />
          <span className="text-[9px] font-black text-[#008894] uppercase tracking-[0.3em]">Pakuna Health</span>
        </div>
      </div>

      <div className="w-full max-w-md px-6 relative z-10 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Status Badge */}
        <div className="flex justify-center">
          <div className={`flex items-center gap-3 px-6 py-3 rounded-full border shadow-sm transition-all duration-700 ${isLost ? 'bg-amber-50 border-amber-100 text-amber-700' : 'bg-teal-50 border-teal-100 text-[#008894]'}`}>
            <span className={`w-2.5 h-2.5 rounded-full animate-pulse shadow-[0_0_8px_rgba(0,0,0,0.1)] ${isLost ? 'bg-amber-500' : 'bg-[#008894]'}`} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{isLost ? 'Alerta: Extraviado' : 'Estatus: Seguro'}</span>
          </div>
        </div>

        {/* Pet Card */}
        <div className={`bg-white rounded-[3.5rem] border overflow-hidden shadow-2xl shadow-blue-950/[0.05] transition-colors duration-1000 ${isLost ? 'border-amber-200 ring-2 ring-amber-500/10' : 'border-slate-100'}`}>
          
          <div className="h-48 w-full relative bg-slate-50">
             <img src={pet.photoURL || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=500&q=80"} alt={pet.name} className="w-full h-full object-cover opacity-20 blur-md grayscale transition-opacity duration-1000" />
             <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
             <div className="absolute inset-0 flex items-center justify-center -mb-8">
                <div className={`p-1.5 rounded-[2.5rem] bg-white shadow-2xl transition-all duration-700 ${isLost ? 'shadow-amber-900/10' : 'shadow-blue-900/10'}`}>
                  <img src={pet.photoURL || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=500&q=80"} alt={pet.name} className="w-32 h-32 rounded-[2rem] object-cover border-2 border-white" />
                </div>
             </div>
          </div>

          <div className="px-10 pb-12 pt-8 text-center space-y-6">
            <div className="space-y-1">
              <h1 className="text-4xl font-black text-[#00457C] tracking-tight leading-tight">{pet.name}</h1>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">{pet.species} • {pet.breed}</p>
            </div>

            {/* Fun Fact or Info */}
            <div className="bg-slate-50/50 rounded-[1.5rem] p-6 border border-slate-100 space-y-4">
               {isLost ? (
                 <div className="space-y-4">
                   <p className="text-sm font-black text-amber-700 leading-relaxed italic">"Hola, me perdí. Por favor, ayuda a que vuelva con mi familia."</p>
                   {pet.medicalAlerts && (
                     <div className="pt-4 border-t border-amber-100">
                       <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] mb-2 font-black">⚠️ Alerta Médica Importante</p>
                       <p className="text-sm text-amber-800 font-medium leading-relaxed">{pet.medicalAlerts}</p>
                     </div>
                   )}
                 </div>
               ) : (
                 <div className="space-y-2">
                   <p className="text-[10px] font-black text-[#008894] uppercase tracking-[0.2em] mb-1 font-black">Un poco sobre mí</p>
                   <p className="text-slate-600 text-sm leading-relaxed font-medium italic">"{pet.funFact || 'Soy un chico muy bueno y mi familia me cuida mucho.'}"</p>
                 </div>
               )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 pt-4">
              {isLost ? (
                <>
                  <a href={`tel:${owner?.phone}`} className="flex items-center justify-center gap-4 w-full bg-[#00457C] hover:bg-slate-800 text-white font-black py-6 rounded-[2rem] text-xl shadow-2xl shadow-blue-900/30 active:scale-95 transition-all">
                    <Phone className="w-6 h-6 fill-current" /> Llamar al Dueño
                  </a>
                  <button onClick={handleSendLocationWhatsApp} className="flex items-center justify-center gap-4 w-full bg-[#008894] hover:bg-teal-700 text-white font-black py-5 rounded-[2rem] text-base shadow-xl shadow-teal-900/10 active:scale-95 transition-all">
                    <Send className="w-5 h-5" /> Enviar mi ubicación
                  </button>
                  {reportSent && (
                    <p className="text-[10px] font-black text-[#008894] uppercase tracking-[0.1em] flex items-center justify-center gap-2 animate-bounce">
                      <CheckCircle className="w-4 h-4" /> ¡Ubicación enviada con éxito!
                    </p>
                  )}
                </>
              ) : (
                <div className="space-y-4">
                  {showFoundFlow ? (
                    <div className="bg-amber-50 rounded-[2rem] p-8 border border-amber-100 animate-in zoom-in-95 duration-500">
                      {foundStep === 'confirm' && (
                        <div className="space-y-6">
                          <h2 className="text-xl font-black text-amber-800 flex items-center justify-center gap-2">
                            <Heart className="w-6 h-6 fill-current" /> ¿Lo encontraste?
                          </h2>
                          <p className="text-sm text-amber-700 font-medium leading-relaxed">
                            Avisaremos al dueño de tu ubicación para que pueda reunirse con {pet.name}.
                          </p>
                          <form onSubmit={handleFoundSafe} className="space-y-4">
                            <input 
                              type="text" 
                              placeholder="Tu nombre (opcional)" 
                              value={reporterName} 
                              onChange={(e) => setReporterName(e.target.value)} 
                              className="w-full bg-white border border-amber-200 rounded-2xl px-5 py-4 text-[#00457C] focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-400 font-bold placeholder:text-slate-300" 
                            />
                            <input 
                              type="tel" 
                              placeholder="Tu teléfono (opcional)" 
                              value={reporterPhone} 
                              onChange={(e) => setReporterPhone(e.target.value)} 
                              className="w-full bg-white border border-amber-200 rounded-2xl px-5 py-4 text-[#00457C] focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-400 font-bold placeholder:text-slate-300" 
                            />
                            <Button type="submit" className="w-full py-5 bg-amber-500 hover:bg-amber-600 rounded-2xl text-lg font-black mt-2">Hacer el reporte ahora</Button>
                            <button type="button" onClick={() => setShowFoundFlow(false)} className="text-[10px] font-black text-amber-400 uppercase tracking-widest hover:text-amber-600 transition-colors">Cancelar</button>
                          </form>
                        </div>
                      )}
                      {foundStep === 'sending' && (
                        <div className="flex flex-col items-center py-8">
                           <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
                           <p className="text-amber-800 font-black">Conectando con el dueño...</p>
                        </div>
                      )}
                      {foundStep === 'done' && (
                        <div className="flex flex-col items-center py-8 space-y-4">
                           <div className="p-4 bg-white rounded-full shadow-lg text-[#008894]">
                             <CheckCircle className="w-12 h-12" />
                           </div>
                           <h3 className="text-xl font-black text-[#00457C]">¡Aviso enviado!</h3>
                           <p className="text-sm text-slate-500 font-medium leading-relaxed">Gracias por tu generosidad. El dueño ya tiene tu aviso.</p>
                           <button onClick={() => setShowFoundFlow(false)} className="text-xs font-black text-[#008894] uppercase tracking-widest pt-4">Volver al perfil</button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <button onClick={() => setShowFoundFlow(true)} className="flex items-center justify-center gap-4 w-full bg-amber-50 hover:bg-amber-100 border-2 border-amber-400/20 text-amber-700 font-black py-5 rounded-[2rem] text-base transition-all active:scale-95 group">
                        <Heart className="w-6 h-6 group-hover:scale-110 transition-transform fill-transparent hover:fill-current" /> ¿Lo encontraste? Ayúdanos
                      </button>
                      <Link to="/" className="flex items-center justify-center gap-4 w-full bg-[#00457C] hover:bg-slate-800 text-white font-black py-5 rounded-[2rem] text-base shadow-xl shadow-blue-900/10 active:scale-95 transition-all">
                        <QrCode className="w-5 h-5" /> Quiero mi placa Pakuna
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center pt-8">
           <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] flex items-center justify-center gap-3">
             <Logo className="h-4 opacity-30 grayscale" /> Credencial Médica Inteligente
           </p>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
