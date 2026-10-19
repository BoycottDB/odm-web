import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import QuestionFaq from '@/components/faq/QuestionFaq';
import ReponseAQuoiCaSert from '@/components/faq/ReponseAQuoiCaSert';
import ReponseAlternatives from '@/components/faq/ReponseAlternatives';
import ReponseProposerAlternatives from '@/components/faq/ReponseProposerAlternatives';
import ReponseArgent from '@/components/faq/ReponseArgent';
import ReponseToutBoycotter from '@/components/faq/ReponseToutBoycotter';
import ReponseIphone from '@/components/faq/ReponseIphone';
import ReponseAttendreMouvement from '@/components/faq/ReponseAttendreMouvement';
import ReponseEtats from '@/components/faq/ReponseEtats';
import ReponsePasLesMoyens from '@/components/faq/ReponsePasLesMoyens';
import ReponseEmplois from '@/components/faq/ReponseEmplois';
import ReponseProduitsDejaAchetes from '@/components/faq/ReponseProduitsDejaAchetes';
import ReponseMarqueAbsente from '@/components/faq/ReponseMarqueAbsente';

// Une question se déplie sur place (reponse) ou mène à sa page (url)
type FAQItem = { id: string; question: string } & (
  | { reponse: React.ReactNode; url?: never }
  | { url: string; reponse?: never }
);

// Un thème regroupe ses questions en sous-parties ; une sous-partie sans titre n'affiche que ses questions
interface FAQSousPartie {
  titre?: React.ReactNode;
  questions: FAQItem[];
}

interface FAQTheme {
  titre: string;
  sousParties: FAQSousPartie[];
}

// Chaque question porte un id : elle reste joignable par ancre (/faq#argent)
const faqThemes: FAQTheme[] = [
  {
    titre: 'Boycotter',
    sousParties: [
      {
        titre: <>Réponses aux questionnements sur <em>son utilité</em></>,
        questions: [
          {
            id: 'a-quoi-ca-sert',
            question: '« C\'est peine perdue de toute façon... »',
            reponse: <ReponseAQuoiCaSert />
          },
          {
            id: 'attendre-un-mouvement',
            question: '« Je m\'y mettrai quand il y aura un vrai mouvement de boycott »',
            reponse: <ReponseAttendreMouvement />
          },
          {
            id: 'etats',
            question: '« Le consommateur n\'a aucun pouvoir, c\'est aux États d\'agir »',
            reponse: <ReponseEtats />
          }
        ]
      },
      {
        titre: <>Réponses aux questionnements sur <em>l&apos;impact individuel</em></>,
        questions: [
          {
            id: 'iphone',
            question: '« Tu boycottes, mais tu as un iPhone ! »',
            reponse: <ReponseIphone />
          },
          {
            id: 'tout-boycotter',
            question: '« Je ne peux pas tout boycotter, tout est controversé de toute façon »',
            reponse: <ReponseToutBoycotter />
          },
          {
            id: 'pas-les-moyens',
            question: '« Je n\'ai pas les moyens d\'acheter éthique »',
            reponse: <ReponsePasLesMoyens />
          },
          {
            id: 'emplois',
            question: '« Je ne veux pas que des gens perdent leur emploi à cause de moi »',
            reponse: <ReponseEmplois />
          }
        ]
      },
      {
        titre: 'Réponses diverses',
        questions: [
          {
            id: 'produits-deja-achetes',
            question: '« J\'ai déjà des produits de ces marques, que faire ? »',
            reponse: <ReponseProduitsDejaAchetes />
          },
          {
            id: 'alternatives',
            question: '« Pourquoi ne proposez-vous pas des alternatives ? »',
            reponse: <ReponseAlternatives />
          },
          {
            id: 'proposer-des-alternatives',
            question: '« Comment pourrait-on proposer des alternatives ? »',
            reponse: <ReponseProposerAlternatives />
          }
        ]
      }
    ]
  },
  {
    titre: 'Le site',
    sousParties: [
      {
        questions: [
          {
            id: 'marque-absente',
            question: '« Pourquoi telle marque n\'est pas sur le site ? »',
            reponse: <ReponseMarqueAbsente />
          },
          {
            id: 'moderation',
            question: 'Comment sont modérés les signalements ?',
            url: '/faq/moderation'
          }
        ]
      }
    ]
  },
  {
    titre: 'L\'argent',
    sousParties: [
      {
        questions: [
          {
            id: 'argent',
            question: 'Comment l\'argent de mes achats arrive-t-il jusqu\'aux bénéficiaires ?',
            reponse: <ReponseArgent />
          }
        ]
      }
    ]
  }
];

export default function FAQ() {

  return (
    <div className="w-full">
      {/* Section Hero */}
      <section className="en-tete-page bg-gradient-hero py-10 md:py-16 px-4">
        <div className="w-full max-w-5xl mx-auto text-center">
          <h1 className="heading-hero md:heading-hero text-neutral-900 mb-6 tracking-tight">
            Questions fréquentes
          </h1>
          <p className="heading-sub text-neutral-700 max-w-4xl mx-auto font-light">
            Tout ce que tu dois savoir sur « Qui j&apos;enrichis ? » et notre vision
          </p>
        </div>
      </section>

      {/* Section FAQ */}
      <section className="py-8 md:py-16 px-4">
        {/* Largeur de lecture pour toute la FAQ : titres, questions et réponses restent alignés */}
        <div className="max-w-3xl mx-auto space-y-10 md:space-y-12">
          {faqThemes.map((theme) => (
            <div key={theme.titre}>
              <h2 className="heading-main text-neutral-900 mb-4">{theme.titre}</h2>

              <div className="space-y-10 md:space-y-12">
                {theme.sousParties.map((sousPartie, index) => (
                  <div key={index}>
                    {sousPartie.titre && (
                      <h3 className="text-xs md:text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-1">{sousPartie.titre}</h3>
                    )}

                    {/* Liste des questions de la sous-partie */}
                    <div className="divide-y divide-neutral-200">
                      {sousPartie.questions.map((item) => item.url ? (
                        <Link
                          key={item.id}
                          id={item.id}
                          href={item.url}
                          className="group flex items-center justify-between gap-4 py-5 scroll-mt-24 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
                          draggable={false}
                        >
                          <h3 className="text-lg md:text-xl font-semibold text-neutral-900 group-hover:text-primary transition-colors duration-200 select-text">
                            {item.question}
                          </h3>
                          <ChevronRight className="w-6 h-6 flex-shrink-0 text-neutral-900 transition-transform duration-200 motion-safe:group-hover:translate-x-1" aria-hidden="true" />
                        </Link>
                      ) : (
                        <QuestionFaq key={item.id} id={item.id} question={item.question}>
                          {item.reponse}
                        </QuestionFaq>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
