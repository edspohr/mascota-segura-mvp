/* eslint-env node */
const { onRequest } = require("firebase-functions/v2/https");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const { initializeApp } = require("firebase-admin/app");
const { Resend } = require("resend");
const { defineSecret } = require("firebase-functions/params");

initializeApp();
const db = getFirestore();

const RESEND_API_KEY = defineSecret("RESEND_API_KEY");
const FROM_EMAIL = "Pakuna <alertas@pakuna.app>";
const APP_URL = "https://pakuna-3413d.web.app";

/**
 * onQRScanned HTTP Function
 * Handles scan logging, anti-spam, and immediate owner notifications.
 */
exports.onQRScanned = onRequest(
  { secrets: [RESEND_API_KEY], cors: true, region: "us-central1" },
  async (req, res) => {
    if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });

    const { petId, petSlug, location, type = "normal", reporterName, reporterPhone } = req.body;
    if (!petId || !petSlug) return res.status(400).json({ error: "Faltan petId o petSlug" });

    // ── Anti-spam: skip owner notification if same IP scanned this pet
    //    within the last 10 minutes. Still log the scan for analytics.
    const rawIp = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket?.remoteAddress || "unknown";
    const sessionKey = `${petId}_${rawIp.replace(/\./g, "_")}`;
    const sessionRef = db.collection("scan_sessions").doc(sessionKey);

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
      console.warn("Spam check error (non-fatal):", err.message);
    }

    try {
      // Always log the scan document
      await db.collection("scans").add({
        petId, petSlug, type,
        location: location || { lat: null, lng: null, address: null },
        reporterName: reporterName || null,
        reporterPhone: reporterPhone || null,
        isSpam,
        timestamp: FieldValue.serverTimestamp(),
      });

      // Only notify owner if not spam and scan type warrants notification
      if (!isSpam && (type === "found_safe" || type === "emergency")) {
        const petDoc = await db.collection("pets").doc(petId).get();
        if (!petDoc.exists) return res.status(404).json({ error: "Mascota no encontrada" });

        const pet = petDoc.data();
        const ownerDoc = await db.collection("users").doc(pet.ownerId).get();
        if (!ownerDoc.exists) return res.status(200).json({ ok: true });

        const owner = ownerDoc.data();
        const resend = new Resend(RESEND_API_KEY.value());

        const locationText = location?.lat
          ? `📍 <a href="https://maps.google.com/?q=${location.lat},${location.lng}">Ver en Google Maps</a>`
          : location?.address
          ? `📍 Dirección reportada: ${location.address}`
          : "Ubicación no disponible";

        if (type === "found_safe") {
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
                    <td style="padding:8px 12px;border:1px solid #e5e7eb">${reporterName || "Anónimo"}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:bold">Teléfono</td>
                    <td style="padding:8px 12px;border:1px solid #e5e7eb">${reporterPhone || "No proporcionó"}</td>
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
        } else if (type === "emergency") {
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
                    <td style="padding:8px 12px;border:1px solid #e5e7eb">${reporterName || "Anónimo"}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:bold">Teléfono</td>
                    <td style="padding:8px 12px;border:1px solid #e5e7eb">${reporterPhone || "No proporcionó"}</td>
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
                    style="background:#00457C;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">
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
      console.error("onQRScanned error:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
);
