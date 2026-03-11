import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from '../components/ui/Components';
import Logo from '../components/ui/Logo';
import { ShieldCheck, ArrowRight, Smartphone, HeartPulse, ActivitySquare, Star } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-zinc-950 font-sans selection:bg-teal-500/30 overflow-hidden relative">
      
      {/* Background Ambient Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-teal-600/10 rounded-full blur-[120px] mix-blend-screen animate-float pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[35vw] h-[35vw] bg-emerald-600/10 rounded-full blur-[100px] mix-blend-screen animate-float-delayed pointer-events-none" />

      {/* Navigation */}
      <nav className="border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <Logo className="w-8 h-8" />
             <span className="font-extrabold text-xl text-white tracking-tight">Pakuna</span>
          </div>
          <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-zinc-400">
             <a href="#how-it-works" className="hover:text-teal-400 transition-colors">La Ficha Digital</a>
             <a href="#demo" className="hover:text-teal-400 transition-colors">Empezar Ahora</a>
          </div>
          <Link to="/login">
            <Button variant="outline" className="text-xs md:text-sm border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800">
               Ingresar al App
            </Button>
          </Link>
        </div>
      </nav>

      <main>
        {/* HERO SECTION */}
        <section className="relative pt-24 pb-32 lg:pt-36 lg:pb-48 px-6 overflow-hidden">
          <div className="container mx-auto max-w-6xl relative z-10 flex flex-col lg:flex-row items-center gap-16">
             <div className="flex-1 text-center lg:text-left space-y-8 animate-in slide-in-from-left-8 fade-in duration-1000">
                 <div className="inline-flex items-center rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-2 text-sm font-bold text-teal-400 backdrop-blur-sm shadow-lg shadow-teal-900/20">
                     <Star className="mr-2 h-4 w-4 fill-current animate-pulse-slow" />
                     El ecosistema #1 de Salud Preventiva
                 </div>
                 
                 <h1 className="text-5xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
                    Tranquilidad <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Total</span> para ti.<br/>
                    La mejor salud para ellos.
                 </h1>
                 
                 <p className="text-xl text-zinc-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                   El puente digital entre tu casa y el consultorio. Nunca más olvides una vacuna, ten todo su historial siempre a mano, y protégelo con una Placa GPS Inteligente.
                 </p>
                 
                 <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                    <Link to="/login" className="w-full sm:w-auto">
                      <Button className="px-8 py-5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-lg border-none shadow-xl shadow-teal-900/40 w-full hover:animate-glow transition-all">
                         Consigue tu Placa Inteligente
                      </Button>
                    </Link>
                    <Button variant="ghost" onClick={() => document.getElementById('how-it-works').scrollIntoView({behavior: 'smooth'})} className="px-8 py-5 rounded-2xl text-zinc-300 hover:text-white hover:bg-zinc-800 font-bold text-lg w-full sm:w-auto">
                       Descubrir Cómo Funciona <ArrowRight className="inline ml-2 w-5 h-5" />
                    </Button>
                 </div>
             </div>

             <div className="flex-1 w-full max-w-lg lg:max-w-none animate-in slide-in-from-right-8 fade-in duration-1000 animate-float">
                <div className="relative aspect-[4/5] md:aspect-square w-full rounded-full lg:rounded-[3rem] overflow-hidden border-8 border-zinc-900 shadow-2xl">
                    <img src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80" alt="Perro feliz con dueño" className="object-cover w-full h-full opacity-80" />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                    
                    {/* Floating UI Elements */}
                    <div className="absolute bottom-10 left-10 right-10 p-6 bg-zinc-900/80 backdrop-blur-md rounded-2xl border border-zinc-700/50 shadow-2xl flex items-center justify-between">
                         <div>
                            <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider mb-1">Próxima Vacuna</p>
                            <p className="text-white font-bold text-lg">Mañana, 10:00 AM</p>
                         </div>
                         <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/50">
                            <ShieldCheck className="w-6 h-6 text-emerald-400" />
                         </div>
                    </div>
                </div>
             </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="how-it-works" className="py-24 bg-zinc-900/30 border-y border-zinc-800/50 relative">
          <div className="container mx-auto px-6 max-w-6xl">
              <div className="text-center mb-16 space-y-4">
                  <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">Cuidado Premium en tu Bolsillo</h2>
                  <p className="text-zinc-400 max-w-2xl mx-auto text-lg">Todo lo que necesitas para ser el dueño perfecto, sin el estrés de recordar cada detalle médico de tu mejor amigo.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <FeatureCard 
                    icon={<Smartphone className="w-8 h-8 text-teal-400" />}
                    title="Placa QR Inteligente"
                    description="Quien lo encuentre, escanea el QR. Te enviamos la ubicación GPS al instante y pueden ver tu contacto de emergencia directo en su móvil."
                  />
                  <FeatureCard 
                    icon={<HeartPulse className="w-8 h-8 text-emerald-400" />}
                    title="Bitácora Médica Digital"
                    description="Las veterinarias actualizan la ficha clínica tras cada visita. Tú llevas el historial de vacunas, peso y recetas médicas en tu teléfono."
                  />
                  <FeatureCard 
                    icon={<ActivitySquare className="w-8 h-8 text-cyan-400" />}
                    title="Recordatorios Automáticos"
                    description="La app te avisa antes de que venzan sus vacunas o desparasitaciones, agendando la cita con tu clínica preferida con un solo toque."
                  />
              </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section id="demo" className="py-24 relative">
          <div className="container mx-auto px-6 max-w-2xl relative z-10 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
              Empieza hoy, es gratis
            </h2>
            <p className="text-zinc-400 text-lg mb-10 leading-relaxed">
              Crea tu cuenta, registra a tu mascota y genera tu Ficha Digital en menos de 2 minutos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login" className="w-full sm:w-auto">
                <Button className="px-10 py-5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-lg border-none shadow-xl shadow-teal-900/40 w-full">
                  Crear cuenta gratis
                </Button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <Button variant="ghost" className="px-10 py-5 rounded-2xl text-zinc-300 hover:text-white hover:bg-zinc-800 font-bold text-lg w-full border border-zinc-700">
                  Ya tengo cuenta
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </main>
      
      {/* Footer */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950 py-12 text-center text-zinc-500 text-sm">
         <div className="flex justify-center items-center gap-2 mb-4">
            <Logo className="w-5 h-5 grayscale opacity-50" /> Pakuna
         </div>
         <p>© 2026 Pakuna - Interactive Healthcare Ecosystem. V3 Architecture.</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <Card className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 p-8 flex flex-col hover:border-teal-500/30 transition-all duration-300 shadow-lg group">
     <div className="p-4 bg-zinc-950 rounded-2xl w-max mb-6 border border-zinc-800 shadow-inner group-hover:scale-110 transition-transform duration-500">
        {icon}
     </div>
     <h3 className="text-xl font-bold text-slate-50 mb-3">{title}</h3>
     <p className="text-zinc-400 leading-relaxed text-sm">{description}</p>
  </Card>
);

export default LandingPage;
