import type { Metadata } from 'next';
import { ListeQuestions, TitrePartie, type Question } from '@/components/ui/ListeQuestions';
import ReponseArgent from '@/components/faq/ReponseArgent';
import ReponseMarqueAbsente from '@/components/faq/ReponseMarqueAbsente';

export const metadata: Metadata = {
  title: "Questions fréquentes | Qui j'enrichis ?",
  description: "Comment fonctionne le site et comment ton argent remonte jusqu'aux bénéficiaires.",
};

interface PartieFaq {
  titre: string;
  questions: Question[];
}

const parties: PartieFaq[] = [
  {
    titre: 'Ce que montre le site',
    questions: [
      {
        id: 'argent',
        question: 'Comment l\'argent de mes achats arrive-t-il jusqu\'aux bénéficiaires ?',
        reponse: <ReponseArgent />
      },
      {
        id: 'marque-absente',
        question: 'Pourquoi certaines marques ne sont-elles pas sur le site ?',
        reponse: <ReponseMarqueAbsente />
      }
    ]
  },
  {
    titre: 'Ses règles',
    questions: [
      {
        id: 'moderation',
        question: 'Comment sont modérés les signalements ?',
        url: '/faq/moderation'
      },
      {
        id: 'droit-de-reponse',
        question: 'Comment faire corriger une information ou exercer un droit de réponse ?',
        url: '/droit-de-reponse'
      },
      {
        id: 'confidentialite',
        question: 'Quelles données sont collectées quand j\'utilise le site ?',
        url: '/confidentialite'
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
            Comment fonctionne le site et comment ton argent remonte jusqu&apos;aux bénéficiaires
          </p>
        </div>
      </section>

      {/* Largeur de lecture : titres, questions et réponses restent alignés */}
      <section className="py-8 md:py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-10 md:space-y-12">
          {parties.map((partie) => (
            <div key={partie.titre}>
              <TitrePartie>{partie.titre}</TitrePartie>
              <ListeQuestions questions={partie.questions} libellePartage="Partager cette question" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
