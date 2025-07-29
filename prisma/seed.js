const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Suppression des anciennes données
  await prisma.evenement.deleteMany();
  await prisma.marque.deleteMany();

  // Marques
  const stMichel = await prisma.marque.create({ data: { nom: 'St Michel' } });
  const nike = await prisma.marque.create({ data: { nom: 'Nike' } });
  const nestle = await prisma.marque.create({ data: { nom: 'Nestlé' } });
  const h_m = await prisma.marque.create({ data: { nom: 'H&M' } });
  const mcdo = await prisma.marque.create({ data: { nom: 'McDonald’s' } });

  // Événements St Michel
  await prisma.evenement.createMany({ data: [
    {
      marqueId: stMichel.id,
      description: 'Création du village Bamboula',
      date: new Date('1994-01-01'),
      categorie: 'Racisme',
      source: 'https://fr.wikipedia.org/wiki/Village_Bamboula',
    },
    {
      marqueId: stMichel.id,
      description: 'Publicité controversée sur la diversité',
      date: new Date('2015-03-01'),
      categorie: 'Communication',
      source: '',
    },
  ] });

  // Événements Nike
  await prisma.evenement.createMany({ data: [
    {
      marqueId: nike.id,
      description: 'Travail des enfants dans la chaine d\'approvisionnement',
      date: new Date('2001-06-01'),
      categorie: 'Travail des enfants',
      source: 'https://www.lemonde.fr/economie/article/2001/06/22/nike-admet-le-travail-des-enfants_214447_3234.html',
    },
    {
      marqueId: nike.id,
      description: 'Pollution liee a la production textile en Asie',
      date: new Date('2018-09-01'),
      categorie: 'Environnement',
      source: 'https://www.greenpeace.org/international/story/7923/nike-pollution-textile/',
    },
    {
      marqueId: nike.id,
      description: 'Campagne publicitaire avec Colin Kaepernick',
      date: new Date('2020-06-01'),
      categorie: 'Communication',
      source: 'https://www.nike.com/us/en_us/c/just-do-it',
    },
    {
      marqueId: nike.id,
      description: 'Conditions de travail precaires dans les usines vietnamiennes',
      date: new Date('2019-03-15'),
      categorie: 'Droits humains',
      source: 'https://www.hrw.org/news/2019/03/15/vietnam-nike-factory-workers-face-abuse',
    },
  ] });

  // Événements Nestlé
  await prisma.evenement.createMany({ data: [
    {
      marqueId: nestle.id,
      description: 'Pompage illégal d’eau en France',
      date: new Date('2023-03-01'),
      categorie: 'Environnement',
      source: 'https://www.francetvinfo.fr/societe/eau/nestle-accuse-de-pomper-de-l-eau-en-france-malgre-des-restrictions_5697287.html',
    },
    {
      marqueId: nestle.id,
      description: 'Affaire du lait contaminé',
      date: new Date('2017-12-01'),
      categorie: 'Santé',
      source: '',
    },
  ] });

  // Événements H&M
  await prisma.evenement.createMany({ data: [
    {
      marqueId: h_m.id,
      description: 'Destruction de vêtements invendus',
      date: new Date('2018-02-01'),
      categorie: 'Environnement',
      source: 'https://www.francetvinfo.fr/economie/emploi/metiers/commerce-et-distribution/h-m-admet-avoir-detruit-des-tonnes-de-vetements-invendus_2615342.html',
    },
    {
      marqueId: h_m.id,
      description: 'Soupçons de travail forcé au Bangladesh',
      date: new Date('2019-05-01'),
      categorie: 'Travail',
      source: '',
    },
  ] });

  // Événements McDonald’s
  await prisma.evenement.createMany({ data: [
    {
      marqueId: mcdo.id,
      description: 'Optimisation fiscale massive en Europe',
      date: new Date('2016-04-01'),
      categorie: 'Fiscalité',
      source: 'https://www.lesechos.fr/2016/04/mcdonalds-dans-le-viseur-de-la-commission-europeenne-204894',
    },
    {
      marqueId: mcdo.id,
      description: 'Polémique sur la malbouffe et la santé',
      date: new Date('2012-09-01'),
      categorie: 'Santé',
      source: '',
    },
    {
      marqueId: mcdo.id,
      description: 'Déchets plastiques dans les Happy Meal',
      date: new Date('2019-07-01'),
      categorie: 'Environnement',
      source: '',
    },
  ] });
}


main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
