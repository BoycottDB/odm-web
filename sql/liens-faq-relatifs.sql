-- Liens FAQ en dur vers l'ancienne adresse → liens relatifs (indépendants du domaine)
-- À lancer APRÈS le déploiement du rendu des liens internes (ChaineBeneficiaires.tsx)

-- 1. Vérifier ce qui sera modifié
SELECT id, nom FROM "Beneficiaires"
WHERE impact_generique LIKE '%https://odm-observatoire-des-marques.netlify.app/%';

SELECT id FROM "Marque_beneficiaire"
WHERE impact_specifique LIKE '%https://odm-observatoire-des-marques.netlify.app/%';

-- 2. Remplacer
UPDATE "Beneficiaires"
SET impact_generique = REPLACE(impact_generique, 'https://odm-observatoire-des-marques.netlify.app/', '/')
WHERE impact_generique LIKE '%https://odm-observatoire-des-marques.netlify.app/%';

UPDATE "Marque_beneficiaire"
SET impact_specifique = REPLACE(impact_specifique, 'https://odm-observatoire-des-marques.netlify.app/', '/')
WHERE impact_specifique LIKE '%https://odm-observatoire-des-marques.netlify.app/%';
