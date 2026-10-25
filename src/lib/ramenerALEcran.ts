// Si le haut de l'élément est passé sous l'en-tête fixe du site (ou plus haut),
// on fait défiler pour le ramener juste sous cet en-tête
export const ramenerALEcran = (element: HTMLElement | null) => {
  if (!element) return;
  const basEnteteSite = document.querySelector('header')?.getBoundingClientRect().bottom ?? 0;
  const haut = element.getBoundingClientRect().top;
  if (haut < basEnteteSite) {
    window.scrollBy({ top: haut - basEnteteSite - 8 });
  }
};
