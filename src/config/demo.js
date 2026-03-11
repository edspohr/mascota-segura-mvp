// DEMO_MODE stays true in all builds — the gate is now the password,
// not the build flag. Set to false only to remove demo entirely.
export const DEMO_MODE = true;

// Unlock code — sourced from env so it can be rotated without code changes.
export const DEMO_UNLOCK_CODE =
  import.meta.env.VITE_DEMO_UNLOCK_CODE || 'pakuna2025';
