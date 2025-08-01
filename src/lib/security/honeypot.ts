// Protection anti-bot avec honeypot
export function validateHoneypot(honeypotValue: string): boolean {
  // Le champ honeypot doit rester vide (les bots le remplissent automatiquement)
  return honeypotValue === '' || honeypotValue === undefined;
}

// Génère un nom de champ honeypot aléatoire pour éviter la détection
export function generateHoneypotFieldName(): string {
  const names = [
    'website',
    'url',
    'email2',
    'phone',
    'address',
    'company',
    'fax'
  ];
  
  return names[Math.floor(Math.random() * names.length)];
}

// Validation du temps de soumission (les bots soumettent trop rapidement)
export function validateSubmissionTime(startTime: number, minTime: number = 3000): boolean {
  const submissionTime = Date.now() - startTime;
  return submissionTime >= minTime; // Au moins 3 secondes
}

// Protection basique contre les soumissions répétées
const submissionTracker = new Map<string, number>();

export function checkRateLimit(identifier: string, windowMs: number = 60000): boolean {
  const now = Date.now();
  const lastSubmission = submissionTracker.get(identifier);
  
  if (lastSubmission && (now - lastSubmission) < windowMs) {
    return false; // Trop rapide
  }
  
  submissionTracker.set(identifier, now);
  
  // Nettoyer les anciennes entrées
  for (const [key, time] of submissionTracker.entries()) {
    if (now - time > windowMs) {
      submissionTracker.delete(key);
    }
  }
  
  return true;
}