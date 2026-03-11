import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useApp } from '../context';
import { createPet } from '../services/pets.service';
import { uploadPetPhoto } from '../services/storage.service';
import Logo from '../components/ui/Logo';
import { QrCode, CheckCircle, AlertTriangle } from 'lucide-react';

const QROnboarding = () => {
  const { qrSlug } = useParams();
  const navigate = useNavigate();
  const { user, firebaseUser, addToast } = useApp();

  const [qrStatus, setQrStatus] = useState('loading'); // loading | orphan | claimed | invalid
  const [linkedPetSlug, setLinkedPetSlug] = useState(null);
  const [form, setForm] = useState({ name: '', species: 'Perro', breed: '', age: '', weight: '' });
  const [photoFile, setPhotoFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const checkQR = async () => {
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
        // If user is not authenticated, store returnTo and redirect to login
        if (!firebaseUser) {
          sessionStorage.setItem('returnTo', `/activar/${qrSlug}`);
          navigate('/login');
        }
      }
    };
    checkQR();
  }, [qrSlug, firebaseUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firebaseUser) return;
    setSubmitting(true);
    try {
      const petId = await createPet(firebaseUser.uid, form, qrSlug.toUpperCase());
      if (photoFile) {
        const photoURL = await uploadPetPhoto(petId, photoFile);
        const { updatePet } = await import('../services/pets.service');
        await updatePet(petId, { photoURL });
      }
      addToast(`¡${form.name} registrado! Tu placa QR ya está activa.`, 'success');
      navigate('/dashboard');
    } catch {
      addToast('Error al registrar la mascota. Intenta de nuevo.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (qrStatus === 'loading') return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (qrStatus === 'invalid') return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-center px-6">
      <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
      <h1 className="text-2xl font-bold text-white mb-2">Código QR no encontrado</h1>
      <p className="text-zinc-400">Este código no existe en el sistema. Verifica que la URL sea correcta.</p>
    </div>
  );

  if (qrStatus === 'claimed') return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-center px-6">
      <CheckCircle className="w-16 h-16 text-emerald-500 mb-4" />
      <h1 className="text-2xl font-bold text-white mb-2">Esta placa ya está registrada</h1>
      <p className="text-zinc-400 mb-6">Este QR ya tiene una mascota vinculada.</p>
      {linkedPetSlug && (
        <button
          onClick={() => navigate(`/p/${linkedPetSlug}`)}
          className="bg-teal-600 hover:bg-teal-500 text-white font-bold px-6 py-3 rounded-xl"
        >
          Ver ficha de la mascota
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="p-4 bg-teal-500/10 rounded-full border border-teal-500/30 mb-4">
            <QrCode className="w-10 h-10 text-teal-400" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">¡Activa tu Placa!</h1>
          <p className="text-zinc-400 text-sm mt-2 text-center">
            Código: <span className="text-teal-400 font-mono font-bold">{qrSlug?.toUpperCase()}</span>
            <br />Registra a tu mascota para vincularla a este QR.
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'Nombre de la mascota', key: 'name', type: 'text', placeholder: 'Ej: Max' },
              { label: 'Especie', key: 'species', type: 'text', placeholder: 'Ej: Perro, Gato' },
              { label: 'Raza', key: 'breed', type: 'text', placeholder: 'Ej: Golden Retriever' },
              { label: 'Edad (años)', key: 'age', type: 'number', placeholder: 'Ej: 3' },
              { label: 'Peso aproximado', key: 'weight', type: 'text', placeholder: 'Ej: 12kg' },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 block">{label}</label>
                <input
                  type={type}
                  required
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            ))}

            <div>
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 block">
                Foto (opcional, máx. 2MB)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhotoFile(e.target.files[0] || null)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-400 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-teal-600 file:text-white file:text-xs file:font-bold"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-teal-900/30 mt-4"
            >
              {submitting ? 'Registrando mascota...' : 'Activar Placa QR'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QROnboarding;
