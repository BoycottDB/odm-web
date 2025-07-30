-- CreateTable
CREATE TABLE "public"."Marque" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,

    CONSTRAINT "Marque_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Evenement" (
    "id" SERIAL NOT NULL,
    "marqueId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "categorie" TEXT NOT NULL,
    "source" TEXT NOT NULL,

    CONSTRAINT "Evenement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Marque_nom_key" ON "public"."Marque"("nom");

-- AddForeignKey
ALTER TABLE "public"."Evenement" ADD CONSTRAINT "Evenement_marqueId_fkey" FOREIGN KEY ("marqueId") REFERENCES "public"."Marque"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
