import Link from 'next/link';

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
  }
];

export default function FAQ() {

  return (
    <div className="w-full">
      {/* Section Hero */}
      <section className="bg-gradient-to-r from-primary-50 via-violet-magenta-50 to-lavande-50 py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="heading-hero md:heading-hero font-light text-neutral-900 mb-8 tracking-tight">
            Questions fréquentes
          </h1>
          <p className="heading-sub text-neutral-700 max-w-4xl mx-auto font-light leading-relaxed">
            Tout ce que vous devez savoir sur ODM et notre vision
          </p>
        </div>
      </section>

      {/* Section FAQ */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Liste des questions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqItems.map((item) => (
              <Link
                key={item.id}
                href={item.url}
                className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden transition-all hover:shadow-md h-40 flex items-center justify-center p-6 group hover:bg-neutral-50"
                draggable={false}
              >
                <h3 className="heading-sub font-medium text-neutral-900 group-hover:text-primary transition-colors text-center select-text">
                  {item.question}
                </h3>
              </Link>
            ))}
          </div>
          
        </div>
      </section>
    </div>
  );
}