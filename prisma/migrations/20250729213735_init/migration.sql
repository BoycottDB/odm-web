-- CreateTable
CREATE TABLE "Marque" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Evenement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "marqueId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "categorie" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    CONSTRAINT "Evenement_marqueId_fkey" FOREIGN KEY ("marqueId") REFERENCES "Marque" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Marque_nom_key" ON "Marque"("nom");
