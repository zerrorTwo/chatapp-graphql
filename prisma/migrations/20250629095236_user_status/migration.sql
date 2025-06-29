/*
  Warnings:

  - You are about to alter the column `status` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `TinyInt`.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `status` BOOLEAN NULL DEFAULT true;
