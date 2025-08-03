import { DirigeantDetailClient } from './DirigeantDetailClient';

interface DirigeantDetailPageProps {
  params: Promise<{ nom: string }>;
}

export default async function DirigeantDetailPage({ params }: DirigeantDetailPageProps) {
  const resolvedParams = await params;
  
  return <DirigeantDetailClient dirigeantNom={decodeURIComponent(resolvedParams.nom)} />;
}