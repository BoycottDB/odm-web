import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Création de quelques marques
  const stMichel = await prisma.marque.create({
    data: { nom: 'St Michel' },
  });
  const nike = await prisma.marque.create({
    data: { nom: 'Nike' },
  });
  const nestle = await prisma.marque.create({
    data: { nom: 'Nestlé' },
  });

  // Création d'événements
  await prisma.evenement.create({
    data: {
      marqueId: stMichel.id,
      description: 'Création du village Bamboula',
      date: new Date('1994-01-01'),
      categorie: 'Racisme',
      source: 'https://fr.wikipedia.org/wiki/Village_Bamboula',
    },
  });
  await prisma.evenement.create({
    data: {
      marqueId: nike.id,
      description: 'Travail des enfants dans la chaîne d’approvisionnement',
      date: new Date('2001-06-01'),
      categorie: 'Travail des enfants',
      source: 'https://www.lemonde.fr/economie/article/2001/06/22/nike-admet-le-travail-des-enfants_214447_3234.html',
    },
  });
  await prisma.evenement.create({
    data: {
      marqueId: nestle.id,
      description: 'Pompage illégal d’eau en France',
      date: new Date('2023-03-01'),
      categorie: 'Environnement',
      source: 'https://www.francetvinfo.fr/societe/eau/nestle-accuse-de-pomper-de-l-eau-en-france-malgre-des-restrictions_5697287.html',
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
