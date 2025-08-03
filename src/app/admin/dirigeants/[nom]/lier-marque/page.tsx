import { LierMarqueClient } from './LierMarqueClient';

interface LierMarquePageProps {
  params: Promise<{ nom: string }>;
}

export default async function LierMarquePage({ params }: LierMarquePageProps) {
  const resolvedParams = await params;
  
  return <LierMarqueClient dirigeantNom={decodeURIComponent(resolvedParams.nom)} />;
}