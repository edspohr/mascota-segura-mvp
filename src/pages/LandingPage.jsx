import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from '../components/ui/Components';
import Logo from '../components/ui/Logo';
import { ShieldCheck, ArrowRight, Smartphone, HeartPulse, ActivitySquare, ChevronRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-teal-500/10 overflow-hidden relative text-[#00457C]">
      
      {/* Background Orbs - Softer for Light Theme */}
      <div className="absolute top-[-5%] left-[-10%] w-[50vw] h-[50vw] bg-blue-100/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-teal-100/20 rounded-full blur-[100px] pointer-events-none" />

      <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 h-24 flex items-center justify-between">
          <Logo className="h-14" />
          
          <div className="hidden lg:flex items-center space-x-10 text-[10px] font-black uppercase tracking-[0.2em] text-[#00457C]/40">
             <a href="#how-it-works" className="hover:text-[#008894] transition-colors">La Ficha Digital</a>
             <a href="#demo" className="hover:text-[#008894] transition-colors">Para Veterinarias</a>
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
                 <div className="inline-flex items-center rounded-full border border-teal-100 bg-teal-50 px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#008894] shadow-sm">
                     <ShieldCheck className="mr-2 h-4 w-4 fill-current animate-pulse" />
                     Ecosistema de Salud Preventiva #1
                 </div>
                 
                 <h1 className="text-6xl lg:text-8xl font-black text-[#00457C] tracking-tighter leading-[0.9] text-balance">
                    Tranquilidad <span className="text-[#008894]">Total</span>.<br/>
                    Salud de <span className="bg-gradient-to-r from-[#008894] to-emerald-500 bg-clip-text text-transparent">Vanguardia.</span>
                 </h1>
                 
                 <p className="text-xl text-slate-500 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                   El puente digital entre tu mascota y el consultorio. Historial clínico siempre a mano, recordatorios inteligentes y protección integral con Ficha Digital.
                 </p>
                 
                 <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 pt-6">
                    <Link to="/login" className="w-full sm:w-auto">
                      <Button className="px-12 py-7 rounded-[2.5rem] bg-[#008894] hover:bg-teal-700 text-white font-black text-xl border-none shadow-2xl shadow-teal-900/30 w-full active:scale-95 transition-all">
                         Activa tu Ficha Gratis
                      </Button>
                    </Link>
                    <button onClick={() => document.getElementById('how-it-works').scrollIntoView({behavior: 'smooth'})} className="px-10 py-6 rounded-[2.5rem] text-[#00457C]/60 hover:text-[#00457C] hover:bg-white/50 font-bold text-lg w-full sm:w-auto flex items-center justify-center gap-2 transition-all">
                       Ver Beneficios <ChevronRight className="w-5 h-5 text-[#008894]" />
                    </button>
                 </div>
             </div>

             <div className="flex-1 w-full max-w-xl animate-in slide-in-from-right-8 fade-in duration-1000">
                <div className="relative group">
                    <div className="absolute -inset-4 bg-gradient-to-tr from-teal-100 to-blue-100 rounded-[4rem] blur-2xl opacity-40 group-hover:opacity-70 transition duration-1000" />
                    <div className="relative aspect-square w-full rounded-[3.5rem] overflow-hidden border-8 border-white shadow-[0_40px_100px_-20px_rgba(0,136,148,0.15)]">
                        <img src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80" alt="Pet care with Pakuna" className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-1000" />
                        
                        {/* Interactive UI Element */}
                        <div className="absolute bottom-8 left-8 right-8 p-7 bg-white/95 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-2xl flex items-center justify-between transform group-hover:translate-y-[-10px] transition-transform duration-500">
                             <div>
                                <p className="text-[10px] text-[#008894] font-black uppercase tracking-[0.2em] mb-1">Status de Salud</p>
                                <p className="text-[#00457C] font-black text-2xl tracking-tight">100% Protegido</p>
                             </div>
                             <div className="w-16 h-16 rounded-[1.5rem] bg-[#008894] flex items-center justify-center shadow-lg shadow-teal-500/30">
                                <ShieldCheck className="w-9 h-9 text-white" />
                             </div>
                        </div>
                    </div>
                </div>
             </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="how-it-works" className="py-32 bg-white relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-[40vh] h-[40vh] bg-teal-50/50 rounded-full blur-[120px]" />
          <div className="container mx-auto px-6 max-w-6xl relative z-10">
              <div className="text-center mb-28 space-y-6">
                  <h2 className="text-5xl md:text-7xl font-black text-[#00457C] tracking-tighter leading-tight">Cuidado sin Estrés</h2>
                  <p className="text-slate-500 max-w-2xl mx-auto text-xl font-medium leading-relaxed">Todo lo que necesitas para ser el dueño perfecto, respaldado por una red de confianza.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                  <FeatureCard 
                    icon={<Smartphone className="w-12 h-12 text-[#008894]" />}
                    title="Ficha Digital Inteligente"
                    description="Identificación inmediata y contacto de emergencia. Comparte el historial clínico con cualquier especialista con un solo escaneo."
                  />
                  <FeatureCard 
                    icon={<ActivitySquare className="w-12 h-12 text-[#008894]" />}
                    title="Control Preventivo"
                    description="Centraliza vacunas, tratamientos y recordatorios. La salud de tu mascota organizada y siempre a mano."
                  />
                  <FeatureCard 
                    icon={<HeartPulse className="w-12 h-12 text-[#008894]" />}
                    title="Red de Apoyo"
                    description="Conecta con veterinarias y partners certificados. Recibe alertas y consejos personalizados para el bienestar de tu mascota."
                  />
              </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section id="demo" className="py-32 relative bg-slate-50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#00457C]/5 to-transparent pointer-events-none" />
          <div className="container mx-auto px-6 max-w-3xl relative z-10 text-center space-y-8">
            <h2 className="text-4xl md:text-6xl font-black text-[#00457C] tracking-tighter leading-tight">
              Empieza hoy mismo
            </h2>
            <p className="text-slate-500 text-xl font-medium leading-relaxed">
              Únete a miles de familias que ya gestionan el bienestar de sus mascotas con tranquilidad y orden.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-6">
              <Link to="/login" className="flex-1 sm:flex-none">
                <Button className="px-12 py-7 rounded-[2.5rem] bg-[#008894] hover:bg-teal-700 text-white font-black text-xl border-none shadow-2xl shadow-teal-900/30 w-full sm:w-auto active:scale-95 transition-all text-center flex justify-center">
                  Crear cuenta gratis
                </Button>
              </Link>
              <Link to="/login" className="flex-1 sm:flex-none">
                <Button variant="outline" className="px-12 py-7 rounded-[2.5rem] font-black text-xl w-full sm:w-auto active:scale-95 transition-all text-center flex justify-center">
                  Ya tengo cuenta
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-slate-100 py-20">
        <div className="container mx-auto px-6 flex flex-col items-center gap-12 text-center">
           <Logo className="h-14" />
           <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">Protegiendo lo que más amas</p>
           <div className="flex gap-10 text-[#00457C]/40 font-black text-xs uppercase tracking-widest">
              <a href="#" className="hover:text-[#008894] transition-colors">Privacidad</a>
              <a href="#" className="hover:text-[#008894] transition-colors">Términos</a>
              <a href="#" className="hover:text-[#008894] transition-colors">Contacto</a>
           </div>
           <p className="text-[#00457C]/30 text-[11px] font-medium">© 2026 Pakuna - Tu aliado en salud preventiva.</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <Card className="flex flex-col items-center text-center group hover:translate-y-[-8px] hover:shadow-2xl hover:shadow-teal-900/5 transition-all duration-500 p-12 border-slate-100/50">
    <div className="p-6 bg-slate-50 rounded-[2rem] mb-8 group-hover:bg-teal-50 group-hover:scale-110 transition-all duration-500">
      {icon}
    </div>
    <h3 className="text-2xl font-black text-[#00457C] mb-4 tracking-tight leading-tight">{title}</h3>
    <p className="text-slate-500 leading-relaxed font-medium">{description}</p>
  </Card>
);

export default LandingPage;
