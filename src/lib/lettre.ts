// Lettre d'index d'une marque : première lettre sans accent ; chiffres et symboles sous « # »
export function lettreDe(nom: string): string {
  const premiere = nom.normalize('NFD').replace(/[̀-ͯ]/g, '').charAt(0).toUpperCase();
  return /[A-Z]/.test(premiere) ? premiere : '#';
}
