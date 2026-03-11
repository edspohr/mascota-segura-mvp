/**
 * Generates a unique, URL-safe slug for a pet profile.
 * Strips accents, converts to lowercase, appends a random 6-char ID.
 */
export const generateSlug = (name) => {
  const base = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '-');

  const randomId = Math.random().toString(36).substring(2, 8);
  return `${base}-${randomId}`;
};
