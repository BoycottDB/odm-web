import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  url: string;
}

const faqItems: FAQItem[] = [
  {
    id: '1',
    question: '"À quoi ça sert ? C\'est peine perdue de toute façon..."',
    url: '/faq/pourquoi'
  },
  {
    id: '2',
    question: '"Pourquoi ne proposez-vous pas des alternatives ?"',
    url: '/faq/alternatives'
  },
  {
    id: '3',
    question: 'Comment sont modérés les signalements ?',
    url: '/faq/moderation'
  },
  {
    id: '4',
    question: 'Comment l\'argent de mes achats arrive-t-il jusqu\'aux bénéficiaires ?',
    url: '/faq/argent'
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
            Tout ce que vous devez savoir sur « Qui j&apos;enrichis ? » et notre vision
          </p>
        </div>
      </section>

      {/* Section FAQ */}
      <section className="py-8 md:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Liste des questions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqItems.map((item) => (
              <Link
                key={item.id}
                href={item.url}
                className="group relative bg-white rounded-xl border border-neutral-200 overflow-hidden hover:border-primary transition-colors duration-200 h-40 flex items-center justify-center p-6 pr-12"
                draggable={false}
              >
                <h3 className="heading-sub font-medium text-neutral-900 text-center select-text">
                  {item.question}
                </h3>
                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-primary transition-transform duration-200 motion-safe:group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            ))}
          </div>
          
        </div>
      </section>
    </div>
  );
}