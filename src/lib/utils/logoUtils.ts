/**
 * Utilitaires pour la génération des URLs de logos de marques
 */

/**
 * Génère les domaines .fr et .com à partir d'un nom de marque
 * Priorité aux domaines français pour le marché local
 */
export const generateBrandDomains = (brandName: string): [string, string] => {
  // Nettoyer le nom de marque
  const cleanName = brandName
    // Supprimer tout ce qui est entre parenthèses (ex: "H&M (Hennes & Mauritz)" → "H&M")
    .replace(/\s*\([^)]*\)/g, '')
    .toLowerCase()
    // Remplacements spéciaux
    .replace(/\+/g, 'plus')  // Canal+ → canalplus
    // Supprimer tous les caractères spéciaux sauf lettres et chiffres
    .replace(/[^a-z0-9]/g, '')
    // Normaliser les accents
    .replace(/[éèêë]/g, 'e').replace(/[àâäã]/g, 'a').replace(/[ç]/g, 'c')
    .replace(/[ôöõ]/g, 'o').replace(/[ûüù]/g, 'u').replace(/[îï]/g, 'i');


  return [
    `${cleanName}.fr`,   // Priorité aux domaines français
    `${cleanName}.com`   // Fallback international
  ];
};

/**
 * Génère les URLs Brandfetch pour .fr et .com
 */
export const getBrandLogoUrls = (brandName: string, clientId: string): [string, string] => {
  const [frDomain, comDomain] = generateBrandDomains(brandName);
  const encodedClientId = encodeURIComponent(clientId);
  return [
    `https://cdn.brandfetch.io/${frDomain}?c=${encodedClientId}`,
    `https://cdn.brandfetch.io/${comDomain}?c=${encodedClientId}`
  ];
};

/**
 * Cache simple pour éviter les requêtes répétées
 */
export const LogoCache = {
  get: (brandName: string): 'success' | 'failed' | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(`logo_${brandName}`) as 'success' | 'failed' | null;
  },
  
  set: (brandName: string, status: 'success' | 'failed'): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`logo_${brandName}`, status);
  },
  
  clear: (): void => {
    if (typeof window === 'undefined') return;
    const keys = Object.keys(localStorage).filter(key => key.startsWith('logo_'));
    keys.forEach(key => localStorage.removeItem(key));
    console.log('🧹 Logo cache cleared:', keys.length, 'entries removed');
  },
  
  clearFailed: (): void => {
    if (typeof window === 'undefined') return;
    const keys = Object.keys(localStorage).filter(key => 
      key.startsWith('logo_') && localStorage.getItem(key) === 'failed'
    );
    keys.forEach(key => localStorage.removeItem(key));
    console.log('🧹 Failed logo cache cleared:', keys.length, 'entries removed');
  }
};

/**
 * Génère un hash SHA-256 d'une image
 */
const getImageHash = async (url: string): Promise<string | null> => {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    
    const arrayBuffer = await response.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    return null;
  }
};

// Hash du "B" par défaut de Brandfetch
const BRANDFETCH_B_HASH = '95834f990aa9ee7de720095f1b578f67816b53903131b6404aadf526f36cfe8f';

/**
 * Test si une image peut être chargée et n'est pas vide
 */
export const testImageLoad = (url: string): Promise<boolean> => {
  return new Promise(async (resolve) => {
    // D'abord vérifier si c'est le "B" de Brandfetch
    const imageHash = await getImageHash(url);
    if (imageHash === BRANDFETCH_B_HASH) {
      resolve(false); // C'est le "B", on rejette
      return;
    }

    // Puis tester la taille du fichier avec fetch
    try {
      const response = await fetch(url, { method: 'HEAD' });
      const contentLength = response.headers.get('content-length');
      
      // Si le fichier fait moins de 1KB, probablement vide/inutile
      if (contentLength && parseInt(contentLength) < 1024) {
        resolve(false);
        return;
      }
    } catch {
      resolve(false);
      return;
    }

    // Ensuite tester le chargement de l'image
    const img = new Image();
    const timeout = setTimeout(() => {
      resolve(false);
    }, 3000);
    
    img.onload = () => {
      clearTimeout(timeout);
      // Vérifier que l'image a une taille valide (pas juste 1x1 ou vide)
      resolve(img.width > 10 && img.height > 10);
    };
    
    img.onerror = () => {
      clearTimeout(timeout);
      resolve(false);
    };
    
    img.src = url;
  });
};