/* eslint-env node */
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { getFirestore } = require("firebase-admin/firestore");
const { initializeApp } = require("firebase-admin/app");
const { Resend } = require("resend");
const { defineSecret } = require("firebase-functions/params");

initializeApp();
const db = getFirestore();

// Secret definition for Resend API Key
// Note: This requires the Blaze plan to set via 'firebase functions:secrets:set RESEND_API_KEY'
const resendApiKey = defineSecret("RESEND_API_KEY");

/**
 * onScan Trigger
 * Sends an email to the pet owner when their pet's QR is scanned (emergency mode).
 */
exports.onScanCreated = onDocumentCreated({
  document: "scans/{scanId}",
  secrets: [resendApiKey],
}, async (event) => {
  const snapshot = event.data;
  if (!snapshot) return;

  const scanData = snapshot.data();

  // Only send emails for emergency scans
  if (scanData.type !== "emergency") {
    console.log("Normal scan recorded, skipping email.");
    return;
  }

  try {
    // 1. Get pet data to find the owner
    const petDoc = await db.collection("pets").doc(scanData.petId).get();
    if (!petDoc.exists) {
      console.error("Pet not found:", scanData.petId);
      return;
    }
    const petData = petDoc.data();

    // 2. Get owner data to get their email
    const ownerDoc = await db.collection("users").doc(petData.ownerId).get();
    if (!ownerDoc.exists) {
      console.error("Owner not found:", petData.ownerId);
      return;
    }
    const ownerData = ownerDoc.data();

    if (!ownerData.email) {
      console.error("Owner has no email:", ownerData.name);
      return;
    }

    // 3. Initialize Resend
    const resend = new Resend(resendApiKey.value());

    // 4. Send Email
    const { data, error } = await resend.emails.send({
      from: "Mascota Segura <alertas@mascotasegura.app>", // Should use a verified domain in production
      to: [ownerData.email],
      subject: `🚨 ¡ALERTA! Tu mascota ${petData.name} ha sido escaneada`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; 
                    border-radius: 10px; overflow: hidden;">
          <div style="background-color: #ef4444; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">¡Alerta de Emergencia!</h1>
          </div>
          <div style="padding: 20px; color: #333;">
            <p>Hola <strong>${ownerData.name}</strong>,</p>
            <p>Te informamos que la placa inteligente de <strong>${petData.name}</strong> ha sido escaneada 
               en modo de emergencia.</p>
            
            <div style="background-color: #f9fafb; border-left: 4px solid #f97316; padding: 15px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #f97316;">Datos del Reportante:</h3>
              <p style="margin: 5px 0;"><strong>Nombre:</strong> ${scanData.reporter?.name || "Anónimo"}</p>
              <p style="margin: 5px 0;"><strong>Teléfono:</strong> ${scanData.reporter?.phone || "No proporcionado"}</p>
            </div>

            ${scanData.location ? `
              <div style="margin: 20px 0;">
                <p><strong>Ubicación aproximada del escaneo:</strong></p>
                <a href="https://www.google.com/maps?q=${scanData.location.latitude},${scanData.location.longitude}" 
                   style="display: inline-block; background-color: #0d9488; color: white; padding: 10px 20px; 
                          text-decoration: none; border-radius: 5px; font-weight: bold;">
                  Ver en Google Maps
                </a>
              </div>
            ` : "<p><em>No se pudo capturar la ubicación GPS exacta.</em></p>"}

            <p style="font-size: 14px; color: #666; margin-top: 40px; border-top: 1px solid #eee; pt-20;">
              Este es un mensaje automático del sistema Mascota Segura. Por favor, no respondas a este correo.
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Error:", error);
    } else {
      console.log("Email sent successfully:", data.id);
    }
  } catch (err) {
    console.error("Error Processing Scan Function:", err);
  }
});
