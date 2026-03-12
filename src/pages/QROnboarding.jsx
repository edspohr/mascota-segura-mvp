import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useApp } from '../context';
import { createPet } from '../services/pets.service';
import { uploadPetPhoto } from '../services/storage.service';
import Logo from '../components/ui/Logo';
import { QrCode, CheckCircle, AlertTriangle, ShieldCheck, Plus, Camera } from 'lucide-react';
import { MOCK_QR_CODES, MOCK_PETS } from '../data/mockData';
import { Button, Input } from '../components/ui/Components';

const QROnboarding = () => {
  const { qrSlug } = useParams();
  const navigate = useNavigate();
  const { firebaseUser, addToast, isDemo } = useApp();

  const [qrStatus, setQrStatus] = useState('loading'); // loading | orphan | claimed | invalid
  const [linkedPetSlug, setLinkedPetSlug] = useState(null);
  const [form, setForm] = useState({ name: '', species: 'Perro', breed: '', age: '', weight: '', funFact: '' });
  const [photoFile, setPhotoFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const checkQR = async () => {
      if (isDemo) {
        const mockQr = MOCK_QR_CODES.find(q => q.slug === qrSlug.toUpperCase());
        if (!mockQr) { setQrStatus('invalid'); return; }
        
        if (mockQr.status === 'claimed' && mockQr.petId) {
          const mockPet = MOCK_PETS.find(p => p.id === mockQr.petId);
          if (mockPet) setLinkedPetSlug(mockPet.slug);
          setQrStatus('claimed');
        } else {
          setQrStatus('orphan');
        }
        return;
      }

      const q = query(collection(db, 'qrCodes'), where('slug', '==', qrSlug.toUpperCase()), limit(1));
      const snap = await getDocs(q);
      if (snap.empty) { setQrStatus('invalid'); return; }

      const qrData = snap.docs[0].data();
      if (qrData.status === 'claimed' && qrData.petId) {
        const petSnap = await getDocs(
          query(collection(db, 'pets'), where('__name__', '==', qrData.petId), limit(1))
        );
        if (!petSnap.empty) setLinkedPetSlug(petSnap.docs[0].data().slug);
        setQrStatus('claimed');
      } else {
        setQrStatus('orphan');
        if (!firebaseUser) {
          sessionStorage.setItem('returnTo', `/activar/${qrSlug}`);
          navigate('/login');
        }
      }
    };
    checkQR();
  }, [qrSlug, firebaseUser, navigate, isDemo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isDemo) {
      addToast(`[DEMO] ¡Bienvenido ${form.name}! Tu placa ya está vinculada.`, 'success');
      navigate('/dashboard');
      return;
    }

    if (!firebaseUser) return;
    setSubmitting(true);
    try {
      const petId = await createPet(firebaseUser.uid, form, qrSlug.toUpperCase());
      if (photoFile) {
        const photoURL = await uploadPetPhoto(petId, photoFile);
        const { updatePet } = await import('../services/pets.service');
        await updatePet(petId, { photoURL });
      }
      addToast(`¡Qué alegría! ${form.name} ya tiene su ficha activa.`, 'success');
      navigate('/dashboard');
    } catch {
      addToast('Hubo un pequeño error. Por favor, intenta de nuevo.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (qrStatus === 'loading') return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-[#008894] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (qrStatus === 'invalid') return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-center px-10">
      <div className="p-8 bg-white rounded-full mb-8 shadow-xl text-amber-500 border border-amber-100">
         <AlertTriangle className="w-16 h-16" />
      </div>
      <h1 className="text-3xl font-black text-[#00457C] mb-4">Código no válido</h1>
      <p className="text-slate-500 font-medium max-w-sm">Este código QR no parece ser parte de nuestra red. Por favor, verifica la URL escaneada.</p>
      <Link to="/" className="mt-10 text-[#008894] font-black uppercase tracking-widest text-xs hover:underline">Volver al inicio</Link>
    </div>
  );

  if (qrStatus === 'claimed') return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-center px-10">
      <div className="p-8 bg-white rounded-full mb-8 shadow-xl text-[#008894] border border-teal-100">
         <CheckCircle className="w-16 h-16" />
      </div>
      <h1 className="text-3xl font-black text-[#00457C] mb-4">Placa ya activada</h1>
      <p className="text-slate-500 font-medium max-w-sm mb-10">Esta placa QR ya tiene un compañero vinculado.</p>
      {linkedPetSlug && (
        <Button
          onClick={() => navigate(`/p/${linkedPetSlug}`)}
          className="bg-[#008894] hover:bg-teal-700 text-white font-black px-10 py-5 rounded-[2rem] text-lg shadow-xl shadow-teal-900/10 transition-all"
        >
          Ver Ficha Vinculada
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-20 relative overflow-hidden">
      
      {/* Background Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[80vw] h-[80vw] bg-teal-100/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-blue-100/30 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="p-6 bg-white rounded-[2rem] shadow-2xl shadow-blue-900/10 border border-slate-50 animate-bounce transition-all duration-1000">
            <QrCode className="w-12 h-12 text-[#008894]" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-[#00457C] tracking-tight">¡Hola! Activa tu Placa</h1>
            <p className="text-slate-500 font-medium">Vincula ahora mismo el código <span className="text-[#008894] font-black">{qrSlug?.toUpperCase()}</span> a tu mascota.</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-[3.5rem] p-10 shadow-2xl shadow-blue-950/[0.05] border border-slate-50">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            <Input 
              label="Nombre de tu Mascota" 
              placeholder="Ej: Max, Luna, Toby..." 
              required
              value={form.name} 
              onChange={(e) => setForm({ ...form, name: e.target.value })} 
            />

            <div className="grid grid-cols-2 gap-6">
                <Input 
                  label="Especie" 
                  placeholder="Ej: Perro" 
                  required
                  value={form.species} 
                  onChange={(e) => setForm({ ...form, species: e.target.value })} 
                />
                <Input 
                  label="Raza" 
                  placeholder="Ej: Beagle" 
                  required
                  value={form.breed} 
                  onChange={(e) => setForm({ ...form, breed: e.target.value })} 
                />
            </div>

            <div className="grid grid-cols-2 gap-6">
                <Input 
                  label="Edad" 
                  type="number" 
                  placeholder="Años" 
                  required
                  value={form.age} 
                  onChange={(e) => setForm({ ...form, age: e.target.value })} 
                />
                <Input 
                  label="Peso" 
                  placeholder="Ej: 12kg" 
                  required
                  value={form.weight} 
                  onChange={(e) => setForm({ ...form, weight: e.target.value })} 
                />
            </div>

            {/* Photo Upload Area */}
            <div className="space-y-4">
               <label className="text-[10px] font-black text-[#00457C] uppercase tracking-[0.2em] ml-2 opacity-60">Foto de Perfil (Opcional)</label>
               <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 hover:border-[#008894]/30 transition-all cursor-pointer relative group">
                  <div className="p-4 bg-white rounded-2xl shadow-sm text-slate-300 group-hover:text-[#008894] transition-colors">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div className="flex-grow">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{photoFile ? photoFile.name : 'Subir una foto'}</p>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => setPhotoFile(e.target.files[0] || null)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
               </div>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full py-6 text-xl font-black bg-[#008894] hover:bg-teal-700 text-white border-none shadow-2xl shadow-teal-900/30 rounded-[2rem] active:scale-95 transition-all flex justify-center"
            >
              {submitting ? 'Vínculando...' : 'Activar mi Placa ahora'}
            </Button>
          </form>
        </div>

        {/* Trust Footer */}
        <div className="flex items-center justify-center gap-4 text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">
           <ShieldCheck className="w-4 h-4" />
           <span>Conexión Protegida y Cifrada</span>
        </div>
      </div>
    </div>
  );
};

export default QROnboarding;
