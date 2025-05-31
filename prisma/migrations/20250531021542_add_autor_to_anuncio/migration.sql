/*
  Warnings:

  - Added the required column `autor` to the `Anuncio` table without a default value. This is not possible if the table is not empty.
  - Made the column `precio` on table `Anuncio` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Anuncio" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "precio" REAL NOT NULL,
    "categoria" TEXT NOT NULL,
    "contacto" TEXT NOT NULL,
    "favorito" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "image" TEXT,
    "autor" TEXT NOT NULL,
    "ubicacion" TEXT
);
INSERT INTO "new_Anuncio" ("categoria", "contacto", "createdAt", "descripcion", "favorito", "id", "image", "precio", "titulo", "updatedAt") SELECT "categoria", "contacto", "createdAt", "descripcion", "favorito", "id", "image", "precio", "titulo", "updatedAt" FROM "Anuncio";
DROP TABLE "Anuncio";
ALTER TABLE "new_Anuncio" RENAME TO "Anuncio";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
