import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from '../components/ui/Components';
import Logo from '../components/ui/Logo';
import { ShieldCheck, ArrowRight, Smartphone, HeartPulse, ActivitySquare, Star, ChevronRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-teal-500/10 overflow-hidden relative text-slate-900">
      
      {/* Background Orbs - Softer for Light Theme */}
      <div className="absolute top-[-5%] left-[-10%] w-[50vw] h-[50vw] bg-blue-50/50 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-teal-50/50 rounded-full blur-[100px] pointer-events-none" />

      <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 h-24 flex items-center justify-between">
          <Logo className="h-18" />
          
          <div className="hidden lg:flex items-center space-x-10 text-sm font-black uppercase tracking-widest text-[#00457C]/60">
             <a href="#how-it-works" className="hover:text-teal-600 transition-colors">La Ficha Digital</a>
             <a href="#demo" className="hover:text-teal-600 transition-colors">Para Veterinarias</a>
          </div>

          <Link to="/login">
            <Button className="bg-[#00457C] hover:bg-slate-800 text-white font-bold px-8 py-4 h-auto rounded-2xl shadow-xl shadow-blue-900/10 active:scale-95 transition-all">
               Acceso Clientes
            </Button>
          </Link>
        </div>
      </nav>

      <main>
        {/* HERO SECTION */}
        <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-48 px-6">
          <div className="container mx-auto max-w-6xl relative z-10 flex flex-col lg:flex-row items-center gap-20">
             <div className="flex-1 text-center lg:text-left space-y-10 animate-in slide-in-from-left-8 fade-in duration-1000">
                 <div className="inline-flex items-center rounded-full border border-teal-100 bg-teal-50 px-5 py-2 text-xs font-black uppercase tracking-widest text-teal-700 shadow-sm">
                     <ShieldCheck className="mr-2 h-4 w-4 fill-current animate-pulse" />
                     Ecosistema de Salud Preventiva #1
                 </div>
                 
                 <h1 className="text-6xl lg:text-8xl font-black text-[#00457C] tracking-tighter leading-[0.9] text-balance">
                    Tranquilidad <span className="text-teal-600">Total</span>.<br/>
                    Salud de <span className="bg-gradient-to-r from-teal-500 to-emerald-400 bg-clip-text text-transparent">Vanguardia.</span>
                 </h1>
                 
                 <p className="text-xl text-slate-500 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                   El puente digital entre tu mascota y el consultorio. Historial clínico siempre a mano, recordatorios inteligentes y protección con Placa GPS.
                 </p>
                 
                 <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 pt-6">
                    <Link to="/login" className="w-full sm:w-auto">
                      <Button className="px-10 py-6 rounded-3xl bg-[#00457C] hover:bg-slate-800 text-white font-bold text-xl border-none shadow-2xl shadow-blue-900/10 w-full active:scale-95 transition-all">
                         Activa tu Ficha Gratis
                      </Button>
                    </Link>
                    <Button variant="ghost" onClick={() => document.getElementById('how-it-works').scrollIntoView({behavior: 'smooth'})} className="px-10 py-6 rounded-3xl text-slate-500 hover:text-[#00457C] hover:bg-slate-50 font-bold text-lg w-full sm:w-auto flex items-center justify-center gap-2">
                       Ver Beneficios <ChevronRight className="w-5 h-5" />
                    </Button>
                 </div>
             </div>

             <div className="flex-1 w-full max-w-xl animate-in slide-in-from-right-8 fade-in duration-1000">
                <div className="relative group">
                    <div className="absolute -inset-4 bg-gradient-to-tr from-teal-100 to-blue-100 rounded-[4rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000" />
                    <div className="relative aspect-square w-full rounded-[3.5rem] overflow-hidden border-8 border-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)]">
                        <img src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80" alt="Pet care with Pakuna" className="object-cover w-full h-full" />
                        
                        {/* Interactive UI Element */}
                        <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/90 backdrop-blur-xl rounded-[2rem] border border-white shadow-2xl flex items-center justify-between transform hover:scale-105 transition-transform duration-500">
                             <div>
                                <p className="text-[10px] text-teal-600 font-black uppercase tracking-[0.2em] mb-1">Status de Vacunación</p>
                                <p className="text-[#00457C] font-black text-xl">100% Protegido</p>
                             </div>
                             <div className="w-14 h-14 rounded-2xl bg-teal-500 flex items-center justify-center shadow-lg shadow-teal-500/20">
                                <ShieldCheck className="w-8 h-8 text-white" />
                             </div>
                        </div>
                    </div>
                </div>
             </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="how-it-works" className="py-32 bg-slate-50 relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-[30vh] h-[30vh] bg-teal-100/30 rounded-full blur-[100px]" />
          <div className="container mx-auto px-6 max-w-6xl relative z-10">
              <div className="text-center mb-24 space-y-6">
                  <h2 className="text-4xl md:text-6xl font-black text-[#00457C] tracking-tighter">Cuidado sin Estrés</h2>
                  <p className="text-slate-500 max-w-2xl mx-auto text-xl font-medium leading-relaxed">Todo lo que necesitas para ser el dueño perfecto, respaldado por tecnología médica certificada.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  <FeatureCard 
                    icon={<Smartphone className="w-10 h-10 text-teal-600" />}
                    title="Placa QR Inteligente"
                    description="Identificación inmediata y contacto de emergencia directo. Recibe alertas y ubicación aproximada al ser escaneado."
                  />
                  <FeatureCard 
                    icon={<HeartPulse className="w-10 h-10 text-blue-900" />}
                    title="Historial de Salud"
                    description="Centraliza vacunas, tratamientos y recetas. Veterinarios verificados actualizan la ficha tras cada consulta."
                  />
                  <FeatureCard 
                    icon={<ActivitySquare className="w-10 h-10 text-teal-500" />}
                    title="Notificaciones On-Time"
                    description="Nunca más olvides una dosis. Agenda automáticamente tus recordatorios preventivos con un solo toque."
                  />
              </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section id="demo" className="py-32 relative">
          <div className="container mx-auto px-6 max-w-4xl relative z-10">
            <div className="bg-[#00457C] rounded-[3.5rem] p-12 md:p-20 text-center shadow-2xl shadow-blue-900/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-8 relative z-10">
                  El Futuro de la Pet-Health
                </h2>
                <p className="text-blue-100 text-xl mb-12 leading-relaxed font-medium relative z-10 max-w-2xl mx-auto">
                   Miles de familias y especialistas ya confían en Pakuna para mantener a sus mascotas seguras y saludables.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
                  <Link to="/login" className="w-full sm:w-auto">
                    <Button className="px-12 py-6 rounded-3xl bg-teal-500 hover:bg-teal-400 text-white font-black text-xl border-none shadow-2xl shadow-teal-500/20 w-full active:scale-95 transition-all">
                      Empezar Gratis
                    </Button>
                  </Link>
                  <Link to="/login" className="w-full sm:w-auto">
                    <Button className="px-12 py-6 rounded-3xl bg-white/10 hover:bg-white/20 text-white font-black text-xl border-2 border-white/20 w-full active:scale-95 transition-all">
                      Portal Veterinario
                    </Button>
                  </Link>
                </div>
            </div>
          </div>
        </section>

      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-slate-50 py-24 text-center">
         <div className="container mx-auto px-6">
             <div className="flex justify-center mb-12">
                 <Logo className="h-24 opacity-100" />
             </div>
             <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">© 2026 Pakuna Ecosystem. All Rights Reserved.</p>
             <div className="mt-8 flex justify-center gap-10 text-xs font-black text-slate-300 uppercase tracking-widest">
                 <a href="#" className="hover:text-teal-600 transition-colors">Privacidad</a>
                 <a href="#" className="hover:text-teal-600 transition-colors">Términos</a>
                 <a href="#" className="hover:text-teal-600 transition-colors">Soporte</a>
             </div>
         </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <Card className="bg-white border-slate-50 p-10 flex flex-col hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] hover:border-teal-100 transition-all duration-500 shadow-xl shadow-slate-200/50 group rounded-[3rem] relative overflow-hidden text-left cursor-default">
     <div className="p-5 bg-slate-50 rounded-[1.5rem] w-max mb-8 border border-slate-100 shadow-inner group-hover:scale-110 group-hover:bg-teal-50 transition-all duration-500">
        {icon}
     </div>
     <h3 className="text-2xl font-black text-[#00457C] mb-4 tracking-tight">{title}</h3>
     <p className="text-slate-500 leading-relaxed font-medium">{description}</p>
     <div className="mt-8 pt-8 border-t border-slate-50 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity">
        Saber Más <ChevronRight className="w-4 h-4" />
     </div>
  </Card>
);

export default LandingPage;
