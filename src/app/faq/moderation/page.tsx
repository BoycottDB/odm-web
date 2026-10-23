import type { Metadata } from 'next';
import Moderation from '@/components/faq/Moderation';

export const metadata: Metadata = {
  title: "Modération et validation | Qui j'enrichis ?",
  description: 'Comment les signalements sont relus et les règles que nous appliquons.',
};

export default function Page() {
  return <Moderation />;
}
