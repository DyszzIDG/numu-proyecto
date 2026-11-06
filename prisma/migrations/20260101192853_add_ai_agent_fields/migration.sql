-- AlterTable
ALTER TABLE "ToolExecution" ADD COLUMN     "aiPrompt" TEXT,
ADD COLUMN     "generatedBy" TEXT NOT NULL DEFAULT 'manual';
