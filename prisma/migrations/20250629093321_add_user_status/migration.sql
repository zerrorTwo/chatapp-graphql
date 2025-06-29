-- AlterTable
ALTER TABLE `users` ADD COLUMN `status` ENUM('online', 'offline', 'away') NOT NULL DEFAULT 'offline';
