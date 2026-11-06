-- CreateTable
CREATE TABLE "CertificationTier" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "minScore" INTEGER NOT NULL,
    "maxScore" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "benefits" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CertificationTier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certification" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "tierId" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "certificateNumber" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "certificateUrl" TEXT,
    "badgeCode" TEXT,
    "qrCodeUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "issuedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "revokedReason" TEXT,
    "reminderSent30d" BOOLEAN NOT NULL DEFAULT false,
    "reminderSent7d" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Certification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CertificationPayment" (
    "id" TEXT NOT NULL,
    "certificationId" TEXT NOT NULL,
    "stripePaymentId" TEXT,
    "stripeCustomerId" TEXT,
    "stripeSessionId" TEXT,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" TEXT NOT NULL,
    "paymentMethod" TEXT,
    "receiptUrl" TEXT,
    "invoiceUrl" TEXT,
    "paidAt" TIMESTAMP(3),
    "refundedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CertificationPayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CertificationTier_name_key" ON "CertificationTier"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CertificationTier_slug_key" ON "CertificationTier"("slug");

-- CreateIndex
CREATE INDEX "CertificationTier_order_idx" ON "CertificationTier"("order");

-- CreateIndex
CREATE INDEX "CertificationTier_slug_idx" ON "CertificationTier"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Certification_certificateNumber_key" ON "Certification"("certificateNumber");

-- CreateIndex
CREATE INDEX "Certification_companyId_idx" ON "Certification"("companyId");

-- CreateIndex
CREATE INDEX "Certification_status_idx" ON "Certification"("status");

-- CreateIndex
CREATE INDEX "Certification_certificateNumber_idx" ON "Certification"("certificateNumber");

-- CreateIndex
CREATE INDEX "Certification_tierId_idx" ON "Certification"("tierId");

-- CreateIndex
CREATE UNIQUE INDEX "CertificationPayment_certificationId_key" ON "CertificationPayment"("certificationId");

-- CreateIndex
CREATE UNIQUE INDEX "CertificationPayment_stripePaymentId_key" ON "CertificationPayment"("stripePaymentId");

-- CreateIndex
CREATE UNIQUE INDEX "CertificationPayment_stripeSessionId_key" ON "CertificationPayment"("stripeSessionId");

-- CreateIndex
CREATE INDEX "CertificationPayment_certificationId_idx" ON "CertificationPayment"("certificationId");

-- CreateIndex
CREATE INDEX "CertificationPayment_status_idx" ON "CertificationPayment"("status");

-- CreateIndex
CREATE INDEX "CertificationPayment_stripeSessionId_idx" ON "CertificationPayment"("stripeSessionId");

-- AddForeignKey
ALTER TABLE "Certification" ADD CONSTRAINT "Certification_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certification" ADD CONSTRAINT "Certification_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "CertificationTier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certification" ADD CONSTRAINT "Certification_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CertificationPayment" ADD CONSTRAINT "CertificationPayment_certificationId_fkey" FOREIGN KEY ("certificationId") REFERENCES "Certification"("id") ON DELETE CASCADE ON UPDATE CASCADE;
