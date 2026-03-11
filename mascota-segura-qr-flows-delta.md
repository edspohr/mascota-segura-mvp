# QR SCAN FLOWS — DELTA PATCH
## Apply on top of: `mascota-segura-agent-prompt.md`

> This document overrides and extends `PublicProfile.jsx`, the `scans` schema,
> the `pets` schema, and the `onQRScanned` Cloud Function as defined in the main
> prompt. All other files remain unchanged.
>
> **Language rule applies here too:** every user-facing string must be in Spanish.

---

## DECISIONS LOCKED IN

| Decision | Resolution |
|---|---|
| WhatsApp relay chatbot | ❌ Dropped — use direct `wa.me` deep link instead |
| When to reveal owner phone | Only when owner has activated **Modo Perdido** (`status === 'lost'`) |
| Marketplace B2B | ❌ Post-MVP — render placeholder button only |
| Push notifications | ❌ Post-MVP — email via Resend is sufficient for MVP |

---

## SECTION A — SCHEMA CHANGES

### A.1 Add fields to `/pets/{petId}`

Add the following two fields to the Firestore pet document. Both are optional
(empty string by default) so existing pets are not affected:

```javascript
funFact: string,        // e.g. "Le encanta perseguir palomas" — shown on public profile
medicalAlerts: string,  // e.g. "Alérgico a ibuprofeno. Toma enalapril 2.5mg." — shown ONLY in emergency mode
```

Update `createPet()` in `src/services/pets.service.js` to include these fields
with empty string defaults:

```javascript
// Inside createPet(), add to the addDoc payload:
funFact: petData.funFact || '',
medicalAlerts: petData.medicalAlerts || '',
```

Add both fields to the pet creation form in `OwnerDashboard.jsx`:
- **Dato curioso** (textarea, max 120 chars, placeholder: "Ej: Le encanta perseguir palomas")
- **Alertas médicas** (textarea, max 300 chars, placeholder: "Ej: Alérgico a ibuprofeno. Solo para uso veterinario/emergencias.")
- Add a note below the medical alerts field:
  `"⚠️ Solo visible cuando la mascota está en Modo Perdido."`

### A.2 Add new scan type

The `type` field in `/scans/{scanId}` now has three possible values:

```
type: 'normal' | 'found_safe' | 'emergency'
```

- `normal` — passive scan, no button pressed, pet is safe
- `found_safe` — third party pressed "¿Encontraste a esta mascota?" while pet status is `safe`
- `emergency` — pet status is `lost` and third party submitted reporter data

### A.3 Add spam control collection

New Firestore collection for rate limiting. Documents are keyed by
`{petId}_{anonymizedIp}` and auto-expire via Firestore TTL:

```
/scan_sessions/{sessionId}
  petId: string
  ip: string        // last two octets only, e.g. "*.*.45.123"
  lastScan: Timestamp
  expireAt: Timestamp  // set to lastScan + 10 minutes (used by Firestore TTL policy)
```

> **One-time setup:** Enable Firestore TTL on this collection:
> Firebase Console → Firestore → Indexes → TTL policies → Add policy
> Collection: `scan_sessions` · Field: `expireAt`

---

## SECTION B — THREE-CASE LOGIC IN `PublicProfile.jsx`

Replace the entire data-loading and rendering logic in `PublicProfile.jsx` with
the implementation below. **Do not change any existing Tailwind classNames** —
only add new conditional rendering blocks and new JSX sections.

### B.1 Determine which of the 3 cases applies

```javascript
// After loading the pet document:
const isLost = pet.status === 'lost';       // Case 3: Emergency
const isSafe = pet.status === 'safe';       // Case 1 or Case 2
```

The distinction between Case 1 and Case 2 is **user action**, not pet state:
- Case 1 renders by default when `isSafe === true`
- Case 2 activates when the user presses "¿Encontraste a esta mascota?"

---

### B.2 Full updated `PublicProfile.jsx`

```javascript
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
  const [showEmergencyContact, setShowEmergencyContact] = useState(false);
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
          <span className="text-teal-600 font-bold">Mascota Segura</span>
        </p>
      </div>
    </div>
  );
};

export default PublicProfile;
```

---

## SECTION C — ANTI-SPAM IN `onQRScanned` CLOUD FUNCTION

Replace the beginning of the `onQRScanned` function body with this version.
The rest of the function (email sending logic) remains unchanged:

```javascript
exports.onQRScanned = onRequest(
  { secrets: [RESEND_API_KEY], cors: true, region: 'us-central1' },
  async (req, res) => {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

    const { petId, petSlug, location, type = 'normal', reporterName, reporterPhone } = req.body;
    if (!petId || !petSlug) return res.status(400).json({ error: 'Faltan petId o petSlug' });

    // ── Anti-spam: skip owner notification if same IP scanned this pet
    //    within the last 10 minutes. Still log the scan for analytics.
    const rawIp = req.headers['x-forwarded-for']?.split(',')[0] || req.socket?.remoteAddress || 'unknown';
    const sessionKey = `${petId}_${rawIp.replace(/\./g, '_')}`;
    const sessionRef = db.collection('scan_sessions').doc(sessionKey);

    let isSpam = false;
    try {
      const sessionDoc = await sessionRef.get();
      if (sessionDoc.exists) {
        const lastScan = sessionDoc.data().lastScan?.toMillis() || 0;
        isSpam = (Date.now() - lastScan) < 10 * 60 * 1000; // 10 minutes
      }
      // Always update the session timestamp
      const expireAt = new Date(Date.now() + 10 * 60 * 1000);
      await sessionRef.set({
        petId,
        ip: rawIp,
        lastScan: FieldValue.serverTimestamp(),
        expireAt,
      }, { merge: true });
    } catch (err) {
      // If spam check fails, continue normally — don't block the user
      console.warn('Spam check error (non-fatal):', err.message);
    }

    try {
      // Always log the scan document regardless of spam status
      await db.collection('scans').add({
        petId, petSlug, type,
        location: location || { lat: null, lng: null, address: null },
        reporterName: reporterName || null,
        reporterPhone: reporterPhone || null,
        isSpam,
        timestamp: FieldValue.serverTimestamp(),
      });

      // Only notify owner if not spam and scan type warrants notification
      if (!isSpam && (type === 'found_safe' || type === 'emergency')) {
        const petDoc = await db.collection('pets').doc(petId).get();
        if (!petDoc.exists) return res.status(404).json({ error: 'Mascota no encontrada' });

        const pet = petDoc.data();
        const ownerDoc = await db.collection('users').doc(pet.ownerId).get();
        if (!ownerDoc.exists) return res.status(200).json({ ok: true });

        const owner = ownerDoc.data();
        const resend = new Resend(RESEND_API_KEY.value());

        const locationText = location?.lat
          ? `📍 <a href="https://maps.google.com/?q=${location.lat},${location.lng}">Ver en Google Maps</a>`
          : location?.address
          ? `📍 Dirección reportada: ${location.address}`
          : 'Ubicación no disponible';

        if (type === 'found_safe') {
          // Case 2 email: someone pressed "¿Encontraste a esta mascota?"
          await resend.emails.send({
            from: FROM_EMAIL,
            to: owner.email,
            subject: `👀 Alguien vio a ${pet.name} en la calle`,
            html: `
              <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
                <h1 style="color:#f59e0b">Aviso: ${pet.name} fue visto</h1>
                <p>Una persona escaneó la placa QR de <strong>${pet.name}</strong> y activó el botón de hallazgo.</p>
                <table style="border-collapse:collapse;width:100%;margin:16px 0">
                  <tr>
                    <td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:bold">¿Quién lo vio?</td>
                    <td style="padding:8px 12px;border:1px solid #e5e7eb">${reporterName || 'Anónimo'}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:bold">Teléfono</td>
                    <td style="padding:8px 12px;border:1px solid #e5e7eb">${reporterPhone || 'No proporcionó'}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:bold">Ubicación</td>
                    <td style="padding:8px 12px;border:1px solid #e5e7eb">${locationText}</td>
                  </tr>
                </table>
                <p style="color:#6b7280;font-size:13px">
                  ${pet.name} no está marcado como perdido en el sistema.
                  Si crees que está en riesgo, activa el Modo Perdido desde tu dashboard.
                </p>
                <p style="margin-top:20px">
                  <a href="${APP_URL}/dashboard"
                    style="background:#f59e0b;color:#000;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">
                    Ir a mi dashboard
                  </a>
                </p>
              </div>
            `,
          });
        } else if (type === 'emergency') {
          // Case 3 email: pet is lost, someone scanned and sent location
          await resend.emails.send({
            from: FROM_EMAIL,
            to: owner.email,
            subject: `🚨 ¡Encontraron a ${pet.name}! Contacto directo establecido`,
            html: `
              <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
                <h1 style="color:#dc2626">¡${pet.name} fue encontrado!</h1>
                <p>Alguien escaneó la placa QR de <strong>${pet.name}</strong> en modo emergencia y compartió su ubicación.</p>
                <table style="border-collapse:collapse;width:100%;margin:16px 0">
                  <tr>
                    <td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:bold">Samaritano</td>
                    <td style="padding:8px 12px;border:1px solid #e5e7eb">${reporterName || 'Anónimo'}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:bold">Teléfono</td>
                    <td style="padding:8px 12px;border:1px solid #e5e7eb">${reporterPhone || 'No proporcionó'}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:bold">Ubicación</td>
                    <td style="padding:8px 12px;border:1px solid #e5e7eb">${locationText}</td>
                  </tr>
                </table>
                <p style="color:#6b7280;font-size:13px">
                  Cuando reencuentres a ${pet.name}, recuerda desactivar el Modo Perdido desde tu dashboard.
                </p>
                <p style="margin-top:20px">
                  <a href="${APP_URL}/dashboard"
                    style="background:#0d9488;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">
                    Ir a mi dashboard
                  </a>
                </p>
              </div>
            `,
          });
        }
      }

      res.status(200).json({ ok: true, spam: isSpam });
    } catch (err) {
      console.error('onQRScanned error:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);
```

---

## SECTION D — UPDATED `scans.service.js`

The frontend service now calls the Cloud Function via HTTP instead of writing
directly to Firestore. This is required for the anti-spam logic to work
(Firestore Security Rules allow direct writes, bypassing Cloud Function checks).

Replace `src/services/scans.service.js` completely:

```javascript
const FUNCTIONS_BASE_URL = import.meta.env.DEV
  ? 'http://localhost:5001/pakuna-3413d/us-central1'
  : 'https://us-central1-pakuna-3413d.cloudfunctions.net';

/**
 * Records a QR scan. Routes through the Cloud Function so anti-spam
 * validation and email notifications fire on the server side.
 */
export const recordScan = async ({ petId, petSlug, location, type = 'normal', reporter = null }) => {
  try {
    await fetch(`${FUNCTIONS_BASE_URL}/onQRScanned`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        petId,
        petSlug,
        type,
        location: {
          lat: location?.lat || null,
          lng: location?.lng || null,
          address: location?.address || null,
        },
        reporterName: reporter?.name || null,
        reporterPhone: reporter?.phone || null,
      }),
    });
  } catch (err) {
    // Non-fatal: scan logging failure should not block the public profile UI
    console.warn('recordScan failed (non-fatal):', err.message);
  }
};

/**
 * Requests browser geolocation. Resolves with coords or nulls — never rejects.
 */
export const getGeolocation = () =>
  new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ lat: null, lng: null, address: null });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        address: null,
      }),
      () => resolve({ lat: null, lng: null, address: null }),
      { timeout: 5000 }
    );
  });
```

---

## SECTION E — FIRESTORE SECURITY RULES UPDATE

Add the `scan_sessions` collection to `firestore.rules`.
Replace the `scans` rule block and add `scan_sessions`:

```javascript
// REPLACE the existing scans rule:
match /scans/{scanId} {
  allow read: if isSuperAdmin();
  // Writes now go through Cloud Function — block direct client writes
  allow create: if false;
  allow update, delete: if isSuperAdmin();
}

// ADD after the scans rule:
match /scan_sessions/{sessionId} {
  allow read, write: if false; // Cloud Function only
}
```

---

## SECTION F — AGENT CHECKLIST ADDITIONS

Add these items to the verification checklist in Step 15 of the main prompt:

| # | Check | Expected result |
|---|-------|-----------------|
| 11 | Navigate to `/p/{slug}` for a safe pet | Shows photo, name, breed, fun fact. No phone number visible. |
| 12 | Press "¿Encontraste a esta mascota?" | Slide-in form appears. Submit → "Avisando al dueño..." → "¡El dueño fue avisado!" |
| 13 | Navigate to `/p/{slug}` for a lost pet | Full red emergency UI. "Llamar al Dueño Ahora" and WhatsApp button visible. |
| 14 | Scan the same QR twice within 10 min | Second scan is logged as `isSpam: true`, owner gets no email |
| 15 | Click "Quiero un QR gratis" | Redirects to `/login` |
| 16 | Click "Ver servicios médicos cerca" | Button is disabled with "Próximamente" badge, no action |
| 17 | Check Firestore after Case 2 scan | `/scans` has new doc with `type: 'found_safe'` and owner received amber email |
| 18 | Check Firestore after Case 3 scan | `/scans` has new doc with `type: 'emergency'` and owner received red email |

---

## SUMMARY OF ALL FILES CHANGED BY THIS DELTA

| File | Action |
|---|---|
| `src/pages/PublicProfile.jsx` | Full rewrite — 3 cases, all new JSX |
| `src/services/scans.service.js` | Rewrite — now calls Cloud Function via HTTP |
| `functions/index.js` — `onQRScanned` | Extended — anti-spam + 2 new email templates |
| `firestore.rules` | Add `scan_sessions` block, restrict direct scan writes |
| `src/services/pets.service.js` | Add `funFact` and `medicalAlerts` to `createPet()` |
| `src/pages/OwnerDashboard.jsx` | Add 2 new fields to pet creation form |
