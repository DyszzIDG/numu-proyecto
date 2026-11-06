/*
  Warnings:

  - You are about to drop the column `overallScore` on the `Assessment` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('CYBERSECURITY', 'EDUCATION', 'AI', 'FINTECH', 'GENERAL');

-- CreateEnum
CREATE TYPE "CSIRTRole" AS ENUM ('ADMIN', 'MANAGER', 'ANALYST', 'VIEWER', 'AUDITOR');

-- CreateEnum
CREATE TYPE "CSIRTScanType" AS ENUM ('NETWORK', 'WEB_APPLICATION', 'API', 'CLOUD', 'MOBILE', 'INFRASTRUCTURE', 'FULL_STACK');

-- CreateEnum
CREATE TYPE "CSIRTScanStatus" AS ENUM ('QUEUED', 'RUNNING', 'PAUSED', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CSIRTScanMode" AS ENUM ('MANUAL', 'AI_ASSISTED', 'AUTOMATED');

-- CreateEnum
CREATE TYPE "CSIRTPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "CSIRTSeverity" AS ENUM ('INFO', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "CSIRTVulnStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'WONT_FIX', 'FALSE_POSITIVE');

-- CreateEnum
CREATE TYPE "CSIRTIncidentType" AS ENUM ('MALWARE', 'PHISHING', 'DATA_BREACH', 'DOS_DDOS', 'UNAUTHORIZED_ACCESS', 'POLICY_VIOLATION', 'RANSOMWARE', 'APT', 'INSIDER_THREAT', 'OTHER');

-- CreateEnum
CREATE TYPE "CSIRTIncidentStatus" AS ENUM ('NEW', 'ACKNOWLEDGED', 'INVESTIGATING', 'CONTAINED', 'RESOLVED', 'CLOSED', 'FALSE_ALARM');

-- CreateEnum
CREATE TYPE "ThreatType" AS ENUM ('MALWARE', 'PHISHING', 'RANSOMWARE', 'APT', 'VULNERABILITY', 'EXPLOIT', 'BOTNET', 'C2_SERVER', 'SUSPICIOUS_DOMAIN', 'DATA_LEAK');

-- CreateEnum
CREATE TYPE "IOCType" AS ENUM ('IP_ADDRESS', 'DOMAIN', 'URL', 'FILE_HASH_MD5', 'FILE_HASH_SHA1', 'FILE_HASH_SHA256', 'EMAIL', 'MUTEX', 'REGISTRY_KEY', 'USER_AGENT', 'CERTIFICATE');

-- DropIndex
DROP INDEX "Assessment_overallScore_idx";

-- AlterTable
ALTER TABLE "Answer" ALTER COLUMN "points" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Assessment" DROP COLUMN "overallScore",
ADD COLUMN     "score" INTEGER,
ADD COLUMN     "type" TEXT;

-- AlterTable
ALTER TABLE "CTFChallenge" ADD COLUMN     "programId" TEXT;

-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "phone" TEXT;

-- AlterTable
ALTER TABLE "ToolExecution" ADD COLUMN     "aiConfidence" INTEGER,
ADD COLUMN     "employeeId" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bio" TEXT,
    "location" TEXT,
    "website" TEXT,
    "github" TEXT,
    "linkedin" TEXT,
    "twitter" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceProfile" (
    "id" TEXT NOT NULL,
    "userProfileId" TEXT NOT NULL,
    "service" "ServiceType" NOT NULL,
    "metadata" TEXT,
    "stats" TEXT,
    "settings" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScanTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#3B82F6',
    "description" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScanTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScanAnnotation" (
    "id" TEXT NOT NULL,
    "scanId" TEXT NOT NULL,
    "findingId" TEXT,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScanAnnotation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workflow" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "steps" JSONB NOT NULL,
    "userId" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "executions" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workflow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShareLink" (
    "id" TEXT NOT NULL,
    "scanId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "maxViews" INTEGER,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShareLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScanJob" (
    "id" TEXT NOT NULL,
    "targets" TEXT[],
    "tool" TEXT NOT NULL,
    "parameters" JSONB NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "results" JSONB,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "ScanJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseAttachment" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CaseAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WikiArticle" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WikiArticle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "link" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shift" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Shift_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Incident" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "detectedAt" TIMESTAMP(3) NOT NULL,
    "resolvedAt" TIMESTAMP(3),
    "analystId" TEXT,
    "origin" TEXT,
    "slaDeadline" TIMESTAMP(3),
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Incident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Program" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT NOT NULL,
    "icon" TEXT,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "instructor" TEXT,
    "thumbnail" TEXT,
    "duration" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Module" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT,
    "duration" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resource" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enrollment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LessonProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScanTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "config" JSONB NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScanTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduledScan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "templateId" TEXT,
    "frequency" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "daysOfWeek" INTEGER[],
    "dayOfMonth" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "lastRun" TIMESTAMP(3),
    "nextRun" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScheduledScan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemNotification" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "data" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SystemNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Integration" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "config" JSONB NOT NULL,
    "status" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Integration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "findingId" TEXT,
    "scanId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CSIRTUser" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "CSIRTRole" NOT NULL DEFAULT 'ANALYST',
    "department" TEXT,
    "phone" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CSIRTUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CSIRTScan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "target" TEXT NOT NULL,
    "type" "CSIRTScanType" NOT NULL,
    "status" "CSIRTScanStatus" NOT NULL DEFAULT 'QUEUED',
    "mode" "CSIRTScanMode" NOT NULL DEFAULT 'MANUAL',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "priority" "CSIRTPriority" NOT NULL DEFAULT 'MEDIUM',
    "tools" TEXT[],
    "nmapOptions" JSONB,
    "nucleiTemplates" TEXT[],
    "zapProfile" TEXT,
    "customCommands" JSONB,
    "stealthMode" BOOLEAN NOT NULL DEFAULT false,
    "threads" INTEGER NOT NULL DEFAULT 10,
    "timeout" INTEGER NOT NULL DEFAULT 300,
    "retries" INTEGER NOT NULL DEFAULT 3,
    "userAgent" TEXT,
    "proxy" TEXT,
    "scheduled" BOOLEAN NOT NULL DEFAULT false,
    "scheduledAt" TIMESTAMP(3),
    "recurrence" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "duration" INTEGER,
    "rawOutput" TEXT,
    "errorLog" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CSIRTScan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CSIRTVulnerability" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" "CSIRTSeverity" NOT NULL,
    "cvss" DOUBLE PRECISION,
    "cve" TEXT,
    "cwe" TEXT,
    "owasp" TEXT,
    "affectedUrl" TEXT,
    "affectedParam" TEXT,
    "payload" TEXT,
    "evidence" TEXT,
    "reproduction" TEXT,
    "remediation" TEXT,
    "references" TEXT[],
    "estimatedEffort" TEXT,
    "status" "CSIRTVulnStatus" NOT NULL DEFAULT 'OPEN',
    "falsePositive" BOOLEAN NOT NULL DEFAULT false,
    "risk" TEXT,
    "scanId" TEXT NOT NULL,
    "incidentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CSIRTVulnerability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CSIRTPort" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "protocol" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "service" TEXT,
    "version" TEXT,
    "scanId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CSIRTPort_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CSIRTService" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT,
    "product" TEXT,
    "port" INTEGER,
    "protocol" TEXT,
    "banner" TEXT,
    "scanId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CSIRTService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CSIRTScreenshot" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "description" TEXT,
    "scanId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CSIRTScreenshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CSIRTIncident" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "CSIRTIncidentType" NOT NULL,
    "severity" "CSIRTSeverity" NOT NULL,
    "status" "CSIRTIncidentStatus" NOT NULL DEFAULT 'NEW',
    "priority" "CSIRTPriority" NOT NULL DEFAULT 'MEDIUM',
    "category" TEXT NOT NULL,
    "subcategory" TEXT,
    "source" TEXT NOT NULL,
    "affectedAssets" TEXT[],
    "detectedAt" TIMESTAMP(3) NOT NULL,
    "reportedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acknowledgedAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "rootCause" TEXT,
    "impact" TEXT,
    "actionsTaken" TEXT,
    "lessonsLearned" TEXT,
    "assignedTo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CSIRTIncident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CSIRTEvidence" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "hash" TEXT,
    "size" INTEGER,
    "mimeType" TEXT,
    "description" TEXT,
    "incidentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CSIRTEvidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CSIRTIncidentTimeline" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "action" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "incidentId" TEXT NOT NULL,

    CONSTRAINT "CSIRTIncidentTimeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThreatIntelligence" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "ThreatType" NOT NULL,
    "severity" "CSIRTSeverity" NOT NULL,
    "ttps" TEXT[],
    "techniques" TEXT[],
    "source" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "confidence" INTEGER NOT NULL,
    "targetedSectors" TEXT[],
    "affectedRegions" TEXT[],
    "campaignName" TEXT,
    "threatActor" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ThreatIntelligence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThreatIOC" (
    "id" TEXT NOT NULL,
    "type" "IOCType" NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "firstSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "threatId" TEXT NOT NULL,

    CONSTRAINT "ThreatIOC_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CSIRTComment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "cSIRTIncidentId" TEXT,

    CONSTRAINT "CSIRTComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CSIRTNotification" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "link" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CSIRTNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CSIRTAuditLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "changes" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CSIRTAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CSIRTSystemConfig" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CSIRTSystemConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ScanResultToScanTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

-- CreateIndex
CREATE INDEX "ServiceProfile_userProfileId_idx" ON "ServiceProfile"("userProfileId");

-- CreateIndex
CREATE INDEX "ServiceProfile_service_idx" ON "ServiceProfile"("service");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceProfile_userProfileId_service_key" ON "ServiceProfile"("userProfileId", "service");

-- CreateIndex
CREATE INDEX "ScanTag_userId_idx" ON "ScanTag"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ScanTag_userId_name_key" ON "ScanTag"("userId", "name");

-- CreateIndex
CREATE INDEX "ScanAnnotation_scanId_idx" ON "ScanAnnotation"("scanId");

-- CreateIndex
CREATE INDEX "ScanAnnotation_userId_idx" ON "ScanAnnotation"("userId");

-- CreateIndex
CREATE INDEX "Workflow_userId_idx" ON "Workflow"("userId");

-- CreateIndex
CREATE INDEX "Workflow_isPublic_idx" ON "Workflow"("isPublic");

-- CreateIndex
CREATE UNIQUE INDEX "ShareLink_token_key" ON "ShareLink"("token");

-- CreateIndex
CREATE INDEX "ShareLink_token_idx" ON "ShareLink"("token");

-- CreateIndex
CREATE INDEX "ShareLink_scanId_idx" ON "ShareLink"("scanId");

-- CreateIndex
CREATE INDEX "ShareLink_expiresAt_idx" ON "ShareLink"("expiresAt");

-- CreateIndex
CREATE INDEX "ScanJob_userId_idx" ON "ScanJob"("userId");

-- CreateIndex
CREATE INDEX "ScanJob_status_idx" ON "ScanJob"("status");

-- CreateIndex
CREATE INDEX "ScanJob_createdAt_idx" ON "ScanJob"("createdAt");

-- CreateIndex
CREATE INDEX "CaseAttachment_caseId_idx" ON "CaseAttachment"("caseId");

-- CreateIndex
CREATE INDEX "WikiArticle_authorId_idx" ON "WikiArticle"("authorId");

-- CreateIndex
CREATE INDEX "WikiArticle_category_idx" ON "WikiArticle"("category");

-- CreateIndex
CREATE INDEX "Notification_employeeId_idx" ON "Notification"("employeeId");

-- CreateIndex
CREATE INDEX "Notification_isRead_idx" ON "Notification"("isRead");

-- CreateIndex
CREATE INDEX "Shift_employeeId_idx" ON "Shift"("employeeId");

-- CreateIndex
CREATE INDEX "Shift_start_idx" ON "Shift"("start");

-- CreateIndex
CREATE INDEX "Shift_end_idx" ON "Shift"("end");

-- CreateIndex
CREATE INDEX "Incident_status_idx" ON "Incident"("status");

-- CreateIndex
CREATE INDEX "Incident_severity_idx" ON "Incident"("severity");

-- CreateIndex
CREATE INDEX "Incident_detectedAt_idx" ON "Incident"("detectedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Program_slug_key" ON "Program"("slug");

-- CreateIndex
CREATE INDEX "Program_slug_idx" ON "Program"("slug");

-- CreateIndex
CREATE INDEX "Course_programId_idx" ON "Course"("programId");

-- CreateIndex
CREATE INDEX "Module_courseId_idx" ON "Module"("courseId");

-- CreateIndex
CREATE INDEX "Module_order_idx" ON "Module"("order");

-- CreateIndex
CREATE INDEX "Lesson_moduleId_idx" ON "Lesson"("moduleId");

-- CreateIndex
CREATE INDEX "Lesson_order_idx" ON "Lesson"("order");

-- CreateIndex
CREATE INDEX "Resource_lessonId_idx" ON "Resource"("lessonId");

-- CreateIndex
CREATE INDEX "Enrollment_userId_idx" ON "Enrollment"("userId");

-- CreateIndex
CREATE INDEX "Enrollment_courseId_idx" ON "Enrollment"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "Enrollment_userId_courseId_key" ON "Enrollment"("userId", "courseId");

-- CreateIndex
CREATE INDEX "LessonProgress_userId_idx" ON "LessonProgress"("userId");

-- CreateIndex
CREATE INDEX "LessonProgress_lessonId_idx" ON "LessonProgress"("lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "LessonProgress_userId_lessonId_key" ON "LessonProgress"("userId", "lessonId");

-- CreateIndex
CREATE INDEX "ScheduledScan_active_idx" ON "ScheduledScan"("active");

-- CreateIndex
CREATE INDEX "SystemNotification_read_idx" ON "SystemNotification"("read");

-- CreateIndex
CREATE UNIQUE INDEX "CSIRTUser_userId_key" ON "CSIRTUser"("userId");

-- CreateIndex
CREATE INDEX "CSIRTUser_userId_idx" ON "CSIRTUser"("userId");

-- CreateIndex
CREATE INDEX "CSIRTUser_role_idx" ON "CSIRTUser"("role");

-- CreateIndex
CREATE INDEX "CSIRTScan_userId_status_idx" ON "CSIRTScan"("userId", "status");

-- CreateIndex
CREATE INDEX "CSIRTScan_target_idx" ON "CSIRTScan"("target");

-- CreateIndex
CREATE INDEX "CSIRTScan_type_idx" ON "CSIRTScan"("type");

-- CreateIndex
CREATE INDEX "CSIRTVulnerability_severity_status_idx" ON "CSIRTVulnerability"("severity", "status");

-- CreateIndex
CREATE INDEX "CSIRTVulnerability_cve_idx" ON "CSIRTVulnerability"("cve");

-- CreateIndex
CREATE INDEX "CSIRTVulnerability_scanId_idx" ON "CSIRTVulnerability"("scanId");

-- CreateIndex
CREATE INDEX "CSIRTPort_scanId_idx" ON "CSIRTPort"("scanId");

-- CreateIndex
CREATE INDEX "CSIRTService_scanId_idx" ON "CSIRTService"("scanId");

-- CreateIndex
CREATE INDEX "CSIRTScreenshot_scanId_idx" ON "CSIRTScreenshot"("scanId");

-- CreateIndex
CREATE INDEX "CSIRTIncident_status_severity_idx" ON "CSIRTIncident"("status", "severity");

-- CreateIndex
CREATE INDEX "CSIRTIncident_assignedTo_idx" ON "CSIRTIncident"("assignedTo");

-- CreateIndex
CREATE INDEX "CSIRTIncident_type_idx" ON "CSIRTIncident"("type");

-- CreateIndex
CREATE INDEX "CSIRTEvidence_incidentId_idx" ON "CSIRTEvidence"("incidentId");

-- CreateIndex
CREATE INDEX "CSIRTIncidentTimeline_incidentId_idx" ON "CSIRTIncidentTimeline"("incidentId");

-- CreateIndex
CREATE INDEX "CSIRTIncidentTimeline_timestamp_idx" ON "CSIRTIncidentTimeline"("timestamp");

-- CreateIndex
CREATE INDEX "ThreatIntelligence_type_severity_idx" ON "ThreatIntelligence"("type", "severity");

-- CreateIndex
CREATE INDEX "ThreatIntelligence_userId_idx" ON "ThreatIntelligence"("userId");

-- CreateIndex
CREATE INDEX "ThreatIOC_type_value_idx" ON "ThreatIOC"("type", "value");

-- CreateIndex
CREATE INDEX "ThreatIOC_threatId_idx" ON "ThreatIOC"("threatId");

-- CreateIndex
CREATE INDEX "CSIRTComment_entityType_entityId_idx" ON "CSIRTComment"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "CSIRTComment_userId_idx" ON "CSIRTComment"("userId");

-- CreateIndex
CREATE INDEX "CSIRTNotification_userId_isRead_idx" ON "CSIRTNotification"("userId", "isRead");

-- CreateIndex
CREATE INDEX "CSIRTAuditLog_userId_createdAt_idx" ON "CSIRTAuditLog"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "CSIRTAuditLog_entityType_entityId_idx" ON "CSIRTAuditLog"("entityType", "entityId");

-- CreateIndex
CREATE UNIQUE INDEX "CSIRTSystemConfig_key_key" ON "CSIRTSystemConfig"("key");

-- CreateIndex
CREATE INDEX "CSIRTSystemConfig_category_idx" ON "CSIRTSystemConfig"("category");

-- CreateIndex
CREATE UNIQUE INDEX "_ScanResultToScanTag_AB_unique" ON "_ScanResultToScanTag"("A", "B");

-- CreateIndex
CREATE INDEX "_ScanResultToScanTag_B_index" ON "_ScanResultToScanTag"("B");

-- CreateIndex
CREATE INDEX "Assessment_score_idx" ON "Assessment"("score");

-- CreateIndex
CREATE INDEX "CTFChallenge_programId_idx" ON "CTFChallenge"("programId");

-- CreateIndex
CREATE INDEX "ToolExecution_employeeId_idx" ON "ToolExecution"("employeeId");

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceProfile" ADD CONSTRAINT "ServiceProfile_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolExecution" ADD CONSTRAINT "ToolExecution_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CTFChallenge" ADD CONSTRAINT "CTFChallenge_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScanTag" ADD CONSTRAINT "ScanTag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScanAnnotation" ADD CONSTRAINT "ScanAnnotation_scanId_fkey" FOREIGN KEY ("scanId") REFERENCES "ScanResult"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScanAnnotation" ADD CONSTRAINT "ScanAnnotation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workflow" ADD CONSTRAINT "Workflow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShareLink" ADD CONSTRAINT "ShareLink_scanId_fkey" FOREIGN KEY ("scanId") REFERENCES "ScanResult"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShareLink" ADD CONSTRAINT "ShareLink_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScanJob" ADD CONSTRAINT "ScanJob_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseAttachment" ADD CONSTRAINT "CaseAttachment_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WikiArticle" ADD CONSTRAINT "WikiArticle_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shift" ADD CONSTRAINT "Shift_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_analystId_fkey" FOREIGN KEY ("analystId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Module" ADD CONSTRAINT "Module_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonProgress" ADD CONSTRAINT "LessonProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonProgress" ADD CONSTRAINT "LessonProgress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduledScan" ADD CONSTRAINT "ScheduledScan_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "ScanTarget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduledScan" ADD CONSTRAINT "ScheduledScan_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "ScanTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_findingId_fkey" FOREIGN KEY ("findingId") REFERENCES "ScanFinding"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_scanId_fkey" FOREIGN KEY ("scanId") REFERENCES "ScanResult"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CSIRTUser" ADD CONSTRAINT "CSIRTUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CSIRTScan" ADD CONSTRAINT "CSIRTScan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "CSIRTUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CSIRTVulnerability" ADD CONSTRAINT "CSIRTVulnerability_scanId_fkey" FOREIGN KEY ("scanId") REFERENCES "CSIRTScan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CSIRTVulnerability" ADD CONSTRAINT "CSIRTVulnerability_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "CSIRTIncident"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CSIRTPort" ADD CONSTRAINT "CSIRTPort_scanId_fkey" FOREIGN KEY ("scanId") REFERENCES "CSIRTScan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CSIRTService" ADD CONSTRAINT "CSIRTService_scanId_fkey" FOREIGN KEY ("scanId") REFERENCES "CSIRTScan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CSIRTScreenshot" ADD CONSTRAINT "CSIRTScreenshot_scanId_fkey" FOREIGN KEY ("scanId") REFERENCES "CSIRTScan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CSIRTIncident" ADD CONSTRAINT "CSIRTIncident_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "CSIRTUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CSIRTEvidence" ADD CONSTRAINT "CSIRTEvidence_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "CSIRTIncident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CSIRTIncidentTimeline" ADD CONSTRAINT "CSIRTIncidentTimeline_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "CSIRTIncident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThreatIntelligence" ADD CONSTRAINT "ThreatIntelligence_userId_fkey" FOREIGN KEY ("userId") REFERENCES "CSIRTUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThreatIOC" ADD CONSTRAINT "ThreatIOC_threatId_fkey" FOREIGN KEY ("threatId") REFERENCES "ThreatIntelligence"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CSIRTComment" ADD CONSTRAINT "CSIRTComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "CSIRTUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CSIRTComment" ADD CONSTRAINT "CSIRTComment_cSIRTIncidentId_fkey" FOREIGN KEY ("cSIRTIncidentId") REFERENCES "CSIRTIncident"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CSIRTNotification" ADD CONSTRAINT "CSIRTNotification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "CSIRTUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CSIRTAuditLog" ADD CONSTRAINT "CSIRTAuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "CSIRTUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ScanResultToScanTag" ADD CONSTRAINT "_ScanResultToScanTag_A_fkey" FOREIGN KEY ("A") REFERENCES "ScanResult"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ScanResultToScanTag" ADD CONSTRAINT "_ScanResultToScanTag_B_fkey" FOREIGN KEY ("B") REFERENCES "ScanTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
