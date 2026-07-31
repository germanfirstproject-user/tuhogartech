/**
 * Convierte un texto en un slug apto para URL.
 *
 * Las tildes y la eñe se transliteran en lugar de eliminarse: con un simple
 * `replace(/[^a-z0-9]+/g, '-')` un título como "Baterías y energía" acababa
 * en "bater-as-y-energ-a".
 */
export function slugify(text) {
  if (!text) return '';

  return String(text)
    .normalize('NFD')
    // Marcas diacríticas sueltas que deja NFD (los acentos)
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/ñ/g, 'n')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
