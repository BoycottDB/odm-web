// Markdown basique des textes d'impact : liens, gras, italique, listes « • », retours à la ligne
export const formatImpact = (text: string) => {
  if (!text) return '';

  return text
    .replace(/(?<!!)\[([^\]]+)\]\(([^)]+)\)/g, (match: string, text: string, url: string) => {
      const linkClass = 'text-primary hover:text-primary-dark underline font-medium';
      // Liens internes au site (ex. /faq/argent) : même onglet, indépendants du domaine
      if (/^\/(?!\/)/.test(url)) {
        return `<a href="${url}" class="${linkClass}">${text}</a>`;
      }
      // Liens externes : uniquement http:// ou https://
      if (/^https?:\/\//.test(url)) {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="${linkClass}">${text}</a>`;
      }
      return match; // Retourner le texte original si l'URL n'est pas valide
    }) // liens [texte](url) - negative lookbehind pour éviter les images ![alt](url)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // **gras**
    .replace(/\*(.*?)\*/g, '<em>$1</em>') // *italique*
    .replace(/^• (.+)$/gm, '<div class="flex items-start"><span class="text-primary mr-2">•</span><span>$1</span></div>') // listes avec •
    .replace(/\n/g, '<br />') // tous les retours à la ligne
    .replace(/(<\/div>)<br \/>/g, '$1'); // supprimer les <br /> immédiatement après les éléments de liste
};
