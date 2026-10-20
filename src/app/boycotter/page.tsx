import type { Metadata } from 'next';
import { ListeQuestions, TitrePartie, type Question } from '@/components/ui/ListeQuestions';
import ReponseAQuoiCaSert from '@/components/boycotter/ReponseAQuoiCaSert';
import ReponseAttendreMouvement from '@/components/boycotter/ReponseAttendreMouvement';
import ReponseEtats from '@/components/boycotter/ReponseEtats';
import ReponseIphone from '@/components/boycotter/ReponseIphone';
import ReponseToutBoycotter from '@/components/boycotter/ReponseToutBoycotter';
import ReponsePasLesMoyens from '@/components/boycotter/ReponsePasLesMoyens';
import ReponseEmplois from '@/components/boycotter/ReponseEmplois';
import ReponseProduitsDejaAchetes from '@/components/boycotter/ReponseProduitsDejaAchetes';
import ReponseAlternatives from '@/components/boycotter/ReponseAlternatives';
import ReponseProposerAlternatives from '@/components/boycotter/ReponseProposerAlternatives';

export const metadata: Metadata = {
  title: 'Boycotter ?',
  description: 'Tes doutes sur le boycott, nos réponses.',
};

interface PartieDoutes {
  titre: React.ReactNode;
  questions: Question[];
}

const parties: PartieDoutes[] = [
  {
    titre: <>Réponses aux questionnements sur <em>son utilité</em></>,
    questions: [
      {
        id: 'a-quoi-ca-sert',
        question: '« C\'est peine perdue de toute façon... »',
        reponse: <ReponseAQuoiCaSert />
      },
      {
        id: 'attendre-un-mouvement',
        question: '« Je m\'y mettrai quand il y aura un vrai mouvement de boycott »',
        reponse: <ReponseAttendreMouvement />
      },
      {
        id: 'etats',
        question: '« Le consommateur n\'a aucun pouvoir, c\'est aux États d\'agir »',
        reponse: <ReponseEtats />
      }
    ]
  },
  {
    titre: <>Réponses aux questionnements sur <em>l&apos;impact individuel</em></>,
    questions: [
      {
        id: 'iphone',
        question: '« Tu boycottes, mais tu as un iPhone ! »',
        reponse: <ReponseIphone />
      },
      {
        id: 'tout-boycotter',
        question: '« On peut plus rien acheter, tout est controversé ! »',
        reponse: <ReponseToutBoycotter />
      },
      {
        id: 'pas-les-moyens',
        question: '« Je n\'ai pas les moyens d\'acheter éthique »',
        reponse: <ReponsePasLesMoyens />
      },
      {
        id: 'emplois',
        question: '« Je ne veux pas que des gens perdent leur emploi à cause de moi »',
        reponse: <ReponseEmplois />
      }
    ]
  },
  {
    titre: 'Réponses diverses',
    questions: [
      {
        id: 'produits-deja-achetes',
        question: '« J\'ai déjà des produits de ces marques, que faire ? »',
        reponse: <ReponseProduitsDejaAchetes />
      },
      {
        id: 'alternatives',
        question: '« Pourquoi ne proposez-vous pas des alternatives ? »',
        reponse: <ReponseAlternatives />
      },
      {
        id: 'proposer-des-alternatives',
        question: '« Comment pourrait-on proposer des alternatives ? »',
        reponse: <ReponseProposerAlternatives />
      }
    ]
  }
];

export default function Boycotter() {
  return (
    <div className="w-full">
      {/* Section Hero */}
      <section className="en-tete-page bg-gradient-hero py-10 md:py-16 px-4">
        <div className="w-full max-w-5xl mx-auto text-center">
          <h1 className="heading-hero md:heading-hero text-neutral-900 mb-6 tracking-tight">
            Boycotter ?
          </h1>
          <p className="heading-sub text-neutral-700 max-w-4xl mx-auto font-light">
            Tu as des doutes ? Voici nos arguments pour y répondre
          </p>
        </div>
      </section>

      {/* Largeur de lecture : titres, questions et réponses restent alignés */}
      <section className="py-8 md:py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-10 md:space-y-12">
          {parties.map((partie, index) => (
            <div key={index}>
              <TitrePartie>{partie.titre}</TitrePartie>
              <ListeQuestions questions={partie.questions} libellePartage="Partager cet argumentaire à un proche" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
