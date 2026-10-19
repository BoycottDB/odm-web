'use client';

import { useState } from 'react';

export default function ReponseProposerAlternatives() {
  const [acheteurStatus, setAcheteurStatus] = useState<'none' | 'loading' | 'sent'>('none');
  const [vendeurStatus, setVendeurStatus] = useState<'none' | 'loading' | 'sent'>('none');

  // Fonction pour envoyer les données d'acheteur
  const sendAcheteurResponse = async () => {
    if (acheteurStatus !== 'none') return;

    setAcheteurStatus('loading');

    try {
      const response = await fetch('/api/sondage-ecommerce', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interesse_acheter: true,
          interesse_vendre: false
        })
      });

      if (response.ok) {
        setAcheteurStatus('sent');
      } else {
        setAcheteurStatus('none');
      }
    } catch (error) {
      console.error('Erreur envoi sondage acheteur:', error);
      setAcheteurStatus('none');
    }
  };

  // Fonction pour envoyer les données de vendeur
  const sendVendeurResponse = async () => {
    if (vendeurStatus !== 'none') return;

    setVendeurStatus('loading');

    try {
      const response = await fetch('/api/sondage-ecommerce', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interesse_acheter: false,
          interesse_vendre: true
        })
      });

      if (response.ok) {
        setVendeurStatus('sent');
      } else {
        setVendeurStatus('none');
      }
    } catch (error) {
      console.error('Erreur envoi sondage vendeur:', error);
      setVendeurStatus('none');
    }
  };

  return (
    <>
      <p className="body-base text-neutral-700 leading-snug">
        Nous réfléchissons à développer une plateforme e-commerce éthique : une sorte d&apos;Amazon mais
        exclusivement avec des produits responsables créés par des citoyens lambda. Actuellement,
        les créateurs éthiques galèrent pour se faire connaître : soit ils restent invisibles sur
        leurs propres sites, soit ils sont contraints de passer par des plateformes comme Amazon,
        Facebook ou Instagram pour avoir de la visibilité, ce qui revient à enrichir indirectement
        les multinationales qu&apos;ils cherchent à éviter. L&apos;idée serait de créer une alternative qui
        donne enfin une vraie visibilité aux créateurs éthiques sans qu&apos;ils aient à compromettre
        leurs valeurs.
      </p>
      <p className="body-base text-neutral-700 leading-snug">
        Chaque créateur aurait sa page personnelle pour expliquer sa passion et ses méthodes de fabrication, avec une obligation de transparence sur les fournisseurs pour garantir l&apos;aspect éthique.
      </p>

      <div className="bg-white rounded-lg p-4 md:p-6 border border-neutral-200">
        <h4 className="font-semibold text-neutral-900 mb-4">💬 Ton avis nous intéresse !</h4>
        <p className="body-base text-neutral-700 mb-4">
          Serais-tu intéressé·e par une telle plateforme ? Aide-nous à valider ce concept :
        </p>

        <div className="space-y-3">
          {/* Bouton Acheteur */}
          {acheteurStatus === 'sent' ? (
            <div className="w-full bg-success-light border border-success-medium rounded-lg px-4 py-2 text-center">
              <span className="text-success font-medium text-sm">Merci, ton intérêt a été noté 🙏</span>
            </div>
          ) : (
            <button
              onClick={sendAcheteurResponse}
              disabled={acheteurStatus === 'loading'}
              className="w-full bg-success text-white px-2 md:px-4 py-2 rounded-md font-medium hover:bg-success-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm"
            >
              {acheteurStatus === 'loading' ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Envoi en cours...
                </>
              ) : (
                <>
                  Je serais intéressé·e pour acheter sur une telle plateforme
                </>
              )}
            </button>
          )}

          {/* Bouton Vendeur */}
          {vendeurStatus === 'sent' ? (
            <div className="w-full bg-success-light border border-success-medium rounded-lg px-4 py-2 text-center">
              <span className="text-success font-medium text-sm">Merci, ton intérêt a été noté 🙏</span>
            </div>
          ) : (
            <button
              onClick={sendVendeurResponse}
              disabled={vendeurStatus === 'loading'}
              className="w-full bg-success text-white px-2 md:px-4 py-2 rounded-md font-medium hover:bg-success-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm"
            >
              {vendeurStatus === 'loading' ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Envoi en cours...
                </>
              ) : (
                <>
                  Je serais intéressé·e pour vendre sur une telle plateforme
                </>
              )}
            </button>
          )}
        </div>
      </div>
      <p className="text-xs text-neutral-500 mt-3">
        Si le projet te tente, lance-toi et n&apos;hésite pas à nous contacter pour qu&apos;on travaille ensemble ✌️
      </p>
    </>
  );
}
