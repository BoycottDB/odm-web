import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import QuestionDepliable from '@/components/ui/QuestionDepliable';

// Une question se déplie sur place (reponse) ou mène à sa page (url).
// Chaque question porte un id : elle reste joignable par ancre (/faq#argent)
export type Question = { id: string; question: string } & (
  | { reponse: React.ReactNode; url?: never }
  | { url: string; reponse?: never }
);

// Titre d'une partie de /boycotter ou /faq : en primary pour se distinguer des questions
export function TitrePartie({ children }: { children: React.ReactNode }) {
  return <h2 className="heading-main text-primary mb-2">{children}</h2>;
}

interface ListeQuestionsProps {
  questions: Question[];
  // Libellé du bouton de partage des questions dépliables
  libellePartage: string;
}

export function ListeQuestions({ questions, libellePartage }: ListeQuestionsProps) {
  return (
    <div className="divide-y divide-neutral-200">
      {questions.map((item) => item.url ? (
        <Link
          key={item.id}
          id={item.id}
          href={item.url}
          className="group flex items-center justify-between gap-4 py-5 scroll-mt-24 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
          draggable={false}
        >
          <h3 className="text-lg md:text-xl font-semibold text-neutral-900 group-hover:text-primary transition-colors duration-200 select-text">
            {item.question}
          </h3>
          <ChevronRight className="w-6 h-6 flex-shrink-0 text-neutral-900 transition-transform duration-200 motion-safe:group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      ) : (
        <QuestionDepliable key={item.id} id={item.id} question={item.question} libellePartage={libellePartage}>
          {item.reponse}
        </QuestionDepliable>
      ))}
    </div>
  );
}
