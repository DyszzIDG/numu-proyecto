-- CreateTable
CREATE TABLE "ForensicEvidence" (
    "id" TEXT NOT NULL,
    "caseId" TEXT,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "acquiredBy" TEXT NOT NULL,
    "acquiredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "custodian" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "hashAlgorithm" TEXT,
    "hashValue" TEXT,
    "sizeBytes" BIGINT,
    "metadata" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ForensicEvidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoodleAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "moodleUserId" INTEGER NOT NULL,
    "moodleUsername" TEXT NOT NULL,
    "moodleEmail" TEXT NOT NULL,
    "isLinked" BOOLEAN NOT NULL DEFAULT false,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "linkToken" TEXT,
    "linkTokenExpiry" TIMESTAMP(3),
    "lastSyncAt" TIMESTAMP(3),
    "syncStatus" TEXT NOT NULL DEFAULT 'pending',
    "syncError" TEXT,
    "enrollments" TEXT,
    "completions" TEXT,
    "certificates" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MoodleAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoodleCourse" (
    "id" TEXT NOT NULL,
    "moodleCourseId" INTEGER NOT NULL,
    "fullname" TEXT NOT NULL,
    "shortname" TEXT NOT NULL,
    "category" TEXT,
    "summary" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "format" TEXT,
    "serviceType" "ServiceType" NOT NULL DEFAULT 'EDUCATION',
    "difficulty" TEXT,
    "estimatedHours" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MoodleCourse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoodleEnrollment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'active',
    "role" TEXT NOT NULL DEFAULT 'student',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "lastAccessed" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "grade" DOUBLE PRECISION,
    "moodleEnrollmentId" INTEGER,
    "lastSyncAt" TIMESTAMP(3),

    CONSTRAINT "MoodleEnrollment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ForensicEvidence_caseId_idx" ON "ForensicEvidence"("caseId");

-- CreateIndex
CREATE INDEX "ForensicEvidence_type_idx" ON "ForensicEvidence"("type");

-- CreateIndex
CREATE INDEX "ForensicEvidence_status_idx" ON "ForensicEvidence"("status");

-- CreateIndex
CREATE UNIQUE INDEX "MoodleAccount_userId_key" ON "MoodleAccount"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MoodleAccount_moodleUserId_key" ON "MoodleAccount"("moodleUserId");

-- CreateIndex
CREATE UNIQUE INDEX "MoodleAccount_moodleUsername_key" ON "MoodleAccount"("moodleUsername");

-- CreateIndex
CREATE UNIQUE INDEX "MoodleAccount_linkToken_key" ON "MoodleAccount"("linkToken");

-- CreateIndex
CREATE INDEX "MoodleAccount_userId_idx" ON "MoodleAccount"("userId");

-- CreateIndex
CREATE INDEX "MoodleAccount_moodleUserId_idx" ON "MoodleAccount"("moodleUserId");

-- CreateIndex
CREATE INDEX "MoodleAccount_isLinked_idx" ON "MoodleAccount"("isLinked");

-- CreateIndex
CREATE UNIQUE INDEX "MoodleCourse_moodleCourseId_key" ON "MoodleCourse"("moodleCourseId");

-- CreateIndex
CREATE INDEX "MoodleCourse_moodleCourseId_idx" ON "MoodleCourse"("moodleCourseId");

-- CreateIndex
CREATE INDEX "MoodleCourse_serviceType_idx" ON "MoodleCourse"("serviceType");

-- CreateIndex
CREATE INDEX "MoodleCourse_visible_idx" ON "MoodleCourse"("visible");

-- CreateIndex
CREATE INDEX "MoodleEnrollment_userId_idx" ON "MoodleEnrollment"("userId");

-- CreateIndex
CREATE INDEX "MoodleEnrollment_courseId_idx" ON "MoodleEnrollment"("courseId");

-- CreateIndex
CREATE INDEX "MoodleEnrollment_status_idx" ON "MoodleEnrollment"("status");

-- CreateIndex
CREATE UNIQUE INDEX "MoodleEnrollment_userId_courseId_key" ON "MoodleEnrollment"("userId", "courseId");

-- AddForeignKey
ALTER TABLE "ForensicEvidence" ADD CONSTRAINT "ForensicEvidence_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoodleAccount" ADD CONSTRAINT "MoodleAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoodleEnrollment" ADD CONSTRAINT "MoodleEnrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoodleEnrollment" ADD CONSTRAINT "MoodleEnrollment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "MoodleCourse"("id") ON DELETE CASCADE ON UPDATE CASCADE;
