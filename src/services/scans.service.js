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
