/*
  Warnings:

  - Added the required column `nome` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "nome" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "senha" TEXT;
