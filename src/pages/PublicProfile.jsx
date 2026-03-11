import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
  AlertTriangle, Phone, Heart, QrCode,
  MapPin, CheckCircle, Loader2, Send
} from 'lucide-react';
import { getPetBySlug } from '../services/pets.service';
import { recordScan, getGeolocation } from '../services/scans.service';
import { getUserProfile } from '../services/auth.service';

const PublicProfile = () => {
  const { slug } = useParams();

  // Pet & owner state
  const [pet, setPet] = useState(null);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);

  // Case 2 flow state
  const [showFoundFlow, setShowFoundFlow] = useState(false);
  const [foundStep, setFoundStep] = useState('confirm'); // 'confirm' | 'gps' | 'sending' | 'done'
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');

  // Case 3 flow state
  const [reportSent, setReportSent] = useState(false);

  // ── Load pet & owner ──────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      const petData = await getPetBySlug(slug);
      if (!petData) { setLoading(false); return; }

      const ownerData = await getUserProfile(petData.ownerId);
      setPet(petData);
      setOwner(ownerData);
      setLoading(false);

      // Register a passive scan (no interaction, no notification)
      const location = await getGeolocation();
      await recordScan({
        petId: petData.id,
        petSlug: slug,
        location,
        type: 'normal',
      });
    };
    load();
  }, [slug]);

  // ── CASE 2: "Found safe" handler ──────────────────────────────
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

  // ── CASE 3: Emergency contact handler ─────────────────────────
  const buildWhatsAppUrl = (location) => {
    const text = encodeURIComponent(
      `Hola, encontré a tu mascota *${pet.name}*. Escaneé su placa QR. `
      + (location?.lat
        ? `Mi ubicación: https://maps.google.com/?q=${location.lat},${location.lng}`
        : 'No tengo GPS activo.')
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

  // ── Loading / Not found guards ────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
    </div>
  );

  if (!pet) return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-center px-6">
      <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
      <h1 className="text-2xl font-bold text-white mb-2">Perfil no encontrado</h1>
      <p className="text-zinc-400">Este código QR no está registrado en el sistema.</p>
    </div>
  );

  const isLost = pet.status === 'lost';

  // ═══════════════════════════════════════════════════════════════
  // CASE 3 — EMERGENCY MODE (pet.status === 'lost')
  // ═══════════════════════════════════════════════════════════════
  if (isLost) return (
    <div className="min-h-screen bg-red-950 flex flex-col">

      {/* Emergency Banner */}
      <div className="bg-red-600 text-white text-center py-4 px-4 animate-pulse">
        <p className="text-xl font-extrabold tracking-wide uppercase">
          🚨 ESTOY PERDIDO — ¡AYÚDAME!
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center px-4 py-8 gap-6 max-w-md mx-auto w-full">

        {/* Pet Photo */}
        <div className="relative">
          {pet.photoURL
            ? <img src={pet.photoURL} alt={pet.name}
                className="w-40 h-40 rounded-full object-cover border-4 border-red-500 shadow-2xl shadow-red-900/60" />
            : <div className="w-40 h-40 rounded-full bg-zinc-800 border-4 border-red-500 flex items-center justify-center">
                <span className="text-6xl">🐾</span>
              </div>
          }
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
            PERDIDO
          </span>
        </div>

        {/* Pet Identity */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-white">{pet.name}</h1>
          <p className="text-red-300 mt-1">{pet.species} · {pet.breed}</p>
        </div>

        {/* Medical Alerts */}
        {pet.medicalAlerts && (
          <div className="w-full bg-red-900/60 border border-red-500/50 rounded-2xl p-4">
            <p className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2">
              ⚠️ Alertas Médicas
            </p>
            <p className="text-white text-sm leading-relaxed">{pet.medicalAlerts}</p>
          </div>
        )}

        {/* Direct Contact — only revealed in lost mode */}
        <div className="w-full space-y-3">
          <a
            href={`tel:${owner?.phone}`}
            className="flex items-center justify-center gap-3 w-full bg-green-600 hover:bg-green-500 text-white font-extrabold py-5 rounded-2xl text-lg shadow-xl shadow-green-900/40 transition-colors"
          >
            <Phone className="w-6 h-6" />
            Llamar al Dueño Ahora
          </a>

          <button
            onClick={handleSendLocationWhatsApp}
            className="flex items-center justify-center gap-3 w-full bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl text-base transition-colors"
          >
            <Send className="w-5 h-5" />
            Enviar mi ubicación por WhatsApp
          </button>

          {reportSent && (
            <div className="flex items-center gap-2 justify-center text-green-400 text-sm mt-1">
              <CheckCircle className="w-4 h-4" />
              <span>¡El dueño fue notificado de tu ubicación!</span>
            </div>
          )}
        </div>

        {/* Emergency contact if exists */}
        {owner?.emergencyContact?.phone && (
          <div className="w-full">
            <p className="text-xs text-red-400 text-center mb-2 font-bold uppercase tracking-wider">
              Contacto de emergencia alternativo
            </p>
            <a
              href={`tel:${owner.emergencyContact.phone}`}
              className="flex items-center justify-center gap-3 w-full bg-red-800 hover:bg-red-700 text-white font-bold py-4 rounded-2xl transition-colors"
            >
              <Phone className="w-5 h-5" />
              {owner.emergencyContact.name} — Llamar
            </a>
          </div>
        )}
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════
  // CASE 1 — CURIOSITY MODE (pet.status === 'safe', default view)
  // ═══════════════════════════════════════════════════════════════
  // Also entry point for Case 2 (found flow overlays on top of this)
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-sm flex flex-col items-center gap-6">

        {/* Safe Badge */}
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 text-sm font-bold">Mascota segura</span>
        </div>

        {/* Pet Photo */}
        {pet.photoURL
          ? <img src={pet.photoURL} alt={pet.name}
              className="w-36 h-36 rounded-full object-cover border-4 border-teal-500/40 shadow-xl" />
          : <div className="w-36 h-36 rounded-full bg-zinc-800 border-4 border-teal-500/40 flex items-center justify-center">
              <span className="text-5xl">🐾</span>
            </div>
        }

        {/* Pet Identity */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-white">{pet.name}</h1>
          <p className="text-zinc-400 mt-1">{pet.species} · {pet.breed} · {pet.age} años</p>
        </div>

        {/* Fun Fact — Case 1 only visible element beyond identity */}
        {pet.funFact && (
          <div className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center">
            <p className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-2">
              Dato curioso
            </p>
            <p className="text-zinc-300 text-sm leading-relaxed">"{pet.funFact}"</p>
          </div>
        )}

        {/* ── CASE 2 OVERLAY: Found safe flow ────────────────────── */}
        {showFoundFlow ? (
          <div className="w-full bg-amber-900/30 border border-amber-500/30 rounded-2xl p-6">

            {foundStep === 'confirm' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <h2 className="text-white font-bold">¿Encontraste a {pet.name}?</h2>
                </div>
                <p className="text-zinc-400 text-sm">
                  Déjanos tus datos de contacto (opcional) y avisaremos al dueño de tu ubicación.
                  <strong className="text-amber-400"> Tu número no será público.</strong>
                </p>
                <form onSubmit={handleFoundSafe} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Tu nombre (opcional)"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  />
                  <input
                    type="tel"
                    placeholder="Tu teléfono (opcional)"
                    value={reporterPhone}
                    onChange={(e) => setReporterPhone(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  />
                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-3.5 rounded-xl transition-colors"
                  >
                    Avisar al dueño ahora
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowFoundFlow(false)}
                    className="w-full text-zinc-500 hover:text-zinc-300 text-sm py-2"
                  >
                    Cancelar
                  </button>
                </form>
              </div>
            )}

            {foundStep === 'sending' && (
              <div className="flex flex-col items-center gap-3 py-4">
                <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
                <p className="text-white font-bold">Avisando al dueño...</p>
                <p className="text-zinc-400 text-xs text-center">
                  Obteniendo tu ubicación y enviando la alerta
                </p>
              </div>
            )}

            {foundStep === 'done' && (
              <div className="flex flex-col items-center gap-3 py-4 text-center">
                <CheckCircle className="w-12 h-12 text-green-500" />
                <h3 className="text-white font-bold text-lg">¡El dueño fue avisado!</h3>
                <p className="text-zinc-400 text-sm">
                  Gracias por tu ayuda. Si el dueño quiere contactarte,
                  se comunicará contigo directamente.
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Default CTAs when found flow is not active */
          <div className="w-full space-y-3">
            {/* CTA Primary — Case 2 trigger */}
            <button
              onClick={() => setShowFoundFlow(true)}
              className="flex items-center justify-center gap-3 w-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold py-4 rounded-2xl transition-colors"
            >
              <Heart className="w-5 h-5" />
              ¿Encontraste a esta mascota?
            </button>

            {/* CTA Secondary — Case 1: marketing conversion */}
            <Link
              to="/login"
              className="flex items-center justify-center gap-3 w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-4 rounded-2xl transition-colors shadow-lg shadow-teal-900/30"
            >
              <QrCode className="w-5 h-5" />
              Quiero un QR gratis para mi mascota
            </Link>

            {/* CTA Tertiary — Marketplace placeholder (post-MVP) */}
            <button
              disabled
              className="flex items-center justify-center gap-3 w-full bg-zinc-800/50 text-zinc-600 font-bold py-4 rounded-2xl cursor-not-allowed"
              title="Próximamente"
            >
              <MapPin className="w-5 h-5" />
              Ver servicios médicos cerca
              <span className="text-xs bg-zinc-700 text-zinc-400 px-2 py-0.5 rounded-full ml-1">
                Próximamente
              </span>
            </button>
          </div>
        )}

        {/* Footer branding */}
        <p className="text-zinc-700 text-xs text-center mt-4">
          Ficha digital generada por{' '}
          <span className="text-teal-600 font-bold">Pakuna</span>
        </p>
      </div>
    </div>
  );
};

export default PublicProfile;
