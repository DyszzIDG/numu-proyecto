-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "industryId" TEXT;

-- CreateTable
CREATE TABLE "Industry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "regulatoryFocus" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Industry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IndustryCategory" (
    "id" TEXT NOT NULL,
    "industryId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "weight" INTEGER NOT NULL,
    "description" TEXT,

    CONSTRAINT "IndustryCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IndustryQuestion" (
    "id" TEXT NOT NULL,
    "industryId" TEXT NOT NULL,
    "industryCategoryId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "options" TEXT,
    "weight" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "regulationReference" TEXT,
    "complianceLevel" TEXT,
    "riskLevel" TEXT,
    "bestPractice" TEXT,
    "implementationGuide" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IndustryQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IndustryBenchmark" (
    "id" TEXT NOT NULL,
    "industryId" TEXT NOT NULL,
    "metric" TEXT NOT NULL,
    "categoryId" TEXT,
    "value" DOUBLE PRECISION NOT NULL,
    "sampleSize" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "quarter" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IndustryBenchmark_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Industry_name_key" ON "Industry"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Industry_slug_key" ON "Industry"("slug");

-- CreateIndex
CREATE INDEX "Industry_slug_idx" ON "Industry"("slug");

-- CreateIndex
CREATE INDEX "Industry_order_idx" ON "Industry"("order");

-- CreateIndex
CREATE INDEX "IndustryCategory_industryId_idx" ON "IndustryCategory"("industryId");

-- CreateIndex
CREATE INDEX "IndustryCategory_categoryId_idx" ON "IndustryCategory"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "IndustryCategory_industryId_categoryId_key" ON "IndustryCategory"("industryId", "categoryId");

-- CreateIndex
CREATE INDEX "IndustryQuestion_industryId_idx" ON "IndustryQuestion"("industryId");

-- CreateIndex
CREATE INDEX "IndustryQuestion_industryCategoryId_idx" ON "IndustryQuestion"("industryCategoryId");

-- CreateIndex
CREATE INDEX "IndustryQuestion_order_idx" ON "IndustryQuestion"("order");

-- CreateIndex
CREATE INDEX "IndustryBenchmark_industryId_idx" ON "IndustryBenchmark"("industryId");

-- CreateIndex
CREATE UNIQUE INDEX "IndustryBenchmark_industryId_metric_year_quarter_categoryId_key" ON "IndustryBenchmark"("industryId", "metric", "year", "quarter", "categoryId");

-- CreateIndex
CREATE INDEX "Company_industryId_idx" ON "Company"("industryId");

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "Industry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndustryCategory" ADD CONSTRAINT "IndustryCategory_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "Industry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndustryCategory" ADD CONSTRAINT "IndustryCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "AssessmentCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndustryQuestion" ADD CONSTRAINT "IndustryQuestion_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "Industry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndustryQuestion" ADD CONSTRAINT "IndustryQuestion_industryCategoryId_fkey" FOREIGN KEY ("industryCategoryId") REFERENCES "IndustryCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndustryBenchmark" ADD CONSTRAINT "IndustryBenchmark_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "Industry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
