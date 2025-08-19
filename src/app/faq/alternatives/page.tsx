'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AlternativesFAQ() {
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
    <div className="w-full">
      {/* Section Hero */}
      <section className="bg-gradient-to-r from-primary-light via-purple-50 to-indigo-50 py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="heading-hero md:heading-hero font-light text-neutral-900 mb-8 tracking-tight">
            Pourquoi ne proposons-nous pas des alternatives ?
          </h1>
          <p className="heading-sub text-neutral-700 max-w-4xl mx-auto font-light leading-relaxed">
            Une question légitime que nous recevons souvent
          </p>
        </div>
      </section>

      {/* Contenu principal */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8">
            <div className="prose prose-lg max-w-none">

              <div className="mb-8">
                <h2 className="heading-main font-bold text-neutral-900 mb-4">Notre position sur les alternatives</h2>
                <p className="body-base text-neutral-700 leading-relaxed mb-6">
                  Nous avons fait le choix délibéré de ne pas proposer d&apos;alternatives pour le moment, et voici pourquoi :
                </p>
              </div>

              <div className="space-y-8">
                <div className="border-l-4 border-error pl-6">
                  <h3 className="body-large font-semibold text-neutral-900 mb-3">Certaines marques cachent bien leur jeu</h3>
                  <p className="body-base text-neutral-700 leading-relaxed">
                    Il peut arriver qu&apos;une marque cache des controverses que nous n&apos;avons pas encore découvertes.
                    Nous nous en voudrions de vous avoir influencé à consommer une marque qui s&apos;avérerait problématique par la suite.
                  </p>
                </div>

                <div className="border-l-4 border-warning pl-6">
                  <h3 className="body-large font-semibold text-neutral-900 mb-3">Les situations peuvent changer</h3>
                  <p className="body-base text-neutral-700 leading-relaxed">
                    Une marque peut être totalement &quot;clean&quot; aujourd&apos;hui et faire quelque chose de grave demain ou se faire racheter par un bénéficiaire controversé comme <strong>Relay</strong> qui appartient maintenant à <strong>Bolloré</strong>.
                  </p>
                </div>

                <div className="border-l-4 border-success pl-6">
                  <h3 className="body-large font-semibold text-neutral-900 mb-3">Nous ne voulons pas faire de tort aux petits producteurs locaux</h3>
                  <p className="body-base text-neutral-700 leading-relaxed mb-4">
                    C&apos;est sûrement le point le plus important : il nous est difficile de connaître toutes les marques
                    éthiques du pays. Il y a surement plein de petits producteurs locaux, près de chez vous dont on n&apos;entendra peut-être
                    jamais parler et à qui on n&apos;aimerait pas faire de l&apos;ombre en influençant ne serait-ce qu&apos;une
                    personne à consommer une autre marque.
                  </p>
                  <p className="body-base text-neutral-700 leading-relaxed">
                    On espère même que toi qui lit ses lignes, tu entreprènes pour créer des alternatives éthiques et responsables.
                  </p>
                </div>
              </div>

              <div className="mt-10 bg-primary-light border border-primary rounded-xl p-6">
                <h3 className="body-large font-semibold text-primary mb-3">Notre approche</h3>
                <p className="body-base text-neutral-700 leading-relaxed">
                  Plutôt que de vous orienter vers des marques spécifiques, nous préférons vous donner
                  l&apos;information pour que vous puissiez faire vos propres choix éclairés. C&apos;est dans cette
                  optique que nous proposons plutôt des <strong>conseils de consommation</strong> dans les sections &quot;Comment bien boycotter telle marque ?&quot;.
                </p>
              </div>

              <div className="mt-10 bg-gradient-to-r from-success-light to-primary-light border border-success rounded-xl p-8">
                <h3 className="body-large font-bold text-neutral-900 mb-4">💡 Cela  dit, et si on créait ensemble la solution ?</h3>
                <p className="body-base text-neutral-700 leading-relaxed mb-6">
                  Nous réfléchissons à développer une plateforme e-commerce éthique : une sorte d&apos;Amazon mais
                  exclusivement avec des produits responsables créés par des citoyens lambda. Actuellement,
                  les créateurs éthiques galèrent pour se faire connaître : soit ils restent invisibles sur
                  leurs propres sites, soit ils sont contraints de passer par des plateformes comme Amazon,
                  Facebook ou Instagram pour avoir de la visibilité, ce qui revient à enrichir indirectement
                  les multinationales qu&apos;ils cherchent à éviter. L&apos;idée serait de créer une alternative qui
                  donne enfin une vraie visibilité aux créateurs éthiques sans qu&apos;ils aient à compromettre
                  leurs valeurs.
                </p>
                <p className="body-base text-neutral-700 leading-relaxed mb-6">
                  Chaque créateur aurait sa page personnelle pour expliquer sa passion et ses méthodes de fabrication, avec une obligation de transparence sur les fournisseurs pour garantir l&apos;aspect éthique.
                </p>

                <div className="bg-white rounded-lg p-6 border border-neutral-200">
                  <h4 className="font-semibold text-neutral-900 mb-4">💬 Votre avis nous intéresse !</h4>
                  <p className="body-base text-neutral-700 mb-4">
                    Seriez-vous intéressé·e par une telle plateforme ? Aidez-nous à valider ce concept :
                  </p>

                  <div className="space-y-3">
                    {/* Bouton Acheteur */}
                    {acheteurStatus === 'sent' ? (
                      <div className="w-full bg-success-light border border-success rounded-lg px-4 py-2 text-center">
                        <span className="text-success font-medium text-sm">Merci, votre intérêt a été noté 🙏</span>
                      </div>
                    ) : (
                      <button
                        onClick={sendAcheteurResponse}
                        disabled={acheteurStatus === 'loading'}
                        className="w-full bg-success text-white md:px-4 py-2 rounded-md font-medium hover:bg-success-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm"
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
                      <div className="w-full bg-success-light border border-success rounded-lg px-4 py-2 text-center">
                        <span className="text-success font-medium text-sm">Merci, votre intérêt a été noté 🙏</span>
                      </div>
                    ) : (
                      <button
                        onClick={sendVendeurResponse}
                        disabled={vendeurStatus === 'loading'}
                        className="w-full bg-success text-white md:px-4 py-2 rounded-md font-medium hover:bg-success-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm"
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
                  Si le projet vous tente, lancez-vous et n&apos;hésitez pas à nous contacter pour qu&apos;on travaille ensemble ✌️
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 text-center">
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 text-primary hover:text-primary-hover font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Retour aux questions fréquentes
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}